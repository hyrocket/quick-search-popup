// =====================================================================
// Shift Quick Search v0.9 — options.js
// =====================================================================

const K_LANG     = "shiftsearch:lang";
const K_ENGS     = "shiftsearch:engines";
const K_LAST     = "shiftsearch:lastEngineId";
const K_SHORTCUT = "shiftsearch:shortcut";

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
  shortcut: { type:"double", key:"Shift" }
};

// ── DOM refs ──
const $ = id => document.getElementById(id);
const langSelect   = $("langSelect");
const engineList   = $("engineList");
const addName      = $("addName");
const addUrl       = $("addUrl");
const addIcon      = $("addIcon");
const addBtn       = $("addBtn");
const addColorRow  = $("addColorRow");
const addHexInput  = $("addHexInput");
const saveBtn      = $("saveBtn");
const savedMsg     = $("savedMsg");
const previewStrip = $("previewStrip");

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

function fillAllLangs(label) {
  const obj = {};
  for (const [c] of LANGS) obj[c] = label;
  return obj;
}

function engineDisplayName(en) {
  const code = state.lang;
  return (en.name && (en.name[code] || en.name.en || en.name.kr)) || en.id;
}

function setEngineName(en, val) {
  if (!en.name || typeof en.name !== "object") en.name = fillAllLangs(val);
  en.name[state.lang] = val;
  for (const [c] of LANGS) {
    if (!en.name[c] || en.name[c].trim() === "") en.name[c] = val;
  }
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

    const iconSpan = document.createElement("span");
    iconSpan.textContent = en.icon || "🔍";
    iconSpan.style.fontSize = "16px";

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

addBtn.addEventListener("click", () => {
  const name = addName.value.trim();
  const url  = addUrl.value.trim();
  const icon = addIcon.value.trim() || "🔍";
  if (!name || !url.includes("{q}")) {
    alert("Please enter a name and a URL containing {q}.");
    return;
  }
  const colorVal = addColor;
  state.engines.push({
    id: genId(),
    name: fillAllLangs(name),
    url, icon,
    color: colorVal,
    enabled: true,
    isAI: detectIsAI(url)   // URL로 자동 감지
  });
  addName.value = "";
  addUrl.value = "";
  addIcon.value = "";
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
    if (!e.name || typeof e.name !== "object") e.name = fillAllLangs(e.id);
    for (const [c] of LANGS) if (typeof e.name[c] !== "string") e.name[c] = e.name.en || e.name.kr || e.id;
    if (typeof e.url !== "string") e.url = "https://www.google.com/search?q={q}";
    if (typeof e.enabled !== "boolean") e.enabled = true;
    if (!e.icon) e.icon = "🔍";
    // isAI: 수동 설정 우선, 없으면 URL 자동 감지
    if (typeof e.isAI !== "boolean") e.isAI = detectIsAI(e.url);
  }
  return out;
}

function defaultEngines() {
  function fa(label) { const obj={}; for(const[c] of LANGS) obj[c]=label; return obj; }
  return [
    { id:"google",     name:{...fa("Google"),    kr:"구글"},      url:"https://www.google.com/search?q={q}",                color:"sky",    enabled:true, icon:"🔍" },
    { id:"naver",      name:{...fa("Naver"),     kr:"네이버"},     url:"https://search.naver.com/search.naver?query={q}",    color:"mint",   enabled:true, icon:"🟢" },
    { id:"bing",       name:{...fa("Bing"),      kr:"빙"},         url:"https://www.bing.com/search?q={q}",                  color:"pastel", enabled:true, icon:"🔵" },
    { id:"wikipedia",  name:{...fa("Wikipedia"), kr:"위키피디아"},  url:"https://en.wikipedia.org/wiki/Special:Search?search={q}", color:"gray", enabled:true, icon:"📚" },
    { id:"perplexity", name:{...fa("Perplexity AI"), kr:"퍼플렉시티"}, url:"https://www.perplexity.ai/search?q={q}",         color:"violet", enabled:true, icon:"🤖", isAI:true },
    { id:"chatgpt",    name:{...fa("ChatGPT"),   kr:"챗GPT"},      url:"https://chatgpt.com/?q={q}&hints=search",            color:"gray",   enabled:true, icon:"💬", isAI:true },
    { id:"claude",     name:{...fa("Claude"),    kr:"클로드"},      url:"https://claude.ai/new?q={q}",                       color:"peach",  enabled:true, icon:"✨", isAI:true },
    { id:"youtube",    name:{...fa("YouTube"),   kr:"유튜브"},      url:"https://www.youtube.com/results?search_query={q}",  color:"rose",   enabled:true, icon:"▶️" }
  ];
}

function loadAll() {
  chrome.storage.sync.get([K_LANG, K_ENGS, K_LAST, K_SHORTCUT], (res) => {
    state.lang = (LANG_CODES.includes(res?.[K_LANG]) ? res[K_LANG] : "en"); // 기본 영어
    let engs = res?.[K_ENGS];
    state.engines = normalizeEngines(Array.isArray(engs) && engs.length ? engs : defaultEngines());
    state.lastEngineId = res?.[K_LAST] || state.engines[0]?.id || "google";
    state.shortcut = res?.[K_SHORTCUT] || { type:"double", key:"Shift" };

    renderLangSelect();
    renderEngineList();
    initAddColorPicker();
    initShortcutUI();
  });
}

saveBtn.addEventListener("click", () => {
  // 저장 직전 최신 상태 동기화
  updateScPreview();
  chrome.storage.sync.set({
    [K_LANG]:     state.lang,
    [K_ENGS]:     state.engines,
    [K_LAST]:     state.lastEngineId,
    [K_SHORTCUT]: state.shortcut
  }, () => {
    savedMsg.style.display = "inline";
    setTimeout(() => (savedMsg.style.display = "none"), 1800);
    // 저장된 값 콘솔 확인용
    console.log("[QSP] Saved shortcut:", JSON.stringify(state.shortcut));
  });
});

// =====================
// Init
// =====================
loadAll();
