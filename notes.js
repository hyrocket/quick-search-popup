// =====================================================================
// TapTap - Quick Search — notes.js  (노트 페이지)
//
// 목록은 meta 만 읽고, 본문(이미지 포함이라 무겁다)은 고른 노트 하나만 읽는다 (notes-db.js).
// 편집은 contenteditable + 자동 저장. 원본 링크·저장 날짜는 고칠 수 없다 (출처가 바뀌면 안 된다).
//
// 보안: 저장된 HTML 은 페이지에서 긁어 온 것이다. 화면에 그리기 전·저장하기 전·붙여넣을 때
// 반드시 sanitizeNoteHtml() 을 거친다. content.js 의 buildClip() 정리는 용량 줄이기일 뿐이다.
// =====================================================================

const K_LANG = "shiftsearch:lang";
const LANG_CODES = ["kr","en","ja","zh-CN","zh-TW","es","fr","de","ru","vn","ms","th","id"];
const SAVE_DELAY = 600;
const UNDO_MS = 6000;
const ME = Math.random().toString(36).slice(2);   // 내가 보낸 방송은 무시하려고

// 폴더 필터: "all" | "unsorted" | 폴더 id
const F_ALL = "all", F_UNSORTED = "unsorted";

let lang = "en";
let metas = [];          // 최신순
let folders = [];
let curFolder = F_ALL;
let targetFolderId = null;
let currentId = null;
let saveTimer = null;
let dirty = false;

