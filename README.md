# ⚡ Quick Search Popup

> Double-tap **Shift** on any webpage to instantly open a search overlay.  
> Google, Naver, AI search (ChatGPT, Claude, Perplexity) and more — without leaving your page.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.0-blue?logo=googlechrome)](https://chromewebstore.google.com/detail/quick-search-popup/bdodpnpniemjlacmdjcaeeagndkmliac)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95-yellow)](https://buymeacoffee.com/hyrocket)

---

## 🎬 How it works

Press **Shift** twice quickly → search overlay appears → type → **Enter**

```
⇧ Shift  +  ⇧ Shift  →  [ Quick Search Popup ]  →  Enter
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Instant overlay** | Double-tap Shift (or custom shortcut) on any page |
| 🤖 **AI Search** | Perplexity, ChatGPT, Claude pre-loaded with AI badge |
| 📝 **Auto-fill** | Highlight text → trigger → fills in automatically |
| 🖱️ **Wheel switching** | Scroll or ↑↓ keys to cycle engines |
| 🕐 **History** | Recent searches with keyboard navigation |
| 🎨 **Theme per engine** | 9 presets + custom hex + native color picker |
| ⌨️ **Custom shortcut** | Double-tap or combo (Ctrl+Shift+S etc.) with conflict detection |
| 🌙 **Dark mode** | Follows browser dark mode automatically |
| 🌐 **13 languages** | KR, EN, JA, ZH, ES, FR, DE, RU, VI, MS, TH, ID |
| 🔒 **Zero tracking** | 100% local storage. No servers, no analytics |

---

## 🚀 Installation

### From Chrome Web Store (recommended)
👉 **[Add to Chrome — Free](https://chromewebstore.google.com/detail/quick-search-popup/bdodpnpniemjlacmdjcaeeagndkmliac)**

### Manual install (developer mode)
1. Download the [latest release](https://github.com/hyrocket/quick-search-popup/releases)
2. Unzip the file
3. Open Chrome → `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **"Load unpacked"** → select the unzipped folder

---

## 📖 Usage

| Action | Shortcut |
|--------|----------|
| Open popup | `Shift` × 2 (double-tap) |
| Switch engine | `↑` / `↓` or mouse wheel |
| Search | `Enter` |
| Close | `Esc` |
| Open Settings | Click ⚙ in popup |

---

## 🔧 Settings

Open popup → click **⚙** → Settings page

- **Search Engines** — add/remove/reorder, set color, AI toggle
- **Shortcut** — change trigger key (double-tap or combo)
- **Language** — 13 UI languages
- **Preview** — see engine strip live preview

---

## 🔍 Default Search Engines

| Engine | AI |
|--------|-----|
| 🔍 Google | |
| 🟢 Naver | |
| 🔵 Bing | |
| 📖 Namu Wiki | |
| 📚 Wikipedia | |
| 🤖 Perplexity AI | ✅ |
| 💬 ChatGPT | ✅ |
| ✨ Claude | ✅ |
| ▶️ YouTube | |

AI badge is **auto-detected** from URL — add any AI engine and it's tagged automatically.

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/hyrocket/quick-search-popup.git
cd quick-search-popup

# Load in Chrome
# chrome://extensions → Developer mode → Load unpacked → select this folder
```

**File structure:**
```
quick-search-popup/
├── manifest.json      # Extension config (MV3)
├── content.js         # Main popup UI (Shadow DOM)
├── background.js      # Service worker
├── options.html       # Settings page
├── options.js         # Settings logic
├── icons/             # Extension icons (16/32/48/128px)
└── docs/
    └── index.html     # GitHub Pages site
```

---

## ☕ Support

If Quick Search Popup saves you time every day, consider buying me a coffee!

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95%20hyrocket-FFDD00?style=for-the-badge&labelColor=000)](https://buymeacoffee.com/hyrocket)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Changelog

### v1.0.0 (2025)
- 🎉 First stable release
- AI engine auto-detection (26 AI domains)
- Custom shortcut with keyboard UI + conflict detection  
- Search history with keyboard navigation
- Dark mode follows browser setting
- 9 color presets + custom hex + native color picker
- Engine strip auto-scroll when switching
- Fully fixed popup width (720px max)
