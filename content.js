// =====================================================================
// Quick Search Popup v0.9 — content.js
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

// 브라우저 다크모드 감지
const isDarkMode = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches;

// 다크모드용 공통 팔레트 (엔진 accent는 유지, 배경/텍스트만 덮어씀)
const DARK_OVERRIDE = {
  panelBg: "#1E1E2E",
  panelFg: "#CDD6F4",
  subBg:   "#313244",
  border:  "#45475A"
};

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
function fillAllLangs(label) {
  const obj = {};
  for (const l of LANGS) obj[l] = label;
  return obj;
}

function defaultEngines() {
  return [
    {
      id: "google",
      name: { ...fillAllLangs("Google"), kr:"구글" },
      url: "https://www.google.com/search?q={q}",
      color: "sky", enabled: true, icon: "🔍"
    },
    {
      id: "naver",
      name: { ...fillAllLangs("Naver"), kr:"네이버" },
      url: "https://search.naver.com/search.naver?query={q}",
      color: "mint", enabled: true, icon: "🟢"
    },
    {
      id: "bing",
      name: { ...fillAllLangs("Bing"), kr:"빙" },
      url: "https://www.bing.com/search?q={q}",
      color: "pastel", enabled: true, icon: "🔵"
    },
    {
      id: "wikipedia",
      name: { ...fillAllLangs("Wikipedia"), kr:"위키피디아" },
      url: "https://en.wikipedia.org/wiki/Special:Search?search={q}",
      color: "gray", enabled: true, icon: "📚"
    },
    {
      id: "perplexity",
      name: { ...fillAllLangs("Perplexity AI"), kr:"퍼플렉시티" },
      url: "https://www.perplexity.ai/search?q={q}",
      color: "violet", enabled: true, icon: "🤖"
    },
    {
      id: "chatgpt",
      name: { ...fillAllLangs("ChatGPT"), kr:"챗GPT" },
      url: "https://chatgpt.com/?q={q}&hints=search",
      color: "gray", enabled: true, icon: "💬"
    },
    {
      id: "claude",
      name: { ...fillAllLangs("Claude"), kr:"클로드" },
      url: "https://claude.ai/new?q={q}",
      color: "peach", enabled: true, icon: "✨"
    },
    {
      id: "youtube",
      name: { ...fillAllLangs("YouTube"), kr:"유튜브" },
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
  shortcut: { type: "double", key: "Shift" }
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
});

// =======================
// Trigger detection (configurable)
// =======================
let lastKeyUpTime = 0;
let keyUpCount = 0;
const DOUBLE_THRESHOLD = 400;

function isImeComposing(e) { return e.isComposing === true || e.key === "Process"; }

document.addEventListener("keydown", (e) => {
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
  if (isImeComposing(e)) return;
  const sc = state.shortcut;
  if (sc.type !== "double") return;
  if (e.key !== sc.key) return;

  const now = Date.now();
  keyUpCount = (now - lastKeyUpTime <= DOUBLE_THRESHOLD) ? keyUpCount + 1 : 1;
  lastKeyUpTime = now;

  if (keyUpCount >= 2) {
    keyUpCount = 0;
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
let historyDropEl, engStripEl, selBadgeEl, titleHintEl;
let overlayOpen = false;

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
    e.stopPropagation();
    if (e.type === "keydown" || e.type === "keypress" || e.type === "keyup") e.preventDefault();
  };
  ["keydown","keypress","keyup"].forEach((t) => document.addEventListener(t, trap, { capture: true }));

  // ── 방향키 전용 document-level 핸들러 (가장 확실한 방법) ──
  document.addEventListener("keydown", (e) => {
    if (!overlayOpen) return;
    const histOpen = historyDropEl?.classList.contains("open");
    if (e.key === "ArrowUp") {
      e.preventDefault(); e.stopPropagation();
      if (!histOpen) { cycleEngine(-1); inputEl?.focus(); }
      else navigateHistory(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault(); e.stopPropagation();
      if (!histOpen) { cycleEngine(+1); inputEl?.focus(); }
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
  sr = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host,*{box-sizing:border-box;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif}

    .overlay{
      position:fixed;inset:0;
      background:rgba(0,0,0,.22);
      backdrop-filter:blur(2px);
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
      box-shadow:0 16px 48px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.08);
      border:1px solid color-mix(in oklab,var(--ss-border,#CBD5E1) 40%,transparent);
      display:flex;flex-direction:column;
      gap:8px;
      position:relative;
      overflow:hidden; /* 폭 고정 — histDrop은 panelWrap 기준으로 배치 */
    }

    /* ── Top row: 타이틀 + 엔진 스트립 한 줄 ── */
    .topRow{
      display:flex;align-items:center;gap:10px;
      padding-bottom:8px;
      border-bottom:1px solid color-mix(in oklab,var(--ss-border,#CBD5E1) 40%,transparent);
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
    .titleText{
      font-size:11px;font-weight:800;letter-spacing:.03em;
      color:#6366F1; /* 엔진 테마 영향 없이 고정 */
      white-space:nowrap;user-select:none;
    }
    .titleHint{
      font-size:10px;color:color-mix(in oklab,var(--ss-panel-fg,#111827) 40%,transparent);
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
      border:1.5px solid var(--ss-border,#CBD5E1);
      border-radius:12px;
      background:var(--ss-sub-bg,#f6f7fb);
      color:var(--ss-panel-fg,#111827);
      font-size:13px;font-weight:600;
      cursor:pointer;user-select:none;
      white-space:nowrap;
      width:auto;             /* 내용 맞춤 */
      flex-shrink:0;          /* grid auto 컬럼이 맞춰줌 */
      overflow:hidden;
      transition:border-color .15s,background .15s;
    }
    .engine:hover{border-color:var(--ss-accent,#94A3B8)}
    .engine .eIcon{font-size:16px;flex-shrink:0}
    .engine .eName{white-space:nowrap}
    .engine .aiTag{
      font-size:9px;font-weight:700;letter-spacing:.04em;
      background:var(--ss-accent,#94A3B8);
      color:#fff;border-radius:4px;padding:1px 4px;
      flex-shrink:0;
    }
    .engine .arrow{font-size:10px;color:var(--ss-accent,#94A3B8);flex-shrink:0;margin-left:2px}

    /* ── Search input wrapper ── */
    .inputWrap{position:relative;overflow:visible;}
    .search{
      width:100%;height:46px;
      font-size:17px;
      padding:0 14px;
      border:1.5px solid var(--ss-border,#CBD5E1);
      border-radius:12px;
      outline:none;
      background:var(--ss-sub-bg,#f6f7fb);
      color:var(--ss-panel-fg,#111827);
      transition:border-color .15s,box-shadow .15s;
    }
    .search:focus{
      border-color:var(--ss-accent,#94A3B8);
      box-shadow:0 0 0 3px color-mix(in oklab,var(--ss-accent,#94A3B8) 22%,transparent);
    }
    .selBadge{
      position:absolute;right:10px;top:50%;transform:translateY(-50%);
      font-size:10px;font-weight:700;letter-spacing:.05em;
      background:var(--ss-accent,#94A3B8);color:#fff;
      border-radius:5px;padding:2px 6px;
      pointer-events:none;opacity:0;transition:opacity .15s;
    }
    .selBadge.visible{opacity:1}

    /* ── Action buttons ── */
    .actBtns{display:flex;gap:6px}
    .btn{
      height:46px;padding:0 14px;
      border:1.5px solid var(--ss-border,#CBD5E1);
      border-radius:12px;
      background:var(--ss-sub-bg,#fafafa);
      color:var(--ss-panel-fg,#111827);
      cursor:pointer;font-size:13px;font-weight:600;
      white-space:nowrap;user-select:none;
      transition:border-color .15s,background .15s;
      display:flex;align-items:center;gap:5px;
    }
    .btn:hover{border-color:var(--ss-accent,#94A3B8);background:color-mix(in oklab,var(--ss-sub-bg,#f6f7fb) 70%,var(--ss-accent,#94A3B8) 10%)}
    .btn.primary{
      background:#6366F1;
      border-color:#6366F1;
      color:#fff;
    }
    .btn.primary:hover{background:#4F46E5;border-color:#4F46E5}
    .iconBtn{
      width:36px;height:36px;padding:0;
      border:1.5px solid rgba(0,0,0,.10);border-radius:10px;
      background:rgba(255,255,255,.85);cursor:pointer;
      font-size:16px;display:flex;align-items:center;justify-content:center;
      transition:border-color .15s;
    }
    .iconBtn:hover{border-color:rgba(0,0,0,.22)}

    /* ── Bottom bar ── */
    .bottomBar{
      display:flex;align-items:center;justify-content:space-between;
      padding:6px 12px;
      border-radius:12px;
      background:rgba(255,255,255,.92);
      border:1px solid rgba(0,0,0,.07);
      box-shadow:0 6px 20px rgba(0,0,0,.08);
      backdrop-filter:blur(8px);
      color:#111827;font-size:12px;
    }
    .bottomLeft{display:flex;align-items:center;gap:10px}
    .bottomRight{display:flex;align-items:center;gap:8px}
    .opts label{display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;font-size:12px}
    .opts input[type="checkbox"]{width:14px;height:14px;accent-color:var(--ss-accent,#3B82F6)}
    .hint{font-size:11px;color:rgba(17,24,39,.55)}

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
      background:color-mix(in oklab,var(--ss-sub-bg,#f6f7fb) 90%,transparent);
      color:var(--ss-panel-fg,#374151);font-size:12px;font-weight:600;
      cursor:pointer;user-select:none;white-space:nowrap;
      transition:all .13s;
    }
    .engChip:hover{
      background:var(--ss-sub-bg,#f6f7fb);
      border-color:var(--ss-border,#CBD5E1);
    }
    .engChip.active{
      border-color:var(--ss-accent,#94A3B8);
      background:color-mix(in oklab,var(--ss-accent,#94A3B8) 15%,var(--ss-panel-bg,#fff));
      color:var(--ss-accent,#94A3B8);
    }
    .engChip .chipIcon{font-size:14px}
    .engChip .chipAI{
      font-size:9px;font-weight:700;letter-spacing:.04em;
      background:var(--ss-accent,#94A3B8);color:#fff;
      border-radius:3px;padding:1px 3px;
    }

    /* ── History dropdown ── */
    .histDrop{
      /* panelWrap 기준 absolute — panel overflow:hidden 영향 없음 */
      position:absolute;
      left:0;right:0;
      top:calc(100% - 8px); /* panelWrap 하단 바로 아래 */
      background:var(--ss-panel-bg,#fff);
      border:1px solid color-mix(in oklab,var(--ss-border,#CBD5E1) 60%,transparent);
      border-radius:12px;
      box-shadow:0 8px 28px rgba(0,0,0,.16);
      z-index:50;overflow:hidden;
      display:none;
      max-height:260px;overflow-y:auto;
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
    .histClear:hover{opacity:1;color:#EF4444}
    .histItem{
      display:flex;align-items:center;gap:8px;
      padding:8px 12px;font-size:13px;
      color:var(--ss-panel-fg,#374151);
      cursor:pointer;transition:background .1s;
    }
    .histItem:hover{background:color-mix(in oklab,var(--ss-sub-bg,#F3F4F6) 80%,transparent)}
    .histItem .histIcon{font-size:12px;color:var(--ss-accent,#9CA3AF);opacity:.6}
    .histEmpty{padding:10px 12px;font-size:12px;color:var(--ss-panel-fg,#9CA3AF);opacity:.5;text-align:center}

    /* ── Dark mode ── */
    @media(prefers-color-scheme:dark){
      /* panel 배경/텍스트는 JS applyTheme(DARK_OVERRIDE)이 처리 */
      /* panel 외부 UI만 여기서 처리 */
      .bottomBar{
        background:rgba(20,20,32,.95);
        border-color:rgba(255,255,255,.09);
        color:#CDD6F4;
      }
      .hint{color:rgba(205,214,244,.5)}
      .iconBtn{background:rgba(30,30,46,.9);border-color:rgba(255,255,255,.12);color:#CDD6F4}
      .titleText{color:#818CF8}
      /* engChip 다크모드 */
      .engChip{background:rgba(255,255,255,.07);color:#CDD6F4}
      .engChip:hover{background:rgba(255,255,255,.13)}
      .engChip.active{background:color-mix(in oklab,var(--ss-accent,#818CF8) 20%,#1E1E2E)}
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

  // Engine display button (click = cycle, shows current engine)
  const engineBtn = document.createElement("div");
  engineBtn.className = "engine";
  engineBtn.tabIndex = 0;
  engineBtn.title = "Click or ↑/↓ to change engine";
  engineBtn.addEventListener("click", () => { cycleEngine(+1); inputEl.focus(); });
  engineBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); cycleEngine(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); cycleEngine(+1); }
  });
  selectEl = engineBtn; // reuse ref name for compatibility

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
  inputEl.addEventListener("input", () => { filterHistoryDrop(inputEl.value); });
  inputEl.addEventListener("keydown", (e) => {
    // stopImmediatePropagation: 같은 요소의 다른 핸들러 + 버블링 모두 차단
    e.stopImmediatePropagation();
    e.stopPropagation();
    const histOpen = historyDropEl.classList.contains("open");
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histOpen) { navigateHistory(-1); return; }
      cycleEngine(-1); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histOpen) { navigateHistory(+1); return; }
      cycleEngine(+1); return;
    }
    if (e.key === "Escape") { e.preventDefault(); if (histOpen) { hideHistoryDrop(); } else { closePanel(); } return; }
    if (e.key === "Enter") { e.preventDefault(); doSearch(); return; }
    if (e.key === "Tab") { e.preventDefault(); cycleEngine(+1); return; }
  }, true)  // capture:true — 페이지 핸들러보다 먼저 실행;

  // Action buttons
  const actBtns = document.createElement("div");
  actBtns.className = "actBtns";

  const searchBtnEl = document.createElement("button");
  searchBtnEl.type = "button";
  searchBtnEl.className = "btn primary";
  searchBtnEl.innerHTML = `<span>↵</span><span class="btnLabel">Search</span>`;
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
  titleIcon.alt = "QSP";
  titleIcon.onerror = () => {
    titleIcon.style.display = "none";
    const fb = document.createElement("span");
    fb.textContent = "⚡"; fb.style.cssText = "font-size:18px;flex-shrink:0";
    titlePill.insertBefore(fb, titleText);
  };

  const titleText = document.createElement("span");
  titleText.className = "titleText";
  titleText.textContent = "Quick Search Popup";

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
  // histDrop은 panelWrap 직접 자식 (panel overflow:hidden 밖)
  panelWrap.appendChild(historyDropEl);
  overlay.append(panelWrap);
  sr.append(style, overlay);
  document.documentElement.appendChild(host);

  installGlobalTraps();

  // Close history on outside click (within shadow)
  overlay.addEventListener("mousedown", (e) => {
    const path = e.composedPath?.() || [];
    if (!path.includes(inputWrap)) hideHistoryDrop();
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
    // rAF로 DOM 렌더 후 실행
    requestAnimationFrame(() => {
      const chipLeft  = activeChip.offsetLeft;
      const chipRight = chipLeft + activeChip.offsetWidth;
      const stripLeft  = strip.scrollLeft;
      const stripRight = stripLeft + strip.offsetWidth;

      if (chipLeft < stripLeft) {
        // 왼쪽으로 스크롤
        strip.scrollTo({ left: chipLeft - 12, behavior: "smooth" });
      } else if (chipRight > stripRight) {
        // 오른쪽으로 스크롤
        strip.scrollTo({ left: chipRight - strip.offsetWidth + 12, behavior: "smooth" });
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
// Theme
// =======================
function applyTheme() {
  const en = getCurrentEngine();
  const p = paletteForEngine(en);
  // 다크모드면 배경/텍스트는 DARK_OVERRIDE로, accent는 엔진 색 유지
  const dark = isDarkMode();
  host.style.setProperty("--ss-panel-bg", dark ? DARK_OVERRIDE.panelBg : p.panelBg);
  host.style.setProperty("--ss-panel-fg", dark ? DARK_OVERRIDE.panelFg : p.panelFg);
  host.style.setProperty("--ss-sub-bg",   dark ? DARK_OVERRIDE.subBg   : p.subBg);
  host.style.setProperty("--ss-border",   dark ? DARK_OVERRIDE.border  : p.border);
  host.style.setProperty("--ss-accent",   p.accent); // accent는 항상 엔진 색

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
}

// =======================
// Storage helpers
// =======================
function fillAllLangsNorm(label) {
  const obj = {};
  for (const l of LANGS) obj[l] = label;
  return obj;
}
function normalizeEngines(engs) {
  const out = Array.isArray(engs) ? engs.filter(Boolean) : [];
  for (const e of out) {
    if (!e.id) e.id = `u_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    if (!e.name || typeof e.name !== "object") e.name = fillAllLangsNorm(e.id);
    for (const l of LANGS) if (typeof e.name[l] !== "string") e.name[l] = e.name.en || e.name.kr || e.id;
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
    [K_LANG, K_NEWTAB, K_ENGS, K_LAST, K_HISTORY, K_SHORTCUT, "shiftsearch:engineColorMap"],
    (res) => {
      const lang = normalizeLang(res?.[K_LANG]);
      const openInNewTab = typeof res?.[K_NEWTAB] === "boolean" ? res[K_NEWTAB] : false;
      let engines = normalizeEngines(migrateIfNeeded(res));
      const history = Array.isArray(res?.[K_HISTORY]) ? res[K_HISTORY] : [];
      const shortcut = res?.[K_SHORTCUT] || { type:"double", key:"Shift" };

      let last = typeof res?.[K_LAST] === "string" ? res[K_LAST] : engines[0]?.id;
      if (!engines.find(e => e.id === last && e.enabled !== false)) {
        last = engines.find(e => e.enabled !== false)?.id || engines[0]?.id || "google";
        chrome.storage?.sync?.set?.({ [K_LAST]: last });
      }

      state = { lang, openInNewTab, engines, lastEngineId: last, history, shortcut };
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
window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  if (overlayOpen) applyTheme();
});