const $ = (id) => document.getElementById(id);
const listEl = $("list"), searchBox = $("searchBox"), countEl = $("listCount"), listName = $("listName");
const editorEl = $("editor"), emptyPane = $("emptyPane"), emptyText = $("emptyText");
const titleInput = $("titleInput"), docEl = $("doc"), srcLink = $("srcLink");
const dateInfo = $("dateInfo"), saveState = $("saveState"), folderSel = $("folderSel");
const folderListEl = $("folderList");

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
// data-orig: 이미지의 원래 주소 (background 가 base64 로 바꿀 때 남긴다). Markdown 에서 쓴다
const SAN_ATTRS = { A:["href"], IMG:["src","alt","width","height","data-orig"], TD:["colspan","rowspan"],
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
        if (!/^(data:image\/|https?:\/\/)/i.test(s)) { child.remove(); continue; }
        const o = child.getAttribute("data-orig") || "";
        if (o && !/^https?:\/\//i.test(o)) child.removeAttribute("data-orig");
      }
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

// =====================================================================
// Markdown — LLM 에 넘기기 좋은 형태
// base64 이미지는 토큰만 잡아먹는다 → 원래 주소(data-orig)가 있으면 그걸 쓰고, 없으면 [image]
// =====================================================================
function htmlToMarkdown(html, headingShift = 0) {
  const doc = new DOMParser().parseFromString(`<body>${sanitizeNoteHtml(html)}</body>`, "text/html");
  const esc = (s) => s.replace(/([\\`*_[\]])/g, "\\$1");

  function inline(node) {
    let out = "";
    for (const n of node.childNodes) {
      if (n.nodeType === 3) { out += esc(n.nodeValue.replace(/\s+/g, " ")); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName;
      if (tag === "BR") { out += "  \n"; continue; }
      if (tag === "IMG") { out += imgMd(n); continue; }
      const inner = inline(n);
      if (!inner.trim()) { out += inner; continue; }
      if (tag === "B" || tag === "STRONG") out += `**${inner.trim()}**`;
      else if (tag === "I" || tag === "EM") out += `*${inner.trim()}*`;
      else if (tag === "S") out += `~~${inner.trim()}~~`;
      else if (tag === "CODE") out += "`" + n.textContent.replace(/`/g, "'") + "`";
      else if (tag === "A" && n.getAttribute("href")) out += `[${inner.trim()}](${n.getAttribute("href")})`;
      else if (isBlock(tag)) out += "\n" + block(n).trim() + "\n";
      else out += inner;
    }
    return out;
  }
  function imgMd(img) {
    const alt = (img.getAttribute("alt") || "").replace(/[[\]]/g, "");
    const src = img.getAttribute("data-orig") || img.getAttribute("src") || "";
    return /^https?:/i.test(src) ? `![${alt}](${src})` : `[image${alt ? ": " + alt : ""}]`;
  }
  const BLOCKS = new Set(["P","DIV","H1","H2","H3","H4","H5","H6","UL","OL","LI","BLOCKQUOTE","PRE","TABLE",
    "HR","FIGURE","FIGCAPTION","DL","DT","DD","THEAD","TBODY","TFOOT","TR"]);
  function isBlock(tag) { return BLOCKS.has(tag); }

  function list(el, depth) {
    const ordered = el.tagName === "OL";
    let i = parseInt(el.getAttribute("start") || "1", 10) || 1;
    const lines = [];
    for (const li of el.children) {
      if (li.tagName !== "LI") continue;
      const nested = [];
      const clone = li.cloneNode(true);
      for (const sub of [...clone.children]) if (sub.tagName === "UL" || sub.tagName === "OL") { nested.push(sub); sub.remove(); }
      const bullet = ordered ? `${i++}.` : "-";
      lines.push("  ".repeat(depth) + bullet + " " + inline(clone).trim().replace(/\n+/g, " "));
      for (const sub of nested) lines.push(list(sub, depth + 1));
    }
    return lines.join("\n");
  }
  function table(el) {
    const rows = [...el.querySelectorAll("tr")].map(tr =>
      [...tr.children].map(c => inline(c).trim().replace(/\|/g, "\\|").replace(/\n+/g, " ")));
    if (!rows.length) return "";
    const w = Math.max(...rows.map(r => r.length));
    const fix = (r) => "| " + [...r, ...Array(w - r.length).fill("")].join(" | ") + " |";
    return [fix(rows[0]), "| " + Array(w).fill("---").join(" | ") + " |", ...rows.slice(1).map(fix)].join("\n");
  }
  function block(el) {
    const parts = [];
    let buf = "";
    const flush = () => { if (buf.trim()) parts.push(buf.trim()); buf = ""; };
    for (const n of el.childNodes) {
      if (n.nodeType === 1 && isBlock(n.tagName)) {
        flush();
        const tag = n.tagName;
        if (/^H[1-6]$/.test(tag)) {
          const lv = Math.min(6, +tag[1] + headingShift);
          parts.push("#".repeat(lv) + " " + inline(n).trim());
        } else if (tag === "UL" || tag === "OL") parts.push(list(n, 0));
        else if (tag === "BLOCKQUOTE") parts.push(block(n).split("\n").map(l => "> " + l).join("\n"));
        else if (tag === "PRE") parts.push("```\n" + n.textContent.replace(/\n$/, "") + "\n```");
        else if (tag === "TABLE") parts.push(table(n));
        else if (tag === "HR") parts.push("---");
        else parts.push(block(n));
      } else {
        buf += n.nodeType === 1 ? inline({ childNodes: [n] }) : (n.nodeType === 3 ? esc(n.nodeValue.replace(/\s+/g, " ")) : "");
      }
    }
    flush();
    return parts.filter(p => p.trim()).join("\n\n");
  }
  return block(doc.body).replace(/\n{3,}/g, "\n\n").trim();
}

function folderNameOf(id) {
  return folders.find(f => f.id === id)?.name || "";
}
function yamlStr(s) { return JSON.stringify(String(s ?? "")); }

// 노트 한 개: YAML 머리말(출처·날짜·폴더) + 본문
async function noteToMarkdown(m) {
  const body = htmlToMarkdown(await notesGetBody(m.id));
  const head = ["---", `title: ${yamlStr(displayTitle(m))}`, `source: ${m.url || ""}`,
    `saved: ${notesFmtDate(m.createdAt)}`];
  const fn = folderNameOf(m.folderId);
  if (fn) head.push(`folder: ${yamlStr(fn)}`);
  head.push("---", "");
  return head.join("\n") + "\n" + body + "\n";
}

// 여러 노트를 한 덩어리로 — AI 에 한 번에 붙여 넣는 용도. 본문 제목은 두 단계 내려서 구조를 유지한다
async function notesToBundle(list, label) {
  const parts = [`# ${label} (${list.length})`, ""];
  let i = 0;
  for (const m of list) {
    i++;
    const body = htmlToMarkdown(await notesGetBody(m.id), 2);
    parts.push(`## ${i}. ${displayTitle(m)}`, "",
      `- Source: ${m.url || "-"}`, `- Saved: ${notesFmtDate(m.createdAt)}`, "", body, "");
  }
  return parts.join("\n").trim() + "\n";
}

// =====================================================================
// 폴더
// =====================================================================
function folderLabel(f) { return f === F_ALL ? t("n.all") : f === F_UNSORTED ? t("n.unsorted") : folderNameOf(f); }

function notesInFolder(f) {
  if (f === F_ALL) return metas;
  if (f === F_UNSORTED) return metas.filter(m => !m.folderId || !folders.some(x => x.id === m.folderId));
  return metas.filter(m => m.folderId === f);
}

const ICON_EDIT = `<svg class="ic" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>`;
const ICON_TRASH = `<svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`;

function renderFolders() {
  folderListEl.textContent = "";
  const rows = [
    { id: F_ALL, icon: "🗂️" },
    { id: F_UNSORTED, icon: "📥" },
    ...folders.map(f => ({ id: f.id, icon: "📂", user: true })),
  ];
  for (const r of rows) {
    const el = document.createElement("div");
    el.className = "folder" + (curFolder === r.id ? " active" : "");
    el.dataset.id = r.id;
    const ic = document.createElement("span"); ic.className = "fIcon"; ic.textContent = r.icon;
    const nm = document.createElement("span"); nm.className = "fName"; nm.textContent = folderLabel(r.id);
    el.append(ic, nm);
    const isTarget = r.user ? targetFolderId === r.id : (r.id === F_UNSORTED && !targetFolderId);
    if (isTarget) {
      const tg = document.createElement("span"); tg.className = "fTarget"; tg.textContent = "📌"; tg.title = t("n.saveTarget");
      el.appendChild(tg);
    }
    const ct = document.createElement("span"); ct.className = "fCount"; ct.textContent = String(notesInFolder(r.id).length);
    el.appendChild(ct);
    if (r.user) {
      const ed = document.createElement("button"); ed.className = "fAct"; ed.innerHTML = ICON_EDIT; ed.title = t("n.rename");
      ed.addEventListener("click", (e) => { e.stopPropagation(); startRename(el, r.id); });
      const dl = document.createElement("button"); dl.className = "fAct del"; dl.innerHTML = ICON_TRASH; dl.title = t("n.delFolder");
      dl.addEventListener("click", (e) => { e.stopPropagation(); removeFolder(r.id); });
      el.append(ed, dl);
    }
    el.addEventListener("click", () => selectFolder(r.id));
    // 노트를 끌어다 놓으면 그 폴더로 옮긴다 ("전체" 는 폴더가 아니라서 제외)
    if (r.id !== F_ALL) {
      el.addEventListener("dragover", (e) => {
        if (!e.dataTransfer.types.includes("text/x-taptap-note")) return;
        e.preventDefault(); e.dataTransfer.dropEffect = "move"; el.classList.add("dropOver");
      });
      el.addEventListener("dragleave", () => el.classList.remove("dropOver"));
      el.addEventListener("drop", (e) => {
        e.preventDefault(); el.classList.remove("dropOver");
        const id = e.dataTransfer.getData("text/x-taptap-note");
        if (id) moveNote(id, r.id === F_UNSORTED ? null : r.id);
      });
    }
    folderListEl.appendChild(el);
  }
  renderTargetLine();
  renderFolderSelect();
}

function renderTargetLine() {
  const name = targetFolderId ? folderNameOf(targetFolderId) : t("n.unsorted");
  const line = $("targetLine");
  line.textContent = "";
  const b = document.createElement("b"); b.textContent = name;
  line.append(t("n.saveTargetLabel") + " 📌 ", b);
}

function renderFolderSelect() {
  folderSel.textContent = "";
  const opt = (v, label) => { const o = document.createElement("option"); o.value = v; o.textContent = label; folderSel.appendChild(o); };
  opt("", t("n.unsorted"));
  folders.forEach(f => opt(f.id, f.name));
  const m = metas.find(x => x.id === currentId);
  folderSel.value = (m && folders.some(f => f.id === m.folderId)) ? m.folderId : "";
}

// 폴더를 고르면 그 폴더가 "새 노트 저장 위치" 가 된다 (분류 안 됨 → 폴더 없음).
// "전체" 는 둘러보기용이라 저장 위치를 바꾸지 않는다
function selectFolder(id) {
  curFolder = id;
  if (id !== F_ALL) {
    targetFolderId = (id === F_UNSORTED) ? null : id;
    chrome.storage.local.set({ [K_NOTE_TARGET]: targetFolderId });
  }
  renderFolders();
  renderList();
}

async function createFolder() {
  const f = { id: crypto.randomUUID(), name: t("n.newFolder"), createdAt: Date.now() };
  await folderPut(f);
  folders.push(f);
  notesAnnounce({ type: "folders", from: ME });
  selectFolder(f.id);
  const el = folderListEl.querySelector(`.folder[data-id="${f.id}"]`);
  if (el) startRename(el, f.id);
}
$("newFolderBtn").addEventListener("click", createFolder);

function startRename(el, id) {
  const f = folders.find(x => x.id === id);
  if (!f) return;
  const nm = el.querySelector(".fName");
  const input = document.createElement("input");
  input.value = f.name;
  input.maxLength = 60;
  nm.replaceWith(input);
  el.querySelectorAll(".fAct,.fCount,.fTarget").forEach(x => x.style.display = "none");
  input.focus(); input.select();
  let done = false;
  const finish = async (save) => {
    if (done) return; done = true;
    const v = input.value.trim();
    if (save && v && v !== f.name) {
      f.name = v;
      await folderPut(f);
      notesAnnounce({ type: "folders", from: ME });
    }
    renderFolders(); renderList();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); finish(true); }
    if (e.key === "Escape") { e.preventDefault(); finish(false); }
  });
  input.addEventListener("blur", () => finish(true));
  input.addEventListener("click", (e) => e.stopPropagation());
}

