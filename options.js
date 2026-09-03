// =====================================================================
// TapTap - Quick Search v1.1 — options.js
// =====================================================================

const K_LANG     = "shiftsearch:lang";
const K_ENGS     = "shiftsearch:engines";
const K_LAST     = "shiftsearch:lastEngineId";
const K_SHORTCUT = "shiftsearch:shortcut";
const K_APPEARANCE = "shiftsearch:appearance";

// ── 테마/외형 (content.js와 동일하게 유지할 것) ──
const THEME_IDS = ["classic", "mono", "midnight", "glass", "paper", "terminal"];
const FONT_IDS  = ["system", "serif", "mono"];
const DEFAULT_APPEARANCE = { theme:"classic", autoDark:true, engineTint:true, font:"system" };

// 카드 라벨. 색상값은 options.html의 .themeCard[data-theme=...] 블록에 있다.
const THEME_META = [
  { id:"classic",  name:"Classic",  desc:"Follows the selected engine's color." },
  { id:"mono",     name:"Mono",     desc:"Neutral black and white." },
  { id:"midnight", name:"Midnight", desc:"Dark, muted violet accent." },
  { id:"glass",    name:"Glass",    desc:"Translucent with a blurred backdrop." },
  { id:"paper",    name:"Paper",    desc:"Warm off-white, serif text." },
  { id:"terminal", name:"Terminal", desc:"Dark console green, monospace." },
];

function normalizeAppearance(v) {
  const a = (v && typeof v === "object") ? v : {};
  return {
    theme:      THEME_IDS.includes(a.theme) ? a.theme : DEFAULT_APPEARANCE.theme,
    autoDark:   typeof a.autoDark   === "boolean" ? a.autoDark   : DEFAULT_APPEARANCE.autoDark,
    engineTint: typeof a.engineTint === "boolean" ? a.engineTint : DEFAULT_APPEARANCE.engineTint,
    font:       FONT_IDS.includes(a.font) ? a.font : DEFAULT_APPEARANCE.font,
  };
}

// ── AI 도메인 자동 감지 (content.js와 동일) ──
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

// ── Palettes (must match content.js) ──
const PALETTE = {
  pastel: { label:"Pastel", accent:"#94A3B8", bg:"#F6F7FB" },
  sky:    { label:"Sky",    accent:"#3B82F6", bg:"#EFF6FF" },
  mint:   { label:"Mint",   accent:"#10B981", bg:"#ECFDF5" },
  peach:  { label:"Peach",  accent:"#FB7185", bg:"#FFF1F2" },
  lemon:  { label:"Lemon",  accent:"#F59E0B", bg:"#FFFBEB" },
  gray:   { label:"Gray",   accent:"#6B7280", bg:"#F3F4F6" },
  dark:   { label:"Dark",   accent:"#89B4FA", bg:"#313244" },
  violet: { label:"Violet", accent:"#7C3AED", bg:"#F3E8FF" },
  rose:   { label:"Rose",   accent:"#E11D48", bg:"#FFE4E6" }
};

const LANGS = [
  ["kr","🇰🇷 Korean"],["en","🇺🇸 English"],["ja","🇯🇵 Japanese"],
  ["zh-CN","🇨🇳 Chinese (Simplified)"],["zh-TW","🇹🇼 Chinese (Traditional)"],
  ["es","🇪🇸 Spanish"],["fr","🇫🇷 French"],["de","🇩🇪 German"],
  ["ru","🇷🇺 Russian"],["vn","🇻🇳 Vietnamese"],["ms","🇲🇾 Malay"],
  ["th","🇹🇭 Thai"],["id","🇮🇩 Indonesian"]
];
const LANG_CODES = LANGS.map(l => l[0]);

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

// ── State ──
let state = {
  lang: guessDefaultLang(),
  engines: [],
  lastEngineId: "google",
  shortcut: { type:"double", key:"Shift" },
  appearance: { ...DEFAULT_APPEARANCE }
};

// ── DOM refs ──
const $ = id => document.getElementById(id);
const langSelect   = $("langSelect");
const engineList   = $("engineList");
const addName      = $("addName");
const addUrl       = $("addUrl");
const addIconWrap  = $("addIconWrap");
const addBtn       = $("addBtn");
const addColorRow  = $("addColorRow");
const addHexInput  = $("addHexInput");
const saveBtn      = $("saveBtn");
const savedMsg     = $("savedMsg");
const previewStrip = $("previewStrip");
// ── Recommended engines refs ──
const recMore   = $("recMore");
const recGrid   = $("recGrid");
const recCount  = $("recCount");
const recSel    = $("recSel");
const recAddBtn = $("recAddBtn");
// ── Appearance refs ──
const themeGrid      = $("themeGrid");
const autoDarkRow    = $("autoDarkRow");
const autoDarkChk    = $("autoDarkChk");
const autoDarkDesc   = $("autoDarkDesc");
const engineTintChk  = $("engineTintChk");
const engineTintDesc = $("engineTintDesc");
const fontSelect     = $("fontSelect");

let addColor = "sky";

// =====================
// Sidebar navigation
// =====================
document.querySelectorAll(".navItem[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".navItem").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    const tab = $("tab-" + btn.dataset.tab);
    if (tab) { tab.classList.add("active"); }
    if (btn.dataset.tab === "preview") renderPreview();
    // About 탭: 저장 바 숨김
    const sb = document.querySelector(".saveBar");
    if (sb) sb.style.display = btn.dataset.tab === "about" ? "none" : "flex";
  });
});

// =====================
// Shortcut keyboard UI
// =====================

// 브라우저/윈도우 충돌 단축키 목록
const CONFLICT_MAP = {
  "Ctrl+W": "Close tab", "Ctrl+T": "New tab", "Ctrl+N": "New window",
  "Ctrl+R": "Reload", "Ctrl+F": "Find", "Ctrl+H": "History",
  "Ctrl+L": "Address bar", "Ctrl+D": "Bookmark", "Ctrl+P": "Print",
  "Ctrl+S": "Save", "Ctrl+O": "Open", "Ctrl+A": "Select all",
  "Ctrl+C": "Copy", "Ctrl+V": "Paste", "Ctrl+X": "Cut",
  "Ctrl+Z": "Undo", "Ctrl+Y": "Redo", "Ctrl+Tab": "Next tab",
  "Ctrl+1":"Tab 1","Ctrl+2":"Tab 2","Ctrl+3":"Tab 3",
  "Ctrl+Shift+T": "Reopen tab", "Ctrl+Shift+N": "Incognito",
  "Ctrl+Shift+J": "DevTools console", "Ctrl+Shift+I": "DevTools",
  "Alt+F4": "Close window", "Alt+Left": "Back", "Alt+Right": "Forward",
  "F1":"Help","F3":"Find next","F5":"Reload","F11":"Fullscreen","F12":"DevTools",
};

