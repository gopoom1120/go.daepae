# 고품격대패 — Design Guide

`0007` 랜딩(시안A_v2)의 디자인 시스템 문서다. 실제 `index.html` / `assets/css/*.css` 를 기준으로
작성했으며, 코드와 문서가 어긋나면 **코드가 항상 우선**이다 — 이 문서는 스냅샷이지 소스가 아니다.

**2026-09-04, 이 골드/레드 시스템을 하루 동안 [shadcn/ui](https://ui.shadcn.com/) 뉴트럴 톤으로
전면 재설계했다가, 같은 날 사용자가 "이전과 똑같이" 되돌려달라고 요청해 색상·타이포그래피·
애니메이션·스큐어모픽 디테일(펀치홀 노치·리본 코너·영수증 프린터슬롯/스캘럽/바코드)을 전부
원복했다.** 이 문서는 그 원복 이후 기준이다 — RixYeoljeongdo 폰트, `--gold`/`--red` 토큰,
워드마크 팝/샤인 애니메이션 모두 예외 없이 현재 코드의 실제 상태다. 다른 md 파일이나 과거
커밋 메시지에서 "shadcn 뉴트럴 토큰"을 언급하는 내용을 보면 그 하루 동안의 이력임을 감안할 것.

---

## Overview

- **컨셉**: "대패의 격이 다르다" — 고급 대패삼겹 프랜차이즈 창업 제안 랜딩. 어두운 톤 + 골드 포인트로
  "프리미엄 정육점/스테이크하우스" 느낌을 낸다.
- **구조**: 단일 페이지, 5개 섹션(경쟁력 → 메뉴 → 수익분석 → 창업비용 → 매장위치) + 히어로 + 푸터.
  섹션은 `id`로 구분되고 상단 내비게이션과 스크롤스파이(`initScrollSpy`)로 연결된다.
- **빌드 없음**: HTML5/CSS3/바닐라 JS(ES6) + `assets/imgs/` 이미지가 전부다. 유일한 예외는
  05 매장위치 캐러셀에 쓰는 **Swiper.js**(jsdelivr CDN, `swiper@11/swiper-bundle.min.{css,js}`,
  2026-09-02 추가) — 이 프로젝트 최초의 외부 JS 런타임 의존성이다. 빌드 단계 없이 `<link>`/
  `<script defer>` 만으로 붙였으므로 "빌드 도구 없음" 원칙 자체는 깨지 않았다.
- **CSS 는 역할별로 4개 파일로 분리되어 있다** (2026-09-02 확정) — `index.html` 이 이 순서로 로드한다:
  1. `assets/css/init.css` — 브라우저 기본값 리셋(`*`, `html`, `body`, `img`, `a`, `ul/li`)만 담는다.
  2. `assets/css/fonts.css` — `@font-face` 선언만 담는다(Pretendard 9웨이트 self-host + RixYeoljeongdo).
  3. `assets/css/animations.css` — `@keyframes` 로 정의하는 모든 애니메이션을 담는다(컴포넌트
     전용이어도 예외 없이 여기로 모은다).
  4. `assets/css/style.css` — 디자인 토큰(`:root`)과 실제 컴포넌트 스타일. 위 세 파일에 정의된
     리셋/폰트/키프레임을 이름으로 참조해서 쓴다.

  새 `@font-face`/`@keyframes`/리셋 규칙을 추가할 때도 반드시 해당 파일에 넣는다 — `style.css`
  에 다시 섞어 넣지 않는다.
- **콘텐츠 단일 진실 공급원**: `data/content.json`. 카드 문구·이미지·수치를 바꿀 일이 생기면 거의 항상
  이 파일만 고치면 된다(`assets/js/script.js` 가 `fetch` 로 읽어 8개 영역을 렌더링).
- **베이스 상태**: 전 섹션(히어로/경쟁력/메뉴/수익분석/창업비용/매장위치)이 어두운 배경을 쓴다 —
  하나의 다크 테마로, 섹션마다 배경 장식(그라디언트/워터마크 사진/블러 사진)만 달라지는 구조다.
  경쟁력 섹션은 원래 흰 배경이었으나 "임팩트가 약하다"는 피드백으로 2026-09-02에 다시 어두운
  배경으로 되돌렸고(골드 글로우 + 상차림 사진 워터마크), 같은 날 매장위치 섹션도 정적 흰 그리드에서
  Swiper 캐러셀 + 블러 처리한 매장 사진(`bg.png`) 배경으로 바뀌면서 마지막 흰 섹션이 사라졌다.
  자세한 규칙은 Colors 참고.

---

## Colors

### 디자인 토큰 (`assets/css/style.css` `:root`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#0E0C0A` | 페이지 기본 배경(거의 검정), 메뉴/경쟁력/창업비용 섹션 배경, 경쟁력 노치 펀치홀 색 |
| `--bg-card` | `#FFFFFF` | 카드/인풋 배경, 경쟁력 트러스트 배지 카드 배경, 모바일 nav 플라이아웃, 창업비용표 헤더 행(2026-09-02부터 섹션 전체 배경으로는 더 이상 쓰이지 않는다 — 매장위치가 마지막 흰 섹션이었다) |
| `--bg-card-2` | `#211B14` | 매장위치 섹션 안의 어두운 스토어 카드 배경, 경쟁력 티켓 카드 짝수 배경 |
| `--gold` | `#C9A227` | 브랜드 골드(진한 톤) — 라벨, 강조, 포커스 컬러 |
| `--gold-light` | `#E8CD7A` | 브랜드 골드(밝은 톤) — 본문 강조, 호버 상태 |
| `--text` | `#333333` | 기본 텍스트(밝은/흰 배경용) |
| `--text-invert` | `#F3EEE2` | 어두운 배경(히어로/메뉴/수익분석/창업비용)에서 쓰는 밝은 본문색 |
| `--text-dim` | `#B3A995` | 보조 텍스트(어두운 배경 기준 값) |
| `--muted` | `#7A7264` | 가장 낮은 우선순위 텍스트(각주 등) |
| `--line` | `#332C22` | 구분선, 테두리 |
| `--red` | `#A6291F` | 강조 배지, 매출 숫자, 절취선 패턴 |

### "섹션마다 배경이 바뀐다" 문제와 해법

`--bg-card` 는 흰색이고 `--text` 는 어두운 글자색이다. 하지만 히어로·메뉴·수익분석·창업비용 섹션은
여전히 **어두운 배경**을 쓴다. 그래서 이 섹션들은 컨테이너 셀렉터에서 CSS 커스텀 프로퍼티를
**로컬로 재정의**해 밝은 값으로 되돌린다:

```css
.hero{ --text: var(--text-invert); }
.menu{ --text: var(--text-invert); }
.profit{ --text: var(--text-invert); }
.cost{ --text: var(--text-invert); }
.competency{ --text: var(--text-invert); }   /* 2026-09-02: 흰 배경 → 다시 어두운 배경으로 */
.location{ --text: var(--text-invert); }     /* 2026-09-02: 마지막 흰 섹션도 어두운 배경사진으로 */
```

그리고 어두운 섹션 **안에 다시 밝은/어두운 박스**가 있으면(`.comp-card`, `.trust-item`) 그 박스
셀렉터에서 `--text`/`--text-dim` 을 **한 번 더 뒤집는다**. 즉 색 규칙은 "가장 가까운 조상의
실제 배경 밝기"를 따라 다시 선언하는 식으로 중첩된다 — 새 컴포넌트를 추가할 때 반드시 자신이 앉을
배경이 밝은지 어두운지 먼저 확인하고 그에 맞는 텍스트 토큰 스코프를 잡을 것. 예를 들어 경쟁력
섹션의 `.trust-item` 은 어두운 섹션 배경 위에서 강한 대비를 내려고 **흰 카드**로 만들었으므로,
`--text`/`--text-dim` 을 전역 토큰이 아니라 밝은 카드에 맞는 값(`#231B12`/`#6B6B6B`)으로 직접
지정해 "두 번 뒤집힌" 상태를 만든다. `.store-card` 는 반대로 이 패턴에서 **빠진** 예다 — 매장위치
섹션이 흰 배경이던 시절에는 어두운 카드로 만들려고 `--text`/`--text-dim` 을 뒤집었지만, 2026-09-02
이후 `.location` 자체가 어두운 배경이 되면서 부모와 카드의 밝기가 같아져 더 이상 오버라이드가
필요 없어졌다.

### 그 외 하드코딩 색상 (토큰화되지 않음, 용도가 국지적이라 의도적으로 리터럴 사용)

- 영수증 카드: 종이 `#F6F1E4` / 잉크 `#221E17` — 실제 영수증 용지 색을 재현하므로 브랜드 토큰과 무관.
- 창업비용 배지: `#F7E9E4`(글자) on `var(--red)`.
- 인쇄 바(프린터 슬롯) 메탈 그라디언트 `#F2F1EE → #77746E`.

---

## Typography

- **서체**: Pretendard 단일 패밀리 (`-apple-system, BlinkMacSystemFont, sans-serif` 폴백), 9웨이트
  모두 `assets/fonts/Pretendard-*.woff2` 로 self-host 한다(`assets/css/fonts.css`). 2026-09-02
  이전에는 `index.html` 이 Google Fonts CSS2 링크를 썼는데, Google Fonts 에는 Pretendard 가
  없어 항상 HTTP 400 이 떨어지고 `-apple-system` 폴백으로만 렌더링되던 known issue였다 — 로컬
  woff2 로 옮기며 해결했다.
- **섹션 타이틀 안의 강조 문구는 빨간색(`var(--red)`)**: 2026-09-02, `.comp-title` 의
  `.cline--accent`(경쟁력 "세 가지 기준")와 같은 의도로 나머지 4개 섹션 타이틀에도 강조 문구를
  빨간색으로 표시했다. `.section-head h2` 안에서는 `<span class="h2-accent">` 로 감싸면 되고
  (`.section-head h2 .h2-accent{ color:var(--red); }`), 수익분석(`.profit-head h2`)은 원래
  있던 `<em>` 태그의 색만 `var(--gold-light)` → `var(--red)` 로 바꿨다. 색만 재사용하고
  `.cline--accent` 의 외곽선/그림자(pop-art extrusion)는 이 타이틀들에는 넣지 않는다 — 그
  효과는 경쟁력 포스터 타이틀 전용이다. 실제 강조 문구:
  - 경쟁력: "세 가지 기준" (`.cline--accent`, 외곽선 포함)
  - 메뉴: "9가지" (`.h2-accent`)
  - 수익분석: "거짓 없는 선택!" (`<em>`)
  - 창업비용: "창업 준비 항목" (`.h2-accent`)
  - 매장위치: "확장을 증명하는 기록" (`.h2-accent`)
  - 문의 소제목: "함께하세요" (`.inquiry-left h3 em`)
- **강조 문구 "즉시 토글" 임팩트 효과(`.accent-impact`, 2026-09-03)**: 위 6개 강조 문구 전부에
  `accent-impact` 클래스를 같이 걸었다(기존 색상용 클래스는 유지). 처음엔 스크롤 진입 시 1회
  스냅되는 IntersectionObserver 방식이었는데, "스크롤과 무관하게 섹션마다 전부 동일하게, 한
  번만이 아니라 무한 반복으로"라는 요청으로 순수 CSS 무한 애니메이션으로 바꿨다 — JS 관여
  없음. `assets/css/style.css` 의 `.accent-impact{ animation:accentSnap 2.6s infinite; }` 가
  `assets/css/animations.css` 의 `@keyframes accentSnap`(흐림/작음 ↔ 빨간색/원래 크기,
  전환 구간이 `15%→15.01%` 로 razor-thin해 기본 이징이 걸려 있어도 보간 시간이 사실상 없다)을
  돌린다 — `transition` 대신 극단적으로 좁은 keyframe 구간으로 "즉시"를 만드는 트릭이다.
  `prefers-reduced-motion` 에서는 `.accent-impact{ animation:none !important; opacity:1
  !important; transform:none !important; }` 로 고정한다(맨 아래 미디어쿼리).
- **예외 — 섹션 상단 타이틀(`.section-head h2`, `.profit-head h2`, `.comp-title`, `.inquiry-left h3`)**:
  2026-09-02에 `RixYeoljeongdo`(`@font-face`, `assets/fonts/RixYeoljeongdo.woff2`) 를 5개 섹션
  헤드라인 + 05 매장위치 문의 블록 소제목("지금, 고품격대패와 함께하세요")에 적용했다(처음엔
  경쟁력만 넣었다가 순차적으로 확장). 폰트 자체가 굵은 디스플레이체라
  `font-weight` 는 `800` 대신 `400` 을 쓴다 — 800 을 주면 브라우저가 가짜로 두껍게 합성해
  지저분해진다. 히어로 워드마크(`.hero-wordmark`)는 5개 섹션에 속하지 않는 별도 인트로라
  이 예외에 포함되지 않고 계속 Pretendard 900 골드 그라디언트를 쓴다. `RixYeoljeongdo` 는 이
  프로젝트에서 Pretendard가 아닌 폰트를 쓰는 **유일한 예외**다 — 세리프 폰트 금지 규칙과는
  별개(디스플레이용 고딕 계열이라 저촉되지 않음)다. 섹션 타이틀 밖(본문, 라벨, 버튼 등)으로는
  확장하지 않는다.
- **크기 범위 규칙(2026-09-02 확정, 2026-09-03 `.hero-wordmark` 예외 추가, 2026-09-11
  `.form-agree`/`.form-agree-more` 예외 추가, 2026-09-17 `.inquiry-sheet-form` 예외 추가)**:
  **`font-size` 는 18px 이상 96px 이하다.**
  라벨·배지·각주·폼 힌트처럼 전통적으로 "잔글씨"였던 자리도 예외 없이 18px 이상이다. 새 요소를
  추가할 때 이 범위를 벗어나는 값을 쓰고 싶다면 — 쓰지 말고 18~96px 안으로 맞출 것. 이 규칙
  때문에 조정된 것들:
  - `.contact-line .k` 너비 90px → 110px (라벨이 18px 로 커져서)
  - `.hero-wordmark` 상한은 원래 132px → 96px 로 줄었다가(2026-09-02), 사용자가 임팩트를 위해
    96px 상한 예외를 명시적으로 요청해 2026-09-03 에 132px 로 되돌아갔다 — 96px 초과 예외는
    이 요소 하나뿐이며, 다른 요소에 유추 확장하지 않는다.
  - 동의 체크박스 라벨/"전문보기" 링크(`.form-agree`, `.form-agree-more`)는 2026-09-11 사용자가
    "본문과 같은 눈높이로 읽힐 필요 없는 보조 요소"라는 이유로 18px 하한 예외를 명시적으로
    요청해 `16px` 로 확정됐다 — 18px 미만 예외는 이 두 셀렉터뿐이며, 다른 라벨/배지/각주에
    유추 확장하지 않는다.
  - 문의하기 Bottom Sheet(`.inquiry-sheet-form`) 안의 `label`/`input`/`select`/`textarea`는
    처음부터 `14px`였는데(2026-09-04 신설 당시부터, 이 규칙 문서화 이전), 그 안의 "창업유형"
    커스텀 셀렉트(`.select-field-trigger`, `.select-field-item`)만 전역 규칙을 따라 18px를
    써서 유독 커 보이는 불일치가 있었다. 2026-09-17 사용자 요청으로 전역 18px 로 올리는 대신
    이 폼 안의 select-field 두 셀렉터를 기존 14px 에 맞췄다 — `.inquiry-sheet-form` 스코프
    밖의 다른 select-field(05 인라인 폼·`.sticky-inquiry-bar`)는 여전히 18px 그대로다. 18px
    미만 예외는 `.form-agree`/`.form-agree-more`와 이 `.inquiry-sheet-form` 스코프뿐이며,
    다른 곳에 유추 확장하지 않는다.
- **스케일**: 반응형 요소는 `clamp(min, vw, max)`(단, `min` ≥ 18px, `max` ≤ 96px), 고정 요소는
  px 리터럴(18~96px)을 쓴다 — 미디어쿼리로 폰트 크기를 계단식으로 바꾸지 않는다.

#### 반응형(`clamp()`) — 뷰포트에 따라 유동

| 요소 | 값 | 굵기 |
|---|---|---|
| 섹션 타이틀 전체(`.comp-title`, `.profit-head h2`, `.section-head h2`, `.inquiry-left h3`) | `clamp(34px, 5vw, 64px)` | 400(`RixYeoljeongdo`) |
| 히어로 워드마크(`.hero-wordmark`) | `clamp(72px, 15vw, 132px)`(96px 상한 규칙의 유일한 예외, 2026-09-03) | 900(Pretendard — 5개 섹션에 속하지 않아 RixYeoljeongdo 예외 대상 아님) |
| 히어로 서브카피(`.hero-sub2`) | `clamp(18px, 1.55vw, 22px)` | 400 |
| 히어로 eyebrow(`.hero-eyebrow2`) | `clamp(18px, 1.25vw, 20px)` | 400 |
| 버튼(`.btn-primary`, `.btn-ghost`) | `clamp(18px, 1.15vw, 19px)` | 700 / 400 |
| 히어로 전화 배지(`.hero-badge-phone`) | `clamp(18px, 1.05vw, 19px)` | 500 |
| 영수증 매장명(`.r-store`) | `clamp(22px, 18cqw, 42px)`(컨테이너쿼리 기준, `vw` 는 폴백) | 900 |
| 영수증 매출액(`.r-sales`) | `clamp(22px, 16cqw, 44px)` | 900 |

#### 고정(px) — 뷰포트와 무관

| 크기 | 요소 |
|---|---|
| 22px | 경쟁력 타이틀 상단 별 장식(`.comp-stars`) |
| 16px | 동의 체크박스 라벨/"전문보기" 링크(`.form-agree`, `.form-agree-more`) — 18px 하한 규칙의 두 번째 예외(2026-09-11) |
| 14px | `.inquiry-sheet-form` 안의 `label`/`input`/`select`/`textarea`/`.select-field-trigger`/`.select-field-item` — 18px 하한 규칙의 세 번째 예외, 이 폼 스코프 안으로 한정(2026-09-17) |
| 20px | `.nav-logo` |
| 19px | 경쟁력 카드 타이틀(`.comp-card h3`), 트러스트 배지 카드 타이틀(`.trust-item h5`) |
| 18px | 그 외 전부 — `.nav-links`(모바일 플라이아웃 포함), `.nav-cta`, `.kicker`, `.section-head p`,
  `.comp-num`, `.comp-card p`, `.trust-num`, `.trust-item p`, `.meat-label`, `.selfbar-note`(+`b`), `.sb-item span`,
  `.profit-sub`, `.r-label`, `.r-sub`, `.r-date`, `.profit-footnote`, `.cost-row span`(헤더 행 포함),
  `.cost-badge`, `.cost-note p`, `.store-card .meta h4`, `.store-card .meta .date`, `.map-btn`,
  `.inquiry-left p`, `.contact-line .k`/`.v`, `label`, `input`/`select`/`textarea`, `.submit-btn`,
  `.footer-logo span`, `footer .meta`, `footer .socials a`, 데이터 로드 실패 안내문(`assets/js/script.js` 인라인) |

- **굵기**: 제목 800~900(black 에 가까운 굵기), 본문 400~500, 강조(`<b>`) 600~800.
- **인라인 강조**: `data/content.json` 의 `desc` 류 필드에 한해 `<b>` 태그를 그대로 HTML 삽입
  허용(그 외 필드는 `esc()` 로 이스케이프). `<b>` 는 대부분 `var(--gold-light)` 로 물든다.

---

## Layout

- **컨테이너**: `.wrap{ max-width:1120px; margin:0 auto; padding:0 32px; }` — 모든 섹션 콘텐츠가
  이 폭 안에 정렬된다. **부분 예외**: `05 매장위치`(`.location`)는 2026-09-03부터 `.location-right`
  (매장 캐러셀)만 `.wrap` 을 뚫고 나가 뷰포트 오른쪽 끝까지 채운다 — `.location-left`(타이틀·설명·
  컨트롤 버튼)와 하단 문의 폼(`.inquiry-grid`)은 그대로 `.wrap` 안에 머문다. 자세한 내용은 아래
  "매장위치 캐러셀" 절 참고.
- **섹션 리듬**: `section{ padding:120px 0; }`, 섹션 헤드(`.section-head`)는 `margin-bottom:64px`,
  `max-width:640px` 로 본문보다 좁게 잡아 타이틀 가독성을 확보한다.
- **그리드** (전부 아래 단일 브레이크포인트 기준):
  - 경쟁력 카드: 3열(PC) → 1열(모바일)
  - 트러스트 스트립: 4열 → 2열
  - 메뉴(고기): 3열 → 2열
  - 셀프바: 8열 → 4열
  - 창업비용 표: `1fr 2fr 1fr` → 가운데 열 숨김, `1fr 1fr`
  - 매장 카드: 3열 → 1열
  - 문의 폼: `0.9fr 1.1fr` 2열 → 1열
  - 내비게이션: 가로 메뉴 → 햄버거 + 흰 배경 풀스크린 플라이아웃
- **브레이크포인트(2026-09-02 확정)**: **PC/모바일 2단계, 기준 `max-width:1024px`** 하나만 쓴다.
  가로 1024px 초과는 PC 버전, 1024px 이하는 모바일 버전이다. 예전에는 900/820/700px 세 값이
  컴포넌트마다 섞여 있었는데, 전부 `1024px` 로 통일했다 — **새 반응형 규칙도 `@media
  (max-width:1024px)` 만 쓰고, 다른 값을 새로 만들지 않는다.** (`.hero-bg` 의
  `@media (max-width:1024px), (hover:none)` 처럼 `hover:none` 같은 능력 기반 쿼리를 폭 조건과
  함께 쓰는 건 별개 관심사라 계속 허용된다.) `.hero-center{ max-width:900px; }` 처럼 브레이크포인트가
  아니라 순수 레이아웃 폭 제한으로 쓰인 `900px` 값은 이 규칙과 무관하므로 바꾸지 않는다.
- **미디어쿼리 위치**: 해당 컴포넌트 블록 바로 뒤에 붙인다(파일 끝에 몰아두지 않음, 파일을
  4개로 나눈 뒤에도 이 관례는 `assets/css/style.css` 안에서 그대로 유지). 대략 "토큰 → nav →
  hero → wave → section 공통 → 섹션별(경쟁력→메뉴→수익분석→창업비용→매장위치) → 폼 → 푸터 →
  접근성 → reduced-motion" 순서를 유지한다.
- **히어로는 `position:sticky`**: 배경·문구·버튼이 화면에 고정된 채 다음 섹션이 그 위로 스크롤되어
  덮인다. `.wave`, `footer` 처럼 sticky 뒤에 오는 정적 형제는 `position:relative` + `z-index` 로
  sticky 위에 그려지도록 만든다.

---

## Elevation & Depth

레이어는 그림자·블러·z-index 조합으로 표현한다. 별도의 "elevation 토큰"은 없고 컴포넌트별로
직접 값을 쓴다 — 새 컴포넌트를 추가할 때는 아래 기존 값 중 가장 가까운 것을 재사용할 것.

| 용도 | 값 |
|---|---|
| 카드 기본 뜸(경쟁력 티켓 카드) | `box-shadow:0 30px 70px -24px rgba(0,0,0,.35)` |
| 카드 호버(경쟁력) | `box-shadow:0 28px 44px -16px rgba(0,0,0,.4)` + `translateY(-10px)` |
| 히어로 워드마크 앰비언트 그림자 | `drop-shadow(0 18px 26px rgba(0,0,0,.6))` 류(현재는 제거된 상태 — 재적용 시 이 값을 기준으로) |
| 영수증 종이 그림자 | `drop-shadow(0 16px 20px rgba(0,0,0,.45))` — **`filter:drop-shadow` 만 쓴다.** `.receipt-body` 에
  `box-shadow` 를 걸면 종이 하단 스캘럽(둥근 절취선)의 투명한 틈으로 그림자가 새어 회색 띠가 생긴다 |
| 프린터 바(금속) | 외부 그림자 + 붉은 테두리 글로우 + 내부 하이라이트/그림자 4겹 조합(`box-shadow` 콤마 목록) |
| 헤더 배경 분리 | 그림자 대신 `background:rgba(0,0,0,.6)` 반투명 판 + `border-bottom` 로 아래 섹션과 분리 |
| 포커스 링(접근성) | `outline:2px solid var(--gold-light); outline-offset:2px;` |

**규칙**: 반투명 검정 오버레이가 필요할 때(`header.nav` 처럼) **`opacity` 를 요소 자체에 걸지 않는다.**
`opacity` 는 자식(로고·텍스트·버튼)까지 함께 흐리게 만든다 — 배경에만 알파를 준 `rgba()`/그라디언트를
쓸 것.

---

## Shapes

- **모서리**: 대부분 각지거나 아주 약한 라운드(`border-radius:2px`) — 버튼, 인풋, 창업비용 표,
  카드 프레임(`.meat-card`) 전부 이 값을 공유한다. 브랜드가 "칼같이 정직한" 느낌을 원해서 둥근
  모서리를 거의 안 쓴다.
- **예외 — 경쟁력 티켓 카드**: 큰 라운드(`border-radius:28px` 프레임, 낱장 타일은 `26px`)를 쓰는
  컴포넌트. 참고 시안(치킨신드롬 혜택 카드)을 재현한 "티켓" 은유라서 의도적으로 다르다. 좌우
  가장자리에 반지름 13px 원(`::before`/`::after`, 배경색 = 섹션 배경)을 배치해 티켓에 펀치홀이 뚫린
  것처럼 보이게 한다 — **섹션 배경색이 바뀌면 이 원의 `background` 도 함께 바꿔야** 이질감이 안 생긴다.
- **예외 — 매장위치 캐러셀 카드**: 2026-09-03부터 `.store-card` 도 큰 라운드(`border-radius:20px`)로
  바뀌었다 — 풀블리드 사진 카드 레퍼런스를 그대로 재현한 것. "매장위치 캐러셀" 절 참고.
- **원형**: 셀프바 아이템(`.sb-item .circle`, `border-radius:50%`), 히어로 배지 폰(`border-radius:999px`,
  알약형), 프린터 바(`border-radius:999px`).
- **시그니처 웨이브**: `.wave` SVG(물결 패스)가 브랜드의 "물결형 인테리어" 정체성을 섹션 구분선으로
  가져온 장치다. 장식이 아니라 브랜드 요소이므로 임의로 없애지 않는다(사용자가 명시적으로 지우라고
  하지 않는 한).
- **영수증 절취선**: 지그재그 `clip-path` 가 아니라 `mask-image:radial-gradient(circle …)` 로 만든
  둥근 스캘럽(반지름 10px, 간격 14px). 다른 곳에 절취선이 필요해도 이 방식을 따른다.

---

## Components

### Navigation (`header.nav`)
고정 헤더, 반투명 검정 배경(`rgba(0,0,0,.6)`). 로고 + 5개 링크(스크롤스파이로 `active` 갱신) +
CTA 버튼 + 모바일 햄버거(≤1024px 에서 흰 배경 풀스크린 플라이아웃으로 전환).

### Hero (`.hero`)
`position:sticky` 배경 사진(패럴랙스, `background-attachment:fixed`) + 오버레이 그라디언트.
`.hero-wordmark` 는 골드 그라디언트 텍스트(`background-clip:text`)에 진입 시 화면을 꽉 채울 만큼
커졌다가(`scale(4.4)`) 빠르게(0.85s) 제자리로 줄어드는 `wordmarkIntro` 애니메이션과, 계속 흐르는
`wordmarkShine` 그라디언트 반짝임을 가진다. 두 `@keyframes` 모두 `assets/css/animations.css` 에 있다
(컴포넌트 전용이어도 예외 없이 그쪽에 모은다 — 아래 CSS 파일 분리 규칙 참고).

### 경쟁력 섹션 배경 (`.competency`)
2026-09-02부터 어두운 배경(`var(--bg)` + 좌상단 은은한 골드 radial glow)이다. `::before` 로
우상단에 상차림 사진(`assets/imgs/generated.png`, 투명 배경 PNG)을 깔고 `mask-image` 선형
그라디언트로 좌하단을 향해 페이드아웃시켜 배경에 자연스럽게 녹아들게 한다(불투명도 `.55`).
텍스트를 크게 키워 배경 장식을 만들지 않는다 — 폰트 크기 18~96px 규칙이 예외 없이 적용되므로,
장식은 반드시 이미지/SVG 로 그린다(글자가 아니다).

### 경쟁력 카드 — "티켓" 그리드 (`.comp-grid` / `.comp-card`)
어두운 라운드 프레임(펀치홀 노치 포함) 안에 타일 3개. 타일은 홀/짝으로 배경 톤이 미묘하게
갈린다(`#1C160E` / `var(--bg-card-2)` — 섹션 배경(`var(--bg)`)보다 밝게 잡아야 카드가 배경에
묻히지 않는다). 좌우 펀치홀 노치(`.comp-grid::before/::after`)는 섹션 배경 톤(`var(--bg)`)과
같은 색을 칠해야 뚫린 것처럼 보인다 — 섹션 배경이 바뀌면 이 값도 반드시 같이 바꾼다. 각 타일 구성:
1. 상단 중앙 아이콘(`::after`, 카드마다 다른 인라인 SVG data-URI, 흰색 스트로크, `mask` 대신
   `background-image` 를 직접 씀 — 색은 SVG 안에 하드코딩)
2. 골드 eyebrow 라벨(`.comp-num`, 대문자)
3. 흰색 굵은 타이틀(`h3`)
4. 본문(`p`) — 안의 `<b>` 키워드는 골드로 강조되며 **`keywordBlink` 애니메이션으로 계속 깜빡인다**
   (1.6s 주기, `opacity 1 ↔ .4`)

스크롤 진입 시 `initGridReveal`(IntersectionObserver, threshold 0.2)이 `.in-view` 를 한 번만 붙여
`compCardReveal`(아래→위 페이드) 애니메이션을 카드 순서대로 딜레이 재생한다(반복 재생 아님).
호버 시 카드가 10px 떠오르고, 상단 골드 바가 왼쪽→오른쪽으로 채워지며, 아이콘이 살짝 확대된다.

### 트러스트 스트립 (`.trust-strip` / `.trust-item`)
4개 통계(HACCP/7호점/25종+/ECO), "POINT 카드" 스타일 레퍼런스를 참고해 리본형 뱃지 카드로
디자인했다. 어두워진 섹션 배경 위에서 대비를 강하게 내려고 **흰 카드**(`var(--bg-card)`)로
만든다 — 경쟁력 티켓 카드(어두운 카드)와 반대다. 카드 구성:
1. 좌측 상단 골드 그라디언트 번호 배지(`.trust-num`, `01`~`04`) — 데이터가 아니라
   `script.js` `renderTrust` 가 배열 순서(`i+1`)로 생성한다
2. 우측 상단 접힌 리본 모서리(`::before`, `border-width` 트라이앵글 트릭으로 그린 삼각형, 골드)
3. 중앙 아이콘(`::after`, 항목마다 다른 SVG, **진한 색 스트로크** `#2A2118` — 흰 카드 위라 경쟁력
   카드 아이콘과 달리 골드가 아니라 어두운 색을 쓴다. 골드는 리본/배지 전용으로 남겨 위계를 만든다)
4. 제목(`h5`, 어두운 텍스트)과 설명(`p`)은 `--text`/`--text-dim` 을 흰 카드에 맞는 값
   (`#231B12`/`#6B6B6B`)으로 로컬 재정의한다

경쟁력 카드와 같은 `compCardReveal` 진입 애니메이션을 공유하고, 호버 시 카드가 떠오르며 리본
색이 밝아지고 제목이 확대+ 진한 골드로 바뀐다.

### 메뉴 카드 (`.meat-card`, 2026-09-09 원형으로 전면 교체)
사각형 사진 + 하단 그라디언트 오버레이 라벨 구조였다가, 사용자가 참고 이미지(동그란 틀 안에
담긴 고기 사진)를 보여주며 요청해 `.meat-card__circle`(4px 다크 보더 + drop-shadow, 원형
`border-radius:50%`, `object-fit:cover`) + 원 아래 `.meat-card__label` 캡션 구조로 바뀌었다.
02 메뉴 섹션에 스크롤로 진입하면 아래→위 페이드인(`compCardReveal` 키프레임 재사용,
`initGridReveal` 이 `#meatGrid .meat-card` 를 관찰 대상에 포함) — 경쟁력 카드와 같은 리빌
패턴을 그대로 가져다 썼다. 호버 시 원 안 이미지만 `scale(1.15)`.

### 수익분석 영수증 (`.receipt-*`)
프린터 슬롯에서 영수증이 뽑혀 나오는 은유. `initReceiptReveal` 은 IntersectionObserver 가
아니라 **`scroll` 이벤트 리스너**로 구현돼 있다 — 뷰포트 상단(`window.scrollY`)이 `#profit`
자체가 아니라 그 앞 02 메뉴 섹션의 `#selfbarGrid` 상단 좌표를 지나는 순간 모든 `.receipt-col`
에 한꺼번에 `.in-view` 를 주고, 다시 그 지점 위로 스크롤을 올리면 제거한다(그 지점을 지날
때마다 반복 재생). 2026-09-03부터 종이가 펼쳐지는 실제 애니메이션은 `.receipt-mask` 의
`clip-path`(`inset(0 0 100% 0)` → `inset(0 0 0% 0)`)로 처리한다 — 이전에는
`max-height:0→760px` 를 움직였는데, 그 방식은 `.receipt-mask` 의 문서 흐름 높이 자체가 접힘/
펼침마다 바뀌어 `03 수익분석` 섹션 전체 높이가 스크롤 도중 출렁이는 문제가 있었다. `clip-path`
는 레이아웃 높이(항상 실제 콘텐츠 높이)에 영향을 주지 않고 보이는 영역만 위→아래로 드러내므로
섹션 높이가 접힘/펼침 상태와 무관하게 고정된다.
**"원" 단위는 사용자 요청으로 삭제됨 — 되살리지 않는다.**

**매출 숫자 카운트업 (`.r-sales`, 2026-09-09 신규, 같은 날 트리거 분리)** — 처음엔 종이 펼침과
같은 트리거(`initReceiptReveal`)에 얹었으나, 종이는 `#selfbarGrid`를 지나자마자(03 섹션에
도착하기 한참 전에) 미리 펼쳐지는 구조라 사용자가 실제로 03 섹션을 보기도 전에 카운트업이
끝나버려 "인터랙션이 없다"는 피드백을 받았다. 그래서 영수증 카드(`.receipt-col`) 자신이 화면에
얼마나 보이는지를 관찰하는 별도 `initProfitCountReveal`로 분리했다 — `initReceiptReveal` 과
같은 `scroll` 이벤트 + `getBoundingClientRect` 방식(IntersectionObserver 가 아님: 이 프로젝트
헤드리스 검증 환경에서 프로그래매틱 `scrollTo` 뒤 IO 콜백이 재발화하지 않는 한계가 확인돼,
반복 리빌 계열은 전부 scroll 리스너로 통일한다). 카드가 40% 이상 보이면 0→실제값으로
카운트업(`animateSalesCount`, ease-out cubic, 1.1초)하고, 40% 미만으로 벗어나면 다시 0으로
리셋한다. `unobserve`/`disconnect` 없이 계속 관찰해 드나들 때마다 반복 재생된다.
`prefers-reduced-motion: reduce` 에서는 애니메이션 없이 바로 최종 값을 표시한다.

### 창업비용 표 (`.cost-table` / `.cost-row`)
3열 그리드 표. 헤더 행(`.cost-head`)만 흰 배경 + 골드 라벨. 현재 모든 금액이 "상담 시 안내" —
실제 수치를 받으면 `index.html` 의 정적 마크업에 바로 채워 넣을 수 있다.

### 매장위치 캐러셀 (`.location-*` / `.store-swiper` / `.store-card`)
2026-09-03, 좌측 텍스트(`.location-left`)는 `.wrap`(max-width:1120px) 안에 그대로 두고
`.location-right`(캐러셀)만 뷰포트 오른쪽 끝까지 bleed 시켰다 — 참고 레퍼런스처럼 "텍스트는
본문 폭, 이미지는 화면 꽉 차게"를 구현한 것. `.location-right{ margin-right: min(-32px,
calc(528px - 50vw)); }` — 528px 은 `.wrap` 콘텐츠 폭(1120-32*2=1056)의 절반. 이 값만큼 grid
트랙의 auto 폭이 음수 마진을 흡수해 오른쪽으로 늘어난다. `min()` 은 `.wrap` 이 더 이상 중앙
정렬되지 않는 1024~1120px 구간에서 확장폭이 32px 밑으로 떨어지지 않게 하는 안전장치다. 1024px
이하 모바일(1열 스택)에서는 비대칭 bleed 가 어색해 `margin-right:0` 으로 되돌린다.

이 bleed 가 섹션 경계에 잘리지 않으려면 `.location{ overflow:hidden; }` 을 섹션 자체에 걸면 안
된다 — 배경 블러(`.location-bg{ transform:scale(1.08); }`)가 살짝 부풀어 오르는 것만 잘라내는
전용 프레임 `.location-bg-frame{ position:absolute; inset:0; overflow:hidden; }` 을 따로 두고,
`.location-bg` 를 그 안에 넣었다. `body{ overflow-x:hidden; }`(`assets/css/init.css`)가 페이지
레벨에서 가로 스크롤 발생을 막아주므로 bleed 자체는 안전하다.

하단 문의 폼(`.inquiry-grid`)은 `.location-layout` 과 별개로 자기 자신만의 `.wrap` 으로 감싸
1120px 폭을 유지한다(즉 이 섹션 안에 `.wrap` 이 두 번 나온다) — 캐러셀의 bleed 와는 무관하다.

2026-09-02, 정적 3열 그리드에서 Swiper.js 캐러셀로 바꿨다 — 이 프로젝트 **최초의 외부 JS
의존성**(jsdelivr CDN `swiper@11/swiper-bundle.min.{css,js}`, `index.html` 에 `<link>`/`<script
defer>` 로 로드).

**카드 디자인(`.store-card`)은 2026-09-03에 레퍼런스를 참고해 풀블리드 사진으로 바꿨다** —
`.store-card{ position:relative; aspect-ratio:8/9; border-radius:20px; overflow:hidden; }` 안에
`.photo`(`position:absolute; inset:0`) 하나만 있고, 사진이 카드 전체를 꽉 채운다. 카드 배경 토큰
(`--bg-card-2`)은 더 이상 쓰이지 않는다. 이 카드만 `border-radius:20px` 로 둥글다(다른 컴포넌트는
대부분 2px 안팎의 각진 프레임, Shapes 절 참고) — 레퍼런스가 명시적으로 요구한 둥근 카드라 의도된
예외다.

**이름·오픈일·지도 버튼은 카드 위가 아니라 좌측 컬럼의 `.store-caption` 에 있다**(같은 날 후속
수정) — 처음엔 카드 하단에 그라디언트 스크림으로 얹었지만, "정보가 좌우 컨트롤 버튼 바로 위에
있으면 좋겠다+ 슬라이드가 넘어갈 때마다 그 정보가 바뀌어 보이면 좋겠다"는 요청으로 위치를
옮겼다. `.store-bottom`(`.location-left` 안, `.section-head` 다음)이 `.store-caption` +
`.store-nav` 를 한 덩어리로 묶어 항상 붙어 다니게 하고, `.location-left` 의
`justify-content:space-between` 이 이 덩어리를 타이틀 블록 반대편(맨 아래)에 붙인다.

내용 동기화는 `assets/js/script.js` `initStoreSwiper` 의 `syncCaption()` 이 담당한다 — 각
`.swiper-slide` 에 `data-name`/`data-date`/`data-map-url` 속성을 심어두고(`renderStores`),
Swiper 의 `slideChange` 이벤트마다 `swiper.slides[swiper.activeIndex].dataset` 를 읽어
`.store-caption` 을 다시 그린다. `loop:true` 로 Swiper 가 슬라이드를 복제해도 원본의 data-*
속성까지 그대로 복사되므로, `activeIndex` 가 복제본을 가리키는 경우까지 감안한 `realIndex`
보정 없이 그냥 `activeIndex` 로 읽어도 항상 맞는 데이터가 나온다.

레이아웃은 좌(`.location-left`: 섹션 헤드 + 캡션 + 원형 컨트롤 3개) / 우(`.location-right`:
캐러셀) 2단 그리드(`.location-layout{ grid-template-columns:0.85fr 1.15fr; }`, 1024px 이하에서
1열로 스택). 배경은 `.location-bg`(`assets/imgs/bg.png` 매장 개업식 사진, `filter:blur(6px)` +
`transform:scale(1.08)` 로 블러 가장자리를 숨김) 위에 `.location-overlay` 어두운 대각선
그라디언트(`linear-gradient(100deg, rgba(14,12,10,.94)…)`)를 얹어 왼쪽 텍스트의 대비를 확보한다
— `.hero-bg`/`.hero-overlay` 와 같은 절대배치 레이어 패턴 재사용.

Swiper 설정(`assets/js/script.js` `initStoreSwiper`): `slidesPerView:1.08`(1024px↑에서 `1.35`)
+ `spaceBetween`, `loop:true`, `autoplay`(4.2초 간격, 마우스 오버 시 정지) — 다음 카드가 오른쪽에
살짝 겹쳐 보이는(peeking) 효과를 낸다. `prefers-reduced-motion` 이면 `autoplay:false` + `speed:0`
으로 자동재생 자체를 켜지 않는다(CSS 쪽 마지막 미디어쿼리와 대칭). 이전/다음은
`navigation:{ prevEl:'.store-nav-prev', nextEl:'.store-nav-next' }` 로 좌측 원형 버튼에 연결하고,
가운데 일시정지 버튼(`#storeAutoplayToggle`)은 클릭 시 `swiper.autoplay.stop()/.start()` 를
토글하며 버튼 안의 아이콘 두 개(`.icon-pause`/`.icon-play`)를 `.is-paused` 클래스로 전환한다.

