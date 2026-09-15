# 크롬 웹스토어 등록정보 초안

TapTap - Quick Search · 2026-09-04 작성 / 2026-09-13 갱신 (v1.4.9 — 다국어 등록정보, 동기화 문구)

이 파일은 **확장 코드가 아니다.** 제출 ZIP 에 넣지 말 것.
스토어 대시보드에 붙여넣을 원고를 여기서 관리한다.

---

## ⚠ 먼저 알아야 할 것

**"짧은 설명"은 대시보드에서 못 고친다.** `_locales/<언어>/messages.json` 의
`appDesc` 가 그대로 올라간다 (v1.4.9 부터. manifest 의 `description` 은 `__MSG_appDesc__` 참조뿐).
바꾸려면 코드를 고치고 재제출해야 한다.

**등록정보 언어 = 패키지의 `_locales` 폴더 목록이다.** 대시보드는 여기 있는 언어만
언어 선택 메뉴에 띄운다. v1.4.8 까지는 `_locales` 가 없어서 영어 한 벌뿐이었다.
→ **v1.4.9 패키지를 먼저 올려야** 12개 언어 상세 설명을 붙여넣을 수 있다.

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

## 2. 짧은 설명 (132자 제한, `_locales/<언어>/messages.json` 의 `appDesc`)

> 아래 영어가 `_locales/en` 이다. 12개 언어 번역은 각 `messages.json` 이 정본 —
> 여기 복사하지 않는다 (두 곳에 두면 어긋난다).
> 2026-09-16 전면 교체: 13개 언어 모두 **`Naver` 를 다시 넣었다**
> (대신 서양어·동남아어는 기능 나열을 줄였다. 예: es 는 테마를 뺌).
> vi·th·ms 는 **132자에 정확히 붙어 있어 여유 0자**.

**현재안** — 126자

```
Tap Shift twice, search from any page. Google, Naver, ChatGPT, Claude, Perplexity built in. Add engines, themes, 13 languages.
```

이전안 (v1.4.9 초안, 132자):
`Double-tap Shift to search from any page. Google, Naver, ChatGPT, Claude, Perplexity built in. Custom engines, themes, 13 languages.`

바꾸려면 `_locales/en/messages.json` 을 고치고, **나머지 12개 언어도** 132자 이내로 같이 고칠 것.

---

## 3. 상세 설명 (본문)

> **이 블록이 정본이다.** 대시보드 `설명*` 칸에 통째로 붙여넣는다.
> 아래 "고칠 때 규칙"을 먼저 읽을 것.

```
⚡ TapTap - Quick Search — Boost Your Browsing Speed

Stop switching tabs. Stop clicking the address bar.
TapTap brings an instant search overlay to any webpage
with a single keyboard shortcut — keeping you in the flow and
getting you answers faster than ever.

Just press your shortcut → type → press Enter. Done.


WHY YOU'LL LOVE IT

TapTap is designed to eliminate the small frictions
that slow you down every day. Whether you're researching, reading,
or working — search anything without ever leaving the page you're on.
Over time, this adds up to a dramatically faster and more efficient
browsing experience.


KEY FEATURES

⚡ Instant Search Overlay
Open a search popup on any webpage with a keyboard shortcut.
No mouse clicks, no tab switching — just type and go.

🔍 Your Engines, Your Way
Popular search engines are built-in and ready to use.
More importantly, you can easily add, edit, and reorder
any search engine you love — make it truly yours.

📝 Auto-Fill Selected Text
Highlight any text on a page, trigger the popup, and it fills in
automatically. Perfect for instant lookups without retyping.

🤖 AI Search Ready
AI-powered search engines are supported out of the box — and you can
add any engine that accepts a search URL, including the latest AI
search tools.

🖱️ Flexible Engine Switching
Use arrow keys or mouse wheel to cycle through your engines.
Find the right source without lifting your hands off the keyboard.

🕐 Search History
Your recent searches appear as you type — jump back to any
previous query in one click.

🎨 Full Theme Control
Six themes plus nine color palettes and a custom hex color picker
per engine. Adapts automatically to your browser's dark mode.

⌨️ Custom Shortcut
Set any trigger key combination that suits your workflow.
Built-in conflict detection prevents clashes with browser shortcuts.

🌐 13 Languages Supported
Korean, English, Japanese, Chinese (Simplified), Chinese (Traditional),
Spanish, French, German, Russian, Vietnamese, Malay, Thai,
and Indonesian.

☁️ Settings Follow You
Set it up once. Your engines, themes, and shortcut ride along on
Chrome's own sync, so every computer you sign in to is ready to go.

🔒 Zero Data Collection
No servers of mine, no analytics, no tracking. Ever. Your settings
stay in your browser — and, if Chrome sync is on, in your own
Google account.


CUSTOMIZATION

Click the settings icon in the popup to open Settings:
- Add, edit, and reorder your favorite search engines
- Set a unique color theme per engine
- Change the trigger shortcut to fit your workflow
- Switch UI language

A "new tab" switch sits at the bottom of the popup itself, so you can
choose whether results open in the current tab or a new one.


PRIVACY

This extension uses only the storage permission to save your
preferences. It does not collect, transmit, or share any personal
data. Your searches go directly to the engine you choose.

Those preferences are saved with Chrome's sync storage, so when you
have Chrome sync turned on they travel between your own devices
through your Google account. That is Chrome's sync, not a TapTap
server — TapTap has no server at all.

Source code: github.com/hyrocket/quick-search-popup


SUPPORT

Found a bug? Missing an engine? Have an idea that would make this
better? I want to hear all of it — suggestions just as much as bugs.
github.com/hyrocket/quick-search-popup/issues
```