let _scMode = "double";   // "double" | "combo"
let _selectedMod = "Ctrl+Shift";
let _selectedKey = "S";

function setScMode(mode) {
  _scMode = mode;
  $("scModeDouble").classList.toggle("active", mode === "double");
  $("scModeCombo").classList.toggle("active", mode === "combo");
  $("scDoubleSection").style.display = mode === "double" ? "" : "none";
  $("scComboSection").style.display  = mode === "combo"  ? "" : "none";
  updateScPreview();
}
// scMode 버튼 이벤트 (HTML onclick 대신 JS에서 등록 — 타이밍 안전)
document.addEventListener("DOMContentLoaded", () => {
  // 버전 표기는 manifest 단일 출처에서 읽는다.
  // HTML에 박아두면 릴리스마다 사이드바/About 두 곳을 손으로 맞춰야 하고,
  // 실제로 1.1.0 -> 1.2.0 때 둘 다 어긋난 채로 남았다.
  const ver = "v" + chrome.runtime.getManifest().version;
  const sideVer  = document.getElementById("versionLabel");
  const aboutVer = document.getElementById("aboutVersion");
  if (sideVer)  sideVer.textContent  = ver;
  if (aboutVer) aboutVer.textContent = ver + " ·  Manifest V3  ·  Chrome Extension";

  const btnDouble = document.getElementById("scModeDouble");
  const btnCombo  = document.getElementById("scModeCombo");
  if (btnDouble) btnDouble.addEventListener("click", () => setScMode("double"));
  if (btnCombo)  btnCombo.addEventListener("click",  () => setScMode("combo"));
});

function updateScPreview() {
  const disp = $("scCurrentDisplay");
  if (!disp) return;
  if (_scMode === "double") {
    const k = document.querySelector(".kbKey.mod[data-dtkey].selected")?.dataset.dtkey || "Shift";
    const sym = {"Shift":"⇧ Shift","Control":"⌃ Ctrl","Alt":"⌥ Alt"}[k] || k;
    disp.innerHTML = `<span class="scKeyBadge">${sym}</span><span class="scPlus">×2</span><span style="font-size:12px;color:var(--muted)">double tap</span>`;
    state.shortcut = { type:"double", key: k };
  } else {
    const modLabel = _selectedMod.replace("Ctrl","⌃").replace("Shift","⇧").replace("Alt","⌥");
    const combo = _selectedMod.split("+").join("+") + "+" + _selectedKey;
    const conflict = CONFLICT_MAP[combo];
    const cnote = $("scConflictNote");
    if (cnote) {
      cnote.style.color = conflict ? "var(--danger)" : "#22C55E";
      cnote.textContent = conflict
        ? `⚠️ "${combo}" conflicts with: ${conflict} — still saveable`
        : _selectedKey ? `✅ "${combo}" — ready to use` : "Select a key above";
    }
    if (_selectedKey) {
      // modLabel 표시용 (⌃⇧ 형태)
      const dispMod = modLabel.replace(/\+/g, " + ");
      disp.innerHTML = `<span class="scKeyBadge">${dispMod}</span><span class="scPlus">+</span><span class="scKeyBadge">${_selectedKey}</span>`;
      state.shortcut = { type:"single", key: combo };
    } else {
      disp.innerHTML = `<span style="font-size:12px;color:var(--muted)">Select modifier + key</span>`;
    }
  }
}

function initShortcutUI() {
  const sc = state.shortcut || { type:"double", key:"Shift" };

  if (sc.type === "double") {
    setScMode("double");
    document.querySelectorAll("[data-dtkey]").forEach(b => {
      b.classList.toggle("selected", b.dataset.dtkey === sc.key);
    });
    _scMode = "double";
  } else {
    // combo
    const parts = sc.key.split("+");
    const mainKey = parts[parts.length - 1];
    const mods = parts.slice(0, -1).join("+");
    _selectedMod = mods || "Ctrl+Shift";
    _selectedKey = mainKey;
    setScMode("combo");
    document.querySelectorAll("[data-mod]").forEach(b => {
      b.classList.toggle("selected", b.dataset.mod === _selectedMod);
    });
    document.querySelectorAll("[data-key]").forEach(b => {
      b.classList.toggle("selected", b.dataset.key === _selectedKey);
    });
  }
  updateScPreview();
}

// Double-tap key 선택
document.querySelectorAll("[data-dtkey]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-dtkey]").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    updateScPreview();
  });
});

// Modifier 선택
document.querySelectorAll("[data-mod]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-mod]").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    _selectedMod = btn.dataset.mod;
    updateScPreview();
  });
});

// Key 선택
document.querySelectorAll("[data-key]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-key]").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    _selectedKey = btn.dataset.key;
    updateScPreview();
  });
});

// =====================
// Color picker (popover)
// =====================

// 열려있는 팝오버 추적 (하나만 열리도록)
let _openPopover = null;

function closeAllPopovers() {
  if (_openPopover) { _openPopover.classList.remove("open"); _openPopover = null; }
}
document.addEventListener("mousedown", (e) => {
  if (_openPopover && !_openPopover.contains(e.target) && !e.target.classList.contains("colorSwatch")) {
    closeAllPopovers();
  }
});

/**
 * renderColorPicker(anchor, currentColor, onChange)
 *  - anchor: 색상 스와치 버튼 컨테이너 (div.colorRow)
 *  - currentColor: 현재 색상 key or "#rrggbb"
 *  - onChange: (colorKeyOrHex) => void
 * Returns the swatch button element.
 */
/* Emoji picker
   renderColorPicker와 같은 팝오버 패턴(_openPopover / closeAllPopovers)을 쓴다.
   목록에 없는 이모지는 상단 입력칸에 직접 입력/붙여넣기 (OS 이모지 키보드: Win + .) */
