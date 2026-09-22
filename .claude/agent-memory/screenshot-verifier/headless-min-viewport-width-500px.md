---
name: headless-min-viewport-width-500px
description: 이 macOS 환경의 헤드리스 Chrome은 --window-size 폭을 500px 미만으로 줘도 실제로는 500px 뷰포트로 렌더링하면서 요청한 작은 크기로 스크린샷 버퍼만 잘라내, 진짜 텍스트가 넘치는 것처럼 보이는 가짜 오버플로우를 만든다
metadata:
  type: feedback
---

`--headless=new --screenshot`에 `--window-size=390,900`처럼 폭 500px 미만 값을 줘도
`window.innerWidth`는 강제로 500이 된다(400/430/450/470/490 모두 500으로 클램프됨,
550부터는 요청한 값 그대로 반영). 즉 실제 레이아웃/미디어쿼리 평가는 500px 뷰포트 기준으로
일어나고, 스크린샷 PNG만 요청한 작은 크기(예: 390x900)로 잘려 나온다 — 500px 너비에서
정상적으로 줄바꿈된 텍스트의 **오른쪽이 크롭되어 마치 진짜 모바일 폭에서 텍스트가 넘쳐
잘리는 버그처럼 보인다**.

이 착시에 실제로 속을 뻔한 사례: 0007의 새 `#promise` 섹션과 기존 히어로 카피
(`.hero-eyebrow2`/`.hero-wordmark`/`.hero-sub2`)를 390px·375px로 캡처했을 때 텍스트가
우측에서 잘려 보였다. `virtual-time-budget`을 15000ms로 늘려도 동일해 폰트 로딩 타이밍
문제가 아니었고, `window.addEventListener('load', ...)`로 `innerWidth`/`scrollWidth`/각
요소의 `getBoundingClientRect().width`를 페이지에 직접 찍어 확인(probe 기법)한 뒤에야
500px 클램프임을 확인했다. 진짜 500px 폭으로 캡처(요청 폭도 500)하니 동일 섹션이 완전히
깨끗하게 줄바꿈됐다 — **실제 CSS 버그가 아니라 순전히 캡처 기법의 착시**였다.

**Why:** 이 클램프의 정확한 원인(Chrome/macOS 창 최소폭 정책으로 추정)은 확인하지 못했다.
`--headless=old`나 CDP `Emulation.setDeviceMetricsOverride` 는 다르게 동작할 수 있으나
검증하지 않았다.

**How to apply:**
- 폭 500px 미만(전형적인 iPhone 375~430px 등)을 헤드리스로 검증해야 할 때는, 먼저 페이지에
  `window.innerWidth`를 화면에 찍는 probe 스크립트를 주입해 실제 렌더링 폭을 확인하고 시작한다.
  값이 요청과 다르면(특히 500으로 고정) 그 스크린샷의 "오버플로우"는 신뢰하지 않는다.
- 이 프로젝트([[gopumgyeok-receipt-reveal-logic]] 등이 있는 0007)의 유일한 브레이크포인트는
  `max-width:1024px` 하나뿐이라, 500px도 이미 모바일 분기 안에 들어간다 — 정확히 390px가
  아니어도 500px 캡처로 "모바일 레이아웃이 켜지는지"는 유효하게 검증할 수 있다. 사용자가
  명시적으로 아이폰 실기기 폭(375/390)의 텍스트 줄바꿈까지 요구하면, 이 헤드리스 CLI 방식의
  한계를 먼저 보고하고 실제 폭 기반 검증이 어렵다는 점을 알린다.
- [[headless-intersection-observer-limitation]], [[headless-chrome-hang-after-screenshot]]
  와 같은 계열의 "헤드리스 캡처 자체의 한계" 메모리다.
