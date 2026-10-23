# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@docs/TECH-STACK-PRIORITY.md

---

# 고품격대패 — 프랜차이즈 창업 랜딩페이지

**실제 클라이언트(고품격대패)에게 제출/운영되는 랜딩 사이트**다. 원래 빌드 도구 없는 정적
HTML/CSS/JS 시안(시안A_v2)이었다가 2026-09-22 이후 **Next.js 14 App Router + React 18 +
TypeScript** 로 이식됐다. 그 정적 소스(`index.html`, `assets/`, `data/`, 루트 `style.css`/`script.js`)는
이제 저장소에 없다 — 오래된 문서·커밋 메시지·`README.md`(2026-09-01 인수인계 스냅샷)에서 그 경로를
보면 이식 이전 기록이다. 클라이언트 요구사항·카탈로그 원본 같은 히스토리는 `README.md`, 색상 토큰/
타이포 크기표/컴포넌트별 정확한 값은 **`docs/design.md`** 가 정본이다.

---

## 명령어

```bash
yarn dev        # next dev  → http://localhost:3000
yarn build      # next build (타입체크 포함)
yarn lint       # next lint (ESLint + prettier/prettier 경고)
yarn format     # prettier --write "src/**/*.{ts,tsx,css}"
npx tsc --noEmit  # 타입체크만
```

- **패키지 매니저는 yarn 고정**(`yarn.lock`), Node ≥ 22. npm 으로 설치하지 않는다.
- **테스트 러너는 없다.** 검증은 `tsc`/`lint`/`build` + 실제 브라우저 렌더 확인이다.
  **CSS 를 만졌으면 반드시 실제로 렌더해서 확인한다.**
- 환경변수(`.env.example` 참고): `NEXT_PUBLIC_CMS_API_BASE_URL`(CMS 백오피스 `go_daepae.cms.api`,
  기본 `http://localhost:3001/api/v1`), `NEXT_PUBLIC_POSTHOG_KEY`/`NEXT_PUBLIC_POSTHOG_HOST`.
- `next` 는 보안 패치 버전 `14.2.35` 로 고정이며 형제 저장소 `go.daepae.cms.api` 와 **같은 버전으로
  함께 올린다**(`docs/TECH-STACK-PRIORITY.md`).

---

## 아키텍처

### 콘텐츠는 `src/data/content.json` 하나가 단일 진실 공급원

경쟁력 카드·트러스트·고기/셀프바·수익 매장·창업비용표·매장 카드·연락처가 전부 이 JSON 에 있고,
`src/app/page.tsx` 가 정적 import 해 각 섹션 컴포넌트(`src/components/sections/*`)에 props 로 내려준다
(타입은 `src/types/content.ts`). **문구·이미지 경로를 바꿀 일은 거의 항상 JSON 만 고치면 된다.**
이미지/폰트는 `public/assets/{imgs,fonts}` 에서 `/assets/...` 로 서빙된다.

### CMS 연동은 `src/libs/api.ts` 의 `dataFetch` 한 곳으로만

- 가맹문의 제출 `POST /franchise-inquiries` (`useInquirySubmit`)
- 팝업 조회 `GET /public/franchise-popups` (`CmsPopupModal`, 모듈 캐시 + 하루 단위 "오늘 하루 안 보기")

호출부는 endpoint 만 넘기고 base URL 조합·JSON 헤더는 `dataFetch` 가 처리한다. CORS 관련 이력은
`.claude/memory/gopumgyeok-cms-*.md` 참고.

### 문의 UI 는 한 훅·한 시트·세 개의 폼

`layout.tsx` 가 `SiteHeader`/`InquiryFab`/`InquirySheet`/`CmsPopupModal`/`StickyInquiryBar`/`SiteFooter`
를 전역으로 얹는다. 문의 관련 구조는 여러 파일을 읽어야 보인다:

- **제출 로직은 `useInquirySubmit` 하나**(`idle/sending/success/error`, 버튼 글자 전환, `done`/`dismiss`
  완료 상태)를 Bottom Sheet(`InquirySheet`)·05 인라인 폼(`InlineInquiryForm`)·하단 고정 바
  (`StickyInquiryBar`, 데스크톱 전용) 3곳이 공유한다. 폼 필드를 바꾸면 **세 곳을 같이** 고친다.
- **시트 열기는 `openInquirySheet()`**(`useInquirySheetTrigger`, `window` CustomEvent) — 헤더/히어로/
  창업비용/우측 세로 탭(`InquiryFab`) 버튼이 호출하고, 시트는 `useInquirySheetOpenListener` 로 듣는다.
  버튼 문구는 **"문의하기"로 통일**돼 있다.
- **접수 완료 팝업은 `InquirySuccess.tsx` 공용** — 시트 내부 오버레이와 인라인/스티키 폼의 중앙
  팝업(`InquirySuccessModal`)이 같은 본문(`InquirySuccessContent`)을 쓴다.
- 허니팟 필드(`website`, `.hp-field`)와 `PhoneInput`/`SelectField`(커스텀 드롭다운)도 세 폼 공용.
- 분석 이벤트는 `track()`(`libs/analytics.ts`)로 — **이름·연락처 같은 개인정보는 props 에 넣지 않는다.**
  PostHog 는 키가 없으면 초기화되지 않고 `track` 은 no-op 이다.

### 스타일은 레거시 CSS 4개를 그대로 이식했다 (Tailwind 로 재작성하지 않는다)

`layout.tsx` 가 `globals.css`(Tailwind v4 + shadcn 변수) → `styles/legacy/init.css`(리셋) →
`fonts.css`(`@font-face`) → `animations.css`(**모든 `@keyframes`**) → swiper css →
`styles/legacy/style.css`(토큰 + 컴포넌트) 순으로 import 한다. 픽셀 단위로 여러 차례 확정된 디자인이라
유틸리티 클래스로 갈아엎지 않는다(요청이 명시적일 때만). 새 리셋/폰트/키프레임을 `style.css` 에
섞지 않는다.

- `style.css` 는 각 컴포넌트 블록 **바로 뒤에** 해당 `@media` 가 붙는 구조다. 새 반응형 규칙도 파일
  끝이 아니라 그 컴포넌트 옆에. **브레이크포인트는 `max-width:1024px` 하나만** 쓴다(1024 초과 = PC).
  새 값을 만들지 않는다. 파일 끝 `prefers-reduced-motion` 블록은 유지하고, **새 애니메이션을 만들면
  그 블록에도 예외를 추가**한다.
- 색은 `style.css` `:root` 토큰(11개)에서 가져온다. 새 색을 하드코딩하지 않는다(정확한 값은
  `docs/design.md`).
- **폰트 크기는 18px~96px 범위만 허용**(고정값·`clamp()` 최소/최대 모두). 예외는 `.hero-wordmark`,
  `.form-agree`/`.form-agree-more`(16px), 문의 시트 폼 내부 전체(14px) 세 곳뿐이며 다른 요소로 유추
  확장하지 않는다.
- 스크롤 리빌은 `useScrollReveal`(IntersectionObserver, 한 번만 `in-view` 부여)·`useInView` 훅.

### CSS 함정

- **다크 섹션 스코프**: 히어로·경쟁력·메뉴·창업비용·매장위치 등은 어두운 배경이라 섹션에서
  `--text: var(--text-invert)` 로 재선언한다. 이 스코프 **안에서 렌더되는 흰 카드/입력칸/팝업**
  (`.trust-item`, 인라인 폼의 접수 완료 팝업, 입력칸 등)은 `--text`/`--text-dim` 을 상속하면 글자가
  배경에 묻힌다 — 색을 직접 지정하거나 한 번 더 뒤집는다. (최근에도 입력칸·완료 팝업에서 두 번 났다.)
  현재 흰 배경인 섹션은 `#profit` 하나뿐이다(2026-10-01 전환) — 섹션 밝기는 `docs/design.md` 참고.