async function removeFolder(id) {
  const f = folders.find(x => x.id === id);
  if (!f || !confirm(t("n.confirmDelFolder", { name: f.name }))) return;
  await flushSave();
  await folderDelete(id);
  folders = folders.filter(x => x.id !== id);
  metas.forEach(m => { if (m.folderId === id) m.folderId = null; });
  if (targetFolderId === id) { targetFolderId = null; chrome.storage.local.set({ [K_NOTE_TARGET]: null }); }
  if (curFolder === id) curFolder = F_ALL;
  notesAnnounce({ type: "folders", from: ME });
  renderFolders(); renderList();
}

async function moveNote(id, folderId) {
  if (id === currentId) await flushSave();
  const m = metas.find(x => x.id === id);
  if (!m || (m.folderId || null) === folderId) return;
  m.folderId = folderId;
  await notesPut({ ...m });              // html 없이 → 본문은 그대로
  notesAnnounce({ type: "updated", id, from: ME });
  renderFolders(); renderList();
}
folderSel.addEventListener("change", () => { if (currentId) moveNote(currentId, folderSel.value || null); });

// =====================================================================
// 목록
// =====================================================================
function displayTitle(m) { return (m.title || "").trim() || t("n.untitled"); }

function shownNotes() {
  const q = searchBox.value.trim().toLowerCase();
  const inF = notesInFolder(curFolder);
  return q ? inF.filter(m => (m.title + " " + m.site + " " + m.text).toLowerCase().includes(q)) : inF;
}