const EMOJI_SETS = [
  ["Search",   ["\u{1F50D}","\u{1F50E}","\u{1F310}","\u{1F9ED}","\u{1F4E1}","\u{1F517}","⚡","⭐","\u{1F680}","\u{1F3AF}"]],
  ["AI",       ["\u{1F916}","\u{1F9E0}","✨","\u{1F4AB}","\u{1FA84}","\u{1F4A1}","\u{1F52E}","\u{1F9EC}"]],
  ["Shopping", ["\u{1F6D2}","\u{1F6CD}️","\u{1F4E6}","\u{1F4B3}","\u{1F3F7}️","\u{1F4B0}","\u{1F381}","\u{1F3EA}"]],
  ["Media",    ["▶️","\u{1F3AC}","\u{1F3B5}","\u{1F3A7}","\u{1F4FA}","\u{1F4F7}","\u{1F5BC}️","\u{1F3AE}"]],
  ["Social",   ["\u{1F4AC}","\u{1F5E8}️","\u{1F4E2}","\u{1F465}","\u{1F426}","\u{1F4CC}","❤️","\u{1F44D}"]],
  ["Docs",     ["\u{1F4DA}","\u{1F4D6}","\u{1F4DD}","\u{1F4C4}","\u{1F4F0}","\u{1F5DE}️","\u{1F3DB}️","\u{1F393}"]],
  ["Dev",      ["\u{1F4BB}","\u{1F419}","\u{1F527}","\u{1F9E9}","\u{1F5A5}️","⌨️","\u{1F5C4}️","\u{1F4CA}"]],
  ["Places",   ["\u{1F5FA}️","\u{1F4CD}","\u{1F9F3}","✈️","\u{1F3E0}","\u{1F37D}️","☕","\u{1F3E5}"]],
  ["Colors",   ["\u{1F535}","\u{1F7E2}","\u{1F534}","\u{1F7E1}","\u{1F7E3}","\u{1F7E0}","⚫","⚪","\u{1F7E4}","\u{1F537}","\u{1F536}","⬛"]]
];

function renderEmojiPicker(anchor, currentIcon, onChange, small) {
  anchor.innerHTML = "";
  anchor.style.position = "relative";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "emojiBtn" + (small ? " sm" : "");
  btn.textContent = currentIcon || "\u{1F50D}";
  btn.title = "Click to change icon";

  const pop = document.createElement("div");
  pop.className = "emojiPopover";
  pop.style.top = small ? "34px" : "44px";
  pop.style.left = "0";

  // 직접 입력 행
  const row = document.createElement("div");
  row.className = "emojiInputRow";
  const inp = document.createElement("input");
  inp.type = "text";
  inp.className = "emojiInline";
  inp.maxLength = 8;   // ZWJ 조합 이모지는 코드유닛이 길다
  inp.placeholder = "Type or paste";
  inp.value = currentIcon || "";
  const hint = document.createElement("span");
  hint.className = "emojiHint";
  hint.textContent = "Win + .";
  row.append(inp, hint);

  const scroll = document.createElement("div");
  scroll.className = "emojiScroll";

  const cells = [];
  function markActive(sel) {
    for (const c of cells) c.classList.toggle("active", c.dataset.em === sel);
  }
  function pick(val) {
    const v = (val || "").trim();
    if (!v) return;
    btn.textContent = v;
    onChange(v);
    markActive(v);
  }

  for (const [label, list] of EMOJI_SETS) {
    const cat = document.createElement("div");
    cat.className = "emojiCat";
    cat.textContent = label;
    const grid = document.createElement("div");
    grid.className = "emojiGrid";
    for (const em of list) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "emojiCell";
      cell.textContent = em;
      cell.dataset.em = em;
      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        inp.value = em;
        pick(em);
        closeAllPopovers();
      });
      cells.push(cell);
      grid.appendChild(cell);
    }
    scroll.append(cat, grid);
  }
  markActive(currentIcon);

  inp.addEventListener("click", (e) => e.stopPropagation());
  inp.addEventListener("input", () => pick(inp.value));
  inp.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter")  { e.preventDefault(); pick(inp.value); closeAllPopovers(); }
    if (e.key === "Escape") { e.preventDefault(); closeAllPopovers(); }
  });

  pop.append(row, scroll);
  anchor.append(btn, pop);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = pop.classList.contains("open");
    closeAllPopovers();
    if (isOpen) return;
    pop.classList.add("open");
    _openPopover = pop;
    // 오른쪽으로 넘치면 반대편에 붙인다
    pop.style.left = "0"; pop.style.right = "auto";
    if (pop.getBoundingClientRect().right > window.innerWidth - 8) {
      pop.style.left = "auto"; pop.style.right = "0";
    }
    inp.focus();
    inp.select();
  });

  return btn;
}

