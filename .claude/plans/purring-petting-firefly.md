# go.daepae — 콘텐츠 마이그레이션 (index.html → Next.js 컴포넌트)

## Context

1단계(환경 세팅, 완료)로 저장소 루트에 Next.js 14.2.35 + TypeScript + Tailwind v4 환경이 이미 구축되어 있다(`src/app/page.tsx`는 아직 임시 플레이스홀더). 이번 단계는 실제 랜딩 콘텐츠 — `index.html`(436줄, 헤더+12개 섹션+오버레이 3종) + `assets/js/{script.js,dataFetch.js,regexr.js}`(총 882줄의 렌더링/인터랙션 로직) + `data/content.json` — 를 React 컴포넌트로 옮기는 작업이다.

기존 정적 사이트(`index.html`/`assets/`/`data/`)는 **손대지 않고 그대로 둔다** — 지난 세션에 확인한 대로 원본 사이트가 계속 살아있어야 한다는 전제다. Next.js 쪽은 `public/`, `src/data/`에 필요한 파일을 **복사**해서 독립적으로 구성한다.

사전 조사에서 확인한 핵심 사실:
- `assets/js/dataFetch.js`/`regexr.js`는 CLAUDE.md 아키텍처 설명에 없는 헬퍼 모듈로, 문의폼 3곳(`#inquiryForm`/`#inquirySheetForm`/`#stickyInquiryForm`)이 실제로 `dataFetch('/franchise-inquiries', {method:'POST'})`를 통해 **CMS API(go.daepae.cms.api, 하드코딩된 `http://localhost:3001/api/v1`)에 실제 전송**하고 있고, `initPopup()`도 `/public/franchise-popups`를 실제로 fetch한다 — 이 부분은 "목업"이 아니라 실동작 연동이므로 그대로 옮긴다.
- CSS(`init/fonts/animations/style.css`, `docs/design.md`에 픽셀 단위로 확정된 값들)는 **그대로 global import** — Tailwind 재작성 안 함.
- 05 매장위치 캐러셀은 `swiper` npm 패키지(`swiper/react`)로 전환.
- 이미지/폰트는 `public/assets/imgs`·`public/assets/fonts`로 복사(원본 유지), `data/content.json`은 `src/data/content.json`으로 복사.
- CMS API 연동은 유지하되 base URL만 `NEXT_PUBLIC_CMS_API_BASE_URL` 환경변수로 뺀다.

## 에셋/데이터 이동 (원본은 그대로, 복사만)

- `assets/imgs/*` → `public/assets/imgs/*` (경로 접두사만 바뀌므로 참조 시 `assets/imgs/X` → `/assets/imgs/X`로 슬래시만 추가하면 됨 — 폴더명 자체는 유지해 리스크 최소화)
- `assets/fonts/*.woff2` → `public/assets/fonts/*.woff2`
- `data/content.json` → `src/data/content.json`, 단 **이미지 경로 필드(`meat[].image`, `selfbar[].image`, `stores[].image`)에 선행 슬래시 추가**(`assets/imgs/X` → `/assets/imgs/X`)해서 복사 — JSX에서 `<img src={item.image}>`로 바로 쓸 수 있게
- `assets/css/{init,fonts,animations,style}.css` → `src/styles/legacy/{init,fonts,animations,style}.css` 그대로 복사 후, 아래 `url()` 참조만 기계적으로 치환(디자인 값 자체는 절대 건드리지 않음):
  - `fonts.css` 10곳: `url('../fonts/X')` → `url('/assets/fonts/X')`
  - `style.css` 6곳(86, 217, 449, 586, 640행 — `meat_platter.jpg`/`generated.png`/`bg_map.png`/`con_bg.png`/`bg.png`): `url('../imgs/X')` → `url('/assets/imgs/X')`
  - `style.css`의 인라인 `data:image/svg+xml,...` 배경(264~266, 320~323행)은 경로가 아니므로 건드리지 않음

## 새 의존성

- `swiper` (React 공식 컴포넌트 `swiper/react` + 모듈 `Navigation`/`Autoplay`/`EffectFade`/`Pagination`/`A11y`/`Keyboard` 사용, CSS는 `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination`, `swiper/css/effect-fade`만 필요한 것만 import)

## 컴포넌트/파일 구조

