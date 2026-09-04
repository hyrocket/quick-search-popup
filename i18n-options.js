// =====================================================================
// 설정 페이지 번역 테이블
//
// content.js 의 I18N 과 분리돼 있다. 팝업은 키 10개짜리 상시 노출 UI라
// 파일 안에 두는 게 맞지만, 이쪽은 About 산문까지 포함해 훨씬 크다.
// options.js(49KB)에 합치면 읽기 어려워져 파일을 나눴다.
// options.html 에서 options.js 보다 먼저 로드된다.
//
// 구조가 두 가지인 이유:
//   OPT_I18N   — 짧은 UI 라벨. data-i18n="키" 로 요소에 꽂는다.
//   ABOUT_HTML — About 탭 본문. 언어별 통 HTML.
//     산문을 문장 단위로 쪼개 번역하면 언어마다 어순이 안 맞아 어색해진다.
//     About 은 사실상 서비스 설명이라(스토어 설명은 영어뿐) 각 언어로
//     자연스럽게 읽히는 게 중요해서 블록째 따로 쓴다.
//
// 폴백: OPT_I18N[lang][key] -> OPT_I18N.en[key] -> HTML 원문(영어)
//
// 테마 키 "classic" 의 표시 이름은 "Chameleon" 이다.
// (선택한 엔진 색을 따라 팝업 색이 바뀌는 동작에서 딴 이름)
// 키를 바꾸면 content.js 의 [data-ss-theme="classic"] 선택자 15곳과
// 기존 사용자의 저장값이 깨지므로 라벨만 바꾼다.
// =====================================================================

