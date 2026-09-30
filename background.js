importScripts("notes-db.js");   // 노트 저장소 (IndexedDB)

const K_NEWTAB = "shiftsearch:openInNewTab";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
    return;
  }
  /* content script 는 자기 탭 번호를 모른다 — sender 로만 알 수 있어 여기서 알려준다.
     툴바 아이콘 팝업이 storage.local 에 적어 둔 "이 탭을 열어라" 요청과 맞춰 보는 데 쓴다.
     팝업이 탭에 직접 메시지를 보내려면 activeTab 권한이 필요해서 이 우회로를 쓴다. */
  if (msg && msg.type === "MY_TAB_ID") {
    sendResponse({ tabId: sender?.tab?.id ?? null });
    return;
  }
  // 팝업의 [노트] — content script 가 정리한 HTML 을 받아 이미지를 채워 넣고 저장한다
  if (msg && msg.type === "NOTE_SAVE") {
    saveNote(msg).then(sendResponse, (e) => sendResponse({ ok: false, error: String(e?.message || e) }));
    return true;   // 비동기 응답
  }
  if (msg && msg.type === "OPEN_NOTES") {
    const hash = (typeof msg.id === "string") ? "#" + encodeURIComponent(msg.id) : "";
    chrome.tabs.create({ url: chrome.runtime.getURL("notes.html" + hash) });
    return;
  }
});

// =====================================================================
// 노트 저장
//
// 이미지를 여기서 받는 이유: content script 의 fetch 는 페이지 origin 이라
// 다른 도메인 이미지(CDN)는 CORS 에 막힌다. 서비스 워커는 host 권한(<all_urls>)이
// 이미 있어 CORS 없이 받을 수 있다 → 권한 추가 없음.
//
// content script 는 <img src> 를 "토큰 URL" 로 바꿔 보내고 원래 주소를 images[] 에 준다.
// 서비스 워커엔 DOM 이 없어서 HTML 을 파싱하지 않고 토큰 문자열만 바꿔 끼운다.
// 받기에 실패한 이미지는 원래 주소로 되돌린다 (온라인이면 여전히 보인다).
// =====================================================================
const NOTE_IMG_MAX_BYTES   = 5 * 1024 * 1024;   // 한 장
const NOTE_TOTAL_MAX_BYTES = 25 * 1024 * 1024;  // 노트 하나 전체
const NOTE_IMG_TIMEOUT     = 8000;
const NOTE_IMG_PARALLEL    = 6;

async function saveNote(msg) {
  const isMemo = msg.kind === "memo";
  const now = Date.now();
  let site = "";
  try { site = new URL(msg.url).hostname; } catch {}
  const url = String(msg.url || "");

  let out, text, title;
  if (isMemo) {
    // 검색창에 적은 짧은 메모. 제목은 메모 앞부분, 원본 링크는 메모를 적은 페이지
    const memo = String(msg.text || "").trim().slice(0, 5000);
    if (!memo) return { ok: false, error: "empty" };
    out = memo.split(/\n+/).map(l => `<p>${escHtml(l)}</p>`).join("");
    text = memo;
    title = `${notesFmtDate(now)} ${memo.replace(/\s+/g, " ").slice(0, 60)}`;
  } else {
    const html   = typeof msg.html === "string" ? msg.html : "";
    const token  = typeof msg.token === "string" ? msg.token : "";
    const images = Array.isArray(msg.images) ? msg.images.slice(0, 60) : [];
    if (!html.trim()) return { ok: false, error: "empty" };
    const inlined = await fetchImagesAsDataUrls(images);
    out = html;
    // data-orig: 원래 이미지 주소. Markdown 내보내기에서 base64 대신 이 주소를 쓴다
    images.forEach((src, i) => {
      const rep = inlined[i] ? `${inlined[i]}" data-orig="${escAttr(src)}` : escAttr(src);
      out = out.split(`${token}/${i}"`).join(`${rep}"`);
    });
    text = String(msg.text || "");
    const pageTitle = String(msg.title || site || "").trim().slice(0, 200);
    title = `${notesFmtDate(now)} ${pageTitle}`.trim();
  }

  const st = await chrome.storage.local.get([K_NOTE_TARGET, K_NOTE_APPEND]);
  const folders = await foldersList();

  // 같은 페이지에서 또 긁으면 그 페이지의 가장 최근 노트 아래에 이어 붙인다 (메모는 제외)
  if (!isMemo && st[K_NOTE_APPEND] !== false) {
    const key = notesPageKey(url);
    const prev = (await notesListMeta()).find(m => m.kind !== "memo" && notesPageKey(m.url) === key);
    if (prev) {
      const body = await notesGetBody(prev.id);
      prev.text = `${prev.text || ""} ${text}`.slice(0, 5000);
      prev.updatedAt = now;
      await notesPut(prev, `${body}<hr>${out}`);
      notesAnnounce({ type: "updated", id: prev.id });
      const f = folders.find(x => x.id === prev.folderId);
      return { ok: true, id: prev.id, appended: true, folderName: f?.name || "" };
    }
  }

  const target = folders.find(x => x.id === st[K_NOTE_TARGET]) || null;
  const meta = {
    id: crypto.randomUUID(),
    kind: isMemo ? "memo" : "clip",
    title,
    url,
    site,
    createdAt: now,
    updatedAt: now,
    text: text.slice(0, 5000),   // 목록 검색용. 본문은 body 에만
    folderId: target?.id || null,
  };
  await notesPut(meta, out);
  notesAnnounce({ type: "saved", id: meta.id });
  return { ok: true, id: meta.id, appended: false, folderName: target?.name || "" };
}

function escHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function escAttr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }

async function fetchImagesAsDataUrls(urls) {
  const out = new Array(urls.length).fill(null);
  let total = 0, next = 0;
  async function worker() {
    while (next < urls.length) {
      const i = next++;
      const src = urls[i];
      if (typeof src !== "string") continue;
      if (src.startsWith("data:image/")) { out[i] = src; continue; }
      if (!/^https?:/i.test(src)) continue;
      try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), NOTE_IMG_TIMEOUT);
        const res = await fetch(src, { credentials: "include", signal: ctl.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        const type = (res.headers.get("content-type") || "").split(";")[0].trim();
        if (!type.startsWith("image/")) continue;
        const buf = await res.arrayBuffer();
        if (buf.byteLength > NOTE_IMG_MAX_BYTES) continue;
        if (total + buf.byteLength > NOTE_TOTAL_MAX_BYTES) continue;
        total += buf.byteLength;
        out[i] = `data:${type};base64,${bufToBase64(buf)}`;
      } catch { /* 실패하면 원래 주소로 남는다 */ }
    }
  }
  await Promise.all(Array.from({ length: NOTE_IMG_PARALLEL }, worker));
  return out;
}

function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

/* 신규 설치 기본값: 새 탭에서 열기.
   content.js 의 폴백을 바꾸면 "한 번도 토글한 적 없는" 기존 사용자까지
   동작이 바뀐다. 그래서 기본값을 폴백이 아니라 설치 시점의 실제 저장값으로 둔다.
   reason 이 "update" 면 아무것도 하지 않으므로 기존 사용자는 그대로다. */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install") return;
  // 같은 계정의 다른 기기에서 이미 설정했다면 sync 저장소에 값이 있다. 덮어쓰지 않는다.
  chrome.storage.sync.get([K_NEWTAB], (res) => {
    if (chrome.runtime.lastError) return;
    if (typeof res?.[K_NEWTAB] === "boolean") return;
    chrome.storage.sync.set({ [K_NEWTAB]: true });
  });

  /* 설치 직후엔 이미 열려 있던 탭에 content script 가 없다 → 그 탭에선 팝업이 안 뜬다.
     탭에 스크립트를 밀어 넣으려면 scripting 권한이 필요하므로, 대신 설정 페이지를 열어
     "열어 둔 탭은 새로고침" 안내 카드를 보여준다. ?welcome=1 이 그 카드의 표시 조건이다.
     openOptionsPage() 로는 쿼리를 못 붙여서 tabs.create 를 쓴다 (권한 불필요). */
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html?welcome=1") });
});