컨트롤 버튼 아이콘은 **Lucide**(lucide.dev, MIT) 소스에서 그대로 가져온 인라인 SVG다 —
`chevron-left`(`m15 18-6-6 6-6`), `chevron-right`(`m9 18 6-6-6-6`), `pause`(세로 막대 2개,
`rect x=14/5 y=3 width=5 height=18 rx=1`), `play`(삼각형 `path`). `stroke="currentColor"` 라
`.store-nav-btn` 의 `color` 토큰만 바꾸면 아이콘 색도 같이 바뀐다 — 프로젝트가 이미 쓰던
"인라인 SVG 아이콘" 관례(`PIN_SVG`, 경쟁력/트러스트 아이콘)와 동일한 방식이라 별도 아이콘
폰트나 스크립트가 필요 없다.

### 문의 폼 (`.inquiry-grid` / `form`)
완전 목업 — `initInquiryForm` 이 `submit` 을 가로채 버튼 텍스트만 바꾼다. 실제 전송 없음(추후
Next.js + Supabase 마이그레이션 예정).

### 우측 스크롤바 세로형 문의 퀵 탭 (`.inquiry-fab`, 2026-09-09 신규, 같은 날 네 차례 형태 변경)
화면 우측 가장자리(스크롤바 자리)에 딱 붙어 세로 중앙에 고정된 탭. 우측 하단 원형 플로팅
버튼 → 다크 배경 세로 탭(서브라벨 "QUICK CONTACT" 포함) → 골드 그라디언트 + `wordmarkIntro`
팝 인트로 → `wordmarkShine` 흐름 반짝임 → **애니메이션 완전 제거 + 단색 `--gold-light`
배경**, 이 순서로 같은 날 다섯 번 바뀌었다. 마지막 변경은 사용자가 "애니메이션 없애고
배경을 `--gold-light`(#E8CD7A)로 고정해달라"고 요청해 반영했다 — 지금은 정적인 단색 탭이다.
`[data-open-inquiry]` 속성을 가지므로 헤더/히어로/창업비용/05 매장위치 CTA 와 같은 트리거
목록에 자동으로 포함되어 클릭 시 문의하기 Bottom Sheet 를 연다 — 별도 JS 없이 기존
`initInquirySheet` 의 `querySelectorAll('[data-open-inquiry]')` 로 잡힌다.

- `position:fixed; right:0; top:50%; transform:translateY(-50%); z-index:90` — 화면 우측
  가장자리에 완전히 밀착(오른쪽 여백 없음). Bottom Sheet 오버레이(`z-index:300`)보다는
  낮고 헤더(`z-index:100`)보다도 낮게 둬서, 시트가 열리면 자연스럽게 덮인다.
- 배경은 `background:var(--gold-light)`(#E8CD7A) 단색 — 애니메이션 없음.
  `border-radius:14px 0 0 14px`(왼쪽 모서리만 둥글게, 오른쪽은 화면 끝에 붙으므로 각짐),
  `box-shadow:-8px 0 24px rgba(0,0,0,.4)`(왼쪽으로만 그림자를 던져 화면에서 튀어나온
  탭처럼 보이게 한다).
- 라벨(`.inquiry-fab__label`, "창업 문의" 하나만 — 서브라벨 "QUICK CONTACT" 는 제거됨)은
  `writing-mode:vertical-rl; text-orientation:upright`로 글자를 회전시키지 않고 위→아래로
  쌓는다. 골드 배경 위라 텍스트는 `color:#1B1608`(어두운 잉크색, `.btn-primary` 와 같은 대비 문법).
- hover 시에는 `translateX(-6px)` 로 왼쪽으로 밀려나오며 그림자를 키운다.
- `max-width:1024px`: 패딩/간격만 축소, 위치·형태는 동일하게 유지.
- `wordmarkShine` 키프레임(`assets/css/animations.css`)은 더 이상 이 탭에 쓰이지 않고
  `.hero-wordmark` 전용으로 남는다 — `prefers-reduced-motion` 예외도 애니메이션 자체가
  없어졌으므로 `.inquiry-fab` 에는 더 이상 필요 없다.

### 문의하기 Bottom Sheet (`.inquiry-sheet-*`, 2026-09-04 신규, 2026-09-09 오픈 트리거 변경)
헤더/히어로/우측 하단 FAB/창업비용/05 매장위치의 `[data-open-inquiry]` 버튼 클릭으로 여는
모달(`initInquirySheet`, `#inquirySheetBackdrop`). 05 섹션 맨 아래의 원래 인라인 문의 폼
(`.inquiry-grid`)과는 완전히 별개 — 이 시트는 자체 `#inquirySheetForm` 을 쓰고, 제출해도
버튼 텍스트만 바뀌는 목업이다. **2026-09-09, 02 메뉴 섹션 진입 시 `IntersectionObserver` 로
자동으로 뜨던 동작을 제거하고 위 FAB 클릭으로만 열리도록 바꿨다** — 옛 문서에서 "`#menu`
진입 시 자동으로 뜬다"는 서술을 보면 이 변경 이전 기록이다.

- 오버레이: `background:rgba(0,0,0,.6)`, `opacity`/`visibility` 트랜지션(.2s).
- 카드: `max-width:480px`, `max-height:85vh`, `background:var(--bg-card)`(흰색),
  `border-radius:12px`, `box-shadow:0 20px 50px -12px rgba(0,0,0,.5)`. 열릴 때
  `translateY(12px) scale(.98) → translateY(0) scale(1)`.
- 시트 자체는 다크 섹션 스코프 밖(body 직속 형제)이라 `--text` 기본값(`#333333`, 라이트
  카드용)을 그대로 쓴다 — 별도 재선언 없이 골드 포인트만 얹는다.
- 로고: `.inquiry-sheet-brand img{ height:96px; }` — 사용자 요청으로 처음보다 키운 값.
- 입력창: `font-size:14px`, `border:1px solid #DCD5C4`, `border-radius:6px`.
- 제출 버튼(`.inquiry-sheet-submit`): `background:var(--gold)`, `color:#1B1608`,
  `font-size:15px; font-weight:700`, hover 시 `var(--gold-light)` — `.btn-primary`/
  `.submit-btn` 과 같은 골드 CTA 문법.
- `max-width:1024px`: 하단 고정 시트로 전환(`border-radius:16px 16px 0 0`,
  `translateY(100%) → translateY(0)`로 슬라이드 업).

### 버튼
- `.btn-primary`: 골드 배경, 다크 텍스트(`#1B1608`) — 가장 강한 CTA.
- `.btn-ghost`: 테두리만 있는 버튼, 히어로(어두운 배경) 전용.
- `.nav-cta`: 헤더용 아웃라인 버튼.
- `.submit-btn`: 폼 전용, hover 시 `var(--gold-light)`.

---

## Do's and Don'ts

### Do
- 색은 항상 `:root` 토큰(`var(--gold)` 등)에서 가져온다. 새 배경 밝기가 필요하면 그 컴포넌트
  스코프에서 `--text`/`--text-dim` 을 재정의하는 기존 패턴을 따른다(Colors 절 참고).
- 반응형 폭은 `clamp()` 로 처리하고, 브레이크포인트는 `max-width:1024px` 하나만 쓴다(PC/모바일 2단계).
- **`font-size` 는 항상 18px 이상 96px 이하**로 쓴다. `clamp()` 를 쓰더라도 `min` 이 18px 미만,
  `max` 가 96px 초과이면 안 된다.
- 새 애니메이션을 추가하면 **`prefers-reduced-motion` 블록에 반드시 예외를 추가**한다
  (`animation:none`, `transform:none`, `opacity:1` 로 무력화).
- **모든 `@keyframes` 는 `assets/css/animations.css` 에 정의한다** — 컴포넌트 전용이라도 예외
  없다(2026-09-02 확정). `assets/css/style.css` 에는 적용부(`animation: name …`)만 남긴다.
- **`@font-face` 는 `assets/css/fonts.css` 에, 리셋 규칙(`*`/`html`/`body`/`img`/`a`/`ul,li`)은
  `assets/css/init.css` 에 정의한다.** `assets/css/style.css` 에 다시 섞어 넣지 않는다.
- CSS 를 만졌으면 반드시 로컬 서버로 실제 렌더링해서 확인한다(`python3 -m http.server 8765`).
  지금까지 이 프로젝트의 CSS 버그는 전부 "브라우저로 본 적이 없어서" 생겼다.
- 문구·수치·이미지 경로를 바꿀 일이 있으면 `data/content.json` 을 고친다 — JS 안에 사본을 두지
  않는다(0007 은 `FALLBACK` 패턴을 의도적으로 안 쓴다).
- 절취선이 필요하면 `mask-image:radial-gradient()` 스캘럽 방식을 재사용한다.
- 반투명한 어두운 판이 필요하면 배경에만 알파를 준 `rgba()`/그라디언트를 쓴다.

### Don't
- **18px 미만 `font-size` 를 쓰지 않는다** — 각주·배지·폼 라벨처럼 원래 작게 쓰던 자리도 예외
  없다. 좁은 고정폭 요소(`.contact-line .k` 등)에 18px 텍스트가 안 들어가면 폭을 늘리지, 글자를
  줄이지 않는다. **96px 초과도 쓰지 않는다 — 단, `.hero-wordmark` 는 2026-09-03 에 사용자가
  명시적으로 96px 상한 예외를 요청해 `132px` 로 되돌아간 유일한 예외다**(Typography 절 참고).
  다른 요소에 이 예외를 유추 확장하지 않는다.
- **`opacity` 를 컨테이너 전체에 걸어 반투명 배경을 만들지 않는다** — 자식 텍스트/아이콘까지
  같이 흐려진다. 배경 레이어에만 알파를 준다.
- **영수증(`.receipt-body`)에 `box-shadow` 를 쓰지 않는다** — 스캘럽 틈으로 그림자가 새어 회색 띠가
  생긴다. `filter:drop-shadow()` 만 쓴다.
- **영수증 매출 숫자 뒤 "원" 단위를 다시 붙이지 않는다** — 사용자가 명시적으로 제거를 요청했다.
- **히어로 하단 "왕십리/천호/시흥은계 오픈일" 스트립을 되살리지 않는다** — 05 매장위치 섹션과
  중복돼서 제거됐다.
- **세리프 폰트(Song Myung 등)를 쓰지 않는다** — Pretendard 단일 패밀리로 확정.
- **`.wave` SVG 디바이더를 장식으로 취급해 삭제하지 않는다** — 브랜드의 "물결형 인테리어" 정체성을
  옮긴 시그니처 장치다. 명시적 요청 없이 없애지 않는다.
- **`js/app.js` 스타일의 `FALLBACK` 상수를 만들지 않는다** — 이 폴더는 형제 폴더(0003 등)와 다르게
  fetch 실패 시 이유를 화면에 보여주는 방식을 쓴다. 데이터 사본을 만들면 JSON 을 고쳐도 화면이
  안 바뀌는 함정이 생긴다.
- **새 색상 값을 컴포넌트 안에 직접 하드코딩하지 않는다** — 영수증/프린터 바처럼 "실물을 재현하는"
  국지적 색은 예외지만, 브랜드 색(골드/배경/텍스트)은 반드시 토큰을 통해서만 쓴다.
- **경쟁력 티켓 카드의 노치 색을 잊고 방치하지 않는다** — `.comp-grid::before/::after` 의
  `background` 는 부모 섹션 배경(현재 `var(--bg)`)과 같아야 펀치홀 착시가 유지된다. 섹션 배경을
  바꾸면 이 값도 함께 바꾼다.
- **`.claude/rules/*.md` 를 그대로 인용하지 않는다** — `0003`(아이스크림 카드) 컴포넌트 기준으로
  작성된 스캐폴딩이라 `data/palettes.json`, `js/app.js`, ES5/`FALLBACK` 같은 이 폴더에 없는 개념을
  전제로 한다. 실제 규칙은 이 문서와 `CLAUDE.md`, `.claude/memory/gopumgyeok-*.md` 를 따른다.