function renderColorPicker(anchor, currentColor, onChange) {
  anchor.innerHTML = "";
  anchor.style.position = "relative";

  const isHex = currentColor && currentColor.startsWith("#");
  const swatchColor = isHex ? currentColor : (PALETTE[currentColor]?.accent || "#94A3B8");

  // ── Trigger swatch ──
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "colorSwatch active";
  swatch.style.background = swatchColor;
  swatch.title = "Click to change color";

  // ── Popover ──
  const pop = document.createElement("div");
  pop.className = "colorPopover";
  pop.style.top = "34px";
  pop.style.left = "0";

  const popTitle = document.createElement("div");
  popTitle.className = "popTitle";
  popTitle.textContent = "Pick color";

  const dotGrid = document.createElement("div");
  dotGrid.className = "dotGrid";

  function refreshDots(sel) {
    dotGrid.innerHTML = "";
    for (const [key, pal] of Object.entries(PALETTE)) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "palDot" + (key === sel ? " active" : "");
      dot.style.background = pal.accent;
      dot.title = pal.label;
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        hexInline.value = pal.accent;
        swatch.style.background = pal.accent;
        refreshDots(key);
        onChange(key);
        closeAllPopovers();
      });
      dotGrid.appendChild(dot);
    }
  }
  refreshDots(isHex ? null : currentColor);

  // ── Hex input + 네이티브 color picker row ──
  const hexRow = document.createElement("div");
  hexRow.className = "hexRow";

  // 네이티브 color picker (브라우저 색상판)
  const nativePicker = document.createElement("input");
  nativePicker.type = "color";
  nativePicker.value = isHex ? currentColor : swatchColor;
  nativePicker.title = "Open color palette";
  nativePicker.style.cssText = "width:28px;height:28px;border:none;padding:0;cursor:pointer;border-radius:6px;overflow:hidden;flex-shrink:0;background:none;";
  nativePicker.addEventListener("click", (e) => e.stopPropagation());
  nativePicker.addEventListener("input", () => {
    const val = nativePicker.value;
    hexInline.value = val;
    swatch.style.background = val;
    refreshDots(null);
    onChange(val);
  });

  const hexLabel = document.createElement("span");
  hexLabel.textContent = "#";
  const hexInline = document.createElement("input");
  hexInline.type = "text";
  hexInline.className = "hexInline";
  hexInline.placeholder = "rrggbb";
  hexInline.maxLength = 7;
  hexInline.value = isHex ? currentColor : swatchColor;
  hexInline.addEventListener("click", (e) => e.stopPropagation());
  hexInline.addEventListener("input", () => {
    let val = hexInline.value.trim();
    if (!val.startsWith("#")) val = "#" + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      nativePicker.value = val; // color picker도 동기화
      swatch.style.background = val;
      refreshDots(null);
      onChange(val);
    }
  });
  hexRow.append(nativePicker, hexLabel, hexInline);

  pop.append(popTitle, dotGrid, hexRow);
  anchor.append(swatch, pop);

  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = pop.classList.contains("open");
    closeAllPopovers();
    if (!isOpen) {
      pop.classList.add("open");
      _openPopover = pop;
      hexInline.focus();
    }
  });

  return swatch;
}

// =====================
// Engine rendering
// =====================
function genId() { return `u_${Date.now()}_${Math.random().toString(16).slice(2,8)}`; }

/* 엔진 이름은 "스파스 다국어 객체"다.
   en은 항상 존재하고, en과 다른 이름을 쓰는 언어만 키로 둔다.
   ⚠ content.js의 compactEngineName()과 동일한 규칙 — 한쪽만 고치지 말 것 */
function compactEngineName(name, id) {
  if (typeof name === "string" && name.trim()) return { en: name.trim() };
  if (!name || typeof name !== "object") return { en: id };
  const en = (typeof name.en === "string" && name.en) ? name.en
           : (typeof name.kr === "string" && name.kr) ? name.kr
           : id;
  const out = { en };
  for (const [c] of LANGS) {
    if (c === "en") continue;
    const v = name[c];
    if (typeof v === "string" && v && v !== en) out[c] = v;
  }
  return out;
}

function engineDisplayName(en) {
  const code = state.lang;
  return (en.name && (en.name[code] || en.name.en || en.name.kr)) || en.id;
}

function setEngineName(en, val) {
  if (!en.name || typeof en.name !== "object") en.name = { en: val };
  if (state.lang === "en") { en.name.en = val; return; }
  // 영어 이름이 비어 있으면 이 값을 영어 이름으로도 쓴다
  if (typeof en.name.en !== "string" || !en.name.en) en.name.en = val;
  // en과 같으면 굳이 따로 저장하지 않는다 (스파스 유지)
  if (val === en.name.en) delete en.name[state.lang];
  else en.name[state.lang] = val;
}