const OPT_I18N = {

  en: {
    "nav.engines":"Search Engines", "nav.shortcut":"Shortcut", "nav.appearance":"Appearance",
    "nav.language":"Language", "nav.about":"About",

    "ab.title":"About",
    "ui.pageTitle":"TapTap - Quick Search — Settings",
    "ab.sub":"TapTap - Quick Search — open-source browser extension",
    "ab.coffee":"☕ Buy me a coffee",

    "eng.title":"Search Engines",
    "eng.sub":"Enable, reorder, rename and color your engines.",
    "eng.recTitle":"Recommended engines",
    "eng.recAdd":"Add selected",
    "eng.recSelected":"{n} selected",
    "eng.active":"Active Engines",
    "eng.addName":"Name",
    "eng.addBtn":"+ Add",
    "eng.colorLabel":"Color:",
    "eng.urlHint":"URL template: use <strong>{q}</strong> for the search term &mdash; e.g. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Trigger Shortcut",
    "sc.sub":"Set the key that opens TapTap.",
    "sc.current":"Current Shortcut",
    "sc.modeDouble":"⬡ Double-tap key",
    "sc.modeCombo":"⌨ Key combination",
    "sc.chooseDouble":"Choose key to double-tap",
    "sc.note400":"Double-tap the same key twice within 400ms to trigger.",
    "sc.chooseCombo":"Choose modifier + key",
    "sc.modifier":"Modifier (required)",
    "sc.key":"Key",
    "sc.doubleTap":"double tap",
    "sc.selectPrompt":"Select modifier + key",

    "ap.title":"Appearance",
    "ap.sub":"Choose how the search popup looks. Layout and behavior stay the same.",
    "ap.theme":"Theme",
    "ap.options":"Options",
    "ap.autoDark":"Auto dark",
    "ap.autoDarkOn":"Follow your system dark mode.",
    "ap.autoDarkOff":"Not used — the {theme} theme has a fixed light/dark look.",
    "ap.engineTint":"Engine tint",
    "ap.tintOn":"Tint the popup with the selected engine's color.",
    "ap.tintOff":"Show the engine color on the search box and the active engine outline.",
    "ap.font":"Font",
    "ap.fontDesc":"Override the theme's default font.",
    "ap.fontSystem":"System", "ap.fontSerif":"Serif", "ap.fontMono":"Mono",

    "theme.classic":"Chameleon", "theme.classicDesc":"Follows the selected engine's color.",
    "theme.mono":"Mono",         "theme.monoDesc":"Neutral black and white.",
    "theme.midnight":"Midnight", "theme.midnightDesc":"Dark, muted violet accent.",
    "theme.glass":"Glass",       "theme.glassDesc":"Translucent with a blurred backdrop.",
    "theme.paper":"Paper",       "theme.paperDesc":"Warm off-white, serif text.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Dark console green, monospace.",

    "lang.title":"Language",
    "lang.sub":"Set the language of TapTap.",
    "lang.label":"Language",
    "lang.note":"Applies to the search popup, engine names and this settings page.",
    "pv.stripLabel":"Engine Strip Preview",
    "pv.none":"No engines enabled.",

    "ui.save":"💾 Save",
    "ui.saved":"✓ Saved!",
    "ui.saveFailed":"⚠ Save failed — settings too large. Remove a few engines.",
    "ui.added":"Added",
    "ui.iconChange":"Click to change icon",
    "ui.typeOrPaste":"Type or paste",
    "ui.colorChange":"Click to change color",
    "ui.pickColor":"Pick color",
    "ui.openPalette":"Open color palette",
    "ui.markAI":"Mark as AI engine (shows AI badge)",
    "ui.moveUp":"Move up",
    "ui.moveDown":"Move down",
    "ui.removeEngine":"Remove engine"
  },

  kr: {
    "nav.engines":"검색 엔진", "nav.shortcut":"단축키", "nav.appearance":"모양",
    "nav.language":"언어 <span class=\"navEn\">(Language)</span>", "nav.about":"정보",

    "ab.title":"정보",
    "ui.pageTitle":"TapTap - Quick Search — 설정",
    "ab.sub":"TapTap - Quick Search — 오픈소스 브라우저 확장",
    "ab.coffee":"☕ 커피 한 잔 사주기",

    "eng.title":"검색 엔진",
    "eng.sub":"엔진을 켜고 끄거나 순서·이름·색을 바꿉니다.",
    "eng.recTitle":"추천 엔진",
    "eng.recAdd":"선택 추가",
    "eng.recSelected":"{n}개 선택됨",
    "eng.active":"사용 중인 엔진",
    "eng.addName":"이름",
    "eng.addBtn":"+ 추가",
    "eng.colorLabel":"색상:",
    "eng.urlHint":"URL 형식: 검색어 자리에 <strong>{q}</strong> 를 넣으세요 &mdash; 예: <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"실행 단축키",
    "sc.sub":"TapTap 을 여는 키를 정합니다.",
    "sc.current":"현재 단축키",
    "sc.modeDouble":"⬡ 같은 키 두 번",
    "sc.modeCombo":"⌨ 조합키",
    "sc.chooseDouble":"두 번 누를 키 선택",
    "sc.note400":"같은 키를 400ms 안에 두 번 누르면 열립니다.",
    "sc.chooseCombo":"조합키 + 키 선택",
    "sc.modifier":"조합키 (필수)",
    "sc.key":"키",
    "sc.doubleTap":"두 번 누르기",
    "sc.selectPrompt":"조합키와 키를 선택하세요",

    "ap.title":"모양",
    "ap.sub":"검색 팝업의 겉모습을 고릅니다. 배치와 동작은 그대로입니다.",
    "ap.theme":"테마",
    "ap.options":"옵션",
    "ap.autoDark":"자동 다크",
    "ap.autoDarkOn":"시스템 다크 모드를 따릅니다.",
    "ap.autoDarkOff":"사용 안 함 — {theme} 테마는 밝기가 고정돼 있습니다.",
    "ap.engineTint":"엔진 색 반영",
    "ap.tintOn":"선택한 엔진의 색을 팝업 전체에 입힙니다.",
    "ap.tintOff":"검색창과 선택된 엔진 테두리에만 엔진 색을 씁니다.",
    "ap.font":"글꼴",
    "ap.fontDesc":"테마 기본 글꼴 대신 다른 글꼴을 씁니다.",
    "ap.fontSystem":"시스템", "ap.fontSerif":"명조", "ap.fontMono":"고정폭",

    "theme.classic":"카멜레온",   "theme.classicDesc":"선택한 엔진의 색을 따라갑니다.",
    "theme.mono":"모노",          "theme.monoDesc":"무채색 흑백.",
    "theme.midnight":"미드나이트", "theme.midnightDesc":"어두운 바탕에 차분한 보라.",
    "theme.glass":"글래스",       "theme.glassDesc":"뒷배경이 비치는 반투명.",
    "theme.paper":"페이퍼",       "theme.paperDesc":"따뜻한 미색 바탕에 명조체.",
    "theme.terminal":"터미널",    "theme.terminalDesc":"검은 콘솔에 초록 고정폭.",

    "lang.title":"언어",
    "lang.sub":"TapTap 의 언어를 정합니다.",
    "lang.label":"언어",
    "lang.note":"검색 팝업, 엔진 이름, 이 설정 페이지에 모두 적용됩니다.",
    "pv.stripLabel":"엔진 스트립 미리보기",
    "pv.none":"켜진 엔진이 없습니다.",

    "ui.save":"💾 저장",
    "ui.saved":"✓ 저장됨!",
    "ui.saveFailed":"⚠ 저장 실패 — 설정이 너무 큽니다. 엔진을 몇 개 지워주세요.",
    "ui.added":"추가됨",
    "ui.iconChange":"클릭해서 아이콘 변경",
    "ui.typeOrPaste":"입력하거나 붙여넣기",
    "ui.colorChange":"클릭해서 색상 변경",
    "ui.pickColor":"색상 선택",
    "ui.openPalette":"색상 팔레트 열기",
    "ui.markAI":"AI 엔진으로 표시 (AI 배지가 붙습니다)",
    "ui.moveUp":"위로",
    "ui.moveDown":"아래로",
    "ui.removeEngine":"엔진 삭제"
  },

  ja: {
    "nav.engines":"検索エンジン", "nav.shortcut":"ショートカット", "nav.appearance":"外観",
    "nav.language":"言語 <span class=\"navEn\">(Language)</span>", "nav.about":"情報",

    "ab.title":"情報",
    "ui.pageTitle":"TapTap - Quick Search — 設定",
    "ab.sub":"TapTap - Quick Search — オープンソースのブラウザ拡張機能",
    "ab.coffee":"☕ コーヒーをおごる",

    "eng.title":"検索エンジン",
    "eng.sub":"エンジンの有効化・並び替え・名前と色の変更ができます。",
    "eng.recTitle":"おすすめエンジン",
    "eng.recAdd":"選択したものを追加",
    "eng.recSelected":"{n}件選択中",
    "eng.active":"使用中のエンジン",
    "eng.addName":"名前",
    "eng.addBtn":"+ 追加",
    "eng.colorLabel":"色:",
    "eng.urlHint":"URL テンプレート: 検索語の位置に <strong>{q}</strong> を入れます &mdash; 例: <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"起動ショートカット",
    "sc.sub":"TapTap を開くキーを設定します。",
    "sc.current":"現在のショートカット",
    "sc.modeDouble":"⬡ 同じキーを2回",
    "sc.modeCombo":"⌨ 組み合わせキー",
    "sc.chooseDouble":"2回押すキーを選択",
    "sc.note400":"同じキーを400ms以内に2回押すと開きます。",
    "sc.chooseCombo":"修飾キー + キーを選択",
    "sc.modifier":"修飾キー (必須)",
    "sc.key":"キー",
    "sc.doubleTap":"2回押し",
    "sc.selectPrompt":"修飾キーとキーを選んでください",

    "ap.title":"外観",
    "ap.sub":"検索ポップアップの見た目を選びます。配置と動作は変わりません。",
    "ap.theme":"テーマ",
    "ap.options":"オプション",
    "ap.autoDark":"自動ダーク",
    "ap.autoDarkOn":"システムのダークモードに合わせます。",
    "ap.autoDarkOff":"未使用 — {theme} テーマは明暗が固定です。",
    "ap.engineTint":"エンジン色を反映",
    "ap.tintOn":"選択中のエンジンの色をポップアップ全体に反映します。",
    "ap.tintOff":"検索ボックスと選択中エンジンの枠だけにエンジン色を使います。",
    "ap.font":"フォント",
    "ap.fontDesc":"テーマ標準のフォントを上書きします。",
    "ap.fontSystem":"システム", "ap.fontSerif":"明朝", "ap.fontMono":"等幅",

    "theme.classic":"カメレオン", "theme.classicDesc":"選択中のエンジンの色に従います。",
    "theme.mono":"モノ",          "theme.monoDesc":"無彩色の白黒。",
    "theme.midnight":"ミッドナイト", "theme.midnightDesc":"暗い背景に落ち着いた紫。",
    "theme.glass":"グラス",       "theme.glassDesc":"背景が透ける半透明。",
    "theme.paper":"ペーパー",     "theme.paperDesc":"温かみのある生成り色に明朝体。",
    "theme.terminal":"ターミナル", "theme.terminalDesc":"黒いコンソールに緑の等幅。",

    "lang.title":"言語",
    "lang.sub":"TapTap の言語を設定します。",
    "lang.label":"言語",
    "lang.note":"検索ポップアップ、エンジン名、この設定ページすべてに適用されます。",
    "pv.stripLabel":"エンジンストリップのプレビュー",
    "pv.none":"有効なエンジンがありません。",

    "ui.save":"💾 保存",
    "ui.saved":"✓ 保存しました",
    "ui.saveFailed":"⚠ 保存に失敗 — 設定が大きすぎます。エンジンをいくつか削除してください。",
    "ui.added":"追加済み",
    "ui.iconChange":"クリックしてアイコンを変更",
    "ui.typeOrPaste":"入力または貼り付け",
    "ui.colorChange":"クリックして色を変更",
    "ui.pickColor":"色を選択",
    "ui.openPalette":"カラーパレットを開く",
    "ui.markAI":"AI エンジンとして表示 (AI バッジが付きます)",
    "ui.moveUp":"上へ",
    "ui.moveDown":"下へ",
    "ui.removeEngine":"エンジンを削除"
  },

  "zh-CN": {
    "nav.engines":"搜索引擎", "nav.shortcut":"快捷键", "nav.appearance":"外观",
    "nav.language":"语言 <span class=\"navEn\">(Language)</span>", "nav.about":"关于",

    "ab.title":"关于",
    "ui.pageTitle":"TapTap - Quick Search —— 设置",
    "ab.sub":"TapTap - Quick Search —— 开源浏览器扩展",
    "ab.coffee":"☕ 请我喝杯咖啡",

    "eng.title":"搜索引擎",
    "eng.sub":"启用、排序、重命名引擎，并设置颜色。",
    "eng.recTitle":"推荐引擎",
    "eng.recAdd":"添加所选",
    "eng.recSelected":"已选 {n} 个",
    "eng.active":"已启用的引擎",
    "eng.addName":"名称",
    "eng.addBtn":"+ 添加",
    "eng.colorLabel":"颜色：",
    "eng.urlHint":"URL 模板：用 <strong>{q}</strong> 代表搜索词 &mdash; 例如 <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"触发快捷键",
    "sc.sub":"设置打开 TapTap 的按键。",
    "sc.current":"当前快捷键",
    "sc.modeDouble":"⬡ 连按同一个键",
    "sc.modeCombo":"⌨ 组合键",
    "sc.chooseDouble":"选择要连按的键",
    "sc.note400":"在 400 毫秒内连按同一个键两次即可打开。",
    "sc.chooseCombo":"选择修饰键 + 按键",
    "sc.modifier":"修饰键（必填）",
    "sc.key":"按键",
    "sc.doubleTap":"连按两次",
    "sc.selectPrompt":"请选择修饰键和按键",

    "ap.title":"外观",
    "ap.sub":"选择搜索弹窗的外观。布局和操作方式保持不变。",
    "ap.theme":"主题",
    "ap.options":"选项",
    "ap.autoDark":"自动深色",
    "ap.autoDarkOn":"跟随系统的深色模式。",
    "ap.autoDarkOff":"不适用 —— {theme} 主题的明暗是固定的。",
    "ap.engineTint":"引擎着色",
    "ap.tintOn":"用所选引擎的颜色为整个弹窗着色。",
    "ap.tintOff":"仅在搜索框和当前引擎的边框上使用引擎颜色。",
    "ap.font":"字体",
    "ap.fontDesc":"覆盖主题的默认字体。",
    "ap.fontSystem":"系统", "ap.fontSerif":"衬线", "ap.fontMono":"等宽",

    "theme.classic":"变色龙",   "theme.classicDesc":"跟随所选引擎的颜色。",
    "theme.mono":"单色",        "theme.monoDesc":"中性的黑与白。",
    "theme.midnight":"午夜",    "theme.midnightDesc":"深色背景，柔和的紫色点缀。",
    "theme.glass":"玻璃",       "theme.glassDesc":"背景模糊的半透明效果。",
    "theme.paper":"纸张",       "theme.paperDesc":"温暖的米白色，衬线字体。",
    "theme.terminal":"终端",    "theme.terminalDesc":"黑色控制台，绿色等宽字体。",

    "lang.title":"语言",
    "lang.sub":"设置 TapTap 的语言。",
    "lang.label":"语言",
    "lang.note":"适用于搜索弹窗、引擎名称以及本设置页面。",
    "pv.stripLabel":"引擎栏预览",
    "pv.none":"没有启用任何引擎。",

    "ui.save":"💾 保存",
    "ui.saved":"✓ 已保存！",
    "ui.saveFailed":"⚠ 保存失败 —— 设置过大。请删除几个引擎。",
    "ui.added":"已添加",
    "ui.iconChange":"点击更换图标",
    "ui.typeOrPaste":"输入或粘贴",
    "ui.colorChange":"点击更换颜色",
    "ui.pickColor":"选择颜色",
    "ui.openPalette":"打开调色板",
    "ui.markAI":"标记为 AI 引擎（显示 AI 徽标）",
    "ui.moveUp":"上移",
    "ui.moveDown":"下移",
    "ui.removeEngine":"删除引擎"
  },

  "zh-TW": {
    "nav.engines":"搜尋引擎", "nav.shortcut":"快速鍵", "nav.appearance":"外觀",
    "nav.language":"語言 <span class=\"navEn\">(Language)</span>", "nav.about":"關於",

    "ab.title":"關於",
    "ui.pageTitle":"TapTap - Quick Search —— 設定",
    "ab.sub":"TapTap - Quick Search —— 開源瀏覽器擴充功能",
    "ab.coffee":"☕ 請我喝杯咖啡",

    "eng.title":"搜尋引擎",
    "eng.sub":"啟用、排序、重新命名引擎，並設定顏色。",
    "eng.recTitle":"推薦引擎",
    "eng.recAdd":"加入所選",
    "eng.recSelected":"已選 {n} 個",
    "eng.active":"已啟用的引擎",
    "eng.addName":"名稱",
    "eng.addBtn":"+ 新增",
    "eng.colorLabel":"顏色：",
    "eng.urlHint":"URL 範本：用 <strong>{q}</strong> 代表搜尋字詞 &mdash; 例如 <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"觸發快速鍵",
    "sc.sub":"設定開啟 TapTap 的按鍵。",
    "sc.current":"目前的快速鍵",
    "sc.modeDouble":"⬡ 連按同一個鍵",
    "sc.modeCombo":"⌨ 組合鍵",
    "sc.chooseDouble":"選擇要連按的按鍵",
    "sc.note400":"在 400 毫秒內連按同一個鍵兩次即可開啟。",
    "sc.chooseCombo":"選擇輔助鍵 + 按鍵",
    "sc.modifier":"輔助鍵（必填）",
    "sc.key":"按鍵",
    "sc.doubleTap":"連按兩次",
    "sc.selectPrompt":"請選擇輔助鍵和按鍵",

    "ap.title":"外觀",
    "ap.sub":"選擇搜尋彈出視窗的外觀。版面配置與操作方式維持不變。",
    "ap.theme":"主題",
    "ap.options":"選項",
    "ap.autoDark":"自動深色",
    "ap.autoDarkOn":"跟隨系統的深色模式。",
    "ap.autoDarkOff":"不適用 —— {theme} 主題的明暗是固定的。",
    "ap.engineTint":"引擎著色",
    "ap.tintOn":"用所選引擎的顏色為整個彈出視窗著色。",
    "ap.tintOff":"僅在搜尋框和目前引擎的外框上使用引擎顏色。",
    "ap.font":"字型",
    "ap.fontDesc":"覆寫主題的預設字型。",
    "ap.fontSystem":"系統", "ap.fontSerif":"襯線", "ap.fontMono":"等寬",

    "theme.classic":"變色龍",   "theme.classicDesc":"跟隨所選引擎的顏色。",
    "theme.mono":"單色",        "theme.monoDesc":"中性的黑與白。",
    "theme.midnight":"午夜",    "theme.midnightDesc":"深色背景，柔和的紫色點綴。",
    "theme.glass":"玻璃",       "theme.glassDesc":"背景模糊的半透明效果。",
    "theme.paper":"紙張",       "theme.paperDesc":"溫暖的米白色，襯線字型。",
    "theme.terminal":"終端機",  "theme.terminalDesc":"黑色主控台，綠色等寬字型。",

    "lang.title":"語言",
    "lang.sub":"設定 TapTap 的語言。",
    "lang.label":"語言",
    "lang.note":"適用於搜尋彈出視窗、引擎名稱以及本設定頁面。",
    "pv.stripLabel":"引擎列預覽",
    "pv.none":"沒有啟用任何引擎。",

    "ui.save":"💾 儲存",
    "ui.saved":"✓ 已儲存！",
    "ui.saveFailed":"⚠ 儲存失敗 —— 設定過大。請刪除幾個引擎。",
    "ui.added":"已加入",
    "ui.iconChange":"點擊更換圖示",
    "ui.typeOrPaste":"輸入或貼上",
    "ui.colorChange":"點擊更換顏色",
    "ui.pickColor":"選擇顏色",
    "ui.openPalette":"開啟調色盤",
    "ui.markAI":"標記為 AI 引擎（顯示 AI 標章）",
    "ui.moveUp":"上移",
    "ui.moveDown":"下移",
    "ui.removeEngine":"刪除引擎"
  },

  es: {
    "nav.engines":"Buscadores", "nav.shortcut":"Atajo", "nav.appearance":"Apariencia",
    "nav.language":"Idioma <span class=\"navEn\">(Language)</span>", "nav.about":"Acerca de",

    "ab.title":"Acerca de",
    "ui.pageTitle":"TapTap - Quick Search — Ajustes",
    "ab.sub":"TapTap - Quick Search: extensión de navegador de código abierto",
    "ab.coffee":"☕ Invítame a un café",

    "eng.title":"Buscadores",
    "eng.sub":"Activa, reordena, renombra y colorea tus buscadores.",
    "eng.recTitle":"Buscadores recomendados",
    "eng.recAdd":"Añadir seleccionados",
    "eng.recSelected":"{n} seleccionados",
    "eng.active":"Buscadores activos",
    "eng.addName":"Nombre",
    "eng.addBtn":"+ Añadir",
    "eng.colorLabel":"Color:",
    "eng.urlHint":"Plantilla de URL: usa <strong>{q}</strong> para el término de búsqueda &mdash; p. ej. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Atajo de activación",
    "sc.sub":"Elige la tecla que abre TapTap.",
    "sc.current":"Atajo actual",
    "sc.modeDouble":"⬡ Pulsar dos veces",
    "sc.modeCombo":"⌨ Combinación de teclas",
    "sc.chooseDouble":"Elige la tecla que pulsarás dos veces",
    "sc.note400":"Pulsa la misma tecla dos veces en menos de 400 ms para abrirlo.",
    "sc.chooseCombo":"Elige modificador + tecla",
    "sc.modifier":"Modificador (obligatorio)",
    "sc.key":"Tecla",
    "sc.doubleTap":"pulsación doble",
    "sc.selectPrompt":"Selecciona modificador + tecla",

    "ap.title":"Apariencia",
    "ap.sub":"Elige el aspecto de la ventana de búsqueda. La disposición y el comportamiento no cambian.",
    "ap.theme":"Tema",
    "ap.options":"Opciones",
    "ap.autoDark":"Modo oscuro automático",
    "ap.autoDarkOn":"Sigue el modo oscuro del sistema.",
    "ap.autoDarkOff":"No se usa: el tema {theme} tiene un aspecto claro/oscuro fijo.",
    "ap.engineTint":"Tinte del buscador",
    "ap.tintOn":"Tiñe toda la ventana con el color del buscador seleccionado.",
    "ap.tintOff":"Usa el color del buscador solo en el cuadro de búsqueda y el borde del buscador activo.",
    "ap.font":"Fuente",
    "ap.fontDesc":"Sustituye la fuente predeterminada del tema.",
    "ap.fontSystem":"Sistema", "ap.fontSerif":"Serif", "ap.fontMono":"Monoespaciada",

    "theme.classic":"Camaleón",  "theme.classicDesc":"Sigue el color del buscador seleccionado.",
    "theme.mono":"Mono",         "theme.monoDesc":"Blanco y negro neutro.",
    "theme.midnight":"Medianoche","theme.midnightDesc":"Oscuro, con un violeta apagado.",
    "theme.glass":"Cristal",     "theme.glassDesc":"Translúcido, con el fondo desenfocado.",
    "theme.paper":"Papel",       "theme.paperDesc":"Blanco cálido y texto con serifa.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Consola oscura, verde y monoespaciada.",

    "lang.title":"Idioma",
    "lang.sub":"Elige el idioma de TapTap.",
    "lang.label":"Idioma",
    "lang.note":"Se aplica a la ventana de búsqueda, a los nombres de los buscadores y a esta página de ajustes.",
    "pv.stripLabel":"Vista previa de la barra de buscadores",
    "pv.none":"No hay buscadores activos.",

    "ui.save":"💾 Guardar",
    "ui.saved":"✓ Guardado",
    "ui.saveFailed":"⚠ Error al guardar: los ajustes son demasiado grandes. Elimina algunos buscadores.",
    "ui.added":"Añadido",
    "ui.iconChange":"Haz clic para cambiar el icono",
    "ui.typeOrPaste":"Escribe o pega",
    "ui.colorChange":"Haz clic para cambiar el color",
    "ui.pickColor":"Elegir color",
    "ui.openPalette":"Abrir la paleta de colores",
    "ui.markAI":"Marcar como buscador de IA (muestra la etiqueta IA)",
    "ui.moveUp":"Subir",
    "ui.moveDown":"Bajar",
    "ui.removeEngine":"Eliminar buscador"
  },

  fr: {
    "nav.engines":"Moteurs de recherche", "nav.shortcut":"Raccourci", "nav.appearance":"Apparence",
    "nav.language":"Langue <span class=\"navEn\">(Language)</span>", "nav.about":"À propos",

    "ab.title":"À propos",
    "ui.pageTitle":"TapTap - Quick Search — Réglages",
    "ab.sub":"TapTap - Quick Search — extension de navigateur open source",
    "ab.coffee":"☕ Offrez-moi un café",

    "eng.title":"Moteurs de recherche",
    "eng.sub":"Activez, réorganisez, renommez vos moteurs et choisissez leur couleur.",
    "eng.recTitle":"Moteurs recommandés",
    "eng.recAdd":"Ajouter la sélection",
    "eng.recSelected":"{n} sélectionné(s)",
    "eng.active":"Moteurs actifs",
    "eng.addName":"Nom",
    "eng.addBtn":"+ Ajouter",
    "eng.colorLabel":"Couleur :",
    "eng.urlHint":"Modèle d'URL : utilisez <strong>{q}</strong> pour le terme recherché &mdash; ex. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Raccourci d'ouverture",
    "sc.sub":"Choisissez la touche qui ouvre TapTap.",
    "sc.current":"Raccourci actuel",
    "sc.modeDouble":"⬡ Double appui",
    "sc.modeCombo":"⌨ Combinaison de touches",
    "sc.chooseDouble":"Choisissez la touche à appuyer deux fois",
    "sc.note400":"Appuyez deux fois sur la même touche en moins de 400 ms pour ouvrir.",
    "sc.chooseCombo":"Choisissez un modificateur + une touche",
    "sc.modifier":"Modificateur (obligatoire)",
    "sc.key":"Touche",
    "sc.doubleTap":"double appui",
    "sc.selectPrompt":"Sélectionnez un modificateur + une touche",

    "ap.title":"Apparence",
    "ap.sub":"Choisissez l'aspect de la fenêtre de recherche. La disposition et le fonctionnement restent identiques.",
    "ap.theme":"Thème",
    "ap.options":"Options",
    "ap.autoDark":"Mode sombre auto",
    "ap.autoDarkOn":"Suit le mode sombre du système.",
    "ap.autoDarkOff":"Inutilisé — le thème {theme} a un rendu clair/sombre fixe.",
    "ap.engineTint":"Teinte du moteur",
    "ap.tintOn":"Teinte toute la fenêtre avec la couleur du moteur sélectionné.",
    "ap.tintOff":"N'applique la couleur du moteur qu'au champ de recherche et au contour du moteur actif.",
    "ap.font":"Police",
    "ap.fontDesc":"Remplace la police par défaut du thème.",
    "ap.fontSystem":"Système", "ap.fontSerif":"Serif", "ap.fontMono":"Monospace",

    "theme.classic":"Caméléon",  "theme.classicDesc":"Suit la couleur du moteur sélectionné.",
    "theme.mono":"Mono",         "theme.monoDesc":"Noir et blanc neutre.",
    "theme.midnight":"Minuit",   "theme.midnightDesc":"Sombre, avec un violet discret.",
    "theme.glass":"Verre",       "theme.glassDesc":"Translucide, sur fond flouté.",
    "theme.paper":"Papier",      "theme.paperDesc":"Blanc cassé chaleureux, texte avec empattements.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Console sombre, vert et monospace.",

    "lang.title":"Langue",
    "lang.sub":"Choisissez la langue de TapTap.",
    "lang.label":"Langue",
    "lang.note":"S'applique à la fenêtre de recherche, aux noms des moteurs et à cette page de réglages.",
    "pv.stripLabel":"Aperçu de la barre de moteurs",
    "pv.none":"Aucun moteur activé.",

    "ui.save":"💾 Enregistrer",
    "ui.saved":"✓ Enregistré",
    "ui.saveFailed":"⚠ Échec de l'enregistrement — réglages trop volumineux. Supprimez quelques moteurs.",
    "ui.added":"Ajouté",
    "ui.iconChange":"Cliquez pour changer l'icône",
    "ui.typeOrPaste":"Saisissez ou collez",
    "ui.colorChange":"Cliquez pour changer la couleur",
    "ui.pickColor":"Choisir une couleur",
    "ui.openPalette":"Ouvrir la palette de couleurs",
    "ui.markAI":"Marquer comme moteur IA (affiche le badge IA)",
    "ui.moveUp":"Monter",
    "ui.moveDown":"Descendre",
    "ui.removeEngine":"Supprimer le moteur"
  },

  de: {
    "nav.engines":"Suchmaschinen", "nav.shortcut":"Tastenkürzel", "nav.appearance":"Darstellung",
    "nav.language":"Sprache <span class=\"navEn\">(Language)</span>", "nav.about":"Info",

    "ab.title":"Info",
    "ui.pageTitle":"TapTap - Quick Search — Einstellungen",
    "ab.sub":"TapTap - Quick Search — quelloffene Browser-Erweiterung",
    "ab.coffee":"☕ Spendier mir einen Kaffee",

    "eng.title":"Suchmaschinen",
    "eng.sub":"Suchmaschinen aktivieren, sortieren, umbenennen und einfärben.",
    "eng.recTitle":"Empfohlene Suchmaschinen",
    "eng.recAdd":"Auswahl hinzufügen",
    "eng.recSelected":"{n} ausgewählt",
    "eng.active":"Aktive Suchmaschinen",
    "eng.addName":"Name",
    "eng.addBtn":"+ Hinzufügen",
    "eng.colorLabel":"Farbe:",
    "eng.urlHint":"URL-Vorlage: <strong>{q}</strong> steht für den Suchbegriff &mdash; z. B. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Tastenkürzel zum Öffnen",
    "sc.sub":"Lege die Taste fest, die TapTap öffnet.",
    "sc.current":"Aktuelles Tastenkürzel",
    "sc.modeDouble":"⬡ Taste zweimal drücken",
    "sc.modeCombo":"⌨ Tastenkombination",
    "sc.chooseDouble":"Taste zum zweimaligen Drücken wählen",
    "sc.note400":"Dieselbe Taste zweimal innerhalb von 400 ms drücken, um zu öffnen.",
    "sc.chooseCombo":"Modifikatortaste + Taste wählen",
    "sc.modifier":"Modifikatortaste (erforderlich)",
    "sc.key":"Taste",
    "sc.doubleTap":"zweimal drücken",
    "sc.selectPrompt":"Modifikatortaste + Taste auswählen",

    "ap.title":"Darstellung",
    "ap.sub":"Bestimme das Aussehen des Suchfensters. Aufbau und Verhalten bleiben gleich.",
    "ap.theme":"Design",
    "ap.options":"Optionen",
    "ap.autoDark":"Automatischer Dunkelmodus",
    "ap.autoDarkOn":"Folgt dem Dunkelmodus des Systems.",
    "ap.autoDarkOff":"Nicht verwendet — das Design {theme} hat ein festes helles/dunkles Aussehen.",
    "ap.engineTint":"Einfärbung nach Suchmaschine",
    "ap.tintOn":"Färbt das gesamte Fenster in der Farbe der gewählten Suchmaschine.",
    "ap.tintOff":"Verwendet die Farbe nur für das Suchfeld und den Rahmen der aktiven Suchmaschine.",
    "ap.font":"Schrift",
    "ap.fontDesc":"Überschreibt die Standardschrift des Designs.",
    "ap.fontSystem":"System", "ap.fontSerif":"Serif", "ap.fontMono":"Monospace",

    "theme.classic":"Chamäleon", "theme.classicDesc":"Folgt der Farbe der gewählten Suchmaschine.",
    "theme.mono":"Mono",         "theme.monoDesc":"Neutrales Schwarzweiß.",
    "theme.midnight":"Mitternacht","theme.midnightDesc":"Dunkel, mit gedämpftem Violett.",
    "theme.glass":"Glas",        "theme.glassDesc":"Durchscheinend, mit unscharfem Hintergrund.",
    "theme.paper":"Papier",      "theme.paperDesc":"Warmes Cremeweiß, Serifenschrift.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Dunkle Konsole, Grün und Monospace.",

    "lang.title":"Sprache",
    "lang.sub":"Lege die Sprache von TapTap fest.",
    "lang.label":"Sprache",
    "lang.note":"Gilt für das Suchfenster, die Namen der Suchmaschinen und diese Einstellungsseite.",
    "pv.stripLabel":"Vorschau der Suchmaschinenleiste",
    "pv.none":"Keine Suchmaschine aktiviert.",

    "ui.save":"💾 Speichern",
    "ui.saved":"✓ Gespeichert",
    "ui.saveFailed":"⚠ Speichern fehlgeschlagen — Einstellungen zu groß. Entferne ein paar Suchmaschinen.",
    "ui.added":"Hinzugefügt",
    "ui.iconChange":"Klicken, um das Symbol zu ändern",
    "ui.typeOrPaste":"Eingeben oder einfügen",
    "ui.colorChange":"Klicken, um die Farbe zu ändern",
    "ui.pickColor":"Farbe wählen",
    "ui.openPalette":"Farbpalette öffnen",
    "ui.markAI":"Als KI-Suchmaschine markieren (zeigt KI-Abzeichen)",
    "ui.moveUp":"Nach oben",
    "ui.moveDown":"Nach unten",
    "ui.removeEngine":"Suchmaschine entfernen"
  },

  ru: {
    "nav.engines":"Поисковые системы", "nav.shortcut":"Горячая клавиша", "nav.appearance":"Оформление",
    "nav.language":"Язык <span class=\"navEn\">(Language)</span>", "nav.about":"О расширении",

    "ab.title":"О расширении",
    "ui.pageTitle":"TapTap - Quick Search — Настройки",
    "ab.sub":"TapTap - Quick Search — расширение браузера с открытым кодом",
    "ab.coffee":"☕ Купить мне кофе",

    "eng.title":"Поисковые системы",
    "eng.sub":"Включайте, меняйте порядок, переименовывайте системы и задавайте им цвет.",
    "eng.recTitle":"Рекомендуемые системы",
    "eng.recAdd":"Добавить выбранные",
    "eng.recSelected":"Выбрано: {n}",
    "eng.active":"Активные системы",
    "eng.addName":"Название",
    "eng.addBtn":"+ Добавить",
    "eng.colorLabel":"Цвет:",
    "eng.urlHint":"Шаблон URL: используйте <strong>{q}</strong> вместо поискового запроса &mdash; например <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Клавиша вызова",
    "sc.sub":"Выберите клавишу, которая открывает TapTap.",
    "sc.current":"Текущая комбинация",
    "sc.modeDouble":"⬡ Двойное нажатие",
    "sc.modeCombo":"⌨ Сочетание клавиш",
    "sc.chooseDouble":"Выберите клавишу для двойного нажатия",
    "sc.note400":"Нажмите одну и ту же клавишу дважды в течение 400 мс, чтобы открыть.",
    "sc.chooseCombo":"Выберите модификатор + клавишу",
    "sc.modifier":"Модификатор (обязательно)",
    "sc.key":"Клавиша",
    "sc.doubleTap":"двойное нажатие",
    "sc.selectPrompt":"Выберите модификатор и клавишу",

    "ap.title":"Оформление",
    "ap.sub":"Выберите внешний вид окна поиска. Расположение и поведение не меняются.",
    "ap.theme":"Тема",
    "ap.options":"Параметры",
    "ap.autoDark":"Авто-тёмная тема",
    "ap.autoDarkOn":"Следует тёмному режиму системы.",
    "ap.autoDarkOff":"Не используется — у темы {theme} фиксированная светлота.",
    "ap.engineTint":"Цвет поисковой системы",
    "ap.tintOn":"Окрашивает всё окно в цвет выбранной системы.",
    "ap.tintOff":"Использует цвет системы только для поля поиска и рамки активной системы.",
    "ap.font":"Шрифт",
    "ap.fontDesc":"Заменяет шрифт темы по умолчанию.",
    "ap.fontSystem":"Системный", "ap.fontSerif":"С засечками", "ap.fontMono":"Моноширинный",

    "theme.classic":"Хамелеон",  "theme.classicDesc":"Следует цвету выбранной системы.",
    "theme.mono":"Моно",         "theme.monoDesc":"Нейтральный чёрно-белый.",
    "theme.midnight":"Полночь",  "theme.midnightDesc":"Тёмный, с приглушённым фиолетовым.",
    "theme.glass":"Стекло",      "theme.glassDesc":"Полупрозрачный, с размытым фоном.",
    "theme.paper":"Бумага",      "theme.paperDesc":"Тёплый белый, шрифт с засечками.",
    "theme.terminal":"Терминал", "theme.terminalDesc":"Тёмная консоль, зелёный моноширинный.",

    "lang.title":"Язык",
    "lang.sub":"Выберите язык TapTap.",
    "lang.label":"Язык",
    "lang.note":"Применяется к окну поиска, названиям систем и этой странице настроек.",
    "pv.stripLabel":"Предпросмотр панели систем",
    "pv.none":"Нет включённых систем.",

    "ui.save":"💾 Сохранить",
    "ui.saved":"✓ Сохранено",
    "ui.saveFailed":"⚠ Не удалось сохранить — настройки слишком велики. Удалите несколько систем.",
    "ui.added":"Добавлено",
    "ui.iconChange":"Нажмите, чтобы сменить значок",
    "ui.typeOrPaste":"Введите или вставьте",
    "ui.colorChange":"Нажмите, чтобы сменить цвет",
    "ui.pickColor":"Выбрать цвет",
    "ui.openPalette":"Открыть палитру",
    "ui.markAI":"Отметить как ИИ-систему (показывает значок AI)",
    "ui.moveUp":"Вверх",
    "ui.moveDown":"Вниз",
    "ui.removeEngine":"Удалить систему"
  },

  vn: {
    "nav.engines":"Công cụ tìm kiếm", "nav.shortcut":"Phím tắt", "nav.appearance":"Giao diện",
    "nav.language":"Ngôn ngữ <span class=\"navEn\">(Language)</span>", "nav.about":"Giới thiệu",

    "ab.title":"Giới thiệu",
    "ui.pageTitle":"TapTap - Quick Search — Cài đặt",
    "ab.sub":"TapTap - Quick Search — tiện ích trình duyệt mã nguồn mở",
    "ab.coffee":"☕ Mời tôi một ly cà phê",

    "eng.title":"Công cụ tìm kiếm",
    "eng.sub":"Bật, sắp xếp, đổi tên và chọn màu cho các công cụ tìm kiếm.",
    "eng.recTitle":"Công cụ gợi ý",
    "eng.recAdd":"Thêm mục đã chọn",
    "eng.recSelected":"Đã chọn {n}",
    "eng.active":"Công cụ đang dùng",
    "eng.addName":"Tên",
    "eng.addBtn":"+ Thêm",
    "eng.colorLabel":"Màu:",
    "eng.urlHint":"Mẫu URL: dùng <strong>{q}</strong> cho từ khoá tìm kiếm &mdash; ví dụ <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Phím mở TapTap",
    "sc.sub":"Chọn phím để mở TapTap.",
    "sc.current":"Phím tắt hiện tại",
    "sc.modeDouble":"⬡ Nhấn đúp một phím",
    "sc.modeCombo":"⌨ Tổ hợp phím",
    "sc.chooseDouble":"Chọn phím để nhấn hai lần",
    "sc.note400":"Nhấn cùng một phím hai lần trong vòng 400 ms để mở.",
    "sc.chooseCombo":"Chọn phím bổ trợ + phím",
    "sc.modifier":"Phím bổ trợ (bắt buộc)",
    "sc.key":"Phím",
    "sc.doubleTap":"nhấn hai lần",
    "sc.selectPrompt":"Hãy chọn phím bổ trợ và phím",

    "ap.title":"Giao diện",
    "ap.sub":"Chọn kiểu hiển thị của cửa sổ tìm kiếm. Bố cục và cách hoạt động giữ nguyên.",
    "ap.theme":"Chủ đề",
    "ap.options":"Tuỳ chọn",
    "ap.autoDark":"Tự động nền tối",
    "ap.autoDarkOn":"Theo chế độ tối của hệ thống.",
    "ap.autoDarkOff":"Không dùng — chủ đề {theme} có độ sáng tối cố định.",
    "ap.engineTint":"Nhuộm màu theo công cụ",
    "ap.tintOn":"Nhuộm toàn bộ cửa sổ theo màu của công cụ đang chọn.",
    "ap.tintOff":"Chỉ dùng màu công cụ cho ô tìm kiếm và viền công cụ đang chọn.",
    "ap.font":"Phông chữ",
    "ap.fontDesc":"Thay phông chữ mặc định của chủ đề.",
    "ap.fontSystem":"Hệ thống", "ap.fontSerif":"Có chân", "ap.fontMono":"Đều nét",

    "theme.classic":"Tắc kè hoa", "theme.classicDesc":"Theo màu của công cụ đang chọn.",
    "theme.mono":"Đơn sắc",      "theme.monoDesc":"Đen trắng trung tính.",
    "theme.midnight":"Nửa đêm",  "theme.midnightDesc":"Nền tối với sắc tím dịu.",
    "theme.glass":"Kính",        "theme.glassDesc":"Trong mờ, nền phía sau bị làm nhoè.",
    "theme.paper":"Giấy",        "theme.paperDesc":"Trắng ngà ấm, chữ có chân.",
    "theme.terminal":"Dòng lệnh","theme.terminalDesc":"Nền đen, chữ xanh lá đều nét.",

    "lang.title":"Ngôn ngữ",
    "lang.sub":"Chọn ngôn ngữ cho TapTap.",
    "lang.label":"Ngôn ngữ",
    "lang.note":"Áp dụng cho cửa sổ tìm kiếm, tên công cụ và trang cài đặt này.",
    "pv.stripLabel":"Xem trước thanh công cụ",
    "pv.none":"Chưa bật công cụ nào.",

    "ui.save":"💾 Lưu",
    "ui.saved":"✓ Đã lưu",
    "ui.saveFailed":"⚠ Lưu thất bại — cài đặt quá lớn. Hãy xoá bớt vài công cụ.",
    "ui.added":"Đã thêm",
    "ui.iconChange":"Nhấn để đổi biểu tượng",
    "ui.typeOrPaste":"Nhập hoặc dán",
    "ui.colorChange":"Nhấn để đổi màu",
    "ui.pickColor":"Chọn màu",
    "ui.openPalette":"Mở bảng màu",
    "ui.markAI":"Đánh dấu là công cụ AI (hiện huy hiệu AI)",
    "ui.moveUp":"Lên",
    "ui.moveDown":"Xuống",
    "ui.removeEngine":"Xoá công cụ"
  },

  ms: {
    "nav.engines":"Enjin Carian", "nav.shortcut":"Pintasan", "nav.appearance":"Penampilan",
    "nav.language":"Bahasa <span class=\"navEn\">(Language)</span>", "nav.about":"Perihal",

    "ab.title":"Perihal",
    "ui.pageTitle":"TapTap - Quick Search — Tetapan",
    "ab.sub":"TapTap - Quick Search — sambungan pelayar sumber terbuka",
    "ab.coffee":"☕ Belanja saya kopi",

    "eng.title":"Enjin Carian",
    "eng.sub":"Aktifkan, susun semula, namakan semula dan warnakan enjin anda.",
    "eng.recTitle":"Enjin disyorkan",
    "eng.recAdd":"Tambah pilihan",
    "eng.recSelected":"{n} dipilih",
    "eng.active":"Enjin Aktif",
    "eng.addName":"Nama",
    "eng.addBtn":"+ Tambah",
    "eng.colorLabel":"Warna:",
    "eng.urlHint":"Templat URL: guna <strong>{q}</strong> untuk istilah carian &mdash; cth. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Pintasan Pembuka",
    "sc.sub":"Tetapkan kekunci yang membuka TapTap.",
    "sc.current":"Pintasan Semasa",
    "sc.modeDouble":"⬡ Tekan dua kali",
    "sc.modeCombo":"⌨ Gabungan kekunci",
    "sc.chooseDouble":"Pilih kekunci untuk ditekan dua kali",
    "sc.note400":"Tekan kekunci yang sama dua kali dalam 400 ms untuk membuka.",
    "sc.chooseCombo":"Pilih pengubah suai + kekunci",
    "sc.modifier":"Pengubah suai (wajib)",
    "sc.key":"Kekunci",
    "sc.doubleTap":"tekan dua kali",
    "sc.selectPrompt":"Pilih pengubah suai + kekunci",

    "ap.title":"Penampilan",
    "ap.sub":"Pilih rupa tetingkap carian. Susun atur dan kelakuan kekal sama.",
    "ap.theme":"Tema",
    "ap.options":"Pilihan",
    "ap.autoDark":"Gelap automatik",
    "ap.autoDarkOn":"Mengikut mod gelap sistem anda.",
    "ap.autoDarkOff":"Tidak digunakan — tema {theme} mempunyai rupa cerah/gelap yang tetap.",
    "ap.engineTint":"Warna enjin",
    "ap.tintOn":"Warnakan seluruh tetingkap dengan warna enjin yang dipilih.",
    "ap.tintOff":"Guna warna enjin hanya pada kotak carian dan bingkai enjin aktif.",
    "ap.font":"Fon",
    "ap.fontDesc":"Ganti fon lalai tema.",
    "ap.fontSystem":"Sistem", "ap.fontSerif":"Serif", "ap.fontMono":"Monospace",

    "theme.classic":"Bunglon",   "theme.classicDesc":"Mengikut warna enjin yang dipilih.",
    "theme.mono":"Mono",         "theme.monoDesc":"Hitam putih neutral.",
    "theme.midnight":"Tengah Malam","theme.midnightDesc":"Gelap, dengan ungu lembut.",
    "theme.glass":"Kaca",        "theme.glassDesc":"Lut sinar dengan latar kabur.",
    "theme.paper":"Kertas",      "theme.paperDesc":"Putih pudar hangat, teks serif.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Konsol gelap, hijau monospace.",

    "lang.title":"Bahasa",
    "lang.sub":"Tetapkan bahasa TapTap.",
    "lang.label":"Bahasa",
    "lang.note":"Digunakan pada tetingkap carian, nama enjin dan halaman tetapan ini.",
    "pv.stripLabel":"Pratonton Jalur Enjin",
    "pv.none":"Tiada enjin diaktifkan.",

    "ui.save":"💾 Simpan",
    "ui.saved":"✓ Disimpan",
    "ui.saveFailed":"⚠ Gagal menyimpan — tetapan terlalu besar. Buang beberapa enjin.",
    "ui.added":"Ditambah",
    "ui.iconChange":"Klik untuk menukar ikon",
    "ui.typeOrPaste":"Taip atau tampal",
    "ui.colorChange":"Klik untuk menukar warna",
    "ui.pickColor":"Pilih warna",
    "ui.openPalette":"Buka palet warna",
    "ui.markAI":"Tanda sebagai enjin AI (menunjukkan lencana AI)",
    "ui.moveUp":"Naik",
    "ui.moveDown":"Turun",
    "ui.removeEngine":"Buang enjin"
  },

  th: {
    "nav.engines":"เครื่องมือค้นหา", "nav.shortcut":"ปุ่มลัด", "nav.appearance":"รูปลักษณ์",
    "nav.language":"ภาษา <span class=\"navEn\">(Language)</span>", "nav.about":"เกี่ยวกับ",

    "ab.title":"เกี่ยวกับ",
    "ui.pageTitle":"TapTap - Quick Search — การตั้งค่า",
    "ab.sub":"TapTap - Quick Search — ส่วนขยายเบราว์เซอร์โอเพนซอร์ส",
    "ab.coffee":"☕ เลี้ยงกาแฟสักแก้ว",

    "eng.title":"เครื่องมือค้นหา",
    "eng.sub":"เปิดใช้ จัดลำดับ เปลี่ยนชื่อ และกำหนดสีให้เครื่องมือค้นหาของคุณ",
    "eng.recTitle":"เครื่องมือค้นหาแนะนำ",
    "eng.recAdd":"เพิ่มรายการที่เลือก",
    "eng.recSelected":"เลือกแล้ว {n} รายการ",
    "eng.active":"เครื่องมือค้นหาที่ใช้อยู่",
    "eng.addName":"ชื่อ",
    "eng.addBtn":"+ เพิ่ม",
    "eng.colorLabel":"สี:",
    "eng.urlHint":"รูปแบบ URL: ใช้ <strong>{q}</strong> แทนคำค้นหา &mdash; เช่น <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"ปุ่มลัดเรียกใช้",
    "sc.sub":"กำหนดปุ่มที่ใช้เปิด TapTap",
    "sc.current":"ปุ่มลัดปัจจุบัน",
    "sc.modeDouble":"⬡ กดปุ่มเดิมสองครั้ง",
    "sc.modeCombo":"⌨ ปุ่มผสม",
    "sc.chooseDouble":"เลือกปุ่มที่จะกดสองครั้ง",
    "sc.note400":"กดปุ่มเดิมสองครั้งภายใน 400 มิลลิวินาทีเพื่อเปิด",
    "sc.chooseCombo":"เลือกปุ่มปรับ + ปุ่ม",
    "sc.modifier":"ปุ่มปรับ (จำเป็น)",
    "sc.key":"ปุ่ม",
    "sc.doubleTap":"กดสองครั้ง",
    "sc.selectPrompt":"เลือกปุ่มปรับและปุ่ม",

    "ap.title":"รูปลักษณ์",
    "ap.sub":"เลือกหน้าตาของหน้าต่างค้นหา การจัดวางและการทำงานยังคงเดิม",
    "ap.theme":"ธีม",
    "ap.options":"ตัวเลือก",
    "ap.autoDark":"โหมดมืดอัตโนมัติ",
    "ap.autoDarkOn":"ทำตามโหมดมืดของระบบ",
    "ap.autoDarkOff":"ไม่ได้ใช้ — ธีม {theme} มีความสว่างคงที่",
    "ap.engineTint":"ไล่สีตามเครื่องมือค้นหา",
    "ap.tintOn":"ไล่สีทั้งหน้าต่างตามสีของเครื่องมือค้นหาที่เลือก",
    "ap.tintOff":"ใช้สีเครื่องมือค้นหาเฉพาะกับช่องค้นหาและกรอบของเครื่องมือที่เลือก",
    "ap.font":"แบบอักษร",
    "ap.fontDesc":"ใช้แบบอักษรอื่นแทนค่าเริ่มต้นของธีม",
    "ap.fontSystem":"ระบบ", "ap.fontSerif":"มีเชิง", "ap.fontMono":"ความกว้างคงที่",

    "theme.classic":"กิ้งก่า",    "theme.classicDesc":"เปลี่ยนตามสีของเครื่องมือค้นหาที่เลือก",
    "theme.mono":"ขาวดำ",       "theme.monoDesc":"ขาวดำแบบกลาง ๆ",
    "theme.midnight":"เที่ยงคืน", "theme.midnightDesc":"พื้นมืดกับสีม่วงนวล",
    "theme.glass":"กระจก",      "theme.glassDesc":"โปร่งแสง พื้นหลังเบลอ",
    "theme.paper":"กระดาษ",     "theme.paperDesc":"สีขาวนวลอบอุ่น ตัวอักษรมีเชิง",
    "theme.terminal":"เทอร์มินัล","theme.terminalDesc":"คอนโซลสีดำ ตัวอักษรเขียวความกว้างคงที่",

    "lang.title":"ภาษา",
    "lang.sub":"กำหนดภาษาของ TapTap",
    "lang.label":"ภาษา",
    "lang.note":"มีผลกับหน้าต่างค้นหา ชื่อเครื่องมือค้นหา และหน้าตั้งค่านี้",
    "pv.stripLabel":"ตัวอย่างแถบเครื่องมือค้นหา",
    "pv.none":"ยังไม่ได้เปิดใช้เครื่องมือค้นหาใด",

    "ui.save":"💾 บันทึก",
    "ui.saved":"✓ บันทึกแล้ว",
    "ui.saveFailed":"⚠ บันทึกไม่สำเร็จ — การตั้งค่าใหญ่เกินไป กรุณาลบเครื่องมือค้นหาออกบ้าง",
    "ui.added":"เพิ่มแล้ว",
    "ui.iconChange":"คลิกเพื่อเปลี่ยนไอคอน",
    "ui.typeOrPaste":"พิมพ์หรือวาง",
    "ui.colorChange":"คลิกเพื่อเปลี่ยนสี",
    "ui.pickColor":"เลือกสี",
    "ui.openPalette":"เปิดจานสี",
    "ui.markAI":"ทำเครื่องหมายเป็นเครื่องมือ AI (แสดงป้าย AI)",
    "ui.moveUp":"เลื่อนขึ้น",
    "ui.moveDown":"เลื่อนลง",
    "ui.removeEngine":"ลบเครื่องมือค้นหา"
  },

  id: {
    "nav.engines":"Mesin Pencari", "nav.shortcut":"Pintasan", "nav.appearance":"Tampilan",
    "nav.language":"Bahasa <span class=\"navEn\">(Language)</span>", "nav.about":"Tentang",

    "ab.title":"Tentang",
    "ui.pageTitle":"TapTap - Quick Search — Pengaturan",
    "ab.sub":"TapTap - Quick Search — ekstensi peramban sumber terbuka",
    "ab.coffee":"☕ Traktir saya kopi",

    "eng.title":"Mesin Pencari",
    "eng.sub":"Aktifkan, urutkan, ganti nama, dan beri warna mesin pencari Anda.",
    "eng.recTitle":"Mesin pencari yang disarankan",
    "eng.recAdd":"Tambahkan yang dipilih",
    "eng.recSelected":"{n} dipilih",
    "eng.active":"Mesin Pencari Aktif",
    "eng.addName":"Nama",
    "eng.addBtn":"+ Tambah",
    "eng.colorLabel":"Warna:",
    "eng.urlHint":"Templat URL: gunakan <strong>{q}</strong> untuk kata kunci &mdash; mis. <code>https://www.google.com/search?q={q}</code>",

    "sc.title":"Pintasan Pembuka",
    "sc.sub":"Tentukan tombol yang membuka TapTap.",
    "sc.current":"Pintasan Saat Ini",
    "sc.modeDouble":"⬡ Tekan dua kali",
    "sc.modeCombo":"⌨ Kombinasi tombol",
    "sc.chooseDouble":"Pilih tombol untuk ditekan dua kali",
    "sc.note400":"Tekan tombol yang sama dua kali dalam 400 md untuk membuka.",
    "sc.chooseCombo":"Pilih pengubah + tombol",
    "sc.modifier":"Pengubah (wajib)",
    "sc.key":"Tombol",
    "sc.doubleTap":"tekan dua kali",
    "sc.selectPrompt":"Pilih pengubah + tombol",

    "ap.title":"Tampilan",
    "ap.sub":"Pilih tampilan jendela pencarian. Tata letak dan cara kerjanya tetap sama.",
    "ap.theme":"Tema",
    "ap.options":"Opsi",
    "ap.autoDark":"Gelap otomatis",
    "ap.autoDarkOn":"Mengikuti mode gelap sistem Anda.",
    "ap.autoDarkOff":"Tidak dipakai — tema {theme} punya tampilan terang/gelap yang tetap.",
    "ap.engineTint":"Warna mesin pencari",
    "ap.tintOn":"Warnai seluruh jendela dengan warna mesin pencari yang dipilih.",
    "ap.tintOff":"Pakai warna mesin pencari hanya pada kotak pencarian dan garis tepi mesin aktif.",
    "ap.font":"Font",
    "ap.fontDesc":"Ganti font bawaan tema.",
    "ap.fontSystem":"Sistem", "ap.fontSerif":"Serif", "ap.fontMono":"Monospace",

    "theme.classic":"Bunglon",   "theme.classicDesc":"Mengikuti warna mesin pencari yang dipilih.",
    "theme.mono":"Mono",         "theme.monoDesc":"Hitam putih netral.",
    "theme.midnight":"Tengah Malam","theme.midnightDesc":"Gelap dengan ungu lembut.",
    "theme.glass":"Kaca",        "theme.glassDesc":"Tembus pandang dengan latar buram.",
    "theme.paper":"Kertas",      "theme.paperDesc":"Putih gading hangat, teks serif.",
    "theme.terminal":"Terminal", "theme.terminalDesc":"Konsol gelap, hijau monospace.",

    "lang.title":"Bahasa",
    "lang.sub":"Tentukan bahasa TapTap.",
    "lang.label":"Bahasa",
    "lang.note":"Berlaku untuk jendela pencarian, nama mesin pencari, dan halaman pengaturan ini.",
    "pv.stripLabel":"Pratinjau Bilah Mesin Pencari",
    "pv.none":"Tidak ada mesin pencari yang aktif.",

    "ui.save":"💾 Simpan",
    "ui.saved":"✓ Tersimpan",
    "ui.saveFailed":"⚠ Gagal menyimpan — pengaturan terlalu besar. Hapus beberapa mesin pencari.",
    "ui.added":"Ditambahkan",
    "ui.iconChange":"Klik untuk mengganti ikon",
    "ui.typeOrPaste":"Ketik atau tempel",
    "ui.colorChange":"Klik untuk mengganti warna",
    "ui.pickColor":"Pilih warna",
    "ui.openPalette":"Buka palet warna",
    "ui.markAI":"Tandai sebagai mesin AI (menampilkan lencana AI)",
    "ui.moveUp":"Naik",
    "ui.moveDown":"Turun",
    "ui.removeEngine":"Hapus mesin pencari"
  }

};


