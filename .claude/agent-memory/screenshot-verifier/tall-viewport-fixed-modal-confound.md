---
name: tall-viewport-fixed-modal-confound
description: 히어로 sticky 우회용 초대형 window-size 풀페이지 캡처 시, 문의하기 Bottom Sheet(position:fixed 백드롭)가 자동으로 열려 그 아래 전체 섹션을 어둡게 덮어버려 시각 검증을 방해함
metadata:
  type: feedback
---

CLAUDE.md 가 안내하는 "히어로 sticky 함정 우회"(`.hero{position:relative !important}` 주입 +
`--window-size` 를 문서 전체 높이만큼 크게 잡아 한 장에 담기) 기법을 쓸 때, `#menu` 섹션이 그
거대한 단일 뷰포트 안에 처음부터 포함되면 `initInquirySheet()` 의 IntersectionObserver 가 즉시
발화해 `#inquirySheetBackdrop`(`position:fixed`, 반투명 검정 배경)이 자동으로 열린다. 이 백드롭은
`position:fixed` 라서 "뷰포트"로 취급되는 그 거대한 `--window-size` 전체를 덮어버리고, `disconnect`
하지 않는 관찰자 설계상 닫히지 않은 채로 캡처된다 — 결과적으로 모달 아래에 깔린 나머지 전체
섹션(예: 02.5 소비자 찐후기, 03 수익분석)이 실제 색상보다 어둡게(대략 40% 밝기, `rgba(0,0,0,.6)`
블렌드) 찍혀서 배지 색상 등을 픽셀 비교로 검증하면 틀린 값이 나온다.

**Why:** 실제 브라우저에서도 모달이 열린 채 스크롤하면 fixed 백드롭이 따라오며 아래 섹션을
계속 덮는 게 맞는 동작이라, 이건 "버그"가 아니라 이 특정 캡처 기법(전체를 한 뷰포트로 렌더)의
부작용이다. 즉 `#menu` 진입 관찰자가 재실행을 막지 않는다는 것 자체는 CLAUDE.md 에 이미 문서화된
의도된 동작([[gopumgyeok-receipt-reveal-logic]] 과 같은 반복 재생 패턴).

**How to apply:** `_debug_full.html` 같은 디버그 사본으로 풀페이지를 캡처할 때, `#menu` 이후
섹션의 색상/대비를 정밀하게(픽셀 색상 비교 등) 검증해야 한다면 히어로 오버라이드에 더해
`<style>.inquiry-sheet-backdrop{display:none !important;}</style>` 도 함께 주입해서 모달을
원천 차단한 뒤 캡처한다. 기하학적 레이아웃(그리드 열 수, 정렬, 요소 겹침 여부)만 볼 때는 굳이
숨기지 않아도 무방 — 모달이 부분적으로 다른 요소를 가릴 수 있으니 필요하면 크롭 범위를 모달이
없는 영역으로 잡거나 스크린샷을 두 번(모달 포함/제외) 찍어 비교하면 된다.
