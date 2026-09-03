const K_NEWTAB = "shiftsearch:openInNewTab";

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
  }
});

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
});