### ⚠ 고칠 때 규칙 — 도입부는 사양서가 아니라 후킹 카피다

**스토어 상세 설명의 첫 5줄은 사람을 끄는 문구여야 한다.**
사용자는 기능 목록을 읽으러 오지 않는다. *"이게 내 문제를 푸나"* 만
3초 안에 판단하고 나간다. 정확하지만 밋밋한 문장은 정확해서 실패한다.

지금 도입부가 하고 있는 일 — **이 구조를 건드리지 말 것**:
1. **문제 제기부터** — `Stop switching tabs. Stop clicking the address bar.`
   (명령형 2연타. 기능 소개보다 먼저 온다)
2. **해결을 한 문장으로** — `keeping you in the flow`
3. **쉽다는 증명** — `→ type → press Enter. Done.` (`Done.` 한 단어로 끊는다)
4. **감정 단락** — `WHY YOU'LL LOVE IT` 은 정보량이 0에 가깝지만
   *"매일 쌓이면 크다"* 를 납득시킨다. 지우고 싶어지는 단락이지만 지우지 말 것

**2026-09-06 에 실제로 겪은 실패:**
사실 검증에 치중해 도입부를 `Search the web without leaving the page you
are on.` 로 바꾼 초안을 냈다가 반려됐다. 사실은 다 맞았지만 후킹이 죽었다.

→ **규칙: 사실 오류는 고치되 도입부의 감정·리듬 구조는 손대지 않는다.**
  사실 수정은 `KEY FEATURES` 이하에서 한다.

**본문 안에서 제품명은 `TapTap` 만 쓴다.**
`TapTap - Quick Search` 를 문장 주어로 넣으면 하이픈 때문에 리듬이 끊긴다.
정식 명칭은 **헤드라인 한 곳**이 책임진다 (패키지 제목과 달라지면 심사에서 걸림).

### 이 원고에서 의도적으로 뺀 것

- **"open source" / MIT** — `LICENSE` 파일이 없다. 저장소는 공개(`private:false`)
  지만 라이선스가 없으면 법적으로 저작권 전부 보유 상태라 "open source" 는
  부정확하다. **`Source code:` 로 바꿔 링크만 남겼다** — 소스가 공개돼 있다는
  사실만 말하므로 정확하다.
  (`Open source` 라고 쓰고 싶으면 `LICENSE` 파일을 먼저 추가할 것)
- **버전 번호** — 스토어가 알아서 표시한다. 적으면 반드시 낡는다 (금지항목 17)

### v1.0.0 게시본에서 고친 사실 오류 (2026-09-06)

| 기존 | 실제 | 근거 |
|---|---|---|
| `9 preset color themes` | 테마 **6종** + 팔레트 **9종** | `content.js:20`, `content.js:262` — 둘을 한 숫자로 뭉뚱그리고 있었다 |
| `Toggle new tab mode` 가 설정 페이지 항목 | 그 스위치는 **팝업 하단** | `content.js:1410`. 설정 좌측 메뉴는 5개뿐 (`options.html:562`) |
| `13 Languages` 인데 나열은 12개 | `Chinese` 를 Simplified/Traditional 로 분리 | `options.js:100` |
| `a instant` | `an instant` | 원본 문법 오류 |
| `Popular search engines` (모호) | 기본 8개 + 추천 27개 | `content.js:322`, `options.js:904` |

### `SUPPORT` 링크는 GitHub Issues 다 (2026-09-06 재확정)

09-04 에 피드백 창구를 스토어 지원 탭으로 옮겼지만(`177a6e0`),
**Support 탭에는 자체 문의 폼이 없다.** 탭 본문은 한 문장뿐이고
대시보드의 "지원 URL" 을 그대로 링크한다 (2026-09-06 라이브 페이지에서 실측):

> For help with questions, suggestions, or problems,
> visit the developer's **support site**.  → [지원 URL 필드]

즉 지원 URL 을 비우면 탭이 가리킬 곳이 없다. 그리고 지원 URL 에 GitHub 을
넣는 이상 `About → /support → GitHub` 로 한 번 더 돌 뿐 장벽은 그대로다.

→ **본문에서 GitHub Issues 를 직접 링크한다.** 클릭이 한 번 줄어든다.

