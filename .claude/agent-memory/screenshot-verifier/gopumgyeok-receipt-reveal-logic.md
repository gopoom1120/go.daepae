---
name: gopumgyeok-receipt-reveal-logic
description: 0007 assets/js/script.js 의 initReceiptReveal() 구조 — 2026-09-09 기준 IntersectionObserver 가 아니라 window scroll 리스너 + getBoundingClientRect 비교 방식. 예전엔 IO 기반이었으나 바뀜
metadata:
  type: project
---

**2026-09-09 기준으로 구조가 다시 바뀌었다.** 이 메모리는 원래 2026-09-03 의 IntersectionObserver
버전을 설명했으나, `assets/js/script.js`(147~176행 부근)를 다시 읽어보니 더 이상 IO 를 쓰지 않는다
— `window.addEventListener('scroll', update)` + `trigger.getBoundingClientRect().top + window.scrollY`
로 직접 스크롤 위치를 비교하는 방식이다. IO 관련 서술(rootMargin 트릭 등)은 지금 코드와 맞지
않으니 참고하지 말 것 — 코드가 또 바뀌었을 수 있으니 항상 먼저 grep 으로 재확인한다.

**현재 로직 요약**: `trigger`(`#selfbarGrid`, 없으면 `#profit` 자체)의 문서 좌표 top 을 구해
`revealed = window.scrollY >= triggerTop` 을 매 스크롤마다 계산하고, `revealed !== wasRevealed`
(rising/falling edge)일 때만 모든 `.receipt-col` 에 `in-view` 를 토글하고 `.r-sales` 카운트업
(`animateSalesCount`, ease-out cubic 1.1s)을 트리거하거나 0으로 리셋한다. `unobserve` 개념 자체가
없고 매번 조건 재계산이라 반복 재생(양방향)이 자연히 보장된다.

**중요한 차이 — [[headless-intersection-observer-limitation]] 이 이 함수엔 적용되지 않는다**:
그 메모리는 IntersectionObserver 콜백이 헤드리스에서 프로그래매틱 `scrollTo` 후 재발화하지
않는다는 한계인데, 이 함수는 IO 가 아니라 순수 `scroll` 이벤트 리스너다. 2026-09-09 검증에서
`_debug_*.html`에 `window.scrollTo(0, triggerTop+50)` 후 `window.dispatchEvent(new Event('scroll'))`
를 주입하고 1.6초 뒤 `--dump-dom` 으로 `.r-sales` textContent 를 읽었더니, 초기 `"0|0|0"` →
정확히 목표값 `"47,000,000|67,000,000|39,000,000"` (콤마 포맷까지 정확)로 카운트업이 완료된 것을
**실제로 자동 검증했다** — "코드상 신뢰"가 아니라 라이브 증거를 확보한 사례. `scroll` 이벤트는
IO 와 달리 컴포지터 프레임에 의존하지 않고 스크롤 위치 변경 시 동기적으로 디스패치되는 것으로
보인다.

**시각 레이아웃 검증(카운트업 완료 후 영수증 카드가 안 깨지는지)은 실제 스크롤 대신 클래스를
직접 주입하는 우회가 안전하다** — `document.querySelectorAll('.receipt-col').forEach(el=>
el.classList.add('in-view'))` + `.r-sales` textContent 를 목표값으로 직접 설정한 뒤 스크린샷.
5000px 이상 되는 실제 프로그래매틱 스크롤 점프는 [[headless-large-scroll-screenshot-black-frame]]
버그를 유발해 `--screenshot` 결과가 완전히 깨지므로, 레이아웃 확인엔 이 클래스 주입 방식 +
[[tall-viewport-fixed-modal-confound]]에서 쓰던 초대형 window-size 풀페이지 기법을 함께 쓰는 게
더 안전하다. 숫자 카운트업의 "정확성"은 dump-dom(작은 스크롤)으로, "레이아웃 안 깨짐"은 클래스
주입 스크린샷(스크롤 없음)으로 역할을 나눠 검증했다.
