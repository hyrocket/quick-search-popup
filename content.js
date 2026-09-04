// =====================================================================
// TapTap - Quick Search — content.js
// New in v3: AI engines, text-selection auto-fill, search history,
//            custom trigger shortcut, custom hex color support
// =====================================================================

// =======================
// Storage Keys
// =======================
const K_LANG    = "shiftsearch:lang";
const K_NEWTAB  = "shiftsearch:openInNewTab";
const K_ENGS    = "shiftsearch:engines";
const K_LAST    = "shiftsearch:lastEngineId";
const K_HISTORY = "shiftsearch:history";
const K_SHORTCUT= "shiftsearch:shortcut";   // { type:"double", key:"Shift" } | { type:"single", key:"Ctrl+Space" }
const K_APPEARANCE = "shiftsearch:appearance"; // { theme, autoDark, engineTint, font }

// 테마/외형 — 기본값 조합이 곧 현행 모습이다 (classic + autoDark + engineTint).
// 이 기본값을 바꾸면 기존 사용자의 팝업이 달라진다.
const THEME_IDS = ["classic", "mono", "midnight", "glass", "paper", "terminal"];
const FONT_IDS  = ["system", "serif", "mono"];
const DEFAULT_APPEARANCE = { theme:"classic", autoDark:true, engineTint:true, font:"system" };

function normalizeAppearance(v) {
  const a = (v && typeof v === "object") ? v : {};
  return {
    theme:      THEME_IDS.includes(a.theme) ? a.theme : DEFAULT_APPEARANCE.theme,
    autoDark:   typeof a.autoDark   === "boolean" ? a.autoDark   : DEFAULT_APPEARANCE.autoDark,
    engineTint: typeof a.engineTint === "boolean" ? a.engineTint : DEFAULT_APPEARANCE.engineTint,
    font:       FONT_IDS.includes(a.font) ? a.font : DEFAULT_APPEARANCE.font,
  };
}
const LEGACY_K_COLORMAP = "shiftsearch:engineColorMap";

const MAX_HISTORY = 30;

// =======================
// Languages
// =======================
const LANGS = ["kr","en","ja","zh-CN","zh-TW","es","fr","de","ru","vn","ms","th","id"];

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

// =======================
// i18n
// =======================
const I18N = {
  kr: {
    placeholder: "검색어 입력 후 Enter",
    placeholderSel: "선택된 텍스트로 검색",
    openNewTab: "새 탭",
    enterBtn: "검색",
    closeBtn: "닫기",
    settings: "설정",
    historyTitle: "최근 검색",
    clearHistory: "기록 지우기",
    noHistory: "검색 기록 없음",
    hint: (engine, newTab) => `${engine} · ↑/↓: 엔진 변경 · ${newTab ? "새탭 ON" : "새탭 OFF"}`
  },
  en: {
    placeholder: "Type to search, press Enter",
    placeholderSel: "Search selected text",
    openNewTab: "New tab",
    enterBtn: "Search",
    closeBtn: "Close",
    settings: "Settings",
    historyTitle: "Recent",
    clearHistory: "Clear",
    noHistory: "No recent searches",
    hint: (engine, newTab) => `${engine} · ↑/↓: change engine · ${newTab ? "New tab ON" : "New tab OFF"}`
  },
  ja: {
    placeholder: "検索後 Enter",
    placeholderSel: "選択テキストで検索",
    openNewTab: "新タブ",
    enterBtn: "検索",
    closeBtn: "閉じる",
    settings: "設定",
    historyTitle: "最近の検索",
    clearHistory: "履歴を消去",
    noHistory: "検索履歴なし",
    hint: (engine, newTab) => `${engine} · ↑/↓: エンジン変更 · ${newTab ? "新タブ ON" : "新タブ OFF"}`
  },
  "zh-CN": {
    placeholder: "输入后按 Enter",
    placeholderSel: "搜索选中文字",
    openNewTab: "新标签",
    enterBtn: "搜索",
    closeBtn: "关闭",
    settings: "设置",
    historyTitle: "最近搜索",
    clearHistory: "清除",
    noHistory: "无搜索历史",
    hint: (engine, newTab) => `${engine} · ↑/↓: 切换 · ${newTab ? "新标签 ON" : "OFF"}`
  },
  "zh-TW": {
    placeholder: "輸入後按 Enter",
    placeholderSel: "搜尋選取文字",
    openNewTab: "新分頁",
    enterBtn: "搜尋",
    closeBtn: "關閉",
    settings: "設定",
    historyTitle: "最近搜尋",
    clearHistory: "清除",
    noHistory: "無搜尋記錄",
    hint: (engine, newTab) => `${engine} · ↑/↓: 切換 · ${newTab ? "新分頁 ON" : "OFF"}`
  },
  es: {
    placeholder: "Escribe y presiona Enter",
    placeholderSel: "Buscar texto seleccionado",
    openNewTab: "Nueva pestaña",
    enterBtn: "Buscar",
    closeBtn: "Cerrar",
    settings: "Configuración",
    historyTitle: "Recientes",
    clearHistory: "Borrar",
    noHistory: "Sin historial",
    hint: (engine, newTab) => `${engine} · ↑/↓: cambiar · ${newTab ? "Nueva pestaña ON" : "OFF"}`
  },
  fr: {
    placeholder: "Saisissez puis Enter",
    placeholderSel: "Rechercher le texte sélectionné",
    openNewTab: "Nouvel onglet",
    enterBtn: "Chercher",
    closeBtn: "Fermer",
    settings: "Paramètres",
    historyTitle: "Récents",
    clearHistory: "Effacer",
    noHistory: "Aucun historique",
    hint: (engine, newTab) => `${engine} · ↑/↓: changer · ${newTab ? "Nouvel onglet ON" : "OFF"}`
  },
  de: {
    placeholder: "Eingeben und Enter",
    placeholderSel: "Ausgewählten Text suchen",
    openNewTab: "Neuer Tab",
    enterBtn: "Suchen",
    closeBtn: "Schließen",
    settings: "Einstellungen",
    historyTitle: "Zuletzt",
    clearHistory: "Löschen",
    noHistory: "Kein Verlauf",
    hint: (engine, newTab) => `${engine} · ↑/↓: wechseln · ${newTab ? "Neuer Tab AN" : "AUS"}`
  },
  ru: {
    placeholder: "Введите и нажмите Enter",
    placeholderSel: "Искать выделенный текст",
    openNewTab: "Новая вкладка",
    enterBtn: "Поиск",
    closeBtn: "Закрыть",
    settings: "Настройки",
    historyTitle: "Недавние",
    clearHistory: "Очистить",
    noHistory: "Нет истории",
    hint: (engine, newTab) => `${engine} · ↑/↓: сменить · ${newTab ? "Новая вкл. ВКЛ" : "ВЫКЛ"}`
  },
  vn: {
    placeholder: "Nhập và nhấn Enter",
    placeholderSel: "Tìm văn bản đã chọn",
    openNewTab: "Tab mới",
    enterBtn: "Tìm",
    closeBtn: "Đóng",
    settings: "Cài đặt",
    historyTitle: "Gần đây",
    clearHistory: "Xóa",
    noHistory: "Không có lịch sử",
    hint: (engine, newTab) => `${engine} · ↑/↓: đổi · ${newTab ? "Tab mới ON" : "OFF"}`
  },
  ms: {
    placeholder: "Taip dan Enter",
    placeholderSel: "Cari teks dipilih",
    openNewTab: "Tab baharu",
    enterBtn: "Cari",
    closeBtn: "Tutup",
    settings: "Tetapan",
    historyTitle: "Terkini",
    clearHistory: "Padam",
    noHistory: "Tiada sejarah",
    hint: (engine, newTab) => `${engine} · ↑/↓: tukar · ${newTab ? "Tab baharu ON" : "OFF"}`
  },
  th: {
    placeholder: "พิมพ์แล้วกด Enter",
    placeholderSel: "ค้นหาข้อความที่เลือก",
    openNewTab: "แท็บใหม่",
    enterBtn: "ค้นหา",
    closeBtn: "ปิด",
    settings: "การตั้งค่า",
    historyTitle: "ล่าสุด",
    clearHistory: "ล้าง",
    noHistory: "ไม่มีประวัติ",
    hint: (engine, newTab) => `${engine} · ↑/↓: เปลี่ยน · ${newTab ? "แท็บใหม่ ON" : "OFF"}`
  },
  id: {
    placeholder: "Ketik lalu Enter",
    placeholderSel: "Cari teks dipilih",
    openNewTab: "Tab baru",
    enterBtn: "Cari",
    closeBtn: "Tutup",
    settings: "Pengaturan",
    historyTitle: "Terkini",
    clearHistory: "Hapus",
    noHistory: "Tidak ada riwayat",
    hint: (engine, newTab) => `${engine} · ↑/↓: ganti · ${newTab ? "Tab baru ON" : "OFF"}`
  }
};

function t(lang, key, ...args) {
  const pack = I18N[lang] || I18N.en;
  const v = pack[key] ?? I18N.en[key] ?? key;
  return (typeof v === "function") ? v(...args) : v;
}

// =======================
// AI 도메인 자동 감지
// =======================
const AI_DOMAINS = [
  "perplexity.ai", "chatgpt.com", "claude.ai", "chat.openai.com",
  "gemini.google.com", "bard.google.com", "grok.x.com", "grok.com",
  "copilot.microsoft.com", "bing.com/chat", "you.com", "phind.com",
  "poe.com", "character.ai", "huggingface.co", "replicate.com",
  "mistral.ai", "groq.com", "cohere.com", "together.ai",
  "deepseek.com", "kimi.moonshot.cn", "chat.deepseek.com",
  "wrtn.ai", "clova.ai", "hyperclova.ai"
];

function detectIsAI(url) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return AI_DOMAINS.some(d => hostname === d || hostname.endsWith("." + d));
  } catch { return false; }
}