function colorSwatch(colorKey) {
  if (PALETTE[colorKey]) return PALETTE[colorKey].accent;
  if (/^#[0-9a-fA-F]{6}$/.test(colorKey)) return colorKey;
  return "#94A3B8";
}

function renderEngineList() {
  engineList.innerHTML = "";
  state.engines.forEach((en, idx) => {
    const card = document.createElement("div");
    card.className = "engCard" + (en.enabled === false ? " disabled" : "");

    // Toggle
    const toggleWrap = document.createElement("label");
    toggleWrap.className = "engToggle";
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = en.enabled !== false;
    const slider = document.createElement("span");
    slider.className = "engSlider";
    toggleInput.addEventListener("change", () => {
      en.enabled = !!toggleInput.checked;
      card.classList.toggle("disabled", !en.enabled);
    });
    toggleWrap.append(toggleInput, slider);

    // Info (name + url editable)
    const info = document.createElement("div");
    info.className = "engInfo";
    const nameWrap = document.createElement("div");
    nameWrap.className = "engName";

    // 아이콘: 클릭하면 이모지 피커가 열린다
    const iconSpan = document.createElement("span");
    iconSpan.className = "emojiAnchor";
    renderEmojiPicker(iconSpan, en.icon || "🔍", (val) => {
      en.icon = val;
      renderPreview();
    }, true);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "engNameInput";
    nameInput.value = engineDisplayName(en);
    nameInput.addEventListener("input", () => setEngineName(en, nameInput.value.trim() || en.id));

    // AI 토글 (URL 자동감지 결과 + 수동 override)
    const aiToggleLabel = document.createElement("label");
    aiToggleLabel.style.cssText = "display:flex;align-items:center;gap:4px;cursor:pointer;flex-shrink:0;margin-left:4px";
    aiToggleLabel.title = "Mark as AI engine (shows AI badge)";

    const aiCheckbox = document.createElement("input");
    aiCheckbox.type = "checkbox";
    aiCheckbox.checked = !!en.isAI;
    aiCheckbox.style.cssText = "width:13px;height:13px;accent-color:var(--accent);cursor:pointer";
    aiCheckbox.addEventListener("change", () => {
      en.isAI = !!aiCheckbox.checked;
      // URL 재감지와 비교해서 수동 override 여부 표시
      const autoDetected = detectIsAI(en.url);
      aiAutoSpan.textContent = autoDetected && !en.isAI ? "AI (auto-off)" :
                               !autoDetected && en.isAI ? "AI ✎" : "AI";
      aiAutoSpan.style.opacity = en.isAI ? "1" : "0.45";
    });

    const aiAutoSpan = document.createElement("span");
    const autoDetected = detectIsAI(en.url);
    aiAutoSpan.className = "aiTag";
    aiAutoSpan.style.cssText = `opacity:${en.isAI ? "1" : "0.45"};font-size:9px;transition:opacity .15s`;
    aiAutoSpan.textContent = autoDetected && en.isAI ? "AI" :
                             !autoDetected && en.isAI ? "AI ✎" :
                             autoDetected && !en.isAI ? "AI (off)" : "AI";
    aiAutoSpan.title = autoDetected ? "Auto-detected as AI engine" : "Manually set as AI engine";

    aiToggleLabel.append(aiCheckbox, aiAutoSpan);
    nameWrap.append(iconSpan, nameInput, aiToggleLabel);

    // urlInput 먼저 선언
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.className = "engUrlInput";
    urlInput.value = en.url || "";
    urlInput.addEventListener("input", () => {
      en.url = urlInput.value.trim();
      // URL 변경 시 AI 자동 재감지
      const nowAI = detectIsAI(en.url);
      if (nowAI !== autoDetected) {
        aiCheckbox.checked = nowAI;
        en.isAI = nowAI;
        aiAutoSpan.textContent = nowAI ? "AI" : "AI (off)";
        aiAutoSpan.style.opacity = nowAI ? "1" : "0.45";
      }
    });

    info.append(nameWrap, urlInput);

    // Color picker (popover)
    const colorWrap = document.createElement("div");
    colorWrap.className = "colorRow";
    colorWrap.style.position = "relative";

    function updateCardAccent(colorVal) {
      const sw = colorSwatch(colorVal);
      card.style.borderColor = sw;
      card.style.background = `color-mix(in srgb, ${sw} 9%, var(--card, #fff))`;
      // 어두운 색이면 nameInput 텍스트를 해당 색 그대로 (배경이 옅어서 OK)
      // 단, nameInput 자체 배경은 transparent이므로 card 배경(옅은 색) 위에서
      // 텍스트 색 = accent 색 그대로 쓰되, 충분한 대비 보장
      const hex = sw.replace('#','');
      const r = parseInt(hex.slice(0,2),16);
      const g = parseInt(hex.slice(2,4),16);
      const b = parseInt(hex.slice(4,6),16);
      const lum = 0.2126*r/255 + 0.7152*g/255 + 0.0722*b/255;
      // 카드 배경이 옅은 색 (sw 9%)이므로 텍스트는 원색 그대로가 대부분 OK
      // 단 매우 밝은 색(lum>0.85)이면 좀 더 어둡게
      if (lum > 0.85) {
        nameInput.style.color = `color-mix(in srgb, ${sw} 70%, #000)`;
      } else {
        nameInput.style.color = sw;
      }
    }
    updateCardAccent(en.color || "pastel");

    renderColorPicker(colorWrap, en.color || "pastel", (colorVal) => {
      en.color = colorVal;
      updateCardAccent(colorVal);
    });

    // Order + delete
    const orderBtns = document.createElement("div");
    orderBtns.className = "orderBtns";

    const upBtn = document.createElement("button");
    upBtn.type = "button"; upBtn.className = "orderBtn"; upBtn.textContent = "↑";
    upBtn.title = "Move up";
    upBtn.addEventListener("click", () => { if (idx > 0) { swap(idx, -1); renderEngineList(); }});

    const dnBtn = document.createElement("button");
    dnBtn.type = "button"; dnBtn.className = "orderBtn"; dnBtn.textContent = "↓";
    dnBtn.title = "Move down";
    dnBtn.addEventListener("click", () => { if (idx < state.engines.length-1) { swap(idx, +1); renderEngineList(); }});

    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.className = "orderBtn delBtn"; delBtn.textContent = "🗑";
    delBtn.title = "Remove engine";
    delBtn.addEventListener("click", () => {
      if (confirm(`Remove "${engineDisplayName(en)}"?`)) {
        state.engines.splice(idx, 1);
        renderEngineList();
      }
    });

    orderBtns.append(upBtn, dnBtn, delBtn);

    card.append(toggleWrap, info, colorWrap, orderBtns);
    engineList.appendChild(card);
  });
  // 목록이 바뀌면 추천 패널의 Added 판정도 다시 한다
  renderRecommended();
}

function swap(idx, delta) {
  const next = idx + delta;
  [state.engines[idx], state.engines[next]] = [state.engines[next], state.engines[idx]];
}

// =====================
// Add engine
// =====================
function initAddColorPicker() {
  renderColorPicker(addColorRow, addColor, (colorVal) => {
    addColor = colorVal;
  });
}
initAddColorPicker();

let addIconVal = "🔍";
function initAddIconPicker() {
  renderEmojiPicker(addIconWrap, addIconVal, (val) => { addIconVal = val; });
}
initAddIconPicker();

addBtn.addEventListener("click", () => {
  const name = addName.value.trim();
  const url  = addUrl.value.trim();
  const icon = addIconVal || "🔍";
  if (!name || !url.includes("{q}")) {
    alert("Please enter a name and a URL containing {q}.");
    return;
  }
  const colorVal = addColor;
  state.engines.push({
    id: genId(),
    name: { en: name },
    url, icon,
    color: colorVal,
    enabled: true,
    isAI: detectIsAI(url)   // URL로 자동 감지
  });
  addName.value = "";
  addUrl.value = "";
  addIconVal = "🔍";
  initAddIconPicker();
  addColor = "sky";
  initAddColorPicker();
  renderEngineList();
});

// =====================
// Language
// =====================
function renderLangSelect() {
  langSelect.innerHTML = "";
  for (const [code, label] of LANGS) {
    const opt = document.createElement("option");
    opt.value = code; opt.textContent = label;
    langSelect.appendChild(opt);
  }
  langSelect.value = state.lang;
}

langSelect.addEventListener("change", () => {
  state.lang = langSelect.value;
  renderEngineList();
});

// =====================
// Preview
// =====================
function renderPreview() {
  previewStrip.innerHTML = "";
  const enabled = state.engines.filter(e => e.enabled !== false);
  if (!enabled.length) {
    previewStrip.textContent = "No engines enabled.";
    return;
  }
  enabled.forEach((en, i) => {
    const chip = document.createElement("div");
    chip.className = "previewChip" + (i === 0 ? " active" : "");
    const sw = colorSwatch(en.color || "pastel");
    if (i === 0) {
      chip.style.background = `${sw}22`;
      chip.style.borderColor = sw;
      chip.style.color = sw;
    }
    const ico = document.createElement("span");
    ico.textContent = en.icon || "🔍";
    ico.style.fontSize = "14px";
    chip.appendChild(ico);
    const nm = document.createElement("span");
    nm.textContent = engineDisplayName(en);
    chip.appendChild(nm);
    if (en.isAI) {
      const ai = document.createElement("span");
      ai.className = "preAI"; ai.textContent = "AI";
      chip.appendChild(ai);
    }
    previewStrip.appendChild(chip);
  });
}

// =====================
// Save / Load
// =====================
function normalizeEngines(engs) {
  const out = Array.isArray(engs) ? engs.filter(Boolean) : [];
  for (const e of out) {
    if (!e.id) e.id = genId();
    e.name = compactEngineName(e.name, e.id);
    if (typeof e.url !== "string") e.url = "https://www.google.com/search?q={q}";
    if (typeof e.enabled !== "boolean") e.enabled = true;
    if (!e.icon) e.icon = "🔍";
    // isAI: 수동 설정 우선, 없으면 URL 자동 감지
    if (typeof e.isAI !== "boolean") e.isAI = detectIsAI(e.url);
  }
  return out;
}

/* ── Recommended engines ──
   설정 페이지 전용이다. content.js는 이 목록을 읽지 않으므로
   여기 하나만 원본이고 이중 관리 대상이 아니다 (CLAUDE.md #2와 무관).
   기본 8개와 겹치는 엔진은 넣지 않는다. */
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

const RECOMMENDED = [
  /* ── 기본 8개 ──
     실수로 지웠을 때 다시 넣을 수 있어야 하므로 추천 목록에도 포함한다.
     이미 들어 있으면 자동으로 "Added"(체크+잠금)로 표시된다.
     ⚠ defaultEngines()와 name/icon/color/url이 같아야 지웠다 넣어도 모습이 그대로다 */
  { name:{ en:"Google", kr:"구글" },             icon:"\u{1F50D}", color:"sky",    url:"https://www.google.com/search?q={q}" },
  { name:{ en:"Naver", kr:"네이버" },             icon:"\u{1F7E2}", color:"mint",   url:"https://search.naver.com/search.naver?query={q}" },
  { name:{ en:"Bing", kr:"빙" },                 icon:"\u{1F535}", color:"pastel", url:"https://www.bing.com/search?q={q}" },
  { name:{ en:"Wikipedia", kr:"위키피디아", ja:"ウィキペディア" }, icon:"\u{1F4DA}", color:"gray", url:wikipediaUrl(guessDefaultLang()) },
  { name:{ en:"Perplexity AI", kr:"퍼플렉시티" },  icon:"\u{1F916}", color:"violet", url:"https://www.perplexity.ai/search?q={q}" },
  { name:{ en:"ChatGPT", kr:"챗GPT" },            icon:"\u{1F4AC}", color:"gray",   url:"https://chatgpt.com/?q={q}&hints=search" },
  { name:{ en:"Claude", kr:"클로드" },            icon:"✨",    color:"peach",  url:"https://claude.ai/new?q={q}" },
  { name:{ en:"YouTube", kr:"유튜브" },           icon:"▶️", color:"rose", url:"https://www.youtube.com/results?search_query={q}" },
  // ── Search ──
  { name:{ en:"DuckDuckGo" },                                icon:"\u{1F986}",  color:"lemon",  url:"https://duckduckgo.com/?q={q}" },
  { name:{ en:"Daum", kr:"다음" },                            icon:"\u{1F537}",  color:"sky",    url:"https://search.daum.net/search?w=tot&q={q}" },
  { name:{ en:"Yahoo! JAPAN", ja:"Yahoo! JAPAN" },           icon:"\u{1F338}",  color:"rose",   url:"https://search.yahoo.co.jp/search?p={q}" },
  // ── Images / Maps ──
  { name:{ en:"Google Images", kr:"구글 이미지", ja:"Google 画像" }, icon:"\u{1F5BC}️", color:"violet", url:"https://www.google.com/search?tbm=isch&q={q}" },
  { name:{ en:"Google Maps", kr:"구글 지도", ja:"Google マップ" },   icon:"\u{1F5FA}️", color:"sky",  url:"https://www.google.com/maps/search/{q}" },
  { name:{ en:"Naver Map", kr:"네이버 지도" },                 icon:"\u{1F4CD}",  color:"mint",   url:"https://map.naver.com/p/search/{q}" },
  // ── Reference / Dev ──
  { name:{ en:"Namu Wiki", kr:"나무위키" },                    icon:"\u{1F4D7}",  color:"mint",   url:"https://namu.wiki/Search?q={q}" },
  { name:{ en:"GitHub" },                                    icon:"\u{1F419}",  color:"gray",   url:"https://github.com/search?q={q}" },
  { name:{ en:"Stack Overflow" },                            icon:"\u{1F536}",  color:"lemon",  url:"https://stackoverflow.com/search?q={q}" },
  // ── Social ──
  { name:{ en:"Reddit" },                                    icon:"\u{1F47D}",  color:"peach",  url:"https://www.reddit.com/search/?q={q}" },
  { name:{ en:"Pinterest" },                                 icon:"\u{1F4CC}",  color:"rose",   url:"https://www.pinterest.com/search/pins/?q={q}" },
  { name:{ en:"Instagram", kr:"인스타그램" },                  icon:"\u{1F4F7}",  color:"rose",   url:"https://www.instagram.com/explore/search/keyword/?q={q}" },
  // ── Shopping ──
  { name:{ en:"Amazon", kr:"아마존" },                         icon:"\u{1F4E6}",  color:"lemon",  url:"https://www.amazon.com/s?k={q}" },
  { name:{ en:"Amazon.co.jp", ja:"Amazon.co.jp" },           icon:"\u{1F4E6}",  color:"peach",  url:"https://www.amazon.co.jp/s?k={q}" },
  { name:{ en:"Coupang", kr:"쿠팡" },                          icon:"\u{1F6D2}",  color:"peach",  url:"https://www.coupang.com/np/search?q={q}" },
  { name:{ en:"Rakuten", ja:"楽天市場", kr:"라쿠텐" },          icon:"\u{1F6CD}️", color:"rose", url:"https://search.rakuten.co.jp/search/mall/{q}/" },
  { name:{ en:"Mercari", ja:"メルカリ" },                      icon:"\u{1F4F1}",  color:"sky",    url:"https://jp.mercari.com/search?keyword={q}" },
  { name:{ en:"Kakaku.com", ja:"価格.com" },                  icon:"\u{1F4B4}",  color:"lemon",  url:"https://kakaku.com/search_results/{q}/" },
  { name:{ en:"eBay" },                                      icon:"\u{1F3F7}️", color:"sky", url:"https://www.ebay.com/sch/i.html?_nkw={q}" }
];

// 기본 위키가 영문이 아닌 사용자에게는 영문 위키를 따로 제안한다
if (WIKI_HOST[guessDefaultLang()] !== "en") {
  RECOMMENDED.push({
    name:{ en:"Wikipedia (English)", kr:"위키피디아 (영문)", ja:"Wikipedia (英語)" },
    icon:"\u{1F4D5}", color:"gray",
    url:"https://en.wikipedia.org/wiki/Special:Search?search={q}"
  });
}

// 설정 페이지 언어에 맞춘 표시 이름 (engineDisplayName과 같은 폴백 규칙)
function recDisplayName(r) {
  return r.name[state.lang] || r.name.en || r.name.kr || "Engine";
}

/* 중복 판정은 URL로 한다 — 이름은 사용자가 바꿀 수 있으므로 기준이 될 수 없다.
   프로토콜/www/후행 슬래시를 무시하고 호스트+경로+쿼리키만 비교한다. */
function engineUrlKey(url) {
  if (typeof url !== "string") return "";
  let u = url.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, "").replace(/^www\./, "");
  u = u.replace(/\/+$/, "");
  return u;
}

