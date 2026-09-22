---
name: gopumgyeok-design-system
description: "고품격대패 랜딩(0007)의 확정 디자인 시스템 — 골드/블랙 토큰, Pretendard 단독, 웨이브 디바이더, 5섹션 구조"
metadata: 
  node_type: memory
  type: project
  originSessionId: 64490a38-09ba-439e-83a5-66505594f155
  modified: 2026-09-04T00:00:00.000Z
---

`component-zip/0007/` 랜딩([[gopumgyeok-landing-project]])의 **확정된** 디자인 규칙. 임의로 바꾸지 말 것.
2026-09-04에 이 시스템 전체를 shadcn/ui 뉴트럴 톤으로 갈아엎었다가 같은 날 사용자가 원래
골드/레드로 되돌렸다 — 그 경위와 "문서가 코드와 어긋나 있을 수 있다"는 경고는
[[gopumgyeok-shadcn-detour-reverted]] 참고. 아래 내용은 **되돌린 뒤의 실제 코드 기준**이다.

**컬러 토큰** (`assets/css/style.css` `:root`)
```
--bg:#0E0C0A  --bg-card:#FFFFFF  --bg-card-2:#211B14
--gold:#C9A227  --gold-light:#E8CD7A
--text:#333333               /* 기본값 — 라이트 섹션/카드용. 다크 섹션에서만 --text-invert 로 재선언 */
--text-invert:#F3EEE2        /* 어두운 배경(히어로/메뉴/수익분석/창업비용/매장위치)용 밝은 본문색 */
--text-dim:#B3A995  --muted:#7A7264  --line:#332C22
--red:#A6291F   /* HACCP 배지·豚 태그에서 채택한 강조 레드 */
```
`--bg-card`가 흰색(`#FFFFFF`)이라는 점이 헷갈리기 쉽다 — 예전 메모에 `#18140F`(어두운 카드)로
적혀 있었다면 그건 오기다. 다크 섹션(`.menu`/`.profit`/`.cost`/`.location`)은 자체 스코프에서
`--text: var(--text-invert)`로 뒤집어 쓰고, 트러스트 카드·창업비용 헤더 행·모바일 nav
플라이아웃·문의 폼 입력창처럼 흰 카드가 필요한 자리만 `--bg-card`를 그대로 쓴다.

**폰트**: Pretendard 단일 패밀리(100~900, 9웨이트). Song Myung 등 세리프는 **사용자가 명시적으로 요청해 완전 제거**했으므로 다시 넣지 말 것.
2026-09-02부터 `assets/fonts/Pretendard-*.woff2` 로 **self-host** 한다(`assets/css/fonts.css`
`@font-face`). 예전엔 `index.html`이 `fonts.googleapis.com/css2?family=Pretendard…`를 썼는데
Google Fonts에 Pretendard가 없어 **HTTP 400**이었다(2026-09-01 확인, 이제는 해결됨 — 이 사실은
과거 이력으로만 남겨둔다). `01 경쟁력` 포스터 타이틀(`.comp-title`)만 예외로
`RixYeoljeongdo`(`assets/fonts/RixYeoljeongdo.woff2`)를 쓴다 — 다른 곳으로 확장하지 말 것.

**시그니처 장치**: 웨이브(wave) SVG 디바이더 = 카탈로그의 "물결형 인테리어" 브랜드 정체성을 섹션 구분선으로 시각화한 것. 영수증 카드는 [[gopumgyeok-receipt-card]] 참고.

**5섹션 구조** (nav 5개 = 섹션 5개, `scrollIntoView` 스무스 스크롤)
1. `#competitiveness` 경쟁력 — 3대 핵심경쟁력 카드 + 트러스트 스트립(HACCP·7호점·25종+·ECO)
2. `#menu` 메뉴 — 고기 9종 그리드 + 셀프바 25종 원형 그리드
3. `#profit` 수익분석 — 영수증 롤 카드 3개
4. `#cost` 창업비용 — 항목표(가맹비/교육비/보증금/인테리어/설비/초도물품), 금액 미확보 상태
5. `#location` 매장위치 — 매장 3곳 Swiper 캐러셀(2026-09-02부터. 정적 3열 그리드에서 전환) + 문의폼.
   이 프로젝트 유일의 외부 JS 의존성(jsdelivr CDN `swiper@11`). 배경은 매장 개업식 사진
   (`assets/imgs/bg.png`) 블러 처리, 컨트롤 아이콘은 Lucide SVG 인라인. 섹션 자체도 이때 흰
   배경 → 어두운 배경으로 바뀌어, 이제 전 섹션이 어두운 톤이다(흰 배경 섹션 없음)