- **공용 태그 셀렉터 특이성**: 05 인라인 폼은 스코프 없는 전역 `label`/`input,select,textarea`/`form`
  규칙을 쓰고, 문의 시트(`.inquiry-sheet-form`)는 같은 태그를 class+type 으로 재스코프해 뒀다.
  공용 컴포넌트(`.select-field` 등)를 두 곳에 넣으면 속성을 전부 다시 선언해야 한다.
- **시트 안 드롭다운은 `position: static`** 으로 흐름 안에 펼친다(absolute 로 되돌리면 하단 고정
  제출 버튼과 겹친다).
- **영수증 카드(03 수익분석)**: 종이 그림자는 `.receipt-body` 의 `filter: drop-shadow()`(종이에
  `box-shadow` 를 걸면 스캘럽 틈으로 새어 회색 띠가 생긴다), 절취선은 `clip-path` 가 아니라
  `mask-image: radial-gradient(circle …)` 둥근 스캘럽(반지름 10px/간격 14px), 매출 숫자 뒤 "원" 단위는
  삭제된 상태 — "정리"하면 회귀다.

### 시그니처 장치

`.wave` SVG 디바이더는 브랜드의 "물결형 인테리어" 정체성을 섹션 구분선으로 옮긴 것이다 — 장식이
아니므로 섹션을 재배치해도 유지한다.

### 05 매장위치 캐러셀

Swiper(`swiper` npm, `StoreCarousel`)를 쓰고 배경은 `bg.png` 블러, 컨트롤 아이콘은 Lucide 인라인 SVG다.
상세는 `docs/design.md` "매장위치 캐러셀".

---

## ⚠️ `.claude/` 스캐폴딩 주의

`.claude/rules/01~04` 는 형제 프로젝트 `0003`(아이스크림 팔레트 카드)에서 복사된 것으로 **이 프로젝트와
맞지 않는다**(`data/palettes.json`, `FALLBACK`, ES5/빌드 금지 등을 전제) — 인용하지 않는다.
`hooks/validate-palettes.sh` 도 이 프로젝트에선 무해한 no-op 이다. 실제 의사결정 맥락은
`.claude/memory/`(`MEMORY.md` 인덱스; `SessionStart` 훅 `load-memory.sh` 가 세션 시작 시 자동 주입)와
`README.md` 에 있다. 새 메모리는 이 저장소의 `.claude/memory/` 에 쓴다(`/save-memory` 스킬).

## 알려진 이슈

1. **창업비용 금액이 전부 "상담 시 안내"** — 카탈로그에 실제 금액이 없다. 값이 오면 `content.json`
   의 `cost` 에서 채운다.
2. **이미지 대부분이 카탈로그 PDF 크롭본(저해상도)**, 셀프바 이미지 다수는 미사용 여분이다(누락 아님).
   프로덕션에서는 클라이언트 원본 사진으로 교체. 용량은 avif 전환 등으로 이미 일부 최적화했다.
3. 프로덕션 마이그레이션 로드맵(Next.js + Supabase, 관리자모드·도메인·호스팅)은 `README.md` 참고 —
   현재 문의 저장은 Supabase 가 아니라 별도 CMS API 로 간다.

## 되살리면 안 되는 것

사용자가 명시적으로 제거를 지시한 항목이다. 개선처럼 보여도 되돌리지 않는다.

- Song Myung 등 **세리프 폰트** — Pretendard 단일 패밀리(+ 디스플레이용 RixYeoljeongdo)로 확정
- 히어로 하단 **"왕십리/천호/시흥은계 오픈일" 스트립** — 05 매장위치와 중복이라 제거
- 영수증 매출 숫자의 **"원" 단위**
- 2026-09-04 하루 동안만 있었던 **shadcn 뉴트럴 그레이스케일 재디자인** — 골드/레드 디자인으로 원복됨
