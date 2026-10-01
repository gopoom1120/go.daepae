---
name: gopumgyeok-receipt-card
description: "[폐기됨] 03 수익분석의 영수증 카드는 2026-10-01 파이차트 카드로 완전히 교체됨 — 아래는 과거 구조였고 더 이상 존재하지 않는다"
metadata:
  type: feedback
---

**이 메모리가 설명하던 영수증(리시트) 카드 디자인은 2026-10-01 사용자 요청으로 03 수익분석
섹션 전체가 재구성되며 완전히 삭제됐다.** `.receipt-col`/`.printer-bar`/`.receipt-mask`/
`.receipt-paper`/`.receipt-scallop` 등 여기서 언급하던 클래스와 `useReceiptReveal`/
`useProfitCountReveal` 훅은 모두 코드에서 제거됐다 — 더 이상 존재하지 않는 마크업을
"되돌리지 말 것"으로 착각하지 않도록 이 메모리를 폐기한다.

**현재 구조**: 매장 사진 카드(이름표 + 사진 + 순수익률/월매출 배지) + 비용 구성
파이차트(`ProfitPieChart.tsx`, SVG `stroke-dasharray` 기반, 라이브러리 미사용)로 바뀌었다.
세부 색상·반지름·라벨 배치 로직은 `src/components/sections/ProfitPieChart.tsx`의 코드
주석에 직접 문서화돼 있다(이 메모리에 중복 기록하지 않는다) — 바뀔 때마다 주석이 같이
갱신되는 쪽이 메모리보다 신뢰도가 높다.

**과거 결정 중 지금도 유효한 선호(새 디자인에도 적용된 것)**:
- 매출/비율 숫자 뒤 **"원" 단위를 쓰지 않는다** — 영수증 카드 때부터 이어진 사용자 결정이며
  새 배지(`.profit-badge`)에도 그대로 적용돼 있다.
- 폰트 크기를 `vw`가 아니라 **`cqw`(컨테이너 폭 기준)**로 잡아야 좁은 카드 안에서 글자가
  잘리지 않는다 — 새 파이차트의 `.profit-pie__pct`/`.profit-pie__label`도 같은 패턴
  (`container-type: inline-size` + `clamp(..., Ncqw, ...)`)을 그대로 이어받았다.
- 스크롤 진입 애니메이션은 섹션에 들어올 때마다 반복 재생해야 한다(1회성 아님) — 새
  파이차트도 `useInView`(재토글되는 boolean)로 같은 원칙을 유지한다.

**Why:** 메모리가 더 이상 존재하지 않는 마크업 구조를 "건드리면 회귀"라고 경고하면, 다음
세션이 실제로는 안전한 변경을 회귀로 오판하거나, 존재하지 않는 클래스를 찾느라 시간을
낭비한다.