// =======================
// Palette — preset + custom hex support
// =======================
const PALETTE = {
  pastel: { label:"Pastel", panelBg:"#FFFFFF", panelFg:"#111827", subBg:"#F6F7FB", border:"#CBD5E1", accent:"#94A3B8" },
  sky:    { label:"Sky",    panelBg:"#F8FAFF", panelFg:"#0F172A", subBg:"#EFF6FF", border:"#B6D4FE", accent:"#3B82F6" },
  mint:   { label:"Mint",   panelBg:"#FBFFFC", panelFg:"#052E16", subBg:"#ECFDF5", border:"#A7F3D0", accent:"#10B981" },
  peach:  { label:"Peach",  panelBg:"#FFFBFA", panelFg:"#111827", subBg:"#FFF1F2", border:"#FECACA", accent:"#FB7185" },
  lemon:  { label:"Lemon",  panelBg:"#FFFEFA", panelFg:"#111827", subBg:"#FFFBEB", border:"#FDE68A", accent:"#F59E0B" },
  gray:   { label:"Gray",   panelBg:"#FFFFFF", panelFg:"#111827", subBg:"#F3F4F6", border:"#D1D5DB", accent:"#6B7280" },
  dark:   { label:"Dark",   panelBg:"#1E1E2E", panelFg:"#CDD6F4", subBg:"#313244", border:"#45475A", accent:"#89B4FA" },
  violet: { label:"Violet", panelBg:"#FAF5FF", panelFg:"#1E0A3C", subBg:"#F3E8FF", border:"#C4B5FD", accent:"#7C3AED" },
  rose:   { label:"Rose",   panelBg:"#FFF1F3", panelFg:"#1A0A0D", subBg:"#FFE4E6", border:"#FECDD3", accent:"#E11D48" }
};

// 다크모드 처리는 CSS로 옮겼다.
// 값(구 DARK_OVERRIDE: #1E1E2E / #CDD6F4 / #313244 / #45475A)은
// shadow DOM 스타일의 @media(prefers-color-scheme:dark) 블록에 있다.
// JS 분기를 없앴으므로 OS 모드 전환이 팝업이 열린 채로도 즉시 반영된다.

// Resolve engine theme: preset key OR "#rrggbb" custom
function paletteForEngine(en) {
  const c = en?.color || "pastel";
  if (PALETTE[c]) return PALETTE[c];
  // custom hex: derive shades automatically
  if (/^#[0-9a-fA-F]{6}$/.test(c)) {
    return buildCustomPalette(c);
  }
  return PALETTE.pastel;
}

function buildCustomPalette(hex) {
  // Build a palette from a single accent hex
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  const lum = 0.2126*r/255 + 0.7152*g/255 + 0.0722*b/255;
  const panelFg = lum > 0.5 ? "#111827" : "#F9FAFB";
  const subBg = `rgba(${r},${g},${b},0.08)`;
  const border = `rgba(${r},${g},${b},0.30)`;
  return { label:"Custom", panelBg:"#FFFFFF", panelFg, subBg, border, accent: hex };
}

// =======================
// Default engines (including AI)
// =======================
/* 엔진 이름은 "스파스 다국어 객체"다.
   en은 항상 존재하고, en과 다른 이름을 쓰는 언어만 키로 둔다.
   읽기는 engineLabel()의 lang -> en -> kr 폴백이 처리한다.
   (13개 언어를 전부 채우면 12개가 영어 문자열의 복사본이라
    chrome.storage.sync 키당 8KB 한도를 금방 먹는다) */
/* Wikipedia는 언어별로 도메인이 다르다. www.wikipedia.org 는 포털이라 검색이 안 되고
   /wiki/ 경로는 영문판으로 리다이렉트된다. 그래서 설치 시점의 브라우저 언어로 시드한다.
   ⚠ content.js / options.js 양쪽에 같은 매핑이 있다 (CLAUDE.md 금지항목 #2) */
const WIKI_HOST = {
  kr:"ko", en:"en", ja:"ja", "zh-CN":"zh", "zh-TW":"zh", es:"es", fr:"fr",
  de:"de", ru:"ru", vn:"vi", ms:"ms", th:"th", id:"id"
};
function wikipediaUrl(lang) {
  const h = WIKI_HOST[lang] || "en";
  return `https://${h}.wikipedia.org/wiki/Special:Search?search={q}`;
}

function defaultEngines() {
  return [
    {
      id: "google",
      name: { en:"Google", kr:"구글" },
      url: "https://www.google.com/search?q={q}",
      color: "sky", enabled: true, icon: "🔍"
    },
    {
      id: "naver",
      name: { en:"Naver", kr:"네이버" },
      url: "https://search.naver.com/search.naver?query={q}",
      color: "mint", enabled: true, icon: "🟢"
    },
    {
      id: "bing",
      name: { en:"Bing", kr:"빙" },
      url: "https://www.bing.com/search?q={q}",
      color: "pastel", enabled: true, icon: "🔵"
    },
    {
      id: "wikipedia",
      name: { en:"Wikipedia", kr:"위키피디아" },
      url: wikipediaUrl(guessDefaultLang()),
      color: "gray", enabled: true, icon: "📚"
    },
    {
      id: "perplexity",
      name: { en:"Perplexity AI", kr:"퍼플렉시티" },
      url: "https://www.perplexity.ai/search?q={q}",
      color: "violet", enabled: true, icon: "🤖"
    },
    {
      id: "chatgpt",
      name: { en:"ChatGPT", kr:"챗GPT" },
      url: "https://chatgpt.com/?q={q}&hints=search",
      color: "gray", enabled: true, icon: "💬"
    },
    {
      id: "claude",
      name: { en:"Claude", kr:"클로드" },
      url: "https://claude.ai/new?q={q}",
      color: "peach", enabled: true, icon: "✨"
    },
    {
      id: "youtube",
      name: { en:"YouTube", kr:"유튜브" },
      url: "https://www.youtube.com/results?search_query={q}",
      color: "rose", enabled: true, icon: "▶️"
    }
  ];
}

// =======================
// Runtime state — 메모리 캐시 (storage I/O 최소화)
// =======================
let state = {
  lang: "en",  // 기본 언어 영어 고정
  openInNewTab: false,
  engines: defaultEngines(),
  lastEngineId: "google",
  history: [],
  shortcut: { type: "double", key: "Shift" },
  appearance: { ...DEFAULT_APPEARANCE }
};

// 최초 한 번만 storage에서 로드, 이후 메모리 캐시 사용
let _stateReady = false;
let _pendingOpen = false;  // 로딩 중 openPanel 요청 대기

// storage 변경 감지 → 메모리 자동 동기화 (다른 탭 설정 변경 대응)
chrome.storage?.sync?.onChanged?.addListener((changes) => {
  if (changes[K_ENGS])     { state.engines   = normalizeEngines(changes[K_ENGS].newValue || []); }
  if (changes[K_LANG])     { state.lang       = normalizeLang(changes[K_LANG].newValue); }
  if (changes[K_NEWTAB])   { state.openInNewTab = !!changes[K_NEWTAB].newValue; }
  if (changes[K_LAST])     { state.lastEngineId = changes[K_LAST].newValue || state.engines[0]?.id; }
  if (changes[K_HISTORY])  { state.history    = changes[K_HISTORY].newValue || []; }
  if (changes[K_SHORTCUT]) { state.shortcut   = changes[K_SHORTCUT].newValue || { type:"double", key:"Shift" }; }
  if (changes[K_APPEARANCE]) {
    state.appearance = normalizeAppearance(changes[K_APPEARANCE].newValue);
    if (host) applyTheme(); // 열려 있는 팝업에도 즉시 반영
  }
});

// =======================
// Trigger detection (configurable)
// =======================
let lastTapTime = 0;      // 마지막으로 "인정된" 탭의 시각
let tapCount = 0;
let modDownTime = 0;      // 트리거 키가 눌린 시각 (0 = 안 눌려 있음)
let modDirty = false;     // 이번 누름 중에 다른 키가 같이 눌렸는가
const DOUBLE_THRESHOLD = 300;   // 인정된 탭 사이의 최대 간격
const TAP_MAX_HOLD     = 250;   // 탭 하나로 인정되는 최대 누름 지속시간

function resetTapHold() { modDownTime = 0; modDirty = false; }

// 포커스가 빠지면 keyup이 안 오므로 눌림 상태를 버린다
window.addEventListener("blur", () => { resetTapHold(); tapCount = 0; });

function isImeComposing(e) { return e.isComposing === true || e.key === "Process"; }

document.addEventListener("keydown", (e) => {
  // 더블탭 누름 추적. IME 조합 중에도 "다른 키가 눌렸다"는 사실은 기록해야 하므로
  // isImeComposing 조기 반환보다 위에 둔다.
  const dsc = state.shortcut;
  if (dsc.type === "double") {
    if (e.key === dsc.key) {
      if (!e.repeat) { modDownTime = Date.now(); modDirty = false; }
    } else if (modDownTime) {
      modDirty = true;   // 이 누름은 조합키 용도 → 탭으로 인정하지 않는다
    }
  }

  if (isImeComposing(e)) return;
  // Single-key combos (e.g. Ctrl+Space)
  const sc = state.shortcut;
  if (sc.type === "single") {
    const parts = sc.key.split("+");
    const mainKey = parts[parts.length - 1];
    const needCtrl  = parts.includes("Ctrl");
    const needAlt   = parts.includes("Alt");
    const needShift = parts.includes("Shift");
    const needMeta  = parts.includes("Meta");

    // e.key 정규화: 알파벳은 대문자로, Space 처리
    let pressedKey = e.key;
    if (pressedKey === " ") pressedKey = "Space";
    else if (pressedKey.length === 1) pressedKey = pressedKey.toUpperCase();

    if (
      pressedKey  === mainKey &&
      e.ctrlKey   === needCtrl  &&
      e.altKey    === needAlt   &&
      e.shiftKey  === needShift &&
      e.metaKey   === needMeta  &&
      !e.repeat
    ) {
      e.preventDefault();
      openPanel();
    }
  }
}, { capture: true });

document.addEventListener("keyup", (e) => {
  const sc = state.shortcut;
  if (sc.type !== "double") return;
  if (e.key !== sc.key) return;

  const downTime = modDownTime;
  const dirty    = modDirty;
  resetTapHold();

  const now  = Date.now();
  const held = downTime ? now - downTime : Infinity;

  // 짧게 눌렀다 뗐고, 그 사이 다른 키를 쓰지 않았고, IME 조합 중이 아닐 때만 탭으로 인정
  if (held > TAP_MAX_HOLD || dirty || isImeComposing(e)) {
    tapCount = 0;   // 대문자 입력용 긴 누름 / 조합키 사용 → 카운터를 버린다
    return;
  }

  tapCount = (now - lastTapTime <= DOUBLE_THRESHOLD) ? tapCount + 1 : 1;
  lastTapTime = now;

  if (tapCount >= 2) {
    tapCount = 0;
    e.preventDefault();
    openPanel();
  }
}, { capture: true });