function renderList() {
  const shown = shownNotes();
  listName.textContent = folderLabel(curFolder);
  countEl.textContent = String(shown.length);
  listEl.textContent = "";

  if (!metas.length || !shown.length) {
    const d = document.createElement("div");
    d.className = "listEmpty";
    if (!metas.length) d.innerHTML = t("n.emptyHow");
    else d.textContent = searchBox.value.trim() ? t("n.noResult") : t("n.emptyFolder");
    listEl.appendChild(d);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const m of shown) {
    const b = document.createElement("div");
    b.className = "item" + (m.id === currentId ? " active" : "");
    b.dataset.id = m.id;
    b.draggable = true;
    const ti = document.createElement("div"); ti.className = "itemTitle";
    ti.textContent = (m.kind === "memo" ? "✏️ " : "") + displayTitle(m);
    const me = document.createElement("div"); me.className = "itemMeta";
    const fn = curFolder === F_ALL ? folderNameOf(m.folderId) : "";
    me.textContent = [m.site, notesFmtDate(m.createdAt), fn && "📂 " + fn].filter(Boolean).join(" · ");
    const sn = document.createElement("div"); sn.className = "itemSnip"; sn.textContent = (m.text || "").slice(0, 160);
    const del = document.createElement("button"); del.className = "itemDel"; del.innerHTML = ICON_TRASH; del.title = t("n.delete");
    b.append(ti, me, sn, del);
    frag.appendChild(b);
  }
  listEl.appendChild(frag);
}

