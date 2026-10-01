// =====================================================================
// 확장 페이지 강조색 (accent.css 의 data-accent) — options · notes · popup 의 <head> 에서 로드
//
// 저장값은 chrome.storage.sync 다 (다른 기기에서도 같은 색).
// storage 는 비동기라 그것만 기다리면 첫 화면이 보라로 그려졌다가 바뀐다 →
// localStorage 에 캐시해 두고 <head> 에서 동기로 먼저 꽂는다. 확장 origin 하나라 세 페이지가 같이 쓴다.
// =====================================================================
const K_UI_ACCENT = "shiftsearch:uiAccent";
const UI_ACCENTS = ["purple", "blue", "navy", "teal", "orange", "graphite"];

function applyUiAccent(id) {
  if (!UI_ACCENTS.includes(id)) id = "purple";
  if (id === "purple") delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = id;
  try { localStorage.setItem(K_UI_ACCENT, id); } catch {}
}

try { applyUiAccent(localStorage.getItem(K_UI_ACCENT)); } catch {}
chrome.storage?.sync?.get?.([K_UI_ACCENT], (r) => applyUiAccent(r?.[K_UI_ACCENT]));
// 설정에서 바꾸면 열려 있는 노트 탭도 바로 따라온다
chrome.storage?.onChanged?.addListener((ch, area) => {
  if (area === "sync" && ch[K_UI_ACCENT]) applyUiAccent(ch[K_UI_ACCENT].newValue);
});