// =======================
// History helpers
// =======================
function addToHistory(q) {
  if (!q || q.length < 2) return;
  state.history = [q, ...state.history.filter(h => h !== q)].slice(0, MAX_HISTORY);
  chrome.storage?.sync?.set?.({ [K_HISTORY]: state.history });
}

function clearHistory() {
  state.history = [];
  chrome.storage?.sync?.set?.({ [K_HISTORY]: [] });
}

// =======================
// Shadow DOM — panel refs
// =======================
let host, sr, overlay, panelWrap, panelEl, inputEl, selectEl, hintEl, newTabEl;
let historyDropEl, engineDropEl, engStripEl, selBadgeEl, titleHintEl;
let overlayOpen = false;

// 편집 가능한 요소인가 (입력을 절대 막으면 안 되는 대상)
function isEditableTarget(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable === true;
}

function installGlobalTraps() {
  // ── 페이지 이벤트 차단 트랩 ──
  const trap = (e) => {
    if (!overlayOpen) return;
    const path = e.composedPath?.() || [];
    const inside = path.includes(host)
                || path.includes(overlay)
                || path.includes(panelWrap)
                || (sr && path.includes(sr));
    if (inside) return;

    // "내 팝업 밖"이라고 해서 무조건 막으면 안 된다.
    // 같은 확장이 두 벌 떠 있으면(스토어 버전 + 개발용 압축해제 버전 등)
    // 상대 인스턴스의 입력창이 여기서 "밖"으로 잡혀 타이핑·Backspace·한영 전환이
    // 전부 죽는다. 한글만 들어가는 것처럼 보이는데, IME는 composition 경로라
    // keydown을 막아도 통과하기 때문이다.
    // 편집 가능한 요소에서 난 이벤트는 어떤 경우에도 건드리지 않는다.
    if (isEditableTarget(path[0])) return;

    e.stopPropagation();
    if (e.type === "keydown" || e.type === "keypress" || e.type === "keyup") e.preventDefault();
  };
  ["keydown","keypress","keyup"].forEach((t) => document.addEventListener(t, trap, { capture: true }));

  // ── 방향키 전용 document-level 핸들러 (가장 확실한 방법) ──
  document.addEventListener("keydown", (e) => {
    if (!overlayOpen) return;
    const histOpen = historyDropEl?.classList.contains("open");
    const engOpen  = isEngDropOpen();
    if (e.key === "ArrowUp") {
      e.preventDefault(); e.stopPropagation();
      if (engOpen) navigateEngineDrop(-1);
      else if (!histOpen) { cycleEngine(-1); inputEl?.focus(); }
      else navigateHistory(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault(); e.stopPropagation();
      if (engOpen) navigateEngineDrop(+1);
      else if (!histOpen) { cycleEngine(+1); inputEl?.focus(); }
      else navigateHistory(+1);
      return;
    }
  }, { capture: true });
}

// =======================
// Build panel (once)
// =======================
function ensurePanel() {
  if (host) return;

  host = document.createElement("div");
  // 테마 속성은 항상 존재해야 한다 (CSS 셀렉터 기준점).
  // applyTheme()이 곧 덮어쓰지만, 그 전에 렌더되는 한 프레임에서도 어긋나면 안 된다.
  host.dataset.ssTheme    = DEFAULT_APPEARANCE.theme;
  host.dataset.ssAutodark = DEFAULT_APPEARANCE.autoDark ? "on" : "off";
  host.dataset.ssTint     = DEFAULT_APPEARANCE.engineTint ? "on" : "off";
  host.dataset.ssFont     = DEFAULT_APPEARANCE.font;
  sr = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    /* ══════════════════════════════════════════════════════════════
       Theme tokens — 기본값은 classic(현행 렌더링)과 픽셀 단위로 동일하다.
       --ss-panel-bg / -panel-fg / -sub-bg / -border / -accent 5개는
       applyTheme()이 host.style에 인라인으로 꽂는다(엔진 팔레트).
       아래 토큰들은 그 5개에서 파생되거나 고정값이다.
       ⚠ 접두사를 --ss- 외의 것으로 바꾸지 말 것 (CLAUDE.md 참고)
       ══════════════════════════════════════════════════════════════ */
    :host{
      /* 엔진 팔레트 → 테마 변수 매핑 (classic 기본 동작).
         applyTheme()은 --ss-engine-* 원본만 인라인으로 꽂는다. 인라인은 어떤
         CSS 규칙보다 강하므로, 파생 이름(--ss-panel-*)에 직접 꽂으면 테마 블록이
         절대 이길 수 없다. 그래서 매핑을 CSS로 옮겼다. */
      --ss-panel-bg: var(--ss-engine-bg,#FFFFFF);
      --ss-panel-fg: var(--ss-engine-fg,#111827);
      --ss-sub-bg:   var(--ss-engine-sub,#F6F7FB);
      --ss-border:   var(--ss-engine-bd,#CBD5E1);
      --ss-accent:   var(--ss-engine-accent,#94A3B8);

      /* 엔진 tint — 비-classic 테마에서 엔진 색이 새어나오는 유일한 통로 */
      --ss-tint-base: var(--ss-accent);
      --ss-tint: var(--ss-tint-base);
      --ss-tint-blend: 100%;

      --ss-font: system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;

      /* overlay */
      --ss-overlay-bg: rgba(0,0,0,.22);
      --ss-overlay-blur: blur(2px);

      /* panel */
      --ss-backdrop: none;
      --ss-shadow: 0 16px 48px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.08);
      --ss-panel-bd: color-mix(in oklab,var(--ss-border,#CBD5E1) 40%,transparent);
      --ss-divider:  color-mix(in oklab,var(--ss-border,#CBD5E1) 40%,transparent);
      --ss-fg-muted: color-mix(in oklab,var(--ss-panel-fg,#111827) 40%,transparent);
      --ss-title-fg: #6366F1;
      --ss-bolt: #F5B301;   /* 로고 번개 — 테마와 무관하게 항상 노란색 */

      /* 검색 입력창 + 엔진 버튼 (tint 지점 ①) */
      --ss-input-bg: var(--ss-sub-bg,#f6f7fb);
      --ss-input-bd: var(--ss-border,#CBD5E1);
      --ss-input-focus-bd: var(--ss-accent,#94A3B8);
      --ss-input-ring: color-mix(in oklab,var(--ss-accent,#94A3B8) 22%,transparent);

      /* 버튼 */
      --ss-btn-bg: var(--ss-sub-bg,#fafafa);
      --ss-btn-bd: var(--ss-border,#CBD5E1);
      --ss-btn-hover-bg: color-mix(in oklab,var(--ss-sub-bg,#f6f7fb) 70%,var(--ss-accent,#94A3B8) 10%);
      --ss-btn-hover-bd: var(--ss-accent,#94A3B8);
      --ss-primary-bg: #6366F1;
      --ss-primary-bg-hover: #4F46E5;
      --ss-on-accent: #fff;

      /* 엔진 스트립 pill (활성 테두리 = tint 지점 ②) */
      --ss-chip-bg: color-mix(in oklab,var(--ss-sub-bg,#f6f7fb) 90%,transparent);
      --ss-chip-fg: var(--ss-panel-fg,#374151);
      --ss-chip-hover-bg: var(--ss-sub-bg,#f6f7fb);
      --ss-chip-hover-bd: var(--ss-border,#CBD5E1);
      --ss-pill-active-bg: color-mix(in oklab,var(--ss-accent,#94A3B8) 15%,var(--ss-panel-bg,#fff));
      --ss-pill-active-fg: var(--ss-accent,#94A3B8);
      --ss-pill-active-bd: var(--ss-accent,#94A3B8);

      /* AI 배지 */
      --ss-aitag-bg: var(--ss-accent,#94A3B8);
      --ss-aitag-fg: #fff;

      /* 하단 바 (panel 바깥) */
      --ss-bar-bg: rgba(255,255,255,.92);
      --ss-bar-bd: rgba(0,0,0,.07);
      --ss-bar-fg: #111827;
      --ss-bar-shadow: 0 6px 20px rgba(0,0,0,.08);
      --ss-bar-backdrop: blur(8px);
      --ss-hint-fg: rgba(17,24,39,.55);
      --ss-iconbtn-bg: rgba(255,255,255,.85);
      --ss-iconbtn-bd: rgba(0,0,0,.10);
      --ss-iconbtn-hover-bd: rgba(0,0,0,.22);
      --ss-iconbtn-fg: buttontext;

      /* 히스토리 드롭다운 (panel 바깥) */
      --ss-drop-bg: var(--ss-panel-bg,#fff);
      --ss-drop-bd: color-mix(in oklab,var(--ss-border,#CBD5E1) 60%,transparent);
      --ss-drop-shadow: 0 8px 28px rgba(0,0,0,.16);
      --ss-hover-bg: color-mix(in oklab,var(--ss-sub-bg,#F3F4F6) 80%,transparent);
      --ss-danger: #EF4444;
      --ss-scrollbar: auto;
    }

    /* ══════════════════════════════════════════════════════════════
       테마 프리셋 — classic은 프리셋이 아니다 (위 :host 기본값 = 현행 동작).
       아래 파생 블록은 classic을 제외한 모든 테마에 공통 적용된다.
       각 테마 블록은 기반색 5~6개만 지정하면 나머지가 자동으로 따라온다.
       ══════════════════════════════════════════════════════════════ */
    :host(:not([data-ss-theme="classic"])){
      --ss-panel-bd: var(--ss-border);
      --ss-divider: color-mix(in oklab,var(--ss-border) 70%,transparent);
      --ss-title-fg: var(--ss-accent);

      --ss-input-bg: var(--ss-sub-bg);
      --ss-input-bd: var(--ss-tint);
      --ss-input-focus-bd: var(--ss-tint);
      --ss-input-ring: color-mix(in oklab,var(--ss-tint) 22%,transparent);

      --ss-btn-bg: var(--ss-sub-bg);
      --ss-btn-bd: var(--ss-border);
      --ss-btn-hover-bg: color-mix(in oklab,var(--ss-sub-bg) 88%,var(--ss-panel-fg));
      --ss-btn-hover-bd: var(--ss-accent);
      --ss-primary-bg: var(--ss-accent);
      --ss-primary-bg-hover: color-mix(in oklab,var(--ss-accent) 85%,var(--ss-panel-fg));

      --ss-chip-bg: color-mix(in oklab,var(--ss-sub-bg) 85%,transparent);
      --ss-chip-fg: var(--ss-panel-fg);
      --ss-chip-hover-bg: var(--ss-sub-bg);
      --ss-chip-hover-bd: var(--ss-border);
      --ss-pill-active-bd: var(--ss-tint);

      --ss-aitag-bg: var(--ss-accent);
      --ss-aitag-fg: var(--ss-on-accent);

      --ss-bar-bg: var(--ss-panel-bg);
      --ss-bar-bd: var(--ss-border);
      --ss-bar-fg: var(--ss-panel-fg);
      --ss-bar-backdrop: var(--ss-backdrop);
      --ss-hint-fg: var(--ss-fg-muted);
      --ss-iconbtn-bg: var(--ss-sub-bg);
      --ss-iconbtn-bd: var(--ss-border);
      --ss-iconbtn-hover-bd: var(--ss-accent);
      --ss-iconbtn-fg: var(--ss-panel-fg);

      --ss-drop-bg: var(--ss-panel-bg);
      --ss-drop-bd: var(--ss-border);
      --ss-hover-bg: color-mix(in oklab,var(--ss-sub-bg) 82%,var(--ss-panel-fg));
      --ss-scrollbar: color-mix(in oklab,var(--ss-panel-fg) 32%,var(--ss-panel-bg)) var(--ss-sub-bg);
    }
    /* classic 외 테마에서만 플레이스홀더 색을 지정한다.
       classic은 UA 기본값을 그대로 두어야 현행과 동일하다. */
    :host(:not([data-ss-theme="classic"])) .search::placeholder{color:var(--ss-placeholder)}

    /* 엔진 tint ON — 입력창 테두리와 활성 pill 테두리에만 엔진 색이 반영된다.
       다크 계열 테마는 --ss-tint-blend로 채도를 낮춘다. */
    :host([data-ss-tint="on"]:not([data-ss-theme="classic"])){
      --ss-tint: color-mix(in oklab,var(--ss-engine-accent,#94A3B8) var(--ss-tint-blend),var(--ss-panel-bg));
    }

    /* ── mono ── */
    :host([data-ss-theme="mono"]){
      --ss-panel-bg:#FFFFFF; --ss-panel-fg:#171717;
      --ss-sub-bg:#FAFAFA;   --ss-border:#D4D4D4;
      --ss-accent:#171717;   --ss-on-accent:#FAFAFA;
      --ss-fg-muted:#737373; --ss-placeholder:#A3A3A3;
      --ss-pill-active-bg:transparent;
      --ss-pill-active-fg:#171717;
    }

    /* ── midnight ── */
    :host([data-ss-theme="midnight"]){
      --ss-bolt:#FBBF24;
      --ss-panel-bg:#1C1C22; --ss-panel-fg:#F0F0F4;
      --ss-sub-bg:#26262E;   --ss-border:#34343E;
      --ss-accent:#7F77DD;   --ss-on-accent:#16161A;
      --ss-fg-muted:#8E8E9A; --ss-placeholder:#6E6E7A;
      --ss-pill-active-bg:#2A2A33;
      --ss-pill-active-fg:#F0F0F4;
      --ss-overlay-bg:rgba(0,0,0,.42);
      --ss-shadow:0 8px 32px rgba(0,0,0,.5);
      --ss-bar-shadow:0 6px 20px rgba(0,0,0,.4);
      --ss-drop-shadow:0 8px 28px rgba(0,0,0,.45);
      --ss-scrollbar:#4A4A56 #26262E;
      --ss-tint-blend:72%;
    }

    /* ── glass ── */
    :host([data-ss-theme="glass"]){
      --ss-panel-bg:rgba(255,255,255,.72); --ss-panel-fg:#1A1A20;
      --ss-sub-bg:rgba(255,255,255,.55);   --ss-border:rgba(255,255,255,.6);
      --ss-accent:#1A1A20;   --ss-on-accent:#F5F5F7;
      --ss-fg-muted:#4B4B55; --ss-placeholder:#5A5A64;
      --ss-pill-active-bg:rgba(255,255,255,.75);
      --ss-pill-active-fg:#1A1A20;
      --ss-backdrop:blur(14px) saturate(1.2);
      --ss-overlay-bg:rgba(0,0,0,.28);
      --ss-hover-bg:rgba(255,255,255,.5);
      --ss-scrollbar:rgba(0,0,0,.28) transparent;
    }
    /* backdrop-filter 미지원 시 반투명만 남으면 가독성이 무너진다 → 불투명 대체 */
    @supports not (backdrop-filter: blur(1px)){
      :host([data-ss-theme="glass"]){
        --ss-panel-bg:#F5F5F7;
        --ss-sub-bg:#EAEAEE;
        --ss-border:#D6D6DC;
        --ss-pill-active-bg:#FFFFFF;
        --ss-hover-bg:#E4E4EA;
      }
    }

    /* ── paper ── */
    :host([data-ss-theme="paper"]){
      --ss-panel-bg:#FAF5EC; --ss-panel-fg:#3E3324;
      --ss-sub-bg:#F2EADB;   --ss-border:#E3D9C6;
      --ss-accent:#99532A;   --ss-on-accent:#FAF0E4;
      --ss-fg-muted:#8A7A61; --ss-placeholder:#A3947B;
      --ss-pill-active-bg:#F0E7D6;
      --ss-pill-active-fg:#3E3324;
      --ss-font:Georgia,'Times New Roman','Apple SD Gothic Neo','Malgun Gothic',serif;
    }

    /* ── terminal ── */
    :host([data-ss-theme="terminal"]){
      --ss-bolt:#D9A521;
      --ss-panel-bg:#0D1117; --ss-panel-fg:#A9B7C1;
      --ss-sub-bg:#161B22;   --ss-border:#21313D;
      --ss-accent:#238636;   --ss-on-accent:#E6FFED;
      --ss-fg-muted:#58707E; --ss-placeholder:#4E6470;
      --ss-pill-active-bg:transparent;
      --ss-pill-active-fg:#3FB950;
      --ss-tint-base:#2A4A35;
      --ss-overlay-bg:rgba(0,0,0,.5);
      --ss-shadow:0 8px 32px rgba(0,0,0,.55);
      --ss-bar-shadow:0 6px 20px rgba(0,0,0,.45);
      --ss-drop-shadow:0 8px 28px rgba(0,0,0,.5);
      --ss-scrollbar:#2A4A35 #161B22;
      --ss-tint-blend:72%;
      --ss-font:ui-monospace,'Cascadia Mono','D2Coding',Consolas,'Malgun Gothic',monospace;
    }

    /* 폰트 오버라이드 — 테마 기본 폰트를 사용자가 덮어쓴다.
       테마 블록보다 뒤에 와야 이긴다 (동일 specificity → 소스 순서). */
    :host([data-ss-font="serif"]){
      --ss-font:Georgia,'Apple SD Gothic Neo','Malgun Gothic',serif;
    }
    :host([data-ss-font="mono"]){
      --ss-font:ui-monospace,'Cascadia Mono','D2Coding',Consolas,'Malgun Gothic',monospace;
    }

    :host,*{box-sizing:border-box;font-family:var(--ss-font)}

    .overlay{
      position:fixed;inset:0;
      background:var(--ss-overlay-bg);
      backdrop-filter:var(--ss-overlay-blur);
      z-index:2147483647;
      display:flex;align-items:center;justify-content:center;
      animation:fadeIn .08s ease;
    }
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}

    .panelWrap{
      width:min(720px,92vw);
      max-width:720px;
      min-width:320px;
      display:grid;gap:8px;
      animation:slideUp .10s cubic-bezier(.22,.68,0,1.2);
      flex-shrink:0;
      position:relative; /* histDrop absolute 기준점 */
    }
    @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}

    /* ── Main panel ── */
    .panel{
      padding:10px 14px 12px;
      border-radius:16px;
      background:var(--ss-panel-bg,#fff);
      backdrop-filter:var(--ss-backdrop);
      box-shadow:var(--ss-shadow);
      border:1px solid var(--ss-panel-bd);
      display:flex;flex-direction:column;
      gap:8px;
      position:relative;
      overflow:hidden; /* 폭 고정 — histDrop은 panelWrap 기준으로 배치 */
    }

    /* ── Top row: 타이틀 + 엔진 스트립 한 줄 ── */
    .topRow{
      display:flex;align-items:center;gap:10px;
      padding-bottom:8px;
      border-bottom:1px solid var(--ss-divider);
      min-width:0; /* flex 자식 축소 허용 */
    }
    .titlePill{
      display:flex;align-items:center;gap:5px;
      flex-shrink:0; /* 타이틀은 절대 축소 안 됨 */
      padding:3px 8px 3px 4px;
      border-radius:8px;
      /* 배경 없음 */
    }
    .titleIcon{
      width:20px;height:20px;border-radius:5px;flex-shrink:0;
    }
    /* icon32.png 로드 실패 시 대체되는 번개 */
    .titleBolt{
      display:flex;align-items:center;flex-shrink:0;
      color:var(--ss-bolt);
    }
    .titleBolt svg{ display:block;width:15px;height:15px }
    .titleText{
      display:flex;align-items:baseline;gap:4px;
      white-space:nowrap;user-select:none;
    }
    .titleName{
      font-size:14px;font-weight:800;letter-spacing:-.02em;
      color:var(--ss-title-fg); /* 엔진 테마 영향 없이 고정 */
    }
    .titleSub{
      font-size:11px;font-weight:500;letter-spacing:0;
      /* muted 그대로면 너무 흐리다. 본문 색 쪽으로 한 단계 당겨온다 */
      color:color-mix(in oklab,var(--ss-fg-muted) 60%,var(--ss-panel-fg));
    }
    .titleHint{
      font-size:10px;color:var(--ss-fg-muted);
      white-space:nowrap;flex-shrink:0;margin-left:auto;padding-left:6px;
    }
    .panelSearchRow{
      display:grid;
      grid-template-columns:auto 1fr auto;
      gap:10px;align-items:center;
    }

    /* ── Engine selector ── */
    .engine{
      display:inline-flex;align-items:center;gap:5px;
      padding:0 12px;height:46px;
      border:1.5px solid var(--ss-input-bd);
      border-radius:12px;
      background:var(--ss-input-bg);
      color:var(--ss-panel-fg,#111827);
      font-size:13px;font-weight:600;
      cursor:pointer;user-select:none;
      white-space:nowrap;
      width:auto;             /* 내용 맞춤 */
      flex-shrink:0;          /* grid auto 컬럼이 맞춰줌 */
      overflow:hidden;
      transition:border-color .15s,background .15s;
    }
    .engine:hover{border-color:var(--ss-input-focus-bd)}
    .engine .eIcon{font-size:16px;flex-shrink:0}
    .engine .eName{white-space:nowrap}
    .engine .aiTag{
      font-size:9px;font-weight:700;letter-spacing:.04em;
      background:var(--ss-aitag-bg);
      color:var(--ss-aitag-fg);border-radius:4px;padding:1px 4px;
      flex-shrink:0;
    }
    .engine .arrow{
      font-size:10px;color:var(--ss-accent,#94A3B8);flex-shrink:0;margin-left:2px;
      display:inline-block;transition:transform .15s;
    }
    .engine.open{border-color:var(--ss-input-focus-bd)}
    .engine.open .arrow{transform:rotate(180deg)}

    /* ── Engine dropdown ──
       histDrop과 같은 이유로 panelWrap 기준 absolute
       (panel의 overflow:hidden 안에 넣으면 잘린다 — CLAUDE.md 참고) */
    .engDrop{
      position:absolute;top:0;left:0;
      background:var(--ss-drop-bg);
      backdrop-filter:var(--ss-backdrop);
      border:1px solid var(--ss-drop-bd);
      border-radius:12px;
      box-shadow:var(--ss-drop-shadow);
      z-index:60;
      display:none;
      padding:4px;
      max-height:280px;overflow-y:auto;
      scrollbar-color:var(--ss-scrollbar);
    }
    .engDrop.open{display:block}
    .engDropItem{
      display:flex;align-items:center;gap:8px;
      padding:8px 10px;border-radius:8px;
      font-size:13px;font-weight:600;
      color:var(--ss-panel-fg,#374151);
      cursor:pointer;white-space:nowrap;
    }
    .engDropItem .edIcon{font-size:16px;flex-shrink:0}
    .engDropItem .edName{flex:1}
    .engDropItem .edCheck{font-size:12px;color:var(--ss-accent);flex-shrink:0}
    .engDropItem .aiTag{
      font-size:9px;font-weight:700;letter-spacing:.04em;
      background:var(--ss-aitag-bg);color:var(--ss-aitag-fg);
      border-radius:4px;padding:1px 4px;flex-shrink:0;
    }
    .engDropItem.current{color:var(--ss-accent);font-weight:800}
    /* --ss-hover-bg(히스토리용)는 목록에서 너무 옅다.
       본문 색을 섞어 라이트/다크 어느 쪽에서든 확실히 보이게 한다. */
    .engDropItem:hover,.engDropItem.active{
      background:color-mix(in oklab,var(--ss-panel-fg) 14%,var(--ss-drop-bg));
    }
    /* classic은 accent가 엔진 고유색이라 연한 엔진(ChatGPT 등)에서 글자가 묻힌다.
       색 대신 본문 색 + 배경 tint로 현재 항목을 구분한다. */
    :host([data-ss-theme="classic"]) .engDropItem.current{
      color:var(--ss-panel-fg);
      background:color-mix(in oklab,var(--ss-accent) 20%,transparent);
    }
    :host([data-ss-theme="classic"]) .engDropItem.current .edCheck{
      color:var(--ss-panel-fg);opacity:.65;
    }
    /* 위 셀렉터가 hover보다 특이도가 높으므로 hover를 같은 특이도로 다시 준다 */
    :host([data-ss-theme="classic"]) .engDropItem.current:hover,
    :host([data-ss-theme="classic"]) .engDropItem.current.active{
      background:color-mix(in oklab,var(--ss-panel-fg) 14%,var(--ss-drop-bg));
    }

    /* ── Search input wrapper ── */
    .inputWrap{position:relative;overflow:visible;}
    .search{
      width:100%;height:46px;
      font-size:17px;
      padding:0 14px;
      border:1.5px solid var(--ss-input-bd);
      border-radius:12px;
      outline:none;
      background:var(--ss-input-bg);
      color:var(--ss-panel-fg,#111827);
      transition:border-color .15s,box-shadow .15s;
    }
    .search:focus{
      border-color:var(--ss-input-focus-bd);
      box-shadow:0 0 0 3px var(--ss-input-ring);
    }
    .selBadge{
      position:absolute;right:10px;top:50%;transform:translateY(-50%);
      font-size:10px;font-weight:700;letter-spacing:.05em;
      background:var(--ss-accent,#94A3B8);color:var(--ss-on-accent);
      border-radius:5px;padding:2px 6px;
      pointer-events:none;opacity:0;transition:opacity .15s;
    }
    .selBadge.visible{opacity:1}

    /* ── Action buttons ── */
    .actBtns{display:flex;gap:6px}
    .btn{
      height:46px;padding:0 14px;
      border:1.5px solid var(--ss-btn-bd);
      border-radius:12px;
      background:var(--ss-btn-bg);
      color:var(--ss-panel-fg,#111827);
      cursor:pointer;font-size:13px;font-weight:600;
      white-space:nowrap;user-select:none;
      transition:border-color .15s,background .15s;
      display:flex;align-items:center;gap:5px;
    }
    .btn:hover{border-color:var(--ss-btn-hover-bd);background:var(--ss-btn-hover-bg)}
    .btn.primary{
      background:var(--ss-primary-bg);
      border-color:var(--ss-primary-bg);
      color:var(--ss-on-accent);
    }
    .btn.primary:hover{background:var(--ss-primary-bg-hover);border-color:var(--ss-primary-bg-hover)}
    /* ↵ 글리프는 폰트에 따라 거의 안 보인다 → 인라인 SVG 사용 */
    .btn .btnIcon{display:flex;align-items:center;flex-shrink:0}
    .btn .btnIcon svg{display:block;width:15px;height:15px}
    .iconBtn{
      width:36px;height:36px;padding:0;
      border:1.5px solid var(--ss-iconbtn-bd);border-radius:10px;
      background:var(--ss-iconbtn-bg);cursor:pointer;
      color:var(--ss-iconbtn-fg);
      font-size:16px;display:flex;align-items:center;justify-content:center;
      transition:border-color .15s;
    }
    .iconBtn:hover{border-color:var(--ss-iconbtn-hover-bd)}

    /* ── Bottom bar ── */
    .bottomBar{
      display:flex;align-items:center;justify-content:space-between;
      padding:6px 12px;
      border-radius:12px;
      background:var(--ss-bar-bg);
      border:1px solid var(--ss-bar-bd);
      box-shadow:var(--ss-bar-shadow);
      backdrop-filter:var(--ss-bar-backdrop);
      color:var(--ss-bar-fg);font-size:12px;
    }
    .bottomLeft{display:flex;align-items:center;gap:10px}
    .bottomRight{display:flex;align-items:center;gap:8px}
    .opts label{display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;font-size:12px}
    .opts input[type="checkbox"]{width:14px;height:14px;accent-color:var(--ss-accent,#3B82F6)}
    .hint{font-size:11px;color:var(--ss-hint-fg)}

    /* ── Engine strip: topRow 안에서 가로 스크롤 ── */
    .engStrip{
      display:flex;gap:5px;flex-wrap:nowrap;overflow-x:auto;
      overflow-y:visible;
      scrollbar-width:none;
      min-width:0;flex:1; /* 남은 공간 차지, 넘치면 스크롤 */
    }
    .engStrip::-webkit-scrollbar{display:none}
    .engChip{
      display:flex;align-items:center;gap:4px;
      padding:5px 11px;border-radius:20px;
      border:1.5px solid transparent;
      background:var(--ss-chip-bg);
      color:var(--ss-chip-fg);font-size:12px;font-weight:600;
      cursor:pointer;user-select:none;white-space:nowrap;
      transition:all .13s;
    }
    .engChip:hover{
      background:var(--ss-chip-hover-bg);
      border-color:var(--ss-chip-hover-bd);
    }
    .engChip.active{
      border-color:var(--ss-pill-active-bd);
      background:var(--ss-pill-active-bg);
      color:var(--ss-pill-active-fg);
    }
    .engChip .chipIcon{font-size:14px}
    .engChip .chipAI{
      font-size:9px;font-weight:700;letter-spacing:.04em;
      /* --ss-chip-accent는 rebuildEngineStrip()이 칩마다 인라인으로 건다.
         엔진 고유색이므로 :host가 아니라 칩에서 해석돼야 한다.
         다크 계열 테마는 --ss-tint-blend로 채도를 낮춰 받는다. */
      background:color-mix(in oklab,var(--ss-chip-accent,var(--ss-aitag-bg)) var(--ss-tint-blend),var(--ss-panel-bg));
      color:var(--ss-aitag-fg);
      border-radius:3px;padding:1px 3px;
    }

    /* ── History dropdown ── */
    .histDrop{
      /* panelWrap 기준 absolute — panel overflow:hidden 영향 없음 */
      position:absolute;
      left:0;right:0;
      top:calc(100% - 8px); /* panelWrap 하단 바로 아래 */
      background:var(--ss-drop-bg);
      backdrop-filter:var(--ss-backdrop);
      border:1px solid var(--ss-drop-bd);
      border-radius:12px;
      box-shadow:var(--ss-drop-shadow);
      z-index:50;overflow:hidden;
      display:none;
      max-height:260px;overflow-y:auto;
      scrollbar-color:var(--ss-scrollbar);
    }
    .histDrop.open{display:block}
    .histHeader{
      display:flex;align-items:center;justify-content:space-between;
      padding:8px 12px 4px;
      font-size:11px;font-weight:700;letter-spacing:.06em;
      color:var(--ss-panel-fg,#6B7280);opacity:.6;text-transform:uppercase;
    }
    .histClear{
      font-size:11px;color:var(--ss-accent,#9CA3AF);background:none;
      border:none;cursor:pointer;padding:0;opacity:.7;
    }
    .histClear:hover{opacity:1;color:var(--ss-danger)}
    .histItem{
      display:flex;align-items:center;gap:8px;
      padding:8px 12px;font-size:13px;
      color:var(--ss-panel-fg,#374151);
      cursor:pointer;transition:background .1s;
    }
    .histItem:hover{background:var(--ss-hover-bg)}
    .histItem .histIcon{font-size:12px;color:var(--ss-accent,#9CA3AF);opacity:.6}
    .histEmpty{padding:10px 12px;font-size:12px;color:var(--ss-panel-fg,#9CA3AF);opacity:.5;text-align:center}

    /* ── Dark mode ── classic 테마 전용.
       다른 테마는 자체적으로 명암이 확정돼 있으므로 OS 다크모드의 영향을 받지 않는다.
       autoDark를 끄면 이 블록이 매칭되지 않아 라이트 색상이 유지된다. */
    @media(prefers-color-scheme:dark){
      :host([data-ss-theme="classic"][data-ss-autodark="on"]){
        /* 구 DARK_OVERRIDE — accent는 엔진 색을 그대로 유지한다 */
        --ss-panel-bg:#1E1E2E;
        --ss-panel-fg:#CDD6F4;
        --ss-sub-bg:#313244;
        --ss-border:#45475A;

        --ss-title-fg:#818CF8;
        --ss-bolt:#FBBF24;   /* 어두운 배경에서는 한 톤 밝게 */
        --ss-chip-bg:rgba(255,255,255,.07);
        --ss-chip-hover-bg:rgba(255,255,255,.13);
        --ss-pill-active-bg:color-mix(in oklab,var(--ss-accent,#818CF8) 20%,var(--ss-panel-bg,#1E1E2E));
        --ss-bar-bg:rgba(20,20,32,.95);
        --ss-bar-bd:rgba(255,255,255,.09);
        --ss-bar-fg:#CDD6F4;
        --ss-hint-fg:rgba(205,214,244,.5);
        --ss-iconbtn-bg:rgba(30,30,46,.9);
        --ss-iconbtn-bd:rgba(255,255,255,.12);
        --ss-iconbtn-fg:#CDD6F4;
      }
    }
  `;

  overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closePanel(); });
  // keydown은 installGlobalTraps + inputEl 핸들러에서 처리
  ["keypress","keyup"].forEach((t) => overlay.addEventListener(t, (e) => e.stopPropagation(), true));

  panelWrap = document.createElement("div");
  panelWrap.className = "panelWrap";

  // ── Main panel row ──
  panelEl = document.createElement("div");
  panelEl.className = "panel";

  // Engine display button (click = 목록 펼치기, shows current engine)
  const engineBtn = document.createElement("div");
  engineBtn.className = "engine";
  engineBtn.tabIndex = 0;
  engineBtn.title = "Click to pick an engine (↑/↓ to move, Enter to select)";
  // overlay mousedown 핸들러가 곧바로 다시 닫지 않도록 전파를 끊는다
  engineBtn.addEventListener("mousedown", (e) => e.stopPropagation());
  engineBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleEngineDrop(); });
  engineBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp")   { e.preventDefault(); isEngDropOpen() ? navigateEngineDrop(-1) : openEngineDrop(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); isEngDropOpen() ? navigateEngineDrop(+1) : openEngineDrop(); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); isEngDropOpen() ? pickHighlightedEngine() : openEngineDrop(); return;
    }
    if (e.key === "Escape")    { e.preventDefault(); closeEngineDrop(); inputEl?.focus(); return; }
  });
  selectEl = engineBtn; // reuse ref name for compatibility

  // 엔진 드롭다운 — panelWrap 직접 자식으로 붙는다 (아래 panelWrap.append 참고)
  engineDropEl = document.createElement("div");
  engineDropEl.className = "engDrop";
  engineDropEl.addEventListener("mousedown", (e) => e.stopPropagation());

  // Input wrapper
  const inputWrap = document.createElement("div");
  inputWrap.className = "inputWrap";
  inputWrap.style.position = "relative";

  inputEl = document.createElement("input");
  inputEl.className = "search";
  inputEl.type = "text";
  inputEl.autocomplete = "off";
  inputEl.spellcheck = false;

  const selBadge = document.createElement("span");
  selBadge.className = "selBadge";
  selBadge.textContent = "SELECTED";
  selBadgeEl = selBadge;  // 캐시

  inputWrap.append(inputEl, selBadge);

  // History dropdown (inside inputWrap so it positions relative to input)
  historyDropEl = document.createElement("div");
  historyDropEl.className = "histDrop";
  // panelWrap에 붙여야 panel overflow:hidden 영향 안 받음
  // panelWrap.append 시점에 추가 (아래에서 처리)

  inputEl.addEventListener("focus", () => showHistoryDrop());
  inputEl.addEventListener("blur", () => {
    // 약간의 딜레이: 히스토리 아이템 mousedown이 blur보다 먼저 처리되도록
    setTimeout(() => hideHistoryDrop(), 80);
  });
  inputEl.addEventListener("input", () => {
    closeEngineDrop();   // 타이핑을 시작했으면 엔진 선택은 끝난 것
    filterHistoryDrop(inputEl.value);
  });
  inputEl.addEventListener("keydown", (e) => {
    // stopImmediatePropagation: 같은 요소의 다른 핸들러 + 버블링 모두 차단
    e.stopImmediatePropagation();
    e.stopPropagation();
    const histOpen = historyDropEl.classList.contains("open");
    const engOpen  = isEngDropOpen();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (engOpen)  { navigateEngineDrop(-1); return; }
      if (histOpen) { navigateHistory(-1); return; }
      cycleEngine(-1); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (engOpen)  { navigateEngineDrop(+1); return; }
      if (histOpen) { navigateHistory(+1); return; }
      cycleEngine(+1); return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (engOpen) { closeEngineDrop(); }
      else if (histOpen) { hideHistoryDrop(); }
      else { closePanel(); }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (engOpen) { pickHighlightedEngine(); return; }
      doSearch(); return;
    }
    if (e.key === "Tab") { e.preventDefault(); if (!engOpen) cycleEngine(+1); return; }
  }, true)  // capture:true — 페이지 핸들러보다 먼저 실행;

  // Action buttons
  const actBtns = document.createElement("div");
  actBtns.className = "actBtns";

  const searchBtnEl = document.createElement("button");
  searchBtnEl.type = "button";
  searchBtnEl.className = "btn primary";
  searchBtnEl.innerHTML =
    `<span class="btnIcon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    `<path d="M20 5v6a4 4 0 0 1-4 4H5"/><path d="M9 11l-4 4 4 4"/>` +
    `</svg></span><span class="btnLabel">Search</span>`;
  searchBtnEl.addEventListener("click", () => doSearch());

  const closeBtnEl = document.createElement("button");
  closeBtnEl.type = "button";
  closeBtnEl.className = "btn";
  closeBtnEl.innerHTML = `<span>✕</span>`;
  closeBtnEl.addEventListener("click", () => closePanel());

  actBtns.append(searchBtnEl, closeBtnEl);

  // ── Top row: 타이틀 pill + 엔진 스트립 + 단축키 힌트 한 줄 ──
  const topRow = document.createElement("div");
  topRow.className = "topRow";

  const titlePill = document.createElement("div");
  titlePill.className = "titlePill";

  const titleIcon = document.createElement("img");
  titleIcon.className = "titleIcon";
  titleIcon.src = chrome.runtime.getURL("icons/icon32.png");
  titleIcon.alt = "TapTap";
  titleIcon.onerror = () => {
    // 폴백은 이모지 대신 인라인 SVG. currentColor 라서 --ss-bolt 로만 색이 결정된다
    titleIcon.style.display = "none";
    const fb = document.createElement("span");
    fb.className = "titleBolt";
    fb.innerHTML =
      `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">` +
      `<path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"/>` +
      `</svg>`;
    titlePill.insertBefore(fb, titleText);
  };

  const titleText = document.createElement("span");
  titleText.className = "titleText";
  titleText.innerHTML =
    `<span class="titleName">TapTap</span><span class="titleSub">- Quick Search</span>`;

  titlePill.append(titleIcon, titleText);

  const engStripWrap = document.createElement("div");
  engStripWrap.className = "engStrip";
  engStripWrap.id = "ss-eng-strip";
  engStripEl = engStripWrap;

  const titleHint = document.createElement("span");
  titleHint.className = "titleHint";
  titleHintEl = titleHint;

  topRow.append(titlePill, engStripWrap, titleHint);

  // ── Search row (engine-btn + input + action-btns) ──
  const searchRow = document.createElement("div");
  searchRow.className = "panelSearchRow";
  searchRow.append(engineBtn, inputWrap, actBtns);

  panelEl.append(topRow, searchRow);

  // ── Wheel on panel → cycle engine ──
  panelEl.addEventListener("wheel", (e) => {
    // 드롭다운이 열려 있으면 목록 스크롤이 우선 — 뒤에서 엔진이 바뀌면 안 된다
    if (isEngDropOpen()) return;
    e.preventDefault();
    cycleEngine(e.deltaY > 0 ? +1 : -1);
  }, { passive: false });

  // ── Bottom bar ──
  const bottomBar = document.createElement("div");
  bottomBar.className = "bottomBar";

  const bottomLeft = document.createElement("div");
  bottomLeft.className = "bottomLeft opts";

  const newTabLabel = document.createElement("label");
  newTabEl = document.createElement("input");
  newTabEl.type = "checkbox";
  const newTabText = document.createElement("span");
  newTabLabel.append(newTabEl, newTabText);
  newTabEl.addEventListener("change", () => {
    state.openInNewTab = !!newTabEl.checked;
    chrome.storage?.sync?.set?.({ [K_NEWTAB]: state.openInNewTab });
    updateHint();
    inputEl.focus();
  });

  bottomLeft.append(newTabLabel);

  const bottomRight = document.createElement("div");
  bottomRight.className = "bottomRight";

  hintEl = document.createElement("div");
  hintEl.className = "hint";

  const settingsBtn = document.createElement("button");
  settingsBtn.type = "button";
  settingsBtn.className = "iconBtn";
  settingsBtn.title = "Settings";
  settingsBtn.textContent = "⚙";
  settingsBtn.addEventListener("click", () => chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" }));

  bottomRight.append(hintEl, settingsBtn);
  bottomBar.append(bottomLeft, bottomRight);

  panelWrap.append(panelEl, bottomBar);
  // histDrop / engDrop은 panelWrap 직접 자식 (panel overflow:hidden 밖)
  panelWrap.appendChild(historyDropEl);
  panelWrap.appendChild(engineDropEl);
  overlay.append(panelWrap);
  sr.append(style, overlay);
  document.documentElement.appendChild(host);

  installGlobalTraps();

  // Close history on outside click (within shadow)
  overlay.addEventListener("mousedown", (e) => {
    const path = e.composedPath?.() || [];
    if (!path.includes(inputWrap)) hideHistoryDrop();
    // 엔진 버튼과 드롭다운은 각자 mousedown 전파를 끊으므로 여기 오면 바깥 클릭이다
    closeEngineDrop();
  });
}

// =======================
// Engine strip (quick-click tabs)
// =======================
function rebuildEngineStrip() {
  const strip = engStripEl;
  if (!strip) return;
  strip.innerHTML = "";
  const enabled = getEnabledEngines();
  const curId = getCurrentEngine()?.id;
  let activeChip = null;

  for (const en of enabled) {
    const isActive = en.id === curId;
    const chip = document.createElement("div");
    chip.className = "engChip" + (isActive ? " active" : "");

    const pal = paletteForEngine(en);
    // 칩은 선택 여부와 무관하게 자기 엔진의 고유색을 유지한다.
    // (이걸 안 걸면 AI 배지가 전부 "현재 엔진" 색으로 물든다)
    chip.style.setProperty("--ss-chip-accent", pal.accent);
    if (isActive) {
      chip.style.setProperty("--ss-accent", pal.accent);
      activeChip = chip;
    }

    const iconSpan = document.createElement("span");
    iconSpan.className = "chipIcon";
    iconSpan.textContent = en.icon || "🔍";
    chip.appendChild(iconSpan);

    const nameSpan = document.createElement("span");
    nameSpan.textContent = engineLabel(en);
    chip.appendChild(nameSpan);

    if (en.isAI) {
      const ai = document.createElement("span");
      ai.className = "chipAI";
      ai.textContent = "AI";
      chip.appendChild(ai);
    }

    chip.addEventListener("click", () => {
      state.lastEngineId = en.id;
      chrome.storage?.sync?.set?.({ [K_LAST]: state.lastEngineId });
      applyTheme();
      updateHint();
      rebuildEngineStrip();
      inputEl.focus();
    });
    strip.appendChild(chip);
  }

  // 활성 칩이 보이도록 부드럽게 스크롤
  if (activeChip) {
    requestAnimationFrame(() => {
      // getBoundingClientRect() 사용 — offsetLeft는 topRow 기준이라 부정확
      const chipRect  = activeChip.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();

      // strip 내부 기준 상대 위치
      const chipLeftInStrip  = chipRect.left - stripRect.left + strip.scrollLeft;
      const chipRightInStrip = chipLeftInStrip + activeChip.offsetWidth;
      const visibleLeft  = strip.scrollLeft;
      const visibleRight = strip.scrollLeft + strip.offsetWidth;

      if (chipLeftInStrip < visibleLeft) {
        // 칩이 왼쪽으로 가려짐 → 왼쪽으로 스크롤
        strip.scrollTo({ left: chipLeftInStrip - 12, behavior: "smooth" });
      } else if (chipRightInStrip > visibleRight) {
        // 칩이 오른쪽으로 가려짐 → 오른쪽으로 스크롤
        strip.scrollTo({ left: chipRightInStrip - strip.offsetWidth + 12, behavior: "smooth" });
      }
    });
  }
}

// =======================
// History dropdown
// =======================
let histHighlightIdx = -1;

function showHistoryDrop() {
  filterHistoryDrop(inputEl.value);
}

function filterHistoryDrop(q) {
  historyDropEl.innerHTML = "";
  histHighlightIdx = -1;
  const items = q.trim()
    ? state.history.filter(h => h.toLowerCase().includes(q.toLowerCase()))
    : state.history;

  if (!items.length) {
    historyDropEl.classList.remove("open");
    return;
  }

  const header = document.createElement("div");
  header.className = "histHeader";
  const titleSpan = document.createElement("span");
  titleSpan.textContent = t(state.lang, "historyTitle");
  const clearBtn = document.createElement("button");
  clearBtn.className = "histClear";
  clearBtn.textContent = t(state.lang, "clearHistory");
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearHistory();
    historyDropEl.classList.remove("open");
    inputEl.focus();
  });
  header.append(titleSpan, clearBtn);
  historyDropEl.appendChild(header);

  for (const item of items.slice(0, 8)) {
    const row = document.createElement("div");
    row.className = "histItem";
    row.innerHTML = `<span class="histIcon">🕐</span><span>${escHtml(item)}</span>`;
    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      inputEl.value = item;
      hideHistoryDrop();
      doSearch();
    });
    historyDropEl.appendChild(row);
  }
  historyDropEl.classList.add("open");
}

function navigateHistory(delta) {
  const items = historyDropEl.querySelectorAll(".histItem");
  if (!items.length) return;
  histHighlightIdx = Math.max(-1, Math.min(items.length - 1, histHighlightIdx + delta));
  items.forEach((el, i) => el.style.background = i === histHighlightIdx ? "rgba(0,0,0,.06)" : "");
  if (histHighlightIdx >= 0) inputEl.value = items[histHighlightIdx].querySelector("span:last-child").textContent;
}

function hideHistoryDrop() {
  historyDropEl.classList.remove("open");
  histHighlightIdx = -1;
}

function escHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

// =======================
// Engine helpers
// =======================
function getEnabledEngines() { return (state.engines || []).filter(e => e && e.enabled !== false); }
function getEngineById(id) { return (state.engines || []).find(e => e.id === id); }
function getCurrentEngine() {
  let cur = getEngineById(state.lastEngineId);
  if (!cur || cur.enabled === false) {
    cur = getEnabledEngines()[0];
    if (cur) state.lastEngineId = cur.id;
  }
  return cur || state.engines[0];
}
function engineLabel(en) {
  const lang = state.lang || "en";
  return (en?.name && (en.name[lang] || en.name.en || en.name.kr)) || en?.id || "Engine";
}

// =======================
// Engine dropdown
// =======================
let engDropIdx = -1;

function isEngDropOpen() { return !!engineDropEl?.classList.contains("open"); }

function buildEngineDrop() {
  engineDropEl.innerHTML = "";
  const enabled = getEnabledEngines();
  const curId = getCurrentEngine()?.id;

  enabled.forEach((en, i) => {
    const row = document.createElement("div");
    row.className = "engDropItem" + (en.id === curId ? " current" : "");

    const ic = document.createElement("span");
    ic.className = "edIcon";
    ic.textContent = en.icon || "🔍";

    const nm = document.createElement("span");
    nm.className = "edName";
    nm.textContent = engineLabel(en);

    row.append(ic, nm);

    if (en.isAI) {
      const ai = document.createElement("span");
      ai.className = "aiTag";
      ai.textContent = "AI";
      row.appendChild(ai);
    }
    if (en.id === curId) {
      const ck = document.createElement("span");
      ck.className = "edCheck";
      ck.textContent = "✓";
      row.appendChild(ck);
    }

    // mousedown 기본동작을 막아야 입력창 포커스가 안 빠진다 (histDrop과 같은 이유)
    row.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); });
    row.addEventListener("click", (e) => { e.stopPropagation(); pickEngine(en.id); });
    row.addEventListener("mousemove", () => highlightEngDrop(i, false));

    engineDropEl.appendChild(row);
  });
}

/* 엔진 버튼 기준으로 배치.
   offsetLeft는 부모(panelSearchRow) 기준이라 어긋난다 → rect 차이로 계산 (CLAUDE.md 참고) */
function positionEngineDrop() {
  if (!engineDropEl || !selectEl || !panelWrap) return;
  const wrapR = panelWrap.getBoundingClientRect();
  const btnR  = selectEl.getBoundingClientRect();
  const gap = 6;

  engineDropEl.style.left = (btnR.left - wrapR.left) + "px";
  engineDropEl.style.minWidth = btnR.width + "px";

  const dh = engineDropEl.offsetHeight;
  const roomBelow = window.innerHeight - btnR.bottom;
  const flipUp = roomBelow < dh + gap + 8 && btnR.top > dh + gap + 8;
  engineDropEl.style.top = flipUp
    ? (btnR.top - wrapR.top - dh - gap) + "px"
    : (btnR.bottom - wrapR.top + gap) + "px";
}

function highlightEngDrop(idx, scroll) {
  const items = engineDropEl.querySelectorAll(".engDropItem");
  if (!items.length) return;
  engDropIdx = Math.max(0, Math.min(items.length - 1, idx));
  items.forEach((el, i) => el.classList.toggle("active", i === engDropIdx));
  if (scroll) items[engDropIdx].scrollIntoView({ block: "nearest" });
}

function openEngineDrop() {
  if (!engineDropEl) return;
  hideHistoryDrop();
  buildEngineDrop();
  if (!engineDropEl.children.length) return;
  engineDropEl.classList.add("open");
  selectEl?.classList.add("open");
  positionEngineDrop();
  // 현재 엔진에서 시작
  const enabled = getEnabledEngines();
  highlightEngDrop(Math.max(0, enabled.findIndex(e => e.id === getCurrentEngine()?.id)), true);
}

function closeEngineDrop() {
  engineDropEl?.classList.remove("open");
  selectEl?.classList.remove("open");
  engDropIdx = -1;
}

function toggleEngineDrop() {
  if (isEngDropOpen()) { closeEngineDrop(); inputEl?.focus(); }
  else openEngineDrop();
}

function navigateEngineDrop(delta) {
  const items = engineDropEl?.querySelectorAll(".engDropItem");
  if (!items?.length) return;
  highlightEngDrop((engDropIdx + delta + items.length) % items.length, true);
}

function pickEngine(id) {
  if (!getEngineById(id)) return;
  state.lastEngineId = id;
  chrome.storage?.sync?.set?.({ [K_LAST]: id });
  closeEngineDrop();
  applyTheme();
  updateHint();
  rebuildEngineStrip();
  inputEl?.focus();
}

function pickHighlightedEngine() {
  const en = getEnabledEngines()[engDropIdx];
  if (en) pickEngine(en.id);
  else closeEngineDrop();
}

// =======================
// Theme
// =======================
function applyTheme() {
  const en = getCurrentEngine();
  const ap = state.appearance || DEFAULT_APPEARANCE;
  const theme   = THEME_IDS.includes(ap.theme) ? ap.theme : "classic";
  const tintOn  = ap.engineTint !== false;

  // classic + tint off → 엔진 색을 무시하고 중립 팔레트 고정
  const p = (theme === "classic" && !tintOn) ? PALETTE.pastel : paletteForEngine(en);

  // 테마 스위치는 속성으로만. 다크모드 분기는 CSS media query가 처리한다.
  host.dataset.ssTheme    = theme;
  host.dataset.ssAutodark = (ap.autoDark !== false) ? "on" : "off";
  host.dataset.ssTint     = tintOn ? "on" : "off";
  host.dataset.ssFont     = FONT_IDS.includes(ap.font) ? ap.font : "system";

  // 엔진 팔레트 원본만 인라인으로. 파생 변수 매핑은 CSS가 담당한다.
  host.style.setProperty("--ss-engine-bg",     p.panelBg);
  host.style.setProperty("--ss-engine-fg",     p.panelFg);
  host.style.setProperty("--ss-engine-sub",    p.subBg);
  host.style.setProperty("--ss-engine-bd",     p.border);
  host.style.setProperty("--ss-engine-accent", p.accent);

  // Update engine button display
  if (selectEl) {
    selectEl.innerHTML = "";
    const iconSpan = document.createElement("span");
    iconSpan.className = "eIcon";
    iconSpan.textContent = en?.icon || "🔍";
    const nameSpan = document.createElement("span");
    nameSpan.className = "eName";
    nameSpan.textContent = engineLabel(en);
    selectEl.append(iconSpan, nameSpan);
    if (en?.isAI) {
      const ai = document.createElement("span");
      ai.className = "aiTag";
      ai.textContent = "AI";
      selectEl.appendChild(ai);
    }
    const arr = document.createElement("span");
    arr.className = "arrow";
    arr.textContent = "▼";
    selectEl.appendChild(arr);
  }
}

function updateTexts() {
  const lang = state.lang || "en";
  const selText = window.getSelection?.()?.toString?.()?.trim?.() || "";
  if (inputEl) {
    inputEl.placeholder = selText
      ? t(lang, "placeholderSel")
      : t(lang, "placeholder");
  }
  if (newTabEl?.nextSibling) newTabEl.nextSibling.textContent = t(lang, "openNewTab");
  const lbl = sr?.querySelector(".btnLabel");
  if (lbl) lbl.textContent = t(lang, "enterBtn");
  updateHint();
}

function updateHint() {
  const lang = state.lang || "en";
  const cur = getCurrentEngine();
  const label = engineLabel(cur);
  if (hintEl) hintEl.textContent = t(lang, "hint", label, !!state.openInNewTab);
  // title bar 단축키 힌트도 업데이트
  const th = titleHintEl;
  if (th) {
    const sc = state.shortcut || { type:"double", key:"Shift" };
    if (sc.type === "double") {
      th.textContent = `${sc.key} × 2`;
    } else {
      th.textContent = sc.key;
    }
  }
}

// =======================
// Cycle engine
// =======================
function cycleEngine(delta) {
  const enabled = getEnabledEngines();
  if (!enabled.length) return;
  const idx = Math.max(0, enabled.findIndex(e => e.id === getCurrentEngine()?.id));
  const next = (idx + delta + enabled.length) % enabled.length;
  state.lastEngineId = enabled[next].id;
  chrome.storage?.sync?.set?.({ [K_LAST]: state.lastEngineId });
  applyTheme();
  updateHint();
  rebuildEngineStrip();
}

// =======================
// Search
// =======================
function doSearch() {
  const qRaw = (inputEl?.value || "").trim();
  if (!qRaw) return;
  const cur = getCurrentEngine();
  if (!cur) return;
  const url = cur.url.replace("{q}", encodeURIComponent(qRaw));
  addToHistory(qRaw);
  hideHistoryDrop();
  if (state.openInNewTab) window.open(url, "_blank", "noopener,noreferrer");
  else location.href = url;
  closePanel();
}

// =======================
// Open / Close
// =======================
function openPanel() {
  // 아직 초기 로드 안됐으면 로드 후 열기
  if (!_stateReady) {
    _pendingOpen = true;
    loadAll(() => {});
    return;
  }
  _showPanel();
}

function _showPanel() {
  ensurePanel();
  overlay.style.display = "flex";
  overlayOpen = true;

  // 캐시된 상태 즉시 사용 — storage I/O 없음
  newTabEl.checked = !!state.openInNewTab;
  updateTexts();
  applyTheme();
  rebuildEngineStrip();

  // 선택 텍스트 자동 입력
  const sel = window.getSelection?.()?.toString?.()?.trim?.() || "";
  inputEl.value = sel;

  if (selBadgeEl) selBadgeEl.classList.toggle("visible", sel.length > 0);

  hideHistoryDrop();
  closeEngineDrop();
  inputEl.focus();
  if (sel) inputEl.select();

  // histDrop top: panelEl 높이 + gap 만큼 아래
  if (historyDropEl && panelEl) {
    requestAnimationFrame(() => {
      const ph = panelEl.offsetHeight;
      const gap = 8;
      historyDropEl.style.top = (ph + gap) + "px";
    });
  }
}

function closePanel() {
  if (overlay) overlay.style.display = "none";
  overlayOpen = false;
  hideHistoryDrop();
  closeEngineDrop();
}

// =======================
// Storage helpers
// =======================
/* 어떤 형태로 저장돼 있든 스파스 이름 객체로 정리한다.
   - 문자열이면 { en: 문자열 }  (팩/추천 엔진처럼 단일 이름으로 들어온 경우)
   - 13언어 객체(구버전)면 en과 같은 값인 키를 버려서 압축
   기존 사용자 데이터는 여기서 메모리상 압축되고, 다음 저장 때 실제로 줄어든다. */
function compactEngineName(name, id) {
  if (typeof name === "string" && name.trim()) return { en: name.trim() };
  if (!name || typeof name !== "object") return { en: id };
  const en = (typeof name.en === "string" && name.en) ? name.en
           : (typeof name.kr === "string" && name.kr) ? name.kr
           : id;
  const out = { en };
  for (const l of LANGS) {
    if (l === "en") continue;
    const v = name[l];
    if (typeof v === "string" && v && v !== en) out[l] = v;
  }
  return out;
}

function normalizeEngines(engs) {
  const out = Array.isArray(engs) ? engs.filter(Boolean) : [];
  for (const e of out) {
    if (!e.id) e.id = `u_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    e.name = compactEngineName(e.name, e.id);
    if (typeof e.url !== "string") e.url = "https://www.google.com/search?q={q}";
    if (typeof e.enabled !== "boolean") e.enabled = true;
    if (!e.icon) e.icon = "🔍";
    // isAI: 수동 설정 우선, 없으면 URL 자동 감지
    if (typeof e.isAI !== "boolean") e.isAI = detectIsAI(e.url);
  }
  return out;
}

function migrateIfNeeded(res) {
  let engines = res?.[K_ENGS];
  if (!Array.isArray(engines) || engines.length === 0) {
    engines = defaultEngines();
    const legacyMap = res?.["shiftsearch:engineColorMap"];
    if (legacyMap && typeof legacyMap === "object") {
      for (const en of engines) { const c = legacyMap[en.id]; if (c) en.color = c; }
    }
    chrome.storage?.sync?.set?.({ [K_ENGS]: engines });
  }
  return engines;
}

function normalizeLang(v) {
  if (!v) return guessDefaultLang();
  return LANGS.includes(v) ? v : guessDefaultLang();
}

function loadAll(cb) {
  chrome.storage?.sync?.get?.(
    [K_LANG, K_NEWTAB, K_ENGS, K_LAST, K_HISTORY, K_SHORTCUT, K_APPEARANCE, "shiftsearch:engineColorMap"],
    (res) => {
      const lang = normalizeLang(res?.[K_LANG]);
      // 폴백 false 는 "저장된 적 없는 기존 사용자"용이다. 여기를 true 로 바꾸면
      // 한 번도 토글한 적 없는 기존 사용자까지 새 탭으로 바뀐다.
      // 신규 설치 기본값은 background.js 의 onInstalled 가 실제 값으로 써둔다.
      const openInNewTab = typeof res?.[K_NEWTAB] === "boolean" ? res[K_NEWTAB] : false;
      let engines = normalizeEngines(migrateIfNeeded(res));
      const history = Array.isArray(res?.[K_HISTORY]) ? res[K_HISTORY] : [];
      const shortcut = res?.[K_SHORTCUT] || { type:"double", key:"Shift" };
      const appearance = normalizeAppearance(res?.[K_APPEARANCE]);

      let last = typeof res?.[K_LAST] === "string" ? res[K_LAST] : engines[0]?.id;
      if (!engines.find(e => e.id === last && e.enabled !== false)) {
        last = engines.find(e => e.enabled !== false)?.id || engines[0]?.id || "google";
        chrome.storage?.sync?.set?.({ [K_LAST]: last });
      }

      state = { lang, openInNewTab, engines, lastEngineId: last, history, shortcut, appearance };
      _stateReady = true;

      cb?.();

      // 로딩 중 열기 요청이 있었으면 이제 표시
      if (_pendingOpen) {
        _pendingOpen = false;
        _showPanel();
      }
    }
  );
}

// 페이지 로드 즉시 백그라운드에서 상태 미리 로드 (첫 팝업 더 빠르게)
loadAll(() => {});

// 브라우저 다크모드 전환 시 팝업 테마 즉시 갱신
// (구) 다크모드 전환 리스너는 제거했다.
// 이제 @media(prefers-color-scheme:dark)가 변수를 직접 교체하므로
// 팝업이 열린 상태에서도 JS 개입 없이 즉시 전환된다.