const _recSelected = new Set();
let _recExpanded = false;
const REC_COLLAPSED_ROWS = 3;

// 화면 폭에 따라 열 수가 바뀌므로(3 -> 2 -> 1) 접힌 상태의 개수도 같이 바뀐다
function recColumns() {
  const w = window.innerWidth;
  if (w <= 760) return 1;
  if (w <= 1080) return 2;
  return 3;
}

function renderRecommended() {
  if (!recGrid) return;
  const have = new Set(state.engines.map(e => engineUrlKey(e.url)));

  // 아직 추가 안 한 것을 앞으로 — 접었을 때 3줄 안에 고를 수 있는 것이 보여야 한다
  const order = RECOMMENDED
    .map((r, i) => ({ r, i, added: have.has(engineUrlKey(r.url)) }))
    .sort((a, b) => (a.added - b.added) || (a.i - b.i));

  recGrid.innerHTML = "";
  let addable = 0;

  for (const { r, i, added } of order) {
    if (added) _recSelected.delete(i); else addable++;

    const row = document.createElement("label");
    row.className = "recItem" + (added ? " added" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    // 이미 추가된 엔진은 체크된 채로 잠근다 (선택 상태가 아니라 "들어있음" 표시)
    cb.checked = added || _recSelected.has(i);
    cb.disabled = added;
    cb.addEventListener("change", () => {
      if (cb.checked) _recSelected.add(i); else _recSelected.delete(i);
      updateRecFoot();
    });

    const ic = document.createElement("span");
    ic.className = "recIcon";
    ic.textContent = r.icon;

    const nm = document.createElement("span");
    nm.className = "recName";
    nm.textContent = recDisplayName(r);
    nm.title = r.url;

    row.append(cb, ic, nm);

    if (added) {
      const tag = document.createElement("span");
      tag.className = "recAdded";
      tag.textContent = "Added";
      row.appendChild(tag);
    }
    recGrid.appendChild(row);
  }

  recCount.textContent = addable ? `${addable} available` : "all added";
  applyRecVisibility();
  updateRecFoot();
}

function updateRecFoot() {
  const n = _recSelected.size;
  recSel.textContent = `${n} selected`;
  recAddBtn.disabled = n === 0;
}

// 접힌 상태에서는 앞 3줄만 남긴다. max-height로 자르지 않으므로 스크롤바가 생기지 않는다.
function applyRecVisibility() {
  const items = recGrid.querySelectorAll(".recItem");
  const limit = recColumns() * REC_COLLAPSED_ROWS;
  const overflow = items.length > limit;

  items.forEach((el, n) => { el.hidden = !_recExpanded && overflow && n >= limit; });

  if (!recMore) return;
  recMore.hidden = !overflow;
  recMore.textContent = _recExpanded
    ? "Show less"
    : `Show all ${items.length}`;
}

if (recMore) {
  recMore.addEventListener("click", () => {
    _recExpanded = !_recExpanded;   // 펼침 상태는 저장하지 않는다
    applyRecVisibility();
  });
}

// 창 폭이 바뀌면 열 수가 달라지므로 접힘 개수를 다시 계산한다
window.addEventListener("resize", () => { if (recGrid) applyRecVisibility(); });

if (recAddBtn) {
  recAddBtn.addEventListener("click", () => {
    const picked = [...RECOMMENDED.keys()].filter(i => _recSelected.has(i));
    if (!picked.length) return;

    const newIds = [];
    for (const i of picked) {
      const r = RECOMMENDED[i];
      const id = genId();
      newIds.push(id);
      state.engines.push({
        id,
        name: { ...r.name },
        url: r.url,
        icon: r.icon,
        color: r.color,
        enabled: true,
        isAI: detectIsAI(r.url)
      });
    }
    _recSelected.clear();
    _recExpanded = false;
    renderEngineList();   // 내부에서 renderRecommended()도 부른다

    // 방금 추가된 행을 잠깐 강조
    const cards = engineList.querySelectorAll(".engCard");
    for (const id of newIds) {
      const idx = state.engines.findIndex(e => e.id === id);
      cards[idx]?.classList.add("justAdded");
    }
    cards[state.engines.findIndex(e => e.id === newIds[0])]
      ?.scrollIntoView({ block:"nearest", behavior:"smooth" });
  });
}

// ⚠ content.js의 defaultEngines()와 반드시 동일하게 유지 (CLAUDE.md 금지항목 #2)
function defaultEngines() {
  return [
    { id:"google",     name:{ en:"Google",        kr:"구글" },      url:"https://www.google.com/search?q={q}",                color:"sky",    enabled:true, icon:"🔍" },
    { id:"naver",      name:{ en:"Naver",         kr:"네이버" },     url:"https://search.naver.com/search.naver?query={q}",    color:"mint",   enabled:true, icon:"🟢" },
    { id:"bing",       name:{ en:"Bing",          kr:"빙" },         url:"https://www.bing.com/search?q={q}",                  color:"pastel", enabled:true, icon:"🔵" },
    { id:"wikipedia",  name:{ en:"Wikipedia",     kr:"위키피디아" },  url:wikipediaUrl(guessDefaultLang()), color:"gray", enabled:true, icon:"📚" },
    { id:"perplexity", name:{ en:"Perplexity AI", kr:"퍼플렉시티" },  url:"https://www.perplexity.ai/search?q={q}",             color:"violet", enabled:true, icon:"🤖", isAI:true },
    { id:"chatgpt",    name:{ en:"ChatGPT",       kr:"챗GPT" },      url:"https://chatgpt.com/?q={q}&hints=search",            color:"gray",   enabled:true, icon:"💬", isAI:true },
    { id:"claude",     name:{ en:"Claude",        kr:"클로드" },      url:"https://claude.ai/new?q={q}",                       color:"peach",  enabled:true, icon:"✨", isAI:true },
    { id:"youtube",    name:{ en:"YouTube",       kr:"유튜브" },      url:"https://www.youtube.com/results?search_query={q}",  color:"rose",   enabled:true, icon:"▶️" }
  ];
}

function loadAll() {
  chrome.storage.sync.get([K_LANG, K_ENGS, K_LAST, K_SHORTCUT, K_APPEARANCE], (res) => {
    state.lang = (LANG_CODES.includes(res?.[K_LANG]) ? res[K_LANG] : "en"); // 기본 영어
    let engs = res?.[K_ENGS];
    state.engines = normalizeEngines(Array.isArray(engs) && engs.length ? engs : defaultEngines());
    state.lastEngineId = res?.[K_LAST] || state.engines[0]?.id || "google";
    state.shortcut = res?.[K_SHORTCUT] || { type:"double", key:"Shift" };
    state.appearance = normalizeAppearance(res?.[K_APPEARANCE]);

    renderLangSelect();
    renderEngineList();
    initAddColorPicker();
    initShortcutUI();
    initAppearanceUI();
  });
}

// =====================
// Appearance
// =====================
function initAppearanceUI() {
  renderThemeGrid();

  autoDarkChk.checked   = state.appearance.autoDark;
  engineTintChk.checked = state.appearance.engineTint;
  fontSelect.value      = state.appearance.font;

  autoDarkChk.addEventListener("change", () => {
    state.appearance.autoDark = autoDarkChk.checked;
  });
  engineTintChk.addEventListener("change", () => {
    state.appearance.engineTint = engineTintChk.checked;
  });
  fontSelect.addEventListener("change", () => {
    state.appearance.font = FONT_IDS.includes(fontSelect.value) ? fontSelect.value : "system";
  });

  syncAutoDarkRow();
}

// Auto dark는 classic에서만 의미가 있다.
// 다른 테마는 자체적으로 명암이 확정돼 있어 OS 모드의 영향을 받지 않는다.
function syncAutoDarkRow() {
  const isClassic = state.appearance.theme === "classic";
  autoDarkChk.disabled = !isClassic;
  autoDarkRow.classList.toggle("disabled", !isClassic);
  autoDarkDesc.textContent = isClassic
    ? "Follow your system dark mode."
    : "Not used — the " + state.appearance.theme + " theme has a fixed light/dark look.";
  engineTintDesc.textContent = isClassic
    ? "Tint the popup with the selected engine's color."
    : "Show the engine color on the search box and the active engine outline.";
}

function renderThemeGrid() {
  themeGrid.innerHTML = "";
  for (const t of THEME_META) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "themeCard" + (t.id === state.appearance.theme ? " active" : "");
    card.dataset.theme = t.id;
    card.innerHTML =
      '<div class="tPrevWrap">' +
        '<div class="tPrev">' +
          '<div class="tPrevTop">' +
            '<span class="tLogo"></span>' +
            '<span class="tPill on"></span>' +
            '<span class="tPill"></span>' +
            '<span class="tPill"></span>' +
          '</div>' +
          '<div class="tPrevBot">' +
            '<span class="tInput"></span>' +
            '<span class="tBtn"></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="tName"></div><div class="tDesc"></div>';
    card.querySelector(".tName").textContent = t.name;
    card.querySelector(".tDesc").textContent = t.desc;
    card.addEventListener("click", () => {
      state.appearance.theme = t.id;
      themeGrid.querySelectorAll(".themeCard").forEach(c =>
        c.classList.toggle("active", c.dataset.theme === t.id));
      syncAutoDarkRow();
    });
    themeGrid.appendChild(card);
  }
}

