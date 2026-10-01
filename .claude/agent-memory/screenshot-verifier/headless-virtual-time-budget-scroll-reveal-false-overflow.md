---
name: headless-virtual-time-budget-scroll-reveal-false-overflow
description: "--virtual-time-budget + --screenshot CLI 단발 캡처가 스크롤 리빌 애니메이션이 걸린 섹션(히어로 워드마크, 섹션 타이틀 등)을 전환 중간 프레임에서 얼려 텍스트가 뷰포트 밖으로 잘린 것처럼 보이는 거짓 오버플로우를 만든다 — CDP 라이브 캡처로 재확인하면 실제로는 전혀 잘리지 않음"
metadata:
  type: feedback
---

Next.js 이식(go.daepae) 세션에서 390px 모바일 스크린샷(`--headless=new --window-size=390,... --virtual-time-budget=9000 --screenshot=...`)을 찍을 때마다 히어로 워드마크(`.hero-wordmark`)와 04 창업비용 섹션 타이틀/표가 뷰포트 오른쪽으로 심하게 잘려 나오는 현상을 반복 관찰했다. 원인을 좁히려고 CSS 변경 되돌리기, `git stash`로 당일 작업 전체 되돌리기(심지어 커밋 `8d6aca8` 상태로도 재현), 중복 `next dev` 프로세스 정리까지 시도했지만 **증상이 완전히 동일하게 지속**됐다 — 즉 코드 문제가 전혀 아니었다.

**검증 방법**: Node 24의 내장 `WebSocket`으로 Chrome을 `--remote-debugging-port`로 띄우고 CDP(`Emulation.setDeviceMetricsOverride`로 390×1200 모바일 뷰포트 강제 + `Page.navigate` + 2~3초 대기 + `Page.captureScreenshot`)를 직접 구동해 **같은 페이지를 라이브로** 다시 캡처했다. 결과: 어떤 요소도 `getBoundingClientRect().right`가 뷰포트를 넘지 않았고(`document.body.scrollWidth === document.documentElement.clientWidth === 390`), 스크린샷에도 잘린 텍스트가 전혀 없었다 — 히어로 워드마크·창업비용 타이틀·표 전부 완벽하게 뷰포트 안에 들어왔다.

**Why**: `.hero-wordmark` 등 스크롤 리빌 애니메이션(`scale`/`opacity`/`clip-path` 전환)이 걸린 요소가 있는 섹션에서, `--virtual-time-budget` 기반 단발 `--screenshot` CLI 캡처는 애니메이션이 완전히 settle 되기 전의 **중간 전환 프레임**을 찍는 경우가 있다(추정 — 정확한 내부 메커니즘은 특정하지 못했으나, CDP 라이브 캡처에서는 100% 재현되지 않는다는 점에서 CLI 단발 캡처 경로 고유의 타이밍 아티팩트로 보인다). 중간 프레임에서 `transform: scale(...)` 값이 최종값보다 크면 텍스트 박스가 실제보다 넓어 보여, 뷰포트 오른쪽이 "잘린" 것처럼 보이는 거짓 오버플로우가 생긴다.

**How to apply**:
1. 스크롤 리빌/진입 애니메이션이 걸린 섹션(히어로, 섹션 타이틀, `.comp-card`/`.trust-item`/`.profit-pie` 등 `useInView` 훅을 쓰는 모든 컴포넌트)을 390px 이하 모바일 폭으로 검증할 때, **`--screenshot` CLI 단발 캡처에서 오버플로우/잘림이 보이면 즉시 코드를 의심하지 말 것.** 먼저 CDP 라이브 캡처(이 메모리의 검증 방법 절차)로 재확인한다.
2. CDP 재확인 스크립트 핵심: `node`(v22+, 내장 `WebSocket` 필요) + `chrome --headless=new --remote-debugging-port=PORT` + `/json/new?URL`로 탭 생성 + `Emulation.setDeviceMetricsOverride`로 원하는 뷰포트 강제 + `Runtime.evaluate`로 `getBoundingClientRect()` 전수 스캔(뷰포트 밖 요소 목록화) + `Page.captureScreenshot`. `puppeteer`/`playwright` 설치 없이도 가능하다.
3. `getBoundingClientRect()` 전수 스캔에서 걸리는 요소 중 `position:fixed`로 오프캔버스 배치된 모바일 네비(`.nav-links`)나 Swiper의 비활성 슬라이드(`.swiper-slide`)는 **의도된 정상 동작**이니 오탐으로 넘긴다 — 실제 버그는 `body.scrollWidth`가 `clientWidth`보다 큰 경우만 의심한다.
4. 작업 완료 후 디버깅에 쓴 CDP용 Chrome 프로세스(`--remote-debugging-port`)는 `pkill -f "remote-debugging-port=PORT"`로 반드시 정리한다 — 일반 `pkill -f "next dev"`처럼 다른 위험한 명령과 체이닝하면 권한 시스템이 전체를 거부할 수 있으니 단독 명령으로 실행한다.

[[gopumgyeok-nextjs-migration-debug-route-technique]]와 함께 적용 — 디버그 라우트로 섹션을 고립시켜 캡처할 때도 이 타이밍 아티팩트는 똑같이 발생할 수 있으니, "잘렸다"는 결과 자체보다 CDP 재확인 결과를 신뢰한다.