listEl.addEventListener("click", (e) => {
  const del = e.target.closest(".itemDel");
  const item = e.target.closest(".item");
  if (!item) return;
  if (del) { e.stopPropagation(); deleteNote(item.dataset.id); return; }
  openNote(item.dataset.id);
});
listEl.addEventListener("dragstart", (e) => {
  const item = e.target.closest(".item");
  if (!item) return;
  e.dataTransfer.setData("text/x-taptap-note", item.dataset.id);
  e.dataTransfer.effectAllowed = "move";
  item.classList.add("dragging");
});
listEl.addEventListener("dragend", (e) => { e.target.closest(".item")?.classList.remove("dragging"); });
searchBox.addEventListener("input", renderList);

async function reloadAll() {
  [metas, folders] = await Promise.all([notesListMeta(), foldersList()]);
  if (curFolder !== F_ALL && curFolder !== F_UNSORTED && !folders.some(f => f.id === curFolder)) curFolder = F_ALL;
  renderFolders();
  renderList();
  renderUsage();
}

async function renderUsage() {
  let size = "";
  try {
    const est = await navigator.storage.estimate();
    const mb = (est.usage || 0) / (1024 * 1024);
    size = mb < 1 ? `${Math.max(1, Math.round(mb * 1024))} KB` : `${mb.toFixed(1)} MB`;
  } catch {}
  $("usageLine").textContent = t("n.usage", { n: metas.length, size });
  renderBackupLine();
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
  renderFolderSelect();
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
// 알림 (삭제 되돌리기 · 복사됨)
// =====================================================================
let toastTimer = null;
function toast(msg, actLabel, onAct) {
  const el = $("toast"), act = $("toastAct");
  $("toastMsg").textContent = msg;
  act.style.display = actLabel ? "" : "none";
  act.textContent = actLabel || "";
  act.onclick = () => { hideToast(); onAct?.(); };
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, actLabel ? UNDO_MS : 2200);
}
function hideToast() { $("toast").classList.remove("show"); }

