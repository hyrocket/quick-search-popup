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

  /* 설치 직후엔 이미 열려 있던 탭에 content script 가 없다 → 그 탭에선 팝업이 안 뜬다.
     탭에 스크립트를 밀어 넣으려면 scripting 권한이 필요하므로, 대신 설정 페이지를 열어
     "열어 둔 탭은 새로고침" 안내 카드를 보여준다. ?welcome=1 이 그 카드의 표시 조건이다.
     openOptionsPage() 로는 쿼리를 못 붙여서 tabs.create 를 쓴다 (권한 불필요). */
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html?welcome=1") });
});