saveBtn.addEventListener("click", () => {
  // 저장 직전 최신 상태 동기화
  updateScPreview();
  chrome.storage.sync.set({
    [K_LANG]:     state.lang,
    [K_ENGS]:     state.engines,
    [K_LAST]:     state.lastEngineId,
    [K_SHORTCUT]: state.shortcut,
    [K_APPEARANCE]: state.appearance
  }, () => {
    // chrome.storage.sync 는 키당 8KB 한도가 있고, 넘으면 set 이 예외 없이 실패한다.
    // lastError 를 안 보면 저장이 안 됐는데도 "Saved!" 가 뜬다.
    const err = chrome.runtime.lastError;
    if (err) {
      console.warn("[TapTap] save failed:", err.message);
      savedMsg.textContent = "⚠ Save failed — settings too large. Remove a few engines.";
      savedMsg.style.color = "#EF4444";
      savedMsg.style.display = "inline";
      setTimeout(() => (savedMsg.style.display = "none"), 6000);
      return;
    }
    savedMsg.textContent = "✓ Saved!";
    savedMsg.style.color = "";   // CSS 기본색(초록)으로 복귀
    savedMsg.style.display = "inline";
    setTimeout(() => (savedMsg.style.display = "none"), 1800);
  });
});

// =====================
// Init
// =====================
loadAll();