// =====================================================================
// 삭제 — 확인 창 대신 "되돌리기". 지울 때 meta+body 를 메모리에 들고 있다가 되살린다
// =====================================================================
async function deleteNote(id) {
  if (id === currentId) { clearTimeout(saveTimer); if (dirty) await flushSave(); }
  const m = metas.find(x => x.id === id);
  if (!m) return;
  const body = await notesGetBody(id);
  const idxInView = shownNotes().findIndex(x => x.id === id);
  await notesDelete(id);
  notesAnnounce({ type: "deleted", id, from: ME });
  metas = metas.filter(x => x.id !== id);
  if (id === currentId) {
    const view = shownNotes();
    const next = view[Math.min(idxInView, view.length - 1)];
    if (next) openNote(next.id); else showEmpty();
  }
  renderFolders(); renderList(); renderUsage();

  toast(t("n.deleted"), t("n.undo"), async () => {
    await notesPut(m, body);
    notesAnnounce({ type: "saved", id, from: ME });
    await reloadAll();
    openNote(id);
  });
}
$("deleteBtn").addEventListener("click", () => { if (currentId) deleteNote(currentId); });

// =====================================================================
// 내보내기 · 복사
// =====================================================================
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function safeFileName(s, ext) {
  const base = String(s || "note").replace(/(\d{2}):(\d{2})/, "$1$2")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
  return (base || "note") + ext;
}
// text 는 문자열 또는 문자열 조각 배열 (백업은 노트마다 조각 — 수백 MB 를 한 문자열로 합치지 않으려고)
function download(text, name, type) {
  const blob = new Blob(Array.isArray(text) ? text : [text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast(t("n.copied")); }
  catch { toast("⚠ " + t("n.saveFail")); }
}
function currentMeta() { return metas.find(x => x.id === currentId); }

$("copyMdBtn").addEventListener("click", async () => {
  await flushSave();
  const m = currentMeta(); if (m) copyText(await noteToMarkdown(m));
});
$("exportMdBtn").addEventListener("click", async () => {
  await flushSave();
  const m = currentMeta(); if (m) download(await noteToMarkdown(m), safeFileName(displayTitle(m), ".md"), "text/markdown");
});

// 보이는 목록(폴더 + 검색) 전체를 한 덩어리 Markdown 으로 — AI 에 자료로 넘기는 용도
$("bulkCopyBtn").addEventListener("click", async () => {
  await flushSave();
  const list = shownNotes(); if (!list.length) return;
  copyText(await notesToBundle(list, "TapTap — " + folderLabel(curFolder)));
});
$("bulkExportBtn").addEventListener("click", async () => {
  await flushSave();
  const list = shownNotes(); if (!list.length) return;
  const label = "TapTap — " + folderLabel(curFolder);
  download(await notesToBundle(list, label), safeFileName(`${label} ${notesFmtDate(Date.now())}`, ".md"), "text/markdown");
});

// 내보낸 HTML 은 확장 없이 더블클릭으로 열린다. 원본 링크와 저장 날짜를 맨 위에 둔다
$("exportBtn").addEventListener("click", async () => {
  await flushSave();
  const m = currentMeta();
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
  download(page, safeFileName(displayTitle(m), ".html"), "text/html");
});

// =====================================================================
// 전체 백업 · 복원 — 확장을 지우면 IndexedDB 도 지워진다. 되살릴 길은 이 파일뿐이다
// 파일: { app, format, exportedAt, folders:[...], notes:[{ meta, html }] } (이미지는 html 안의 base64)
// 복원은 "합치기": 같은 id 는 더 최근에 고친 쪽을 남긴다. 지금 있는 노트는 지우지 않는다
// =====================================================================
const BACKUP_APP = "taptap-notes", BACKUP_FORMAT = 1;
const BACKUP_WARN_DAYS = 30;
const K_NOTE_BACKUP_AT = "shiftsearch:noteBackupAt";   // storage.local — 이 기기의 마지막 백업 시각
let lastBackupAt = 0;

function renderBackupLine() {
  const el = $("backupLine");
  el.textContent = lastBackupAt ? t("n.lastBackup", { date: notesFmtDate(lastBackupAt) }) : t("n.neverBackup");
  const stale = !lastBackupAt || Date.now() - lastBackupAt > BACKUP_WARN_DAYS * 864e5;
  el.classList.toggle("warn", metas.length > 0 && stale);
}

$("backupBtn").addEventListener("click", async () => {
  await flushSave();
  const all = await notesListMeta();
  const parts = [`{"app":"${BACKUP_APP}","format":${BACKUP_FORMAT},"exportedAt":${Date.now()},` +
    `"folders":${JSON.stringify(folders)},"notes":[`];
  for (let i = 0; i < all.length; i++) {
    const html = await notesGetBody(all[i].id);
    parts.push((i ? "," : "") + JSON.stringify({ meta: all[i], html }));
  }
  parts.push("]}");
  const day = notesFmtDate(Date.now()).slice(0, 10);
  download(parts, `TapTap-notes-backup-${day}.json`, "application/json");
  lastBackupAt = Date.now();
  chrome.storage.local.set({ [K_NOTE_BACKUP_AT]: lastBackupAt });
  renderBackupLine();
});

const restoreFile = $("restoreFile");
$("restoreBtn").addEventListener("click", () => { restoreFile.value = ""; restoreFile.click(); });
restoreFile.addEventListener("change", async () => {
  const file = restoreFile.files?.[0];
  if (!file) return;
  let data;
  try { data = JSON.parse(await file.text()); } catch { data = null; }
  if (data?.app !== BACKUP_APP || !Array.isArray(data.notes)) { toast("⚠ " + t("n.restoreBad")); return; }
  await flushSave();

  // 백업 파일도 남이 만든 파일일 수 있다 — 필드를 하나씩 다시 만들고 본문은 sanitize 를 거친다
  const str = (v, max) => (typeof v === "string" ? v : "").slice(0, max);
  const num = (v) => (Number.isFinite(v) ? v : Date.now());
  const haveFolder = new Set(folders.map(f => f.id));
  const newFolders = [];
  for (const f of Array.isArray(data.folders) ? data.folders : []) {
    if (typeof f?.id !== "string" || !f.id || haveFolder.has(f.id)) continue;
    newFolders.push({ id: f.id, name: str(f.name, 100) || t("n.newFolder"), createdAt: num(f.createdAt) });
    haveFolder.add(f.id);
  }
  const haveNote = new Map(metas.map(m => [m.id, m]));
  const entries = [];
  for (const n of data.notes) {
    const m = n?.meta;
    if (typeof m?.id !== "string" || !m.id) continue;
    const mine = haveNote.get(m.id);
    if (mine && (mine.updatedAt || 0) >= num(m.updatedAt)) continue;
    entries.push({
      meta: {
        id: m.id,
        kind: m.kind === "memo" ? "memo" : "clip",
        title: str(m.title, 300),
        url: str(m.url, 4000),
        site: str(m.site, 300),
        createdAt: num(m.createdAt),
        updatedAt: num(m.updatedAt),
        text: str(m.text, 5000),
        folderId: haveFolder.has(m.folderId) ? m.folderId : null,
      },
      html: sanitizeNoteHtml(typeof n.html === "string" ? n.html : ""),
    });
  }
  try { await notesImport(newFolders, entries); }
  catch { toast("⚠ " + t("n.saveFail")); return; }
  notesAnnounce({ type: "saved", from: ME });
  await reloadAll();
  if (currentId && entries.some(e => e.meta.id === currentId)) openNote(currentId);
  else if (!currentId && metas.length) openNote(metas[0].id);
  toast(entries.length ? t("n.restored", { n: entries.length }) : t("n.restoreNone"));
});

// =====================================================================
// 컬럼 폭 조절 — 경계를 끌어서. 이 기기·이 브라우저만의 편의라 localStorage 에 둔다 (sync 할 값 아님)
// 편집 영역은 최소 EDIT_MIN 을 남긴다. 더블클릭하면 CSS 기본 폭으로
// =====================================================================
const K_COLS = "taptap:notesCols";
const COL_LIMITS = { sidebar: [170, 380], list: [220, 600] };
const EDIT_MIN = 360;
const colEl = { sidebar: document.querySelector(".sidebar"), list: document.querySelector(".listCol") };
let colWidths = {};
try { colWidths = JSON.parse(localStorage.getItem(K_COLS) || "{}") || {}; } catch {}

function setColWidth(col, w) {
  const [lo, hi] = COL_LIMITS[col];
  const other = col === "sidebar" ? colEl.list : colEl.sidebar;
  const room = window.innerWidth - other.getBoundingClientRect().width - EDIT_MIN;
  w = Math.round(Math.max(lo, Math.min(hi, room, w)));
  colEl[col].style.width = w + "px";
  colWidths[col] = w;
}
function saveColWidths() { try { localStorage.setItem(K_COLS, JSON.stringify(colWidths)); } catch {} }
for (const col of Object.keys(colEl)) if (Number.isFinite(colWidths[col])) setColWidth(col, colWidths[col]);

document.querySelectorAll(".resizer").forEach(rz => {
  const col = rz.dataset.col;
  rz.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX, startW = colEl[col].getBoundingClientRect().width;
    rz.setPointerCapture(e.pointerId);
    rz.classList.add("dragging");
    document.body.classList.add("colResizing");
    const move = (ev) => setColWidth(col, startW + ev.clientX - startX);
    const up = () => {
      rz.removeEventListener("pointermove", move);
      rz.removeEventListener("pointerup", up);
      rz.removeEventListener("pointercancel", up);
      rz.classList.remove("dragging");
      document.body.classList.remove("colResizing");
      saveColWidths();
    };
    rz.addEventListener("pointermove", move);
    rz.addEventListener("pointerup", up);
    rz.addEventListener("pointercancel", up);
  });
  rz.addEventListener("dblclick", () => {
    colEl[col].style.width = "";
    delete colWidths[col];
    saveColWidths();
  });
});

