---
name: headless-intersection-observer-limitation
description: 헤드리스 Chrome(--dump-dom, --screenshot 모두)에서 window.scrollTo() 로 프로그래매틱하게 스크롤한 뒤 IntersectionObserver 콜백이 재발화하지 않는 문제 — 실기기/실사용자 스크롤에서는 발생하지 않는 테스트 방법론 한계
metadata:
  type: feedback
---

`--headless=new --disable-gpu`(혹은 `--headless`(legacy) 도 동일) Chrome 에서 페이지 로드 후
`window.scrollTo({top, behavior:'instant'})` 로 스크롤 위치를 바꾸면, `window.scrollY` 와
`element.getBoundingClientRect()` 는 즉시 올바르게 갱신되지만 **이미 등록된
`IntersectionObserver` 의 콜백은 최초 1회(관찰 시작 시점, 보통 스크롤 0 상태)만 발화하고 이후
스크롤을 아무리 바꿔도 다시 발화하지 않는다.** `--virtual-time-budget`, `--dump-dom`,
`--screenshot`, `--run-all-compositor-stages-before-draw` 조합을 모두 시도했지만 재발화하지
않았다.

**검증 방법**: 사이트 코드와 무관한 최소 재현 페이지(500px 스페이서 + observer 하나, `rootMargin:
'0px 0px -100% 0px'`)를 만들어 scrollY 0/100/470/500/530/600 에서 각각 새 프로필로 dump-dom 을
찍어봤다. 모든 경우에서 콜백 로그가 `t=10ms` 근처 1건(초기 발화, 스크롤 전)만 있고 이후 스크롤에
대한 추가 콜백이 전혀 없었다. 즉 사이트의 `initReceiptReveal()` 로직 문제가 아니라 헤드리스
환경 자체의 한계로 확인됨.

**Why:** IntersectionObserver 재계산은 브라우저의 "update the rendering" 스텝(보통 컴포지터
프레임 생성/vsync 에 연동)에 묶여 있는데, 헤드리스 모드에서 JS 로 순간 이동하듯 스크롤하면 실제
사용자가 스크롤할 때처럼 연속적인 프레임이 생성되지 않아 이 스텝이 스킵되는 것으로 보인다.
`puppeteer`/`selenium`(CDP 로 진짜 `Input.dispatchMouseEvent` 휠 이벤트를 여러 프레임에 걸쳐 보낼
수 있는 도구)이 설치돼 있지 않아 실제 프레임 단위 스크롤을 재현할 수 없었다(이 환경엔 `node` 는
있지만 `puppeteer` 모듈 없음, `python3-selenium` 도 없음).

**How to apply:** `IntersectionObserver` 기반 리빌/스크롤 애니메이션(`.receipt-col.in-view`,
`.comp-card.in-view`, `.trust-item.in-view` 등)을 헤드리스로 "정확한 크로스 시점"까지 검증하려는
요청을 받으면:
1. 먼저 **정적 상태**(스크롤 0에서 접힌 상태, `max-height:0`)는 일반 스크린샷으로 확실히 검증
   가능하다 — 이건 실제로 잘 된다.
2. **코드 레벨 정합성**(옵저버 옵션, rootMargin 수식, toggle vs add+unobserve 여부)을 정적으로
   읽어 논리적으로 맞는지 확인하고, `getBoundingClientRect()` 기반 수치(섹션 top 이 스크롤에 따라
   기대대로 변하는지)는 dump-dom 으로 안정적으로 확인 가능하다(이건 레이아웃 값이라 IO 콜백과
   무관하게 항상 정확했다).
3. **라이브 크로스 순간의 실제 클래스 토글**은 이 환경에서 자동화로 확실히 증명하기 어렵다는 걸
   솔직히 보고한다. "확인함"이라고 과장하지 말고, 정적 상태 + 코드 정합성까지만 확인했고 라이브
   토글은 방법론적 한계로 자동 검증 불가였다고 명시한다.
4. `--window-size` 를 너무 크게 잡거나(문서 전체 높이 근접) 프로그래매틱 스크롤 거리가 커지면
   (대략 700~900px 이상, 뷰포트 높이 근처) 화면이 완전히 깨진 블랙 프레임으로 캡처되는 별개
   렌더링 버그도 관찰됨 — [[headless-chrome-hang-after-screenshot]] 참고. 이 프로젝트의
   `.hero{position:sticky}` 트랩과는 다른 증상이지만 함께 겹치면 원인 추적이 더 어려워지니, 큰
   스크롤이 필요한 섹션을 검증할 때는 그 섹션 앞의 무거운 섹션들을 `display:none` 으로 죽이고
   스페이서로 원하는 오프셋만 재현하는 식으로 스크롤 거리를 줄이는 우회가 유효했다.