히어로는 nav에 포함되지 않는 인트로 섹션. **2026-09-01에 대대적으로 비워냈다** — 자세한 구조와 패럴랙스는 [[gopumgyeok-hero-parallax]] 참고.
현재 남은 것은 5개뿐: 배경(`meat_platter.jpg` 풀블리드) + 그라디언트 오버레이 + 중앙 스택(아이캐치 문구 → 골드 그라디언트 워드마크 → 서브카피 → CTA 버튼 2개 → "창업문의 1877-1960" 알약 배지). 폰트 크기는 2026-09-02부터 프로젝트 전역 규칙(18~96px)이 적용됐다 — [[gopumgyeok-landing-project]] 또는 `docs/design.md` Typography 참고.

**`.hero-wordmark`는 이 96px 규칙의 유일한 예외다.** 원래 132px → 96px로 줄었다가(2026-09-02),
2026-09-03에 사용자가 "타이틀을 더 크게" 요청 → 96px 상한을 지키며 임팩트를 키우는 대안(letter-spacing/그림자 등)을 먼저 제안했으나 사용자가 명시적으로 96px 예외를 선택 →
`docs/design.md`에 남아있던 "132px→96px" 이력을 근거로 원래 값 132px로 복원. 현재 `clamp(72px,15vw,132px)`.
같이 확인할 것: `wordmarkIntro` 팝 인트로는 원래 1회성(`both`, 애니메이션 없음 반복)이었는데
2026-09-03에 "6초마다 반복" → 다시 "3초가 너무 길다"는 피드백으로 최종 **3초 주기 무한 반복**
(`animation: wordmarkIntro 3s … infinite`)으로 바뀌었다. 팝 자체의 체감 속도(약 0.85s)는 유지하고
나머지 구간은 scale(1)/opacity:1로 정지해 있다가 주기마다 다시 팝인다.
다른 요소에 96px 예외를 유추 확장하지 말 것 — [[gopumgyeok-font-size-rule-exception]] 참고.

**히어로에서 삭제된 것 — 사용자가 하나씩 지목해 없앴다. 되살리지 말 것:**
- `.hero-bottom-photos` (하단 좌우 고기 사진, radial 마스크 페이드)
- `.hero-tag-float` (좌측 "#프리미엄 대패삼겹살 / 물결형 인테리어 시그니처")
- `.hero-underline` (워드마크 아래 붉은 SVG 웨이브) — 이 요소가 갖고 있던 아래 여백 28px은 `.hero-wordmark`로 옮겼다
- `.hero-callout` (골드 배지 "왕십리 · 천호 · 시흥은계 3개 매장 운영중!")
- 히어로 직후의 `.wave` 디바이더 1개 (3개 중 첫 번째). **남은 웨이브는 `.wave--from-profit`
  단 하나뿐**이다(03 수익분석 → 04 창업비용 사이) — "2개 남아있다"는 옛 기록은 오기다.
  2026-09-04 shadcn 작업 중 "실제 마크업이 없는 죽은 CSS"로 오판해 지웠다가, 같은 날
  `git show HEAD:index.html`로 대조해 실재 마크업임을 확인하고 되살렸다
  ([[gopumgyeok-shadcn-detour-reverted]] 참고) — 다시 죽은 코드로 오판하지 말 것.
- "왕십리/천호/시흥은계 오픈일" 하단 스트립 (05 섹션과 중복)

`.hero-badge-phone`은 **삭제가 아니라 이동**이다 — 우상단 절대배치(헤더 "창업 상담" 버튼에 가려졌었다)에서 중앙 스택 맨 아래로 옮겨 `display:inline-flex` + 부모의 `text-align:center`로 정렬한다.

**`.hero-center`는 `.hero-badge-phone`(inline-flex)은 `text-align:center`로 잘 센터링되지만,
`display:flex`(block-level) 자식은 그렇지 않다.** 2026-09-17, `.hero-cta-group`(두 CTA
버튼을 감싸는 flex 컨테이너)에 고정폭(`width:215px`)을 줬더니 왼쪽으로 쏠려 보이는 버그가
났다 — `.hero-center`는 `display:flex`가 아니라 그냥 block에 `text-align:center`만 있는데,
`text-align`은 인라인 콘텐츠만 센터링하고 block-level 고정폭 요소(`display:flex`도
block-level)는 센터링하지 못한다. `margin:0 auto`를 명시적으로 추가해서 고쳤다. **앞으로
`.hero-center` 안에 고정폭 block/flex 요소를 새로 추가할 때마다 반복될 수 있는 함정** —
`text-align:center` 하나만 믿지 말고 `margin:0 auto`가 필요한지 항상 확인할 것.