// =====================================================================
// 같은 페이지 이어 붙이기 옵션 (background 가 저장할 때 읽는다)
// =====================================================================
const appendOpt = $("appendOpt");
appendOpt.addEventListener("change", () => chrome.storage.local.set({ [K_NOTE_APPEND]: appendOpt.checked }));

// =====================================================================
// 다른 곳에서 저장·수정·삭제되면 다시 읽는다 (팝업에서 새 노트, 다른 노트 탭)
// =====================================================================
try {
  const ch = new BroadcastChannel(NOTES_CHANNEL);
  ch.onmessage = async (ev) => {
    const msg = ev.data || {};
    if (msg.from === ME) return;
    await reloadAll();
    if (msg.id && msg.id === currentId) {
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
chrome.storage.sync.get([K_LANG], (res) => {
  const saved = res?.[K_LANG];
  lang = LANG_CODES.includes(saved) ? saved : guessDefaultLang();
  applyI18n();
  chrome.storage.local.get([K_NOTE_TARGET, K_NOTE_APPEND, K_NOTE_BACKUP_AT], async (st) => {
    targetFolderId = st?.[K_NOTE_TARGET] || null;
    appendOpt.checked = st?.[K_NOTE_APPEND] !== false;
    lastBackupAt = Number(st?.[K_NOTE_BACKUP_AT]) || 0;
    await reloadAll();
    if (targetFolderId && !folders.some(f => f.id === targetFolderId)) targetFolderId = null;
    renderFolders();
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && metas.some(m => m.id === id)) openNote(id);
    else if (metas.length) openNote(metas[0].id);
    else showEmpty();
  });
});