```
src/
  data/content.json                 (복사 + 이미지 경로 슬래시 보정)
  types/content.ts                  (content.json 형태의 TS 인터페이스)
  libs/
    utils.ts                        (기존 cn(), 그대로)
    format.ts                       (formatWon, formatPhoneNumber — regexr.js/script.js 포팅. esc()는 JSX가 기본 이스케이프하므로 포팅 불필요, competency[].desc의 <b> 렌더링만 dangerouslySetInnerHTML로 예외 처리)
    api.ts                          (dataFetch — dataFetch.js 포팅, CMS_API_BASE_URL 대신 process.env.NEXT_PUBLIC_CMS_API_BASE_URL)
  hooks/
    useScrollReveal.ts              (initGridReveal 포팅 — IntersectionObserver, threshold 0.2, 1회성 unobserve)
    useReceiptReveal.ts             (initReceiptReveal 포팅 — #selfbarGrid 상단 좌표 기준 scroll 리스너)
    useProfitCountReveal.ts         (initProfitCountReveal + animateSalesCount 포팅 — rAF 카운트업, 40% 가시성 기준)
    useInView.ts                    (초 store swiper 자동재생 게이팅용 범용 IntersectionObserver 훅, threshold 0.3)
    useInquirySubmit.ts             (submitInquiry 포팅 — status: idle/sending/success/error, dataFetch 호출 + 버튼 문구 전환 타이밍. resetInquiryForm의 DOM 리셋 방식 대신, 폼 컴포넌트가 자신의 controlled state를 초기값으로 되돌리는 React 방식으로 대체)
  components/
    layout/
      SiteHeader.tsx                (nav + 모바일 토글 + scrollSpy — initSmoothScroll/initMobileNav/initScrollSpy 포팅, 'use client')
      SiteFooter.tsx                (정적, Server Component)
    sections/
      Hero.tsx                      (정적 + data-open-inquiry 트리거, 'use client' 불필요하나 버튼 클릭 이벤트 위해 클라이언트 컴포넌트)
      Competitiveness.tsx           (comp-grid + trust-strip, props: competency/trust, useScrollReveal 사용, 'use client')
      Menu.tsx                      (meat-grid + selfbar-grid, props: meat/selfbar, useScrollReveal, 'use client')
      Reviews.tsx                   (정적 마크업 3장 그대로, useScrollReveal만 적용, 'use client')
      Profit.tsx                    (receipt-track, props: profit, useReceiptReveal + useProfitCountReveal, 'use client')
      Promise.tsx                   (완전 정적 배너, Server Component)
      Cost.tsx                      (cost-table, props: cost, Server Component 가능 — 인터랙션 없음)
      Location.tsx                  (좌측 캡션+우측 Swiper 캐러셀 + 05 하단 인라인 문의폼, props: stores/contact, 'use client')
    inquiry/
      SelectField.tsx               (.select-field 커스텀 드롭다운 — initCustomSelects 포팅, controlled: value/onChange/options/label/placeholder, 'use client')
      PhoneInput.tsx                (formatPhoneNumber 적용 tel input, 3개 폼 공용, 'use client')
      InquirySheetForm.tsx / InlineInquiryForm.tsx / StickyInquiryForm.tsx
                                     (3개 폼 각각 — 이름/연락처/SelectField/지역/동의 체크박스 + useInquirySubmit. 마크업은 원본 클래스 그대로, 필드 상태는 controlled useState)
      InquirySheet.tsx              (#inquirySheetBackdrop 모달 셸 — 열기/닫기, ESC,포커스 복귀, [data-open-inquiry] 전역 트리거 구독. Context나 전역 store 없이 커스텀 이벤트(`window` CustomEvent) 또는 간단한 Zustand 없는 상태 공유가 필요 — 아래 "열기 트리거 공유" 참고)
      InquiryFab.tsx                (우측 세로 퀵탭 버튼, data-open-inquiry 트리거)
      StickyInquiryBar.tsx          (데스크톱 전용 하단 바, 자체 폼 포함)
    popup/
      CmsPopupModal.tsx             (initPopup 포팅 — mount 시 fetchPopups, localStorage 오늘하루보기, Swiper effect-fade, centerPopupNav 재계산 로직 포함)
  app/
    layout.tsx                      (SiteHeader → {children} → InquiryFab → InquirySheet → CmsPopupModal → StickyInquiryBar → SiteFooter 순서로 재구성. 기존 globals.css는 유지하되 그 뒤에 legacy CSS 4종을 순서대로 import)
    page.tsx                        (src/data/content.json import → 각 섹션에 슬라이스 전달, 플레이스홀더 내용 전체 교체)
```