**문의하기 Bottom Sheet 팝업 (2026-09-04 신규, 2026-09-09 오픈 트리거 전면 교체)** —
헤더/히어로/창업비용/05 매장위치 CTA(`[data-open-inquiry]` 버튼)를 누르면 열리는 모달
(`#inquirySheetBackdrop`, `assets/js/script.js` `initInquirySheet`). **2026-09-09, "02 메뉴
섹션(`#menu`)에 스크롤로 진입할 때마다 자동으로 열리는" 동작은 사용자 요청으로 완전히
제거됐다** — 옛 기록(이 메모리의 예전 버전 포함)에서 "자동으로 열린다"는 서술을 보면 이
날짜 이전 기록이다. 대신 화면 우측 가장자리에 딱 붙는 세로형 퀵 탭(`.inquiry-fab`,
`position:fixed; right:0; top:50%; transform:translateY(-50%)`)이 새로 생겨 `[data-open-
inquiry]` 트리거 목록에 자동 포함됐고, 이제는 오직 클릭으로만 연다. 이 탭은 같은 세션 안에서
원형 플로팅 버튼 → 다크 세로 탭(서브라벨 "QUICK CONTACT" 포함) → 골드 그라디언트+
`wordmarkIntro` 팝 인트로 → 골드 그라디언트+`wordmarkShine` 흐름 반짝임 순으로 다섯 번
바뀌었다가, 최종적으로 **애니메이션 전혀 없는 단색 `background:var(--gold-light)`
배경 + "창업 문의" 라벨 하나**(`writing-mode:vertical-rl; text-orientation:upright`로
회전 없이 글자를 위→아래로 쌓음)로 정착했다 — 화려한 버전들을 다 시도해본 뒤 가장 단순한
정적 형태로 되돌아간 것이니, 다음에 이 탭을 만지게 되면 애니메이션을 다시 제안하지 말고
이 단색 정적 상태가 최종 기준임을 전제할 것. 05 섹션 맨 아래의 원래 인라인 문의 폼
(`#inquiryForm`)과는 완전히 별개 — 이 시트는 자체 `#inquirySheetForm`을 쓰고, 제출해도
버튼 텍스트만 바뀌는 목업이다. 시트 자체는 다크 섹션 스코프 밖(body 직속)이라 `--text`의
기본값(라이트 카드용 `#333333`)을 그대로 쓰고, 골드 포인트(제출 버튼·포커스 링)만 얹는다.

**⚠ `.inquiry-fab`은 더 이상 "항상 보이는" 정적 탭이 아니다(2026-09-11 변경).** 위 문단은
그 전까지의 상태를 서술한 것 — 형제 시안 0007-B의 `.sticky-inquiry-bar`(하단 고정 문의
폼 바, 아래 문단 참고)가 0007에도 이식되며 데스크톱(>1024px)에 같은 역할의 CTA가 두 개
뜨게 됐고, 사용자 요청으로 `.inquiry-fab`은 **PC에서 `display:none`, 모바일(≤1024px)
에서만 `display:flex`**로 뒤집혔다. `.sticky-inquiry-bar`는 반대로 데스크톱 전용(≤1024px
에서 숨음)이라 두 CTA가 겹치지 않고 폭에 따라 정확히 하나씩만 보인다.

**하단 고정 문의 폼 바 + shadcn Select + 통일 동의 체크박스 (2026-09-11 신규, 0007-B 이식)**
— 0007-B에서 먼저 만들어진 세 컴포넌트를 0007의 골드/레드 아이덴티티로 재현해 05 인라인
폼(`#inquiryForm`)·문의 모달(`.inquiry-sheet-form`)·하단 고정 바(`.sticky-inquiry-bar`)
세 곳에 공통 적용했다:
- `.sticky-inquiry-bar` — 화면 하단에 고정된 데스크톱 전용 인라인 폼(로고+전화번호, 이름/
  연락처/창업유형/창업희망지역 입력, 동의 체크박스, 제출 버튼 한 줄). 다크 배경(`--bg-card-2`)
  이라 body 직속 스코프 밖에서 `--text-invert`/밝은 테두리(`rgba(243,238,226,.35)`)로
  직접 재반전해야 한다 — 섹션 기반 자동 반전(`--text:var(--text-invert)`)이 적용되는
  범위가 아니다. footer의 `padding-bottom`에 이 바의 실측 높이(약 80px)만큼 여유를
  더해뒀다(안 그러면 데스크톱에서 바가 footer 마지막 줄을 덮는다).