// =====================================================================
// About 탭 산문 — 언어별 통 HTML
//
// 문장 단위로 쪼개 번역하지 않는 이유:
//   About 은 사실상 서비스 설명이다. 스토어 설명은 영어뿐이라, 비영어권
//   사용자가 이 확장이 뭘 하는지 자기 언어로 읽을 수 있는 곳은 여기뿐이다.
//   산문을 문장 단위로 나눠 끼우면 언어마다 어순이 안 맞아 번역투가 된다.
//
// 헤더 카드(로고/버전/링크)는 options.html 에 정적으로 남겨뒀다.
// GitHub 아이콘 SVG 가 커서 13벌 복제하면 파일만 커진다.
//
// 스타일은 .abtP / .abtList / .abtSteps / .abtKbd / .abtKbdA 클래스를 쓴다.
// 인라인 스타일로 두면 그것도 13벌 복제된다.
// =====================================================================

const ABOUT_HTML = {

  en: `
      <div class="card">
        <div class="cardTitle">What is TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> is a lightweight Chrome extension for searching the web without leaving the page you are on. Press <kbd class="abtKbdA">Shift</kbd> twice and a search box appears on top of the page. Type your query and press Enter.</p>
        <p class="abtP">It takes the idea of the quick search box from the old Opera browser and rebuilds it for today's web: AI search engines, engines you define yourself, and a keyboard-first design.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Features</div>
        <ul class="abtList">
          <li><strong>⚡ Opens anywhere</strong> — double-tap Shift, or set your own shortcut</li>
          <li><strong>🤖 AI search built in</strong> — Perplexity, ChatGPT and Claude are ready to use</li>
          <li><strong>🖱️ Switch by mouse wheel</strong> — scroll on the popup to change engine</li>
          <li><strong>📝 Uses selected text</strong> — select text on a page, then open TapTap to search it</li>
          <li><strong>🕐 Search history</strong> — recent searches appear as you type</li>
          <li><strong>🎨 6 themes</strong> — Chameleon, Mono, Midnight, Glass, Paper and Terminal</li>
          <li><strong>🌈 A color per engine</strong> — 9 palettes, or your own hex code</li>
          <li><strong>➕ 27 recommended engines</strong> — add them in one click, or add your own</li>
          <li><strong>🌐 13 languages</strong> — English, Korean, Japanese, Chinese and more</li>
          <li><strong>🔒 Collects nothing</strong> — settings stay in your browser. No server, no tracking.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 How to use</div>
        <ol class="abtSteps">
          <li>Press <kbd class="abtKbdA">Shift</kbd> twice on any web page</li>
          <li>Type your query — or it is already filled in if you had selected text</li>
          <li>Change engine with <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> or the mouse wheel</li>
          <li><kbd class="abtKbd">Enter</kbd> to search, <kbd class="abtKbd">Esc</kbd> to close</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 License &amp; Credits</div>
        <p class="abtP">Released under the <strong>MIT License</strong>. Free to use, modify and share.</p>
        <p class="abtP" style="color:var(--muted)">Built by <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Contributions are welcome on GitHub &nbsp;·&nbsp; Found a bug? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Open an issue</a></p>
      </div>`,

  kr: `
      <div class="card">
        <div class="cardTitle">TapTap 이란?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> 는 보던 페이지를 벗어나지 않고 검색할 수 있게 해주는 가벼운 크롬 확장입니다. <kbd class="abtKbdA">Shift</kbd> 를 두 번 누르면 페이지 위에 검색창이 뜹니다. 검색어를 입력하고 엔터를 누르면 끝입니다.</p>
        <p class="abtP">예전 오페라 브라우저의 빠른 검색창에서 아이디어를 가져와 요즘 웹에 맞게 다시 만들었습니다. AI 검색 엔진, 직접 등록하는 엔진, 키보드 위주의 조작을 갖췄습니다.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ 기능</div>
        <ul class="abtList">
          <li><strong>⚡ 어디서나 열림</strong> — Shift 두 번, 또는 원하는 단축키로</li>
          <li><strong>🤖 AI 검색 내장</strong> — Perplexity, ChatGPT, Claude 를 바로 사용</li>
          <li><strong>🖱️ 휠로 엔진 전환</strong> — 팝업 위에서 스크롤하면 엔진이 바뀜</li>
          <li><strong>📝 선택한 글자로 검색</strong> — 페이지에서 글자를 드래그한 뒤 열면 자동으로 채워짐</li>
          <li><strong>🕐 검색 기록</strong> — 입력하는 동안 최근 검색어가 나타남</li>
          <li><strong>🎨 테마 6종</strong> — 카멜레온, 모노, 미드나이트, 글래스, 페이퍼, 터미널</li>
          <li><strong>🌈 엔진마다 색상</strong> — 팔레트 9종, 또는 직접 지정하는 hex 코드</li>
          <li><strong>➕ 추천 엔진 27개</strong> — 클릭 한 번으로 추가, 직접 추가도 가능</li>
          <li><strong>🌐 13개 언어</strong> — 한국어, 영어, 일본어, 중국어 등</li>
          <li><strong>🔒 아무것도 수집하지 않음</strong> — 설정은 브라우저 안에만. 서버도 추적도 없음</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 사용법</div>
        <ol class="abtSteps">
          <li>아무 웹페이지에서 <kbd class="abtKbdA">Shift</kbd> 를 두 번 누릅니다</li>
          <li>검색어를 입력합니다 — 글자를 선택해 뒀다면 이미 채워져 있습니다</li>
          <li><kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> 또는 마우스 휠로 엔진을 바꿉니다</li>
          <li><kbd class="abtKbd">Enter</kbd> 로 검색, <kbd class="abtKbd">Esc</kbd> 로 닫기</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 라이선스 &amp; 만든 사람</div>
        <p class="abtP"><strong>MIT 라이선스</strong>로 공개돼 있습니다. 자유롭게 쓰고, 고치고, 나눠도 됩니다.</p>
        <p class="abtP" style="color:var(--muted)">만든 사람 <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; GitHub 에서 기여를 환영합니다 &nbsp;·&nbsp; 버그를 찾으셨나요? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">이슈 남기기</a></p>
      </div>`,

  ja: `
      <div class="card">
        <div class="cardTitle">TapTap とは?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> は、今見ているページを離れずに検索できる軽量な Chrome 拡張機能です。<kbd class="abtKbdA">Shift</kbd> を2回押すとページの上に検索ボックスが現れます。検索語を入力して Enter を押すだけです。</p>
        <p class="abtP">かつての Opera ブラウザのクイック検索ボックスの発想を、今のウェブに合わせて作り直しました。AI 検索エンジン、自分で登録するエンジン、キーボード中心の操作を備えています。</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ 機能</div>
        <ul class="abtList">
          <li><strong>⚡ どこでも開く</strong> — Shift 2回、または好きなショートカットで</li>
          <li><strong>🤖 AI 検索を内蔵</strong> — Perplexity、ChatGPT、Claude をすぐ使える</li>
          <li><strong>🖱️ ホイールで切り替え</strong> — ポップアップ上でスクロールするとエンジンが変わる</li>
          <li><strong>📝 選択した文字で検索</strong> — ページで文字を選んでから開くと自動で入る</li>
          <li><strong>🕐 検索履歴</strong> — 入力中に最近の検索語が出る</li>
          <li><strong>🎨 テーマ6種</strong> — カメレオン、モノ、ミッドナイト、グラス、ペーパー、ターミナル</li>
          <li><strong>🌈 エンジンごとの色</strong> — パレット9種、または自分で決める hex コード</li>
          <li><strong>➕ おすすめエンジン27件</strong> — ワンクリックで追加、自分で追加もできる</li>
          <li><strong>🌐 13言語</strong> — 日本語、英語、韓国語、中国語など</li>
          <li><strong>🔒 何も集めない</strong> — 設定はブラウザの中だけ。サーバーも追跡もなし</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 使い方</div>
        <ol class="abtSteps">
          <li>どのウェブページでも <kbd class="abtKbdA">Shift</kbd> を2回押します</li>
          <li>検索語を入力します — 文字を選んでいた場合はすでに入っています</li>
          <li><kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> かマウスホイールでエンジンを変えます</li>
          <li><kbd class="abtKbd">Enter</kbd> で検索、<kbd class="abtKbd">Esc</kbd> で閉じる</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 ライセンスとクレジット</div>
        <p class="abtP"><strong>MIT ライセンス</strong>で公開しています。自由に使い、改変し、共有できます。</p>
        <p class="abtP" style="color:var(--muted)">制作 <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; GitHub での貢献を歓迎します &nbsp;·&nbsp; バグを見つけたら <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Issue を作成</a></p>
      </div>`,

  "zh-CN": `
      <div class="card">
        <div class="cardTitle">TapTap 是什么？</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> 是一个轻量的 Chrome 扩展，让你不用离开当前页面就能搜索。连按两次 <kbd class="abtKbdA">Shift</kbd>，搜索框就会出现在页面上方。输入内容按回车即可。</p>
        <p class="abtP">它借鉴了早期 Opera 浏览器的快速搜索框，并针对今天的网络重新打造：内置 AI 搜索引擎，可自行添加引擎，操作以键盘为主。</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ 功能</div>
        <ul class="abtList">
          <li><strong>⚡ 随处可开</strong> —— 连按两次 Shift，或自定义快捷键</li>
          <li><strong>🤖 内置 AI 搜索</strong> —— Perplexity、ChatGPT、Claude 开箱即用</li>
          <li><strong>🖱️ 滚轮切换</strong> —— 在弹窗上滚动即可更换引擎</li>
          <li><strong>📝 使用选中的文字</strong> —— 先在页面选中文字，再打开 TapTap 即自动填入</li>
          <li><strong>🕐 搜索历史</strong> —— 输入时显示最近搜索过的内容</li>
          <li><strong>🎨 6 种主题</strong> —— 变色龙、单色、午夜、玻璃、纸张、终端</li>
          <li><strong>🌈 每个引擎一种颜色</strong> —— 9 组配色，或自定义十六进制色值</li>
          <li><strong>➕ 27 个推荐引擎</strong> —— 一键添加，也可自行添加</li>
          <li><strong>🌐 13 种语言</strong> —— 中文、英文、韩文、日文等</li>
          <li><strong>🔒 不收集任何数据</strong> —— 设置只保存在你的浏览器里。没有服务器，没有追踪。</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 使用方法</div>
        <ol class="abtSteps">
          <li>在任意网页上连按两次 <kbd class="abtKbdA">Shift</kbd></li>
          <li>输入搜索内容 —— 如果事先选中了文字，则已自动填入</li>
          <li>用 <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> 或滚轮切换引擎</li>
          <li><kbd class="abtKbd">Enter</kbd> 搜索，<kbd class="abtKbd">Esc</kbd> 关闭</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 许可与致谢</div>
        <p class="abtP">以 <strong>MIT 许可证</strong>发布。可自由使用、修改和分享。</p>
        <p class="abtP" style="color:var(--muted)">由 <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> 开发 &nbsp;·&nbsp; 欢迎在 GitHub 上参与贡献 &nbsp;·&nbsp; 发现问题？<a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">提交 issue</a></p>
      </div>`,

  "zh-TW": `
      <div class="card">
        <div class="cardTitle">TapTap 是什麼？</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> 是一個輕量的 Chrome 擴充功能，讓你不必離開目前的頁面就能搜尋。連按兩次 <kbd class="abtKbdA">Shift</kbd>，搜尋框就會出現在頁面上方。輸入內容按下 Enter 即可。</p>
        <p class="abtP">它借鑒了早期 Opera 瀏覽器的快速搜尋框，並為今天的網路重新打造：內建 AI 搜尋引擎、可自行新增引擎，操作以鍵盤為主。</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ 功能</div>
        <ul class="abtList">
          <li><strong>⚡ 隨處可開</strong> —— 連按兩次 Shift，或自訂快速鍵</li>
          <li><strong>🤖 內建 AI 搜尋</strong> —— Perplexity、ChatGPT、Claude 立即可用</li>
          <li><strong>🖱️ 滾輪切換</strong> —— 在彈出視窗上捲動即可更換引擎</li>
          <li><strong>📝 使用選取的文字</strong> —— 先在頁面選取文字，再開啟 TapTap 即自動填入</li>
          <li><strong>🕐 搜尋紀錄</strong> —— 輸入時顯示最近搜尋過的內容</li>
          <li><strong>🎨 6 種主題</strong> —— 變色龍、單色、午夜、玻璃、紙張、終端機</li>
          <li><strong>🌈 每個引擎一種顏色</strong> —— 9 組配色，或自訂十六進位色碼</li>
          <li><strong>➕ 27 個推薦引擎</strong> —— 一鍵加入，也可自行加入</li>
          <li><strong>🌐 13 種語言</strong> —— 中文、英文、韓文、日文等</li>
          <li><strong>🔒 不收集任何資料</strong> —— 設定只保存在你的瀏覽器裡。沒有伺服器，沒有追蹤。</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 使用方式</div>
        <ol class="abtSteps">
          <li>在任何網頁上連按兩次 <kbd class="abtKbdA">Shift</kbd></li>
          <li>輸入搜尋內容 —— 若事先選取了文字，則已自動填入</li>
          <li>用 <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> 或滾輪切換引擎</li>
          <li><kbd class="abtKbd">Enter</kbd> 搜尋，<kbd class="abtKbd">Esc</kbd> 關閉</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 授權與致謝</div>
        <p class="abtP">以 <strong>MIT 授權條款</strong>發布。可自由使用、修改與分享。</p>
        <p class="abtP" style="color:var(--muted)">由 <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> 開發 &nbsp;·&nbsp; 歡迎在 GitHub 上參與貢獻 &nbsp;·&nbsp; 發現問題？<a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">提交 issue</a></p>
      </div>`,

  es: `
      <div class="card">
        <div class="cardTitle">¿Qué es TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> es una extensión ligera de Chrome para buscar en la web sin salir de la página en la que estás. Pulsa <kbd class="abtKbdA">Shift</kbd> dos veces y aparecerá un cuadro de búsqueda sobre la página. Escribe y pulsa Intro.</p>
        <p class="abtP">Retoma la idea del cuadro de búsqueda rápida del antiguo navegador Opera y la reconstruye para la web actual: buscadores con IA, buscadores que defines tú y un manejo pensado para el teclado.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Funciones</div>
        <ul class="abtList">
          <li><strong>⚡ Se abre en cualquier sitio</strong>: pulsa Shift dos veces o define tu propio atajo</li>
          <li><strong>🤖 Búsqueda con IA incluida</strong>: Perplexity, ChatGPT y Claude listos para usar</li>
          <li><strong>🖱️ Cambio con la rueda del ratón</strong>: desplázate sobre la ventana para cambiar de buscador</li>
          <li><strong>📝 Usa el texto seleccionado</strong>: selecciona texto y abre TapTap para buscarlo</li>
          <li><strong>🕐 Historial de búsquedas</strong>: las búsquedas recientes aparecen mientras escribes</li>
          <li><strong>🎨 6 temas</strong>: Camaleón, Mono, Medianoche, Cristal, Papel y Terminal</li>
          <li><strong>🌈 Un color por buscador</strong>: 9 paletas o tu propio código hexadecimal</li>
          <li><strong>➕ 27 buscadores recomendados</strong>: añádelos con un clic o añade el tuyo</li>
          <li><strong>🌐 13 idiomas</strong>: español, inglés, coreano, japonés, chino y más</li>
          <li><strong>🔒 No recopila nada</strong>: los ajustes se quedan en tu navegador. Sin servidores ni rastreo.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Cómo se usa</div>
        <ol class="abtSteps">
          <li>Pulsa <kbd class="abtKbdA">Shift</kbd> dos veces en cualquier página web</li>
          <li>Escribe tu búsqueda; si habías seleccionado texto, ya estará escrito</li>
          <li>Cambia de buscador con <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> o con la rueda del ratón</li>
          <li><kbd class="abtKbd">Intro</kbd> para buscar, <kbd class="abtKbd">Esc</kbd> para cerrar</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Licencia y créditos</div>
        <p class="abtP">Publicado bajo la <strong>licencia MIT</strong>. Puedes usarlo, modificarlo y compartirlo libremente.</p>
        <p class="abtP" style="color:var(--muted)">Creado por <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Las contribuciones son bienvenidas en GitHub &nbsp;·&nbsp; ¿Has encontrado un fallo? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Abre una incidencia</a></p>
      </div>`,

  fr: `
      <div class="card">
        <div class="cardTitle">Qu'est-ce que TapTap ?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> est une extension Chrome légère qui permet de faire une recherche sans quitter la page où vous êtes. Appuyez deux fois sur <kbd class="abtKbdA">Shift</kbd> : un champ de recherche apparaît par-dessus la page. Saisissez votre recherche et appuyez sur Entrée.</p>
        <p class="abtP">Elle reprend l'idée du champ de recherche rapide de l'ancien navigateur Opera et la reconstruit pour le web d'aujourd'hui : moteurs de recherche IA, moteurs que vous définissez vous-même et une utilisation pensée pour le clavier.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Fonctionnalités</div>
        <ul class="abtList">
          <li><strong>⚡ S'ouvre partout</strong> — deux appuis sur Shift, ou votre propre raccourci</li>
          <li><strong>🤖 Recherche IA intégrée</strong> — Perplexity, ChatGPT et Claude prêts à l'emploi</li>
          <li><strong>🖱️ Changement à la molette</strong> — faites défiler sur la fenêtre pour changer de moteur</li>
          <li><strong>📝 Utilise le texte sélectionné</strong> — sélectionnez du texte, puis ouvrez TapTap pour le rechercher</li>
          <li><strong>🕐 Historique de recherche</strong> — les recherches récentes apparaissent pendant la saisie</li>
          <li><strong>🎨 6 thèmes</strong> — Caméléon, Mono, Minuit, Verre, Papier et Terminal</li>
          <li><strong>🌈 Une couleur par moteur</strong> — 9 palettes, ou votre propre code hexadécimal</li>
          <li><strong>➕ 27 moteurs recommandés</strong> — ajoutez-les en un clic, ou ajoutez le vôtre</li>
          <li><strong>🌐 13 langues</strong> — français, anglais, coréen, japonais, chinois et d'autres</li>
          <li><strong>🔒 Ne collecte rien</strong> — vos réglages restent dans votre navigateur. Aucun serveur, aucun suivi.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Comment l'utiliser</div>
        <ol class="abtSteps">
          <li>Appuyez deux fois sur <kbd class="abtKbdA">Shift</kbd> sur n'importe quelle page web</li>
          <li>Saisissez votre recherche — si vous aviez sélectionné du texte, il est déjà rempli</li>
          <li>Changez de moteur avec <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> ou la molette</li>
          <li><kbd class="abtKbd">Entrée</kbd> pour rechercher, <kbd class="abtKbd">Échap</kbd> pour fermer</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Licence et crédits</div>
        <p class="abtP">Publié sous <strong>licence MIT</strong>. Libre d'utilisation, de modification et de partage.</p>
        <p class="abtP" style="color:var(--muted)">Réalisé par <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Les contributions sont bienvenues sur GitHub &nbsp;·&nbsp; Vous avez trouvé un bug ? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Ouvrez un ticket</a></p>
      </div>`,

  de: `
      <div class="card">
        <div class="cardTitle">Was ist TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> ist eine schlanke Chrome-Erweiterung, mit der du suchen kannst, ohne die aktuelle Seite zu verlassen. Drücke zweimal <kbd class="abtKbdA">Shift</kbd> und ein Suchfeld erscheint über der Seite. Suchbegriff eingeben, Enter drücken.</p>
        <p class="abtP">Sie greift die Idee des Schnellsuchfelds aus dem alten Opera-Browser auf und baut sie für das heutige Web neu: KI-Suchmaschinen, selbst angelegte Suchmaschinen und eine Bedienung, die auf die Tastatur ausgelegt ist.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Funktionen</div>
        <ul class="abtList">
          <li><strong>⚡ Öffnet sich überall</strong> — zweimal Shift, oder ein eigenes Tastenkürzel</li>
          <li><strong>🤖 KI-Suche eingebaut</strong> — Perplexity, ChatGPT und Claude sofort einsatzbereit</li>
          <li><strong>🖱️ Wechsel per Mausrad</strong> — über dem Fenster scrollen wechselt die Suchmaschine</li>
          <li><strong>📝 Nutzt markierten Text</strong> — Text auf der Seite markieren, dann TapTap öffnen</li>
          <li><strong>🕐 Suchverlauf</strong> — frühere Suchen erscheinen beim Tippen</li>
          <li><strong>🎨 6 Designs</strong> — Chamäleon, Mono, Mitternacht, Glas, Papier und Terminal</li>
          <li><strong>🌈 Eine Farbe je Suchmaschine</strong> — 9 Paletten, oder dein eigener Hex-Code</li>
          <li><strong>➕ 27 empfohlene Suchmaschinen</strong> — mit einem Klick hinzufügen, oder eigene hinzufügen</li>
          <li><strong>🌐 13 Sprachen</strong> — Deutsch, Englisch, Koreanisch, Japanisch, Chinesisch und mehr</li>
          <li><strong>🔒 Sammelt nichts</strong> — Einstellungen bleiben im Browser. Kein Server, kein Tracking.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 So wird es benutzt</div>
        <ol class="abtSteps">
          <li>Drücke auf einer beliebigen Webseite zweimal <kbd class="abtKbdA">Shift</kbd></li>
          <li>Gib deinen Suchbegriff ein — hattest du Text markiert, steht er schon da</li>
          <li>Wechsle die Suchmaschine mit <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> oder dem Mausrad</li>
          <li><kbd class="abtKbd">Enter</kbd> zum Suchen, <kbd class="abtKbd">Esc</kbd> zum Schließen</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Lizenz &amp; Danksagung</div>
        <p class="abtP">Veröffentlicht unter der <strong>MIT-Lizenz</strong>. Frei nutzbar, veränderbar und weitergebbar.</p>
        <p class="abtP" style="color:var(--muted)">Entwickelt von <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Beiträge sind auf GitHub willkommen &nbsp;·&nbsp; Einen Fehler gefunden? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Melde ihn als Issue</a></p>
      </div>`,

  ru: `
      <div class="card">
        <div class="cardTitle">Что такое TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> — лёгкое расширение для Chrome, которое позволяет искать, не покидая страницу, на которой вы находитесь. Нажмите <kbd class="abtKbdA">Shift</kbd> дважды, и поверх страницы появится строка поиска. Введите запрос и нажмите Enter.</p>
        <p class="abtP">Оно продолжает идею строки быстрого поиска из старого браузера Opera, заново собранную для сегодняшнего веба: поисковики с ИИ, свои собственные поисковики и управление с клавиатуры.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Возможности</div>
        <ul class="abtList">
          <li><strong>⚡ Открывается везде</strong> — двойное нажатие Shift или своя комбинация</li>
          <li><strong>🤖 Встроенный ИИ-поиск</strong> — Perplexity, ChatGPT и Claude готовы к работе</li>
          <li><strong>🖱️ Переключение колесом мыши</strong> — прокрутка над окном меняет поисковик</li>
          <li><strong>📝 Берёт выделенный текст</strong> — выделите текст на странице и откройте TapTap</li>
          <li><strong>🕐 История поиска</strong> — прошлые запросы появляются по мере ввода</li>
          <li><strong>🎨 6 тем</strong> — Хамелеон, Моно, Полночь, Стекло, Бумага и Терминал</li>
          <li><strong>🌈 Свой цвет для каждого поисковика</strong> — 9 палитр или ваш HEX-код</li>
          <li><strong>➕ 27 рекомендованных поисковиков</strong> — добавьте в один клик или добавьте свой</li>
          <li><strong>🌐 13 языков</strong> — русский, английский, корейский, японский, китайский и другие</li>
          <li><strong>🔒 Ничего не собирает</strong> — настройки остаются в браузере. Ни сервера, ни слежки.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Как пользоваться</div>
        <ol class="abtSteps">
          <li>Нажмите <kbd class="abtKbdA">Shift</kbd> дважды на любой веб-странице</li>
          <li>Введите запрос — если текст был выделен, он уже подставлен</li>
          <li>Меняйте поисковик клавишами <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> или колесом мыши</li>
          <li><kbd class="abtKbd">Enter</kbd> — искать, <kbd class="abtKbd">Esc</kbd> — закрыть</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Лицензия и авторы</div>
        <p class="abtP">Распространяется по <strong>лицензии MIT</strong>. Можно свободно использовать, изменять и передавать.</p>
        <p class="abtP" style="color:var(--muted)">Разработано <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Будем рады вкладу на GitHub &nbsp;·&nbsp; Нашли ошибку? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Создайте issue</a></p>
      </div>`,

  vn: `
      <div class="card">
        <div class="cardTitle">TapTap là gì?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> là một tiện ích Chrome gọn nhẹ giúp bạn tìm kiếm mà không phải rời khỏi trang đang xem. Nhấn <kbd class="abtKbdA">Shift</kbd> hai lần, một ô tìm kiếm sẽ hiện lên trên trang. Gõ từ khoá rồi nhấn Enter.</p>
        <p class="abtP">Tiện ích lấy ý tưởng từ ô tìm kiếm nhanh của trình duyệt Opera ngày trước và dựng lại cho web hiện nay: có công cụ tìm kiếm AI, công cụ do bạn tự thêm, và cách dùng ưu tiên bàn phím.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Tính năng</div>
        <ul class="abtList">
          <li><strong>⚡ Mở được ở mọi nơi</strong> — nhấn Shift hai lần, hoặc đặt phím tắt riêng</li>
          <li><strong>🤖 Tích hợp sẵn tìm kiếm AI</strong> — Perplexity, ChatGPT và Claude dùng được ngay</li>
          <li><strong>🖱️ Đổi bằng con lăn chuột</strong> — cuộn trên cửa sổ để đổi công cụ</li>
          <li><strong>📝 Dùng chữ đã bôi đen</strong> — bôi đen chữ trên trang rồi mở TapTap để tìm</li>
          <li><strong>🕐 Lịch sử tìm kiếm</strong> — các từ khoá gần đây hiện ra khi bạn gõ</li>
          <li><strong>🎨 6 chủ đề</strong> — Tắc kè hoa, Đơn sắc, Nửa đêm, Kính, Giấy và Dòng lệnh</li>
          <li><strong>🌈 Mỗi công cụ một màu</strong> — 9 bảng màu, hoặc mã hex của riêng bạn</li>
          <li><strong>➕ 27 công cụ gợi ý</strong> — thêm bằng một cú nhấp, hoặc tự thêm công cụ của bạn</li>
          <li><strong>🌐 13 ngôn ngữ</strong> — tiếng Việt, tiếng Anh, tiếng Hàn, tiếng Nhật, tiếng Trung và nhiều hơn nữa</li>
          <li><strong>🔒 Không thu thập gì</strong> — cài đặt chỉ nằm trong trình duyệt của bạn. Không máy chủ, không theo dõi.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Cách dùng</div>
        <ol class="abtSteps">
          <li>Nhấn <kbd class="abtKbdA">Shift</kbd> hai lần trên bất kỳ trang web nào</li>
          <li>Gõ từ khoá — nếu bạn đã bôi đen chữ thì nó có sẵn rồi</li>
          <li>Đổi công cụ bằng <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> hoặc con lăn chuột</li>
          <li><kbd class="abtKbd">Enter</kbd> để tìm, <kbd class="abtKbd">Esc</kbd> để đóng</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Giấy phép &amp; ghi công</div>
        <p class="abtP">Phát hành theo <strong>giấy phép MIT</strong>. Bạn được tự do dùng, sửa và chia sẻ.</p>
        <p class="abtP" style="color:var(--muted)">Thực hiện bởi <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Hoan nghênh đóng góp trên GitHub &nbsp;·&nbsp; Phát hiện lỗi? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Hãy tạo issue</a></p>
      </div>`,

  ms: `
      <div class="card">
        <div class="cardTitle">Apa itu TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> ialah sambungan Chrome yang ringan untuk mencari di web tanpa meninggalkan halaman yang sedang anda baca. Tekan <kbd class="abtKbdA">Shift</kbd> dua kali dan kotak carian akan muncul di atas halaman. Taip carian anda dan tekan Enter.</p>
        <p class="abtP">Ia mengambil idea kotak carian pantas daripada pelayar Opera lama dan membinanya semula untuk web hari ini: enjin carian AI, enjin yang anda tetapkan sendiri, dan penggunaan yang mengutamakan papan kekunci.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Ciri-ciri</div>
        <ul class="abtList">
          <li><strong>⚡ Boleh dibuka di mana-mana</strong> — tekan Shift dua kali, atau tetapkan pintasan sendiri</li>
          <li><strong>🤖 Carian AI terbina dalam</strong> — Perplexity, ChatGPT dan Claude sedia digunakan</li>
          <li><strong>🖱️ Tukar dengan roda tetikus</strong> — tatal pada tetingkap untuk menukar enjin</li>
          <li><strong>📝 Guna teks yang dipilih</strong> — pilih teks pada halaman, kemudian buka TapTap</li>
          <li><strong>🕐 Sejarah carian</strong> — carian terbaharu muncul semasa anda menaip</li>
          <li><strong>🎨 6 tema</strong> — Bunglon, Mono, Tengah Malam, Kaca, Kertas dan Terminal</li>
          <li><strong>🌈 Satu warna bagi setiap enjin</strong> — 9 palet, atau kod heks anda sendiri</li>
          <li><strong>➕ 27 enjin disyorkan</strong> — tambah dengan satu klik, atau tambah enjin anda sendiri</li>
          <li><strong>🌐 13 bahasa</strong> — Melayu, Inggeris, Korea, Jepun, Cina dan lain-lain</li>
          <li><strong>🔒 Tidak mengumpul apa-apa</strong> — tetapan kekal dalam pelayar anda. Tiada pelayan, tiada penjejakan.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Cara menggunakannya</div>
        <ol class="abtSteps">
          <li>Tekan <kbd class="abtKbdA">Shift</kbd> dua kali pada mana-mana halaman web</li>
          <li>Taip carian anda — jika anda telah memilih teks, ia sudah terisi</li>
          <li>Tukar enjin dengan <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> atau roda tetikus</li>
          <li><kbd class="abtKbd">Enter</kbd> untuk mencari, <kbd class="abtKbd">Esc</kbd> untuk menutup</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Lesen &amp; penghargaan</div>
        <p class="abtP">Dikeluarkan di bawah <strong>Lesen MIT</strong>. Bebas untuk digunakan, diubah suai dan dikongsi.</p>
        <p class="abtP" style="color:var(--muted)">Dibina oleh <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Sumbangan dialu-alukan di GitHub &nbsp;·&nbsp; Jumpa pepijat? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Buka satu issue</a></p>
      </div>`,

  th: `
      <div class="card">
        <div class="cardTitle">TapTap คืออะไร?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> เป็นส่วนขยาย Chrome ขนาดเล็กที่ให้คุณค้นหาได้โดยไม่ต้องออกจากหน้าที่กำลังดูอยู่ กด <kbd class="abtKbdA">Shift</kbd> สองครั้ง แล้วช่องค้นหาจะปรากฏขึ้นเหนือหน้าเว็บ พิมพ์คำค้นหาแล้วกด Enter</p>
        <p class="abtP">แนวคิดนี้มาจากช่องค้นหาด่วนของเบราว์เซอร์ Opera รุ่นเก่า แล้วสร้างขึ้นใหม่ให้เข้ากับเว็บยุคนี้ ทั้งเครื่องมือค้นหาแบบ AI เครื่องมือที่คุณเพิ่มเอง และการใช้งานที่เน้นแป้นพิมพ์</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ ความสามารถ</div>
        <ul class="abtList">
          <li><strong>⚡ เปิดได้ทุกที่</strong> — กด Shift สองครั้ง หรือตั้งปุ่มลัดเอง</li>
          <li><strong>🤖 มีการค้นหาแบบ AI ในตัว</strong> — Perplexity, ChatGPT และ Claude พร้อมใช้งาน</li>
          <li><strong>🖱️ เปลี่ยนด้วยลูกกลิ้งเมาส์</strong> — เลื่อนบนหน้าต่างเพื่อเปลี่ยนเครื่องมือ</li>
          <li><strong>📝 ใช้ข้อความที่เลือกไว้</strong> — เลือกข้อความบนหน้าเว็บ แล้วเปิด TapTap เพื่อค้นหา</li>
          <li><strong>🕐 ประวัติการค้นหา</strong> — คำค้นหาล่าสุดจะปรากฏขณะพิมพ์</li>
          <li><strong>🎨 6 ธีม</strong> — กิ้งก่า, ขาวดำ, เที่ยงคืน, กระจก, กระดาษ และเทอร์มินัล</li>
          <li><strong>🌈 หนึ่งสีต่อหนึ่งเครื่องมือ</strong> — 9 ชุดสี หรือรหัสสีฐานสิบหกของคุณเอง</li>
          <li><strong>➕ เครื่องมือค้นหาแนะนำ 27 รายการ</strong> — เพิ่มได้ในคลิกเดียว หรือเพิ่มของคุณเอง</li>
          <li><strong>🌐 13 ภาษา</strong> — ไทย, อังกฤษ, เกาหลี, ญี่ปุ่น, จีน และอื่น ๆ</li>
          <li><strong>🔒 ไม่เก็บข้อมูลใด ๆ</strong> — การตั้งค่าอยู่ในเบราว์เซอร์ของคุณเท่านั้น ไม่มีเซิร์ฟเวอร์ ไม่มีการติดตาม</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 วิธีใช้</div>
        <ol class="abtSteps">
          <li>กด <kbd class="abtKbdA">Shift</kbd> สองครั้งบนหน้าเว็บใดก็ได้</li>
          <li>พิมพ์คำค้นหา — ถ้าคุณเลือกข้อความไว้ก่อนแล้ว ระบบจะใส่ให้อัตโนมัติ</li>
          <li>เปลี่ยนเครื่องมือด้วย <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> หรือลูกกลิ้งเมาส์</li>
          <li><kbd class="abtKbd">Enter</kbd> เพื่อค้นหา, <kbd class="abtKbd">Esc</kbd> เพื่อปิด</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 สัญญาอนุญาตและเครดิต</div>
        <p class="abtP">เผยแพร่ภายใต้ <strong>สัญญาอนุญาต MIT</strong> ใช้ แก้ไข และแบ่งปันได้อย่างอิสระ</p>
        <p class="abtP" style="color:var(--muted)">พัฒนาโดย <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; ยินดีรับการมีส่วนร่วมบน GitHub &nbsp;·&nbsp; พบข้อผิดพลาด? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">แจ้ง issue ได้เลย</a></p>
      </div>`,

  id: `
      <div class="card">
        <div class="cardTitle">Apa itu TapTap?</div>
        <p class="abtP"><strong>TapTap - Quick Search</strong> adalah ekstensi Chrome yang ringan untuk mencari di web tanpa meninggalkan halaman yang sedang Anda buka. Tekan <kbd class="abtKbdA">Shift</kbd> dua kali dan kotak pencarian akan muncul di atas halaman. Ketik kata kunci lalu tekan Enter.</p>
        <p class="abtP">Ekstensi ini mengambil gagasan kotak pencarian cepat dari peramban Opera lama dan membangunnya ulang untuk web masa kini: mesin pencari AI, mesin pencari yang Anda tentukan sendiri, dan pengoperasian yang mengutamakan papan ketik.</p>
      </div>

      <div class="card">
        <div class="cardTitle">✨ Fitur</div>
        <ul class="abtList">
          <li><strong>⚡ Bisa dibuka di mana saja</strong> — tekan Shift dua kali, atau atur pintasan sendiri</li>
          <li><strong>🤖 Pencarian AI bawaan</strong> — Perplexity, ChatGPT, dan Claude siap dipakai</li>
          <li><strong>🖱️ Ganti dengan roda tetikus</strong> — gulir di atas jendela untuk mengganti mesin</li>
          <li><strong>📝 Memakai teks yang dipilih</strong> — pilih teks di halaman, lalu buka TapTap</li>
          <li><strong>🕐 Riwayat pencarian</strong> — pencarian terakhir muncul saat Anda mengetik</li>
          <li><strong>🎨 6 tema</strong> — Bunglon, Mono, Tengah Malam, Kaca, Kertas, dan Terminal</li>
          <li><strong>🌈 Satu warna untuk tiap mesin</strong> — 9 palet, atau kode heks Anda sendiri</li>
          <li><strong>➕ 27 mesin pencari yang disarankan</strong> — tambahkan sekali klik, atau tambahkan milik Anda sendiri</li>
          <li><strong>🌐 13 bahasa</strong> — Indonesia, Inggris, Korea, Jepang, Mandarin, dan lainnya</li>
          <li><strong>🔒 Tidak mengumpulkan apa pun</strong> — pengaturan tetap di peramban Anda. Tanpa server, tanpa pelacakan.</li>
        </ul>
      </div>

      <div class="card">
        <div class="cardTitle">🚀 Cara memakainya</div>
        <ol class="abtSteps">
          <li>Tekan <kbd class="abtKbdA">Shift</kbd> dua kali di halaman web mana pun</li>
          <li>Ketik kata kunci — jika tadi Anda memilih teks, kolomnya sudah terisi</li>
          <li>Ganti mesin dengan <kbd class="abtKbd">↑</kbd> <kbd class="abtKbd">↓</kbd> atau roda tetikus</li>
          <li><kbd class="abtKbd">Enter</kbd> untuk mencari, <kbd class="abtKbd">Esc</kbd> untuk menutup</li>
        </ol>
      </div>

      <div class="card">
        <div class="cardTitle">📄 Lisensi &amp; kredit</div>
        <p class="abtP">Dirilis di bawah <strong>Lisensi MIT</strong>. Bebas dipakai, diubah, dan dibagikan.</p>
        <p class="abtP" style="color:var(--muted)">Dibuat oleh <a href="https://github.com/hyrocket" target="_blank" style="color:var(--accent);font-weight:600">@hyrocket</a> &nbsp;·&nbsp; Kontribusi disambut di GitHub &nbsp;·&nbsp; Menemukan bug? <a href="https://github.com/hyrocket/quick-search-popup/issues" target="_blank" style="color:var(--accent)">Buat issue</a></p>
      </div>`

};
