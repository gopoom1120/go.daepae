---
name: gopumgyeok-receipt-card
description: "영수증 카드(0007 수익분석 섹션) 구현 교훈 — 그림자는 wrapper에 drop-shadow, 절취선은 mask-image 스캘럽"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 64490a38-09ba-439e-83a5-66505594f155
  modified: 2026-09-01T07:19:49.350Z
---

`0007` 03 수익분석 섹션의 **영수증(리시트) 카드**는 여러 차례 피드백을 거쳐 확정된 구조다([[gopumgyeok-landing-project]]).

```
.receipt-col           (--d 커스텀 프로퍼티로 stagger delay)
 ├─ .printer-bar       (메탈릭 알약형 외곽)
 │   └─ .printer-slot(검은 리세스). 슬롯 양끝의 흰 사각 엔드캡(`.printer-endcap`)은
 │      2026-09-01 사용자 요청으로 마크업·CSS 모두 삭제됨 — 되살리지 말 것
 └─ .receipt-mask      (overflow:hidden, max-height 0→760px 애니메이션)
     └─ .receipt-body  (filter:drop-shadow — 페이드는 없다, 2026-09-01 사용자 요청으로 opacity 제거)
         ├─ .receipt-paper    (크림색 종이: 라벨/매장명/매출/순수익률/날짜/바코드)
         └─ .receipt-scallop  (하단 스캘럽 절취선)
```

**재작업 시 반드시 지킬 것:**
- **종이 폭은 검은 슬롯 폭과 같아야 한다.** `.printer-bar` 100% / `.printer-slot` 은 바 기준 `left:9% right:9%` → 슬롯 = 컬럼의 82%. 그래서 `.receipt-mask` 도 **82%**. 셋 중 하나를 바꾸면 나머지도 같이 움직일 것(2026-09-01 사용자 요청으로 슬롯 폭에 정렬). 종이와 바를 같은 폭(94%)으로 두던 시절엔 바의 둥근 끝 바깥으로 종이 모서리가 삐져나왔다.
- **종이는 바 앞에 그려진다.** `.receipt-mask{position:relative; z-index:3}` 로 바와 같은 값 + DOM 순서상 뒤 → 종이가 바 하단을 덮는다. 슬롯 폭과 정확히 맞물려 구멍에서 빠져나오는 연출이다. 2 이하로 내리면 종이가 바 뒤로 들어간다.
- 겹침(`.receipt-mask`의 `margin-top`)은 **바 높이의 절반보다 크게**. 현재 -19px(바 34px) — 종이 윗변이 슬롯 뒤에 숨는다. -12px 이던 시절엔 윗변이 바 아래로 드러났다.
- 종이 그림자는 `box-shadow`가 **아니라** wrapper에 `filter: drop-shadow()`. 종이 자체에 `box-shadow`를 걸면 스캘럽 절취선의 투명한 틈으로 그림자가 새어 회색으로 보이는 버그가 났었다.
- 절취선은 `clip-path` 삼각형 지그재그가 아니라 `mask-image: radial-gradient(circle ...)` 반복 패턴의 **둥근 스캘럽**(참고 이미지가 스캘럽이라 전면 교체함). 뾰족하게 만들려면 원 지름을 tile 간격보다 크게 잡아 인접 원이 겹치게 한다 — 현재 반지름 10px / 간격 14px. **다른 섹션에 절취선을 쓸 일이 생겨도 스캘럽 방식을 기본으로.**
- 진입 애니메이션은 `IntersectionObserver`로 `.receipt-col`에 `in-view`를 넣고 뺀다. **섹션에 들어올 때마다 반복 재생**한다(2026-09-01 사용자 요청으로 1회성 `unobserve` 방식에서 변경). `threshold:[0, 0.35]` 두 값이 핵심 — 35% 보이면 재생, **완전히 벗어났을 때만** 되감는다. 임계값을 하나로 두면 스크롤 도중 아직 보이는 카드가 접히면서 깜빡인다.
- 매출 숫자 뒤 **"원" 단위는 사용자 요청으로 삭제**됨. 다시 붙이지 말 것.
- **폰트 크기는 `vw` 가 아니라 `cqw`(종이 폭) 기준.** `.receipt-paper{container-type:inline-size}` + 매장명 `clamp(22px,18cqw,42px)` / 매출 숫자 `clamp(22px,16cqw,44px)`. `vw` 로 두면 종이 폭(컬럼의 82%)과 연동되지 않아 매출 숫자가 좌우로 잘린다 — 실제로 잘렸었다(2026-09-01). `"39,000,000"` 실측 글자폭이 폰트 크기의 **5.83배**라 16cqw 가 상한이며, 이 값을 올리면 다시 잘린다. `@media(max-width:820px)` 의 `vw` 오버라이드는 같은 이유로 제거했다.

**Why:** 그림자·절취선 두 건은 실제로 버그와 재작업을 유발했던 지점이고, "원" 삭제와 스캘럽 채택은 사용자가 직접 내린 결정이다.

**How to apply:** 이 카드 CSS를 건드릴 때 위 네 가지를 되돌리는 방향(그림자 이동, clip-path 회귀, 단위 복원)의 "정리"는 개선이 아니라 회귀다.
