// =====================================================================
// 노트 저장소 (IndexedDB) — background.js 와 notes.html 이 같이 쓴다
//
// 확장 origin(chrome-extension://<id>)의 IndexedDB 라 권한이 필요 없다.
// chrome.storage 를 안 쓰는 이유: sync 는 100KB, local 은 10MB 한도이고
// 이미지를 base64 로 품은 노트는 한 개에 수 MB 가 된다.
//
// 저장소 (속도 때문에 목록용과 본문을 나눴다):
//   meta    — 목록에 필요한 것만 (제목·주소·날짜·폴더·검색용 텍스트). 목록은 이것만 읽는다
//   body    — 본문 HTML (이미지 포함, 무겁다). 노트를 고를 때 한 개만 읽는다
//   folders — { id, name, createdAt }. 노트의 folderId 가 null 이면 "분류 안 됨"
//
// content script 에서는 로드하지 말 것 — 거기서 열면 "페이지" origin 의 DB 가 된다.
// =====================================================================

const NOTES_DB = "taptap-notes";
const NOTES_DB_VER = 2;                  // 2: folders 저장소 추가
const NOTES_CHANNEL = "taptap-notes";    // BroadcastChannel: 저장·수정·삭제 알림

// 새 노트가 들어갈 폴더 (노트 페이지에서 고른 폴더). storage.local — 기기 간 동기화할 값이 아니다
const K_NOTE_TARGET = "shiftsearch:noteTargetFolder";
// 같은 페이지에서 긁은 조각은 기존 노트에 이어 붙인다 (기본 켬)
const K_NOTE_APPEND = "shiftsearch:noteAppendSamePage";

let _notesDbP = null;
function notesDb() {
  if (_notesDbP) return _notesDbP;
  _notesDbP = new Promise((resolve, reject) => {
    const req = indexedDB.open(NOTES_DB, NOTES_DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "id" });
      if (!db.objectStoreNames.contains("body")) db.createObjectStore("body", { keyPath: "id" });
      if (!db.objectStoreNames.contains("folders")) db.createObjectStore("folders", { keyPath: "id" });
    };
    req.onsuccess = () => {
      const db = req.result;
      // 다른 쪽(노트 페이지·서비스 워커)이 새 버전으로 열려 하면 비켜 준다. 안 그러면 업그레이드가 막힌다
      db.onversionchange = () => { db.close(); _notesDbP = null; };
      resolve(db);
    };
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

// meta 는 { id, title, url, site, createdAt, updatedAt, text, folderId }
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

function foldersList() {
  return _tx(["folders"], "readonly", (tx) => _req(tx.objectStore("folders").getAll()))
    .then(arr => (arr || []).sort((a, b) => a.createdAt - b.createdAt));
}
function folderPut(folder) {
  return _tx(["folders"], "readwrite", (tx) => { tx.objectStore("folders").put(folder); });
}
// 폴더를 지워도 노트는 지우지 않는다 — "분류 안 됨"으로 옮긴다
function folderDelete(id) {
  return _tx(["folders", "meta"], "readwrite", async (tx) => {
    tx.objectStore("folders").delete(id);
    const metaStore = tx.objectStore("meta");
    const all = await _req(metaStore.getAll());
    for (const m of all) if (m.folderId === id) { m.folderId = null; metaStore.put(m); }
  });
}

// 백업 복원 — 폴더와 노트를 한 트랜잭션에 넣는다 (중간에 실패하면 아무것도 안 들어간다)
// entries: [{ meta, html }]. 정리·병합 판단은 부르는 쪽(notes.js)이 끝낸 뒤에 넘긴다
function notesImport(folderArr, entries) {
  return _tx(["folders", "meta", "body"], "readwrite", (tx) => {
    const fs = tx.objectStore("folders"), ms = tx.objectStore("meta"), bs = tx.objectStore("body");
    for (const f of folderArr) fs.put(f);
    for (const e of entries) { ms.put(e.meta); bs.put({ id: e.meta.id, html: e.html }); }
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

// 같은 페이지 판정용 — #해시는 무시한다 (목차 링크로 이동해도 같은 글)
function notesPageKey(url) {
  try { const u = new URL(url); u.hash = ""; return u.href; } catch { return String(url || ""); }
}
