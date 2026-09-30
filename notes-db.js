// =====================================================================
// 노트 저장소 (IndexedDB) — background.js 와 notes.html 이 같이 쓴다
//
// 확장 origin(chrome-extension://<id>)의 IndexedDB 라 권한이 필요 없다.
// chrome.storage 를 안 쓰는 이유: sync 는 100KB, local 은 10MB 한도이고
// 이미지를 base64 로 품은 노트는 한 개에 수 MB 가 된다.
//
// 저장소를 둘로 나눈 이유 (속도):
//   meta — 목록에 필요한 것만 (제목·주소·날짜·검색용 텍스트). 목록은 이것만 읽는다
//   body — 본문 HTML (이미지 포함, 무겁다). 노트를 고를 때 한 개만 읽는다
//
// content script 에서는 로드하지 말 것 — 거기서 열면 "페이지" origin 의 DB 가 된다.
// =====================================================================

const NOTES_DB = "taptap-notes";
const NOTES_DB_VER = 1;
const NOTES_CHANNEL = "taptap-notes";   // BroadcastChannel: 저장·수정·삭제 알림

let _notesDbP = null;
function notesDb() {
  if (_notesDbP) return _notesDbP;
  _notesDbP = new Promise((resolve, reject) => {
    const req = indexedDB.open(NOTES_DB, NOTES_DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "id" });
      if (!db.objectStoreNames.contains("body")) db.createObjectStore("body", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { _notesDbP = null; reject(req.error); };
  });
  return _notesDbP;
}

function _tx(stores, mode, fn) {
  return notesDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    let out;
    Promise.resolve(fn(tx)).then(v => { out = v; });
    tx.oncomplete = () => resolve(out);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}
function _req(r) {
  return new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
}

// meta 는 { id, title, url, site, createdAt, updatedAt, text }
function notesPut(meta, html) {
  return _tx(["meta", "body"], "readwrite", (tx) => {
    tx.objectStore("meta").put(meta);
    if (typeof html === "string") tx.objectStore("body").put({ id: meta.id, html });
  });
}
function notesListMeta() {
  return _tx(["meta"], "readonly", (tx) => _req(tx.objectStore("meta").getAll()))
    .then(arr => (arr || []).sort((a, b) => b.createdAt - a.createdAt));
}
function notesGetMeta(id) {
  return _tx(["meta"], "readonly", (tx) => _req(tx.objectStore("meta").get(id)));
}
function notesGetBody(id) {
  return _tx(["body"], "readonly", (tx) => _req(tx.objectStore("body").get(id)))
    .then(r => r?.html ?? "");
}
function notesDelete(id) {
  return _tx(["meta", "body"], "readwrite", (tx) => {
    tx.objectStore("meta").delete(id);
    tx.objectStore("body").delete(id);
  });
}
function notesAnnounce(msg) {
  try { const ch = new BroadcastChannel(NOTES_CHANNEL); ch.postMessage(msg); ch.close(); } catch {}
}

// "2026-10-01 14:32" — 로컬 시각. 제목 머리와 목록 날짜에 같이 쓴다
function notesFmtDate(ms) {
  const d = new Date(ms), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
