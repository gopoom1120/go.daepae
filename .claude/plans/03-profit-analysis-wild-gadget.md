# 03 PROFIT ANALYSIS — 영수증 롤 → 매장 사진 + 파이 차트 카드로 교체

## Context

현재 03 수익분석 섹션은 "영수증이 프린터에서 뽑혀 나오는" 메타포(`.receipt-col`, 종이 펼침
애니메이션 + 매출 숫자 카운트업)로 구현되어 있다. 사용자가 이 시각화를 완전히 폐기하고,
새로 제공한 레퍼런스 이미지와 동일한 구조 — 매장 사진 카드 + 순수익률/월매출 배지 +
비용 항목별 파이 차트(식자재/고기/인건비/기타공과금/음료/주류 + 가장 큰 조각인 순수익) —
로 바꿔달라고 요청했다. 모바일에서 깨지지 않아야 하고, 차트 영역에 스크롤 진입 시
인터랙션 애니메이션이 있어야 한다.

레퍼런스 이미지의 수치(순수익률, 월매출)는 기존 `content.json`의 `profit[].rate`/`salesWon`과
정확히 일치한다 — 실제 데이터를 그대로 시각화만 바꾸는 작업이다. 매장 사진도
`public/assets/imgs/store1~3.jpg`에 이미 있고(각 사진 속 간판 전화번호로 왕십리/천호/시흥은계
순서 확인 완료), 현재 코드베이스 어디에서도 쓰이지 않고 있었다.

사용자 확인 완료 사항:
- 섹션 상단 헤드(키커 "03 · PROFIT ANALYSIS" / 제목 "가맹점주님들의 거짓 없는 선택!" / 부제)는
  그대로 유지한다. nav 스크롤스파이가 `id="profit"`을 참조하므로 섹션 id도 유지.
- 음료/주류는 레퍼런스에 숫자가 없어 남는 비율을 절반씩 균등 분할한다.
- 하단 각주는 레퍼런스의 짧은 문구 `"*실제 데이터 기반으로 작성된 표입니다."`로 교체한다.

## 데이터 모델

`src/types/content.ts` — `ProfitItem` 교체(기존 `open`/`tall` 필드는 새 디자인에 없으므로 제거):

```ts
export interface ProfitCostBreakdown {
  food: number; // 식자재
  meat: number; // 고기
  labor: number; // 인건비
  utilities: number; // 기타 공과금
  drink: number; // 음료
  alcohol: number; // 주류
}

export interface ProfitItem {
  name: string;
  image: string; // "/assets/imgs/store1.jpg"
  rate: number; // 순수익률
  salesManWon: number; // 월매출(만원 단위) — 기존 salesWon(원 단위)을 대체
  cost: ProfitCostBreakdown;
}
```

`src/data/content.json` → `profit` 배열 교체:

```json
"profit": [
  { "name": "왕십리 본점", "image": "/assets/imgs/store1.jpg", "rate": 36.1, "salesManWon": 4700,
    "cost": { "food": 8.2, "meat": 14.4, "labor": 22.7, "utilities": 14.4, "drink": 2.1, "alcohol": 2.1 } },
  { "name": "천호 직영점", "image": "/assets/imgs/store2.jpg", "rate": 40.2, "salesManWon": 6700,
    "cost": { "food": 9.3, "meat": 16.5, "labor": 17.5, "utilities": 12.4, "drink": 2.05, "alcohol": 2.05 } },
  { "name": "시흥 은계점", "image": "/assets/imgs/store3.jpg", "rate": 33.3, "salesManWon": 3900,
    "cost": { "food": 9.4, "meat": 14.5, "labor": 17.7, "utilities": 20.8, "drink": 2.15, "alcohol": 2.15 } }
]
```

각 행의 `rate` + 6개 cost 값 합계는 정확히 100이다. `formatWon`(`src/libs/format.ts`,
`n.toLocaleString("ko-KR")`)은 그대로 재사용 — "원" 단위가 아니라 "만원" 단위 숫자를 넣어도
함수 자체는 콤마 포맷만 하므로 수정 불필요, 새 헬퍼를 추가하지 않는다.

## 컴포넌트 구조

`Profit.tsx`는 헤드 + 카드 3장 루프만 담당하는 얇은 셸로 재작성하고, 반복되는 SVG 각도
계산은 신규 `ProfitPieChart.tsx`로 분리한다(이 섹션처럼 동일한 비자명 기하 계산이 3회
반복되는 경우는 이 프로젝트에 처음이라, 섹션당 파일 1개라는 기존 관례에서 벗어나는 걸
정당화할 만하다).

```
section.profit#profit
  .wrap
    .profit-head (유지: kicker/h2/profit-sub/underline-mark)
    .profit-grid
      .profit-card × 3
        .profit-card__tag      매장명 ("왕십리 본점")
        .profit-card__photo    img (store1~3.jpg, object-fit:cover)
        .profit-badges
          .profit-badge        순수익률 {rate}%
          .profit-badge        월 매출 약 {formatWon(salesManWon)}만원
        .profit-connector      점선 세로 커넥터(장식)
        <ProfitPieChart cost rate />
    p.profit-footnote          "*실제 데이터 기반으로 작성된 표입니다."
```

