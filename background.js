chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
  }
});