- `.select-field` — 네이티브 `<select>` 대신 트리거 버튼 + `role="listbox"` 패널로 만든
  shadcn 스타일 커스텀 드롭다운(`initCustomSelects`, script.js). `.sticky-inquiry-bar`
  안에서만 패널이 트리거 **위쪽**으로 펼쳐지게 뒤집혀 있다(화면 맨 아래 고정이라 아래로
  펼치면 뷰포트 밖으로 나간다).
- `.form-agree`/`.form-agree-check`/`.form-agree-more` — 동의 체크박스는 네이티브
  input을 시각적으로만 숨기고(`position:absolute;opacity:0`) 둥근 사각 배지로 대체한
  컴포넌트. 세 곳 모두 "개인정보처리방침 동의 · 전문보기" 형태로 통일했다. 글꼴 크기
  16px는 18~96px 규칙의 **두 번째** 예외([[feedback_font-size-rule-exception]] 참고).
  2026-09-17, **세 번째 예외**로 `.inquiry-sheet-form`(문의하기 Bottom Sheet) 스코프 안의
  `label`/`input`/`select`/`textarea`/`.select-field-trigger`/`.select-field-item`이
  `14px`로 확정됐다 — 이 폼은 애초부터 14px였는데 "창업유형" 커스텀 셀렉트만 전역 18px를
  써서 불일치가 있었고, 전역을 올리는 대신 기존 14px에 맞췄다. 다른 select-field(05 인라인
  폼·`.sticky-inquiry-bar`)는 여전히 18px.
- "문의유형"(select)/"문의내용"(textarea) 필드는 세 폼 전부에서 "창업유형"(select: 신규
  창업/기존 매장 전환/다점포 확장/상담 후 결정)/"창업희망지역"(자유 텍스트)으로 바뀌었다 —
  옛 스크린샷이나 커밋 메시지에서 "문의유형/문의내용"을 보면 이 변경 이전 기록이다.
- `#inquiryForm`/`.inquiry-sheet-form` 안에서 이 공용 컴포넌트를 쓸 때 겪은 CSS 특이성
  함정은 [[feedback_css-specificity-scoped-vs-global]] 참고 — 같은 함정이 반복해서
  발생했다.

**콘텐츠 데이터**: 2026-09-01부터 `data/content.json` 이 단일 진실 공급원이다(경쟁력·트러스트·고기·셀프바·수익·창업비용·매장·연락처). `index.html` 은 빈 컨테이너만 갖고 `assets/js/script.js` 가 `fetch` 로 채운다. **JS 안에 `FALLBACK` 사본을 두지 않았다** — 그래서 `file://` 더블클릭으로는 콘텐츠가 안 뜬다(안내 문구가 대신 표시됨). 로컬 서버로 볼 것.

**JS 구조** (`assets/js/script.js`, `defer`): `boot()` 가 JSON 을 읽어 `renderAll()` 로 8개 영역을 그린 뒤 `initReceiptReveal()` 을 붙인다. 데이터와 무관한 `initSmoothScroll()` / `initMobileNav()`(1024px↓ 햄버거) / `initScrollSpy()` / `initInquiryForm()`(목업) 은 fetch 전에 먼저 붙는다.

**CSS 파일 분리 + 반응형 브레이크포인트 (2026-09-02 확정)**
`assets/css/` 는 역할별 4개 파일이고 `index.html` 이 이 순서로 로드한다:
`init.css`(리셋: `*`/`html`/`body`/`img`/`a`/`ul,li`) → `fonts.css`(`@font-face` — Pretendard
9웨이트 + RixYeoljeongdo) → `animations.css`(`@keyframes` 전부, 컴포넌트 전용이어도 예외 없음) →
`style.css`(토큰 + 컴포넌트, 위 세 파일을 이름으로만 참조). 새 리셋/폰트/키프레임을 추가할 때
`style.css` 에 다시 섞어 넣지 말 것.
반응형은 **`@media (max-width:1024px)` 하나만** 쓴다 — 1024px 초과 PC / 1024px 이하 모바일의
2단계 구조다. 이전엔 900(nav)/820(카드 그리드 다수)/700(고기 그리드·창업비용 표) 세 값이
컴포넌트마다 따로 쓰였는데 전부 1024px 로 통일했다. 새 반응형 규칙도 이 값만 재사용할 것 —
`.hero-center{ max-width:900px; }` 처럼 브레이크포인트가 아니라 순수 레이아웃 폭 제한으로 쓰인
값은 이 통일 대상이 아니다. 자세한 내용은 `docs/design.md` Layout 절 참고.