`ProfitPieChart`는 자체 `useRef` + 기존 `src/hooks/useInView.ts`(IntersectionObserver,
양방향 토글 — 일회성 아님)로 카드별 독립 관찰자를 두어, 뷰포트 재진입마다 스윕인이 반복
재생되게 한다(삭제되는 `useReceiptReveal`의 "다시 지날 때마다 반복" 철학을 계승).

## 파이 차트 SVG

`viewBox="0 0 240 240"`, `cx=cy=120`, `r=50`, `stroke-width=100`(반지름만큼 굵게 그려
중앙 구멍 없는 꽉 찬 파이가 된다 — `StoreCarousel`의 `.store-nav-toggle__ring circle`
(`stroke-dasharray`/`stroke-dashoffset` 패턴)과 동일 기법, 두께만 다르다). `circumference =
2π·50 ≈ 314.16`. `<svg>`에 `transform:rotate(-90deg)`를 줘 12시 방향에서 시작, 시계방향으로
식자재 → 고기 → 인건비 → 기타공과금 → 음료 → 주류 → 순수익(나머지, 가장 큰 조각) 순서로
쌓는다.

슬라이스 *i* (비율 `p_i`, 이전까지 누적 비율 `c_i`):
```
length_i   = circumference * (p_i / 100)
dasharray  = `${length_i} ${circumference - length_i}`
dashoffset = -(circumference * c_i / 100)   // 고정값, 시계방향으로 이어붙인다
```
라벨 각도: `angle_i = (c_i + p_i/2)/100 * 360`(12시 기준 시계방향 도), 반지름 `R`에서의 좌표:
`x = cx + R·sin(angle), y = cy - R·cos(angle)`.
- 식자재/고기/인건비/기타공과금: `R = 118`(파이 바깥)에 두 줄 텍스트(라벨명 + %), `x`와 `cx`
  차이로 `text-anchor`(가운데/좌/우) 결정.
- 음료/주류(아주 얇은 조각): `<line>`으로 `R=100`→`R=135` 리더선을 긋고 끝에 라벨 텍스트만
  배치(숫자 없이 라벨명만 — 레퍼런스와 동일).
- "순수익 {rate}%": SVG 밖, `position:relative` 래퍼 안에 절대배치 `<div>`(`left:38%;
  top:48%` 근방 — 항상 가장 큰 조각이 걸리는 위치라 매장 3곳 공통값으로 충분하다). 두 줄
  (`순수익` 작게 + `{rate}%` 크게), `filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))`.

## 색상 — 11개 토큰만 사용, 새 hex 추가하지 않는다

CLAUDE.md/design.md 규칙("색을 새로 쓰지 말고 토큰에서 가져온다")을 지키기 위해 기존
`:root` 11개 토큰만으로 7개 슬라이스 + 배지를 구성한다(레퍼런스처럼 완전히 다른 브라운
팔레트를 새로 만들지 않음):

| 요소 | 토큰 |
|---|---|
| 순수익(가장 큰 조각) | `var(--gold-light)` |
| 고기 | `var(--gold)` |
| 인건비 | `var(--bg-card-2)` |
| 기타공과금 | `var(--muted)` |
| 식자재 | `var(--text-dim)` |
| 음료 / 주류 | `var(--line)` (둘 다 — 레퍼런스에서도 두 조각이 육안으로 거의 구분 안 됨) |
| "순수익"/퍼센트 오버레이 텍스트 | `var(--bg-card-2)`(밝은 gold-light 조각 위라 어두운 텍스트로 대비) |
| 배지 카드 배경/텍스트 | `var(--bg-card)`(흰 카드, `.trust-item`과 동일하게 어두운 섹션 위 대비) / `var(--text)` |
| 배지 강조 숫자(순수익률 %, 월매출 금액) | `var(--red)`(기존 "강조 문구는 빨간색" 컨벤션) |
| 매장명 태그 배지 | 배경 `var(--gold)`, 텍스트 `var(--bg-card-2)` (`.trust-num` 골드 배지와 동일 패턴) |

섹션 배경(`.profit`의 다크 마룬 그라디언트)과 `.wave--from-profit`는 그대로 둔다 — 바꾸지 않음.

## 애니메이션

- 기본 상태: 각 `<circle>`의 `dasharray` 첫 값을 `0`으로(`.profit-pie:not(.in-view) .pie-slice`).
- `useInView`가 `true`가 되면 `.profit-pie`에 `in-view` 클래스 토글 → `.pie-slice`의
  `dasharray`가 실제 `length_i`로 전환(`transition: stroke-dasharray 650ms
  cubic-bezier(0.22,1,0.36,1) var(--slice-delay)`), `--slice-delay: calc(var(--i) * 90ms)`를
  각 `<circle style={{"--i": i}}>`에 인라인으로 준다(기존 `.receipt-col`의 `--d` 스태거와
  동일 패턴). 뷰포트에서 벗어나면 다시 `0`으로 돌아가 재진입마다 반복 재생된다.