### 열기 트리거 공유 (data-open-inquiry 대체)

원본은 `document.querySelectorAll('[data-open-inquiry]')`로 헤더/히어로/창업비용/05 CTA/FAB 버튼을 한 곳(`initInquirySheet`)에서 일괄 구독한다. React에서는 여러 컴포넌트 트리 위치에 흩어진 버튼들이 `InquirySheet`(layout.tsx에 있음)의 열림 상태를 건드려야 하므로, **간단한 커스텀 훅 `useInquirySheetTrigger()`**를 만든다 — 내부적으로 `window` 객체에 `CustomEvent('open-inquiry-sheet')`를 dispatch/listen 하는 방식(전역 상태 라이브러리 도입 없이 최소 구현). `InquirySheet.tsx`가 리스너를 등록하고, 나머지 트리거 버튼들은 `dispatchEvent`만 호출.

## CSS/폰트 연결

`src/app/layout.tsx`에서 import 순서(기존 `globals.css`가 shadcn 플레이스홀더 토큰을 갖고 있으므로, 실제 디자인이 이를 덮어쓰도록 **legacy CSS를 뒤에** import):

```
import "./globals.css";
import "@/styles/legacy/init.css";
import "@/styles/legacy/fonts.css";
import "@/styles/legacy/animations.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "@/styles/legacy/style.css";
```

## 환경변수

`.env.example`에 `NEXT_PUBLIC_CMS_API_BASE_URL=http://localhost:3001/api/v1` 추가(문서화), `.env.local`에 동일 값 설정(gitignore 대상, 로컬 전용). `src/libs/api.ts`는 `process.env.NEXT_PUBLIC_CMS_API_BASE_URL`을 읽어 base URL로 사용.

## 구현 순서

1. 에셋 복사(`public/assets/imgs`, `public/assets/fonts`) + `data/content.json` → `src/data/content.json`(경로 보정) + CSS 4종 복사·경로 치환 → `src/styles/legacy/`
2. `yarn add swiper`
3. 공용 유틸/훅 작성: `types/content.ts`, `libs/format.ts`, `libs/api.ts`, `hooks/*`
4. 공용 폼 부품: `SelectField.tsx`, `PhoneInput.tsx`
5. 레이아웃 셸: `SiteHeader.tsx`, `SiteFooter.tsx`
6. 섹션 컴포넌트: `Hero` → `Competitiveness` → `Menu` → `Reviews` → `Profit` → `Promise` → `Cost` → `Location`(Swiper 포함, 가장 복잡하므로 마지막)
7. 오버레이: `InquirySheet`(+ 3개 폼 컴포넌트) → `InquiryFab` → `StickyInquiryBar` → `CmsPopupModal`
8. `layout.tsx`/`page.tsx` 조립
9. `.env.example`/`.env.local` 추가
10. `yarn build` / `yarn lint` 통과 확인
11. 헤드리스 스크린샷으로 기존 정적 사이트(`localhost:8765`)와 새 Next.js(`localhost:3000`) 섹션별(히어로/01/02/03 스크롤 리빌 후/05) 시각 비교, 모바일 폭(390px)에서 nav 토글/FAB 노출·데스크톱 폭에서 sticky bar 노출 확인
12. go.daepae.cms.api를 `yarn dev`(3001)로 띄운 상태에서 문의폼 실제 제출 테스트(버튼 문구 전환 확인)

## 검증

- `yarn build`/`yarn lint` 에러 없이 통과
- 기존 정적 사이트(`index.html`/`assets/`/`data/`)가 `git status`상 전혀 변경되지 않음
- 헤드리스 스크린샷으로 주요 섹션 시각적 동일성 확인(색상 토큰, 폰트, 레이아웃)
- 스크롤 인터랙션 동작 확인: 영수증 카드 펼침/카운트업, 그리드 리빌, 매장 캐러셀 자동재생(뷰포트 진입 시에만) 및 캡션 동기화
- 커스텀 셀렉트 3곳 키보드 탐색(방향키/Enter/Esc) 동작
- CMS API(3001) 기동 상태에서 문의폼 제출 시 실제 POST 요청과 성공/실패 문구 전환 확인
