// =====================================================================
// TapTap - Quick Search — notes.js  (노트 페이지)
//
// 목록은 meta 만 읽고, 본문(이미지 포함이라 무겁다)은 고른 노트 하나만 읽는다 (notes-db.js).
// 편집은 contenteditable + 자동 저장. 원본 링크·저장 날짜는 고칠 수 없다 (출처가 바뀌면 안 된다).
//
// 보안: 저장된 HTML 은 페이지에서 긁어 온 것이다. 화면에 그리기 전·저장하기 전에
// 반드시 sanitizeNoteHtml() 을 거친다. content.js 의 buildClip() 정리는 용량 줄이기일 뿐이다.
// =====================================================================

const K_LANG = "shiftsearch:lang";
const LANG_CODES = ["kr","en","ja","zh-CN","zh-TW","es","fr","de","ru","vn","ms","th","id"];
const SAVE_DELAY = 600;
const ME = Math.random().toString(36).slice(2);   // 내가 보낸 방송은 무시하려고

let lang = "en";
let metas = [];          // 최신순
let currentId = null;
let saveTimer = null;
let dirty = false;

const $ = (id) => document.getElementById(id);
const listEl = $("list"), searchBox = $("searchBox"), countEl = $("listCount");
const editorEl = $("editor"), emptyPane = $("emptyPane"), emptyText = $("emptyText");
const titleInput = $("titleInput"), docEl = $("doc"), srcLink = $("srcLink");
const dateInfo = $("dateInfo"), saveState = $("saveState");

// ── i18n (popup.js 와 같은 방식. 표는 i18n-options.js) ──
function t(key, vars) {
  const tbl = (typeof OPT_I18N !== "undefined" && OPT_I18N) || {};
  let s = (tbl[lang] && tbl[lang][key]) || (tbl.en && tbl.en[key]) || key;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}
function guessDefaultLang() {
  const nav = (navigator.language || "").toLowerCase();
  const map = [["ko","kr"],["ja","ja"],["zh-cn","zh-CN"],["zh-tw","zh-TW"],["es","es"],["fr","fr"],
    ["de","de"],["ru","ru"],["vi","vn"],["ms","ms"],["th","th"],["id","id"]];
  for (const [p, c] of map) if (nav.startsWith(p)) return c;
  if (nav.includes("hans")) return "zh-CN";
  if (nav.includes("hant")) return "zh-TW";
  return "en";
}
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-title]").forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.title = t("n.pageTitle");
  document.documentElement.lang = (lang === "kr") ? "ko" : lang;
}

// =====================================================================
// HTML 정리 — 이 페이지의 보안 경계
// 허용 목록에 없는 태그는 껍데기만 벗기고(글자는 남김), 위험한 태그는 통째로 버린다.
// 속성도 허용 목록만. 링크는 http(s), 이미지는 data:image/ 또는 http(s) 만.
// =====================================================================
const SAN_DROP = new Set(["SCRIPT","STYLE","NOSCRIPT","IFRAME","FRAME","OBJECT","EMBED","LINK","META","BASE",
  "TEMPLATE","SVG","MATH","CANVAS","VIDEO","AUDIO","SOURCE","TRACK","INPUT","BUTTON","SELECT","TEXTAREA",
  "FORM","DIALOG","HEAD","TITLE"]);
const SAN_KEEP = new Set(["P","BR","HR","H1","H2","H3","H4","H5","H6","UL","OL","LI","DL","DT","DD",
  "BLOCKQUOTE","PRE","CODE","B","STRONG","I","EM","U","S","SUB","SUP","MARK","SMALL","A","IMG",
  "TABLE","THEAD","TBODY","TFOOT","TR","TD","TH","CAPTION","FIGURE","FIGCAPTION","DIV","SPAN"]);
const SAN_ATTRS = { A:["href"], IMG:["src","alt","width","height"], TD:["colspan","rowspan"],
  TH:["colspan","rowspan"], OL:["start"] };

