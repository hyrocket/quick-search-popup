# 크롬 웹스토어 등록정보 초안

TapTap - Quick Search · 2026-09-04 작성 / 2026-09-06 갱신 (v1.4.8 제출용)

이 파일은 **확장 코드가 아니다.** 제출 ZIP 에 넣지 말 것.
스토어 대시보드에 붙여넣을 원고를 여기서 관리한다.

---

## ⚠ 먼저 알아야 할 것

**"짧은 설명"은 대시보드에서 못 고친다.** `manifest.json` 의 `description`
필드가 그대로 올라간다. 바꾸려면 코드를 고치고 재제출해야 한다.

현재 게시된 등록정보(2026-09-04 확인):
- 제목: `Quick Search Popup` ← 구 이름
- 짧은 설명: manifest 의 `description` (132자 — **한도에 정확히 붙어 있어 여유 0자**)
- 사용자 22명 · 별점 5.0 (2개)
- 본문에 **"The extension is open source"** 가 있다 → 라이선스 주장을 걷어냈으므로 제거 필요

---

## 1. 제목

```
TapTap - Quick Search
```

`manifest.json` 의 `name` 과 같다. 이미 코드에 반영돼 있다.

---

## 2. 짧은 설명 (132자 제한, manifest.json 의 description)

**권장안** — 132자

```
Double-tap Shift to search from any page. Google, Naver, ChatGPT, Claude, Perplexity built in. Custom engines, themes, 13 languages.
```

대안:

| # | 길이 | 문안 |
|---|---:|---|
| A | 131 | `Double-tap Shift to search from any page without leaving it. Google, Naver and AI engines built in. Custom engines, themes, hotkey.` |
| B | 124 | `Tap Shift twice to open a search box on any page. Google, Naver, ChatGPT, Claude, Perplexity built in. Add your own engines.` |

바꾸려면 `manifest.json` 의 `description` 을 고칠 것.

---

## 3. 상세 설명 (본문)

```
Search the web without leaving the page you are on.

Press Shift twice and a search box appears on top of the page. Type your
query and press Enter. No mouse, no new tab, no losing your place.

WHAT YOU GET

⚡ Opens anywhere
   Double-tap Shift on any web page. Prefer a different key? Set your own
   shortcut, including modifier combinations. Conflicts with the page are
   detected for you.

🤖 AI search built in
   Perplexity, ChatGPT and Claude are ready to use out of the box, next to
   Google, Naver, Bing, Wikipedia and YouTube.

📝 Uses the text you selected
   Highlight something on the page, then open TapTap — your selection is
   already in the box.

🕐 Search history
   Recent searches appear as you type, and you can pick one with the
   keyboard.

🖱️ Switch engines the way you like
   Arrow keys, the mouse wheel, or a dropdown inside the popup.

➕ Make it yours
   27 recommended engines you can add in one click, or add your own with a
   URL template. Rename, reorder, and give each engine its own emoji icon.

🎨 Six themes
   Chameleon (follows the colour of the engine you picked), Mono, Midnight,
   Glass, Paper and Terminal. Nine colour palettes per engine, or your own
   hex code. Automatic dark mode follows your system setting.

🌐 13 languages
   English, Korean, Japanese, Chinese (Simplified and Traditional), Spanish,
   French, German, Russian, Vietnamese, Malay, Thai and Indonesian — in the
   search popup and the settings page.

🔒 Collects nothing
   Your settings stay in your browser. No server, no analytics, no tracking.
   Your searches go straight to the engine you picked, exactly as they would
   from the address bar.

HOW TO USE

1. Press Shift twice on any web page
2. Type your query — or it is already filled in if you had selected text
3. Change engine with the arrow keys or the mouse wheel
4. Enter to search, Esc to close

NOTE
Browser pages such as chrome:// cannot run extensions, so the popup does not
open there. That is a Chrome security policy, not a limitation of TapTap.
```

### v1.4.7 / v1.4.8 반영 여부 — 본문 수정 불필요
드래그 선택 길이 상한(v1.4.7)과 기록 Clear 버튼 수정(v1.4.8)은
둘 다 내부 수정이다. 원고의
"📝 Uses the text you selected" 문구는 그대로 맞다.
아주 긴 문단은 잘려 들어가지만 스토어 설명에 적을 만한 사양은 아니다.

### 이 원고에서 의도적으로 뺀 것

- **"open source" / MIT** — 라이선스를 붙이지 않기로 했으므로 부정확한 주장이 된다
- **버전 번호** — 스토어가 알아서 표시한다. 적으면 반드시 낡는다
- **"9 preset color themes"** — 현재 게시본의 표현인데 팔레트(9)와 테마(6)를 섞어
  쓰고 있었다. 위 원고는 둘을 나눠 적었다

---

## 4. 같이 손봐야 할 것

- [ ] **스크린샷** — 구 이름과 구 설정 페이지가 찍혀 있다. 다시 찍을 것
      (특히 Preview 탭이 없어졌고 좌측 메뉴가 5개로 줄었다)
- [ ] **프로모 타일** — 이름이 박혀 있으면 교체. 새로 만들 시간이 없으면 **삭제**
      (필수 아님. 틀린 이름이 박힌 타일을 남기는 것보다 아이콘만 나오는 편이 낫다)
- [~] **아이콘 — 이번 제출에서는 건드리지 않는다** (2026-09-06 결정)
      실측: 캔버스 128×128 정사각형 ✅ / 그래픽 120×120 / 투명 여백 사방 4px.
      권장은 그래픽 96×96 + 여백 16px 이지만 **권장이지 필수가 아니고**,
      지금 이 아이콘 그대로 v1.0.0 이 심사를 통과해 게시돼 있다.
      원형일 필요도 없다 — 크롬 웹스토어는 아이콘을 마스킹하지 않는다.
      아이콘은 **패키지 안에서 오므로**(`manifest.json` 의 `icons`) 바꾸려면
      PNG 4개 재작업 + ZIP 재생성이 필요하다. 이번엔 얻는 게 없다.
      → **아이콘 개선 + 홍보 영상은 다음 릴리스에서 함께 낸다**
- [ ] 카테고리는 `Functionality & UI` 유지
- [ ] **지원 URL — 비워둘 것.** 09-04 항목 14 에서 피드백 창구를 **스토어 지원 탭**
      으로 옮겼다. 여기에 GitHub 을 넣으면 "지원" 클릭이 다시 GitHub 으로 가서
      그 결정이 무효가 된다. 비우면 스토어가 자체 지원 탭을 쓴다.
      (`docs`/`privacy` 의 문의처를 GitHub 으로 남긴 건 독자가 개발자라서다 — 여기와 다름)
- [ ] 개인정보처리방침 URL: `https://hyrocket.github.io/quick-search-popup/privacy.html`

---

## 5. 제출 체크리스트

- [ ] 로컬 테스트 전 스토어 설치본 토글 OFF (CLAUDE.md 테스트 0번)
- [ ] `submit-v1.4.8.zip` 에 `i18n-options.js` 포함 확인 — 빠지면 설정 페이지가 통째로 깨진다
      (v1.4.7 빌드는 폐기. Clear 버튼 버그가 들어 있다 — 절대 올리지 말 것)
- [x] `manifest.json` 의 `description` 을 위 문안으로 바꿨는지 (커밋 `76ee0f1`)
- [ ] 제목/설명/스크린샷이 서로 같은 이름을 쓰는지 (심사에서 어긋나면 반려)