문구는 **버그만이 아니라 제안도 받는다**는 쪽으로 썼다.
사용자 27명 규모에서 진짜 문제는 중복 제보가 아니라 **아무도 말을 안 하는 것**이다.

### `NOTE` 문단은 뺀다 (2026-09-13 확정)

맨 끝 `NOTE` (chrome:// 에서는 안 뜬다)는 원고 최초 작성(`76ee0f1`, 09-04)
때부터 있던 문단이지만, **게시본에는 한 번도 올라간 적이 없다.**

빼는 이유: 남긴 근거는 "심사자가 `chrome://` 에서 눌러보고 반려할까 봐"였는데,
**사용자가 이 문단 없이 제출해 실제로 문제없이 통과했다.** 가정이 틀린 게 확인됐다.
원고에만 남겨두면 게시본·12개 번역본과 계속 어긋난다.

→ **다시 넣지 말 것.** 되살리려면 "빼서 반려됐다"는 실제 사례가 먼저 있어야 한다.
  (chrome:// 제약 자체는 `CLAUDE.md` 의 알려진 제약에 그대로 남아 있다)

### 동기화 문구 — "로컬 저장"은 부정확했다 (2026-09-13)

코드는 `chrome.storage.sync` 를 쓴다 (`options.js:1113`, `background.js:16`).
크롬 동기화를 켠 사용자는 설정이 **본인 구글 계정을 통해 기기 사이를 오간다.**
그런데 원고엔 `stored locally` / `No servers` 라고만 적혀 있었다 — 틀린 말이다.

숨기는 대신 **강점으로 바꿨다.** 한 번 설정하면 로그인한 모든 컴퓨터에서
그대로 쓸 수 있다는 건 실제로 편리한 기능이다.

- `KEY FEATURES` 에 `☁️ Settings Follow You` 항목 추가 (🌐 다음, 🔒 앞)
- `🔒 Zero Data Collection` → `No servers of mine` 로. "내 서버가 없다"와
  "설정이 구글 계정에 있다"는 서로 모순이 아니다. 둘을 한 문단에서 같이 말한다
- `PRIVACY` 에 한 문단 추가: **크롬의 동기화이지 TapTap 의 서버가 아니다**
  (TapTap 엔 서버가 아예 없다). 심사 쪽에도 이 편이 안전하다
- 짧은 설명(`_locales` 의 `appDesc`)엔 "로컬" 주장이 없었다 → 수정 불필요
- 12개 번역본 전부 같이 반영됐다

### 다국어 번역본 — `store_listing/<언어>.txt` (2026-09-11)

위 영어 정본의 12개 언어 번역. 대시보드에서 언어를 고른 뒤 해당 파일을 통째로 붙여넣는다.
파일명은 웹스토어 로케일 코드다: `ko ja zh_CN zh_TW es fr de ru vi ms th id`

- **정본은 영어다.** 영어를 고치면 12개 파일도 같이 고칠 것 (금지항목 16 의 About 과 같은 구조)
- `☁️` 항목과 `PRIVACY` 의 동기화 문단은 12개 전부에 들어가 있다 (2026-09-13)
- 번역 기준은 **2026-09-11 게시본**(사용자가 붙여준 라이브 텍스트). `NOTE` 문단은 영어 정본에서도 뺐다(위 참조)
- 도입부는 직역이 아니라 언어별로 **2연타 명령형 → `Done.` 한 단어 끊기** 리듬을 살렸다
- 팝업 안의 실제 표기에 맞췄다: `설정`/`Settings`, `새 탭`/`New tab` 스위치 이름은 `content.js` 의 `settings`/`openNewTab` 번역과 같다.
  독일어는 설정 페이지처럼 `du`, 테마는 `Designs`
- 번역하지 않은 것: 제목 `TapTap - Quick Search`, 엔진명, URL, `Shift`/`Enter`, 권한명 `storage`
- 짧은 설명(Overview 첫 줄)은 여기 없다 — `_locales/<언어>/messages.json` 에 있다 (위 2번)

### v1.4.7 / v1.4.8 반영 여부 — 본문 수정 불필요
드래그 선택 길이 상한(v1.4.7)과 기록 Clear 버튼 수정(v1.4.8)은
둘 다 내부 수정이다. 원고의
"📝 Auto-Fill Selected Text" 문구는 그대로 맞다.

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

### v1.4.9 (다국어 등록정보) 추가 체크
- [ ] `submit-v1.4.9.zip` 에 `_locales/` 13개 폴더 포함 — 빠지면 `default_locale` 때문에 로드 실패
- [ ] 압축해제 로드 후 `chrome://extensions` 에 설명이 `__MSG_appDesc__` 로 **안** 보이는지
- [ ] 패키지 업로드 후 대시보드 등록정보에 언어 선택 메뉴가 생겼는지
- [ ] 언어별로 `store_listing/<언어>.txt` 붙여넣기 (영어는 위 3번 블록)