function sanitizeNoteHtml(html) {
  // DOMParser 문서는 비활성이라 파싱만으로는 스크립트·이미지가 실행/로드되지 않는다
  const doc = new DOMParser().parseFromString(`<body>${html || ""}</body>`, "text/html");
  const walk = (el) => {
    for (const child of [...el.children]) {
      const tag = child.tagName.toUpperCase();
      if (SAN_DROP.has(tag)) { child.remove(); continue; }
      walk(child);
      if (!SAN_KEEP.has(tag)) { child.replaceWith(...child.childNodes); continue; }
      const keep = SAN_ATTRS[tag] || [];
      for (const at of [...child.attributes]) if (!keep.includes(at.name)) child.removeAttribute(at.name);
      if (tag === "A") {
        const h = child.getAttribute("href") || "";
        if (/^https?:\/\//i.test(h)) { child.setAttribute("target", "_blank"); child.setAttribute("rel", "noopener noreferrer"); }
        else child.removeAttribute("href");
      }
      if (tag === "IMG") {
        const s = child.getAttribute("src") || "";
        if (!/^(data:image\/|https?:\/\/)/i.test(s)) child.remove();
      }
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

// =====================================================================
// 목록
// =====================================================================
function displayTitle(m) { return (m.title || "").trim() || t("n.untitled"); }

function renderList() {
  const q = searchBox.value.trim().toLowerCase();
  const shown = q
    ? metas.filter(m => (m.title + " " + m.site + " " + m.text).toLowerCase().includes(q))
    : metas;
  countEl.textContent = metas.length ? String(metas.length) : "";
  listEl.textContent = "";

  if (!metas.length) {
    const d = document.createElement("div");
    d.className = "listEmpty";
    d.innerHTML = t("n.emptyHow");
    listEl.appendChild(d);
    return;
  }
  if (!shown.length) {
    const d = document.createElement("div");
    d.className = "listEmpty";
    d.textContent = t("n.noResult");
    listEl.appendChild(d);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const m of shown) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "item" + (m.id === currentId ? " active" : "");
    b.dataset.id = m.id;
    const ti = document.createElement("div"); ti.className = "itemTitle"; ti.textContent = displayTitle(m);
    const me = document.createElement("div"); me.className = "itemMeta";
    me.textContent = [m.site, notesFmtDate(m.createdAt)].filter(Boolean).join(" · ");
    const sn = document.createElement("div"); sn.className = "itemSnip"; sn.textContent = (m.text || "").slice(0, 160);
    b.append(ti, me, sn);
    frag.appendChild(b);
  }
  listEl.appendChild(frag);
}

listEl.addEventListener("click", (e) => {
  const b = e.target.closest(".item");
  if (b) openNote(b.dataset.id);
});
searchBox.addEventListener("input", renderList);

async function reloadMetas() {
  metas = await notesListMeta();
  renderList();
}

// =====================================================================
// 보기 / 편집
// =====================================================================
function showEmpty() {
  currentId = null;
  editorEl.classList.remove("show");
  emptyPane.style.display = "";
  emptyText.innerHTML = metas.length ? t("n.pick") : t("n.emptyHow");
  if (location.hash) history.replaceState(null, "", location.pathname);
  renderList();
}

async function openNote(id) {
  if (!id) return;
  await flushSave();
  const m = metas.find(x => x.id === id) || await notesGetMeta(id);
  if (!m) { showEmpty(); return; }
  currentId = id;
  const html = await notesGetBody(id);
  if (currentId !== id) return;   // 그 사이 다른 노트를 눌렀다

  titleInput.value = m.title || "";
  srcLink.href = /^https?:/i.test(m.url) ? m.url : "#";
  srcLink.textContent = m.url || "-";
  srcLink.title = m.url || "";
  renderDateInfo(m);
  docEl.innerHTML = sanitizeNoteHtml(html);
  saveState.textContent = "";
  dirty = false;

  emptyPane.style.display = "none";
  editorEl.classList.add("show");
  if (location.hash.slice(1) !== encodeURIComponent(id)) history.replaceState(null, "", "#" + encodeURIComponent(id));
  renderList();
  docEl.parentElement.scrollTop = 0;
}

function renderDateInfo(m) {
  let s = t("n.created") + " " + notesFmtDate(m.createdAt);
  if (m.updatedAt && m.updatedAt - m.createdAt > 60000) s += " · " + t("n.edited") + " " + notesFmtDate(m.updatedAt);
  dateInfo.textContent = s;
}

function markDirty() {
  if (!currentId) return;
  dirty = true;
  saveState.textContent = t("n.saving");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, SAVE_DELAY);
}

async function flushSave() {
  clearTimeout(saveTimer);
  if (!dirty || !currentId) return;
  dirty = false;
  const id = currentId;
  const m = metas.find(x => x.id === id);
  if (!m) return;
  m.title = titleInput.value.trim();
  m.updatedAt = Date.now();
  m.text = (docEl.innerText || "").replace(/\s+/g, " ").trim().slice(0, 5000);
  const html = sanitizeNoteHtml(docEl.innerHTML);
  try {
    await notesPut({ ...m }, html);
    notesAnnounce({ type: "updated", id, from: ME });
    if (currentId === id) { saveState.textContent = t("n.saved"); renderDateInfo(m); }
  } catch {
    if (currentId === id) saveState.textContent = "⚠ " + t("n.saveFail");
  }
  renderList();
}

titleInput.addEventListener("input", markDirty);
titleInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); docEl.focus(); } });
docEl.addEventListener("input", markDirty);
window.addEventListener("visibilitychange", () => { if (document.hidden) flushSave(); });
window.addEventListener("beforeunload", () => { flushSave(); });
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); flushSave(); }
});

