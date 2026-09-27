// =====================================================================
// TapTap - Quick Search — popup.js  (툴바 아이콘 패널)
//
// "이 페이지에서 열기" 는 현재 탭의 content script 에게 팝업을 열라고 시킨다.
// 탭에 직접 메시지를 보내려면 activeTab 권한이 필요해서, 권한 없이 storage 를 경유한다:
//   여기서 K_OPENREQ 에 { tabId, ts } 를 쓴다
//     -> 모든 탭의 content script 가 보고, 자기 탭 번호일 때만 열고 K_OPENACK 을 쓴다
//     -> 응답이 오면 이 패널을 닫는다. 안 오면 "이 페이지에선 못 연다" 를 띄운다
//        (chrome:// 페이지이거나, 확장 설치·업데이트 후 새로고침 안 한 탭)
// =====================================================================

const K_LANG    = "shiftsearch:lang";
const K_OPENREQ = "shiftsearch:openRequest";
const K_OPENACK = "shiftsearch:openAck";

const ACK_TIMEOUT = 500;   // 이 안에 응답이 없으면 실패로 본다

// 언어 코드는 options.js 의 LANGS 와 같아야 한다 (kr, zh-CN, vn 처럼 표준 코드와 다른 게 있다).
const LANG_CODES = ["kr","en","ja","zh-CN","zh-TW","es","fr","de","ru","vn","ms","th","id"];

let lang = "en";

// 번역 표는 i18n-options.js (popup.html 에서 먼저 로드된다). 폴백: 현재 언어 -> en -> 키 그대로.
function t(key) {
  const tbl = (typeof OPT_I18N !== "undefined" && OPT_I18N) || {};
  return (tbl[lang] && tbl[lang][key]) || (tbl.en && tbl.en[key]) || key;
}

function guessDefaultLang() {
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("ko")) return "kr";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("zh-cn") || nav.includes("hans")) return "zh-CN";
  if (nav.startsWith("zh-tw") || nav.includes("hant")) return "zh-TW";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("vi")) return "vn";
  if (nav.startsWith("ms")) return "ms";
  if (nav.startsWith("th")) return "th";
  if (nav.startsWith("id")) return "id";
  return "en";
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.documentElement.lang = (lang === "kr") ? "ko" : lang;
}

const openBtn = document.getElementById("openBtn");
const optBtn  = document.getElementById("optBtn");
const msgEl   = document.getElementById("msg");

chrome.storage.sync.get([K_LANG], (res) => {
  const saved = res?.[K_LANG];
  lang = LANG_CODES.includes(saved) ? saved : guessDefaultLang();
  applyI18n();
});

optBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

openBtn.addEventListener("click", async () => {
  msgEl.classList.remove("show");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (typeof tab?.id !== "number") { msgEl.classList.add("show"); return; }

  let done = false;
  const onAck = (changes) => {
    const ack = changes[K_OPENACK]?.newValue;
    if (!ack || ack.tabId !== tab.id) return;
    done = true;
    chrome.storage.local.onChanged.removeListener(onAck);
    window.close();
  };
  chrome.storage.local.onChanged.addListener(onAck);

  chrome.storage.local.set({ [K_OPENREQ]: { tabId: tab.id, ts: Date.now() } });

  setTimeout(() => {
    if (done) return;
    chrome.storage.local.onChanged.removeListener(onAck);
    msgEl.classList.add("show");
  }, ACK_TIMEOUT);
});
