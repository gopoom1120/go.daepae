---
name: typography-rule-is-18-96px
description: 이 프로젝트(0007)의 폰트 크기 규칙은 현재 "18px~96px 전역" 이다 — shadcn 타입 스케일이 아니다
metadata:
  type: feedback
---

`CLAUDE.md`/`docs/design.md` 최신본 기준, `0007` 랜딩의 폰트 크기 규칙은 **18px 이상 96px
이하**이며 예외는 `.hero-wordmark`(clamp(72px,15vw,132px))와 `.form-agree`/`.form-agree-more`
(16px) 딱 둘뿐이다. "2026-09-04에 shadcn 뉴트럴 톤으로 하루 재설계"된 적이 있고 그때는
13/14/16/18~20/28~40px 같은 shadcn 타입 스케일을 썼지만, **같은 날 사용자가 전부 원복**해서
지금은 다시 18~96px 규칙 + 골드/레드 토큰 + RixYeoljeongdo + 스큐어모픽 디테일(영수증
프린터슬롯/스캘럽/바코드, 경쟁력 카드 펀치홀, 트러스트 카드 리본)이 확정 상태다.

**Why:** 이 에이전트(code-reviewer)에게 주입되는 고정 역할 지침(시스템 프롬프트)에는
"2026-09-04부터 옛 18~96px 규칙은 더 이상 유효하지 않다"는 문구가 박혀 있는데, 이는 그날 있었던
"재설계 → 즉시 원복" 이력 중 재설계 시점의 스냅샷을 반영한 것으로 보이며 실제로는 스테일하다.
CLAUDE.md 와 docs/design.md 본문 모두 "이 문서는 원복 이후 기준"이라고 명시적으로 경고한다.

**How to apply:** 폰트 크기를 검토할 때는 역할 지침의 "shadcn 타입 스케일" 문구를 무시하고, 항상
`docs/design.md` Typography 절과 `CLAUDE.md` 를 그 자리에서 다시 읽어 18~96px 규칙(예외 2개
한정)을 기준으로 판단할 것. 마찬가지로 프린터 슬롯/스캘럽/바코드/펀치홀/리본 같은 스큐어모픽
디테일도 "제거 대상"이 아니라 **현재 확정된 디자인**이므로, `renderProfitCards` 등 기존
마크업을 유지하고 있다면 위반으로 보고하지 않는다. [[gopumgyeok-shadcn-revert-2026-09-04]]
(있다면 참고)