// 붙여넣기도 같은 정리를 거친다 (다른 페이지에서 복사한 스크립트·스타일이 섞이지 않게)
docEl.addEventListener("paste", (e) => {
  const cd = e.clipboardData;
  if (!cd) return;
  e.preventDefault();
  const html = cd.getData("text/html");
  if (html) document.execCommand("insertHTML", false, sanitizeNoteHtml(html));
  else document.execCommand("insertText", false, cd.getData("text/plain"));
});

// 편집 중인 글 안의 링크는 눌러도 안 열린다 → Ctrl/⌘ + 클릭으로 연다
docEl.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (a && (e.ctrlKey || e.metaKey)) { e.preventDefault(); window.open(a.href, "_blank", "noopener"); }
});

// 툴바: mousedown 에서 막아야 본문 선택이 안 풀린다
document.querySelectorAll(".tb[data-cmd]").forEach(b => {
  b.addEventListener("mousedown", (e) => e.preventDefault());
  b.addEventListener("click", () => {
    docEl.focus();
    document.execCommand(b.dataset.cmd, false, b.dataset.arg || null);
    markDirty();
  });
});

// =====================================================================
// 삭제 / 내보내기
// =====================================================================
$("deleteBtn").addEventListener("click", async () => {
  if (!currentId || !confirm(t("n.confirmDel"))) return;
  const id = currentId;
  clearTimeout(saveTimer); dirty = false;
  const idx = metas.findIndex(m => m.id === id);
  await notesDelete(id);
  notesAnnounce({ type: "deleted", id, from: ME });
  metas = metas.filter(m => m.id !== id);
  const next = metas[Math.min(idx, metas.length - 1)];
  if (next) openNote(next.id); else showEmpty();
});

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function safeFileName(s) {
  const base = String(s || "note").replace(/(\d{2}):(\d{2})/, "$1$2")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
  return (base || "note") + ".html";
}

// 내보낸 파일은 확장 없이 더블클릭으로 열린다. 원본 링크와 저장 날짜를 맨 위에 둔다
$("exportBtn").addEventListener("click", async () => {
  if (!currentId) return;
  await flushSave();
  const m = metas.find(x => x.id === currentId);
  if (!m) return;
  const body = sanitizeNoteHtml(await notesGetBody(m.id));
  const url = /^https?:/i.test(m.url) ? m.url : "";
  const page = `<!doctype html>
<html lang="${escHtml(document.documentElement.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(displayTitle(m))}</title>
<style>
  body{max-width:760px;margin:40px auto;padding:0 20px;font:16px/1.75 system-ui,-apple-system,'Segoe UI',sans-serif;color:#111827}
  header{border-bottom:1px solid #e5e7eb;padding-bottom:14px;margin-bottom:24px}
  header h1{font-size:22px;line-height:1.35;margin:0 0 8px}
  header p{margin:2px 0;font-size:13px;color:#6b7280;word-break:break-all}
  a{color:#4f46e5} img{max-width:100%;height:auto}
  blockquote{border-left:3px solid #e5e7eb;margin-left:0;padding-left:14px;color:#6b7280}
  pre{background:#f6f7f9;padding:12px;border-radius:8px;overflow-x:auto}
  table{border-collapse:collapse} td,th{border:1px solid #e5e7eb;padding:5px 9px}
</style>
</head>
<body>
<header>
  <h1>${escHtml(displayTitle(m))}</h1>
  <p>🔗 ${url ? `<a href="${escHtml(url)}">${escHtml(url)}</a>` : "-"}</p>
  <p>${escHtml(t("n.created"))} ${escHtml(notesFmtDate(m.createdAt))}</p>
</header>
<article>
${body}
</article>
</body>
</html>`;
  const blob = new Blob([page], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = safeFileName(displayTitle(m));
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
});

// =====================================================================
// 다른 곳에서 저장·수정·삭제되면 목록을 다시 읽는다 (팝업에서 새 노트, 다른 노트 탭)
// =====================================================================
try {
  const ch = new BroadcastChannel(NOTES_CHANNEL);
  ch.onmessage = async (ev) => {
    const msg = ev.data || {};
    if (msg.from === ME) return;
    await reloadMetas();
    if (msg.id === currentId) {
      if (msg.type === "deleted") showEmpty();
      else if (!dirty) openNote(currentId);   // 편집 중이면 내 편집을 우선한다
    }
    if (!currentId && metas.length) emptyText.innerHTML = t("n.pick");
  };
} catch {}

window.addEventListener("hashchange", () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && id !== currentId) openNote(id);
});

// =====================================================================
// Init
// =====================================================================
chrome.storage.sync.get([K_LANG], async (res) => {
  const saved = res?.[K_LANG];
  lang = LANG_CODES.includes(saved) ? saved : guessDefaultLang();
  applyI18n();
  await reloadMetas();
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && metas.some(m => m.id === id)) openNote(id);
  else if (metas.length) openNote(metas[0].id);
  else showEmpty();
});