- 배지/매장명 등 나머지 요소는 애니메이션 없이 정적 — 사용자가 요청한 "그래프 영역"만
  움직이면 충분하고, 두 번째 모션 시스템을 새로 만들지 않는다.
- `@keyframes` 불필요(순수 `transition`) — `animations.css`는 건드리지 않는다.
- 맨 아래 `@media (prefers-reduced-motion: reduce)` 블록(현재 `style.css:2777`)에 추가:
  `.pie-slice, .profit-pie__label, .profit-pie__pct { transition:none !important; }`,
  그리고 `.profit-pie .pie-slice`가 항상 최종 `dasharray`로 보이도록 처리.

## 반응형 (`max-width:1024px` 단일 브레이크포인트)

- `.profit-grid`: desktop `display:grid; grid-template-columns:repeat(3,1fr); gap:28px`
  → `≤1024px`에서 `grid-template-columns:1fr; max-width:420px; margin:0 auto;`로 1열 스택
  (기존 `.receipt-track`의 flex→column 전환과 같은 패턴).
- `<svg>`는 `width:100%; height:auto`로 `viewBox` 기준 스케일 — 고정 px 없음, 좁은 화면에서도
  카드 폭을 넘치지 않는다.
- 오버레이 "순수익 {rate}%"는 `clamp(18px, 4.5vw, 40px)`("순수익" 라벨) /
  `clamp(32px, 9vw, 72px)`(퍼센트 숫자) — 18~96px 규칙 안에서 유동. 테스트 중 모바일 폭(390px
  기준)에서 파이 카드 폭을 벗어나면 `.profit-pie`에 `container-type:inline-size`를 주고
  `vw` 대신 `cqw`로 바꾼다(`.receipt-paper`가 썼던 것과 동일한 폴백 전략).

## 파일별 변경 목록

- `src/components/sections/Profit.tsx` — 전면 재작성(위 구조대로).
- `src/components/sections/ProfitPieChart.tsx` — **신규**, SVG 기하 계산 + 스윕인.
- `src/types/content.ts` — `ProfitItem` 교체, `ProfitCostBreakdown` 추가.
- `src/data/content.json` — `profit` 배열 교체(위 표).
- `src/hooks/useReceiptReveal.ts`, `src/hooks/useProfitCountReveal.ts` — **삭제**(grep 확인 결과
  `Profit.tsx`만의 단독 소비자).
- `src/styles/legacy/style.css`:
  - 삭제: `.receipt-track` ~ `.r-barcode` ~ 해당 `@media` 블록(현재 1127~1316줄 부근, 정확한
    범위는 작업 시점에 재확인).
  - 유지: `.profit`(1061~1085), `.profit-head`/`.profit-sub`/`.underline-mark`(1086~1125),
    `.profit-footnote`(1318~1323) — 그대로 둔다.
  - 신규 추가: `.profit-grid`, `.profit-card`, `.profit-card__tag`, `.profit-card__photo`
    (`.store-card`와 동일하게 `border-radius:20px` 예외 재사용), `.profit-badges`/`.profit-badge`,
    `.profit-connector`, `.profit-pie` 래퍼, `.pie-slice`, `.profit-pie__label`/`__pct`,
    라벨/리더선 텍스트 클래스 — 삭제한 블록 자리에 넣고, 미디어쿼리는 바로 뒤에 둔다(프로젝트
    컨벤션).
  - `prefers-reduced-motion` 블록(2777줄)에 위 선택자 추가.

## 검증

1. `yarn dev` 로컬 서버에서 데스크톱 폭 헤드리스 스크린샷으로 레퍼런스 이미지와 레이아웃 대조.
2. 390px 폭으로 리사이즈해 `.profit-grid` 1열 스택과 파이 SVG가 카드 폭을 넘치지 않는지 확인.
3. 스크롤 리빌 애니메이션은 헤드리스에서 프로그래매틱 스크롤로는 재발화하지 않는 known
   limitation이 있으므로, 프로젝트에 이미 쓰인 임시 라우트 기법
   (`.claude/agent-memory/screenshot-verifier/gopumgyeok-nextjs-migration-debug-route-technique.md`)
   을 재사용한다 — 언더스코어 없는 임시 라우트(`src/app/debugprofitverifytmp/page.tsx`)에
   `<Profit profit={data.profit} />`를 렌더하고 `.pie-slice{transition:none!important}` +
   `in-view` 강제 클래스를 인라인 `<style>`로 주입해 "다 그려진" 최종 상태를 캡처한 뒤,
   검증이 끝나면 라우트 파일/디렉터리를 삭제하고 404 + `git status` 클린 여부까지 확인한다.
4. Chrome의 `prefers-reduced-motion: reduce` 에뮬레이션으로 애니메이션 없이 바로 완성된 파이가
   보이는지 확인.
