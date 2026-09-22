---
name: headless-large-scroll-screenshot-black-frame
description: 헤드리스 Chrome --screenshot 이 프로그래매틱 window.scrollTo() 로 큰 거리(약 5000px)를 점프시킨 뒤 캡처하면 완전히 새까만 프레임을 뱉는 렌더링 버그. --dump-dom 은 영향 없음
metadata:
  type: feedback
---

`--headless=new --disable-gpu --screenshot=...` 로 페이지를 로드한 뒤 주입 스크립트가
`window.scrollTo(0, veryFarY)`(0007 의 03 수익분석 섹션처럼 문서 상단에서 약 5500px 떨어진
지점)로 스크롤하고 `virtual-time-budget` 을 그 이후까지 넉넉히 주더라도, 최종 스크린샷 PNG 가
완전히 단색 검정 프레임으로 나오는 경우를 재현했다(같은 스크립트를 두 번 실행해도 파일 크기가
정확히 6491 bytes 로 동일 — 진짜 렌더링 실패지 우연이 아니다). **`--dump-dom` 으로 같은 스크롤을
검증하면 DOM 값 자체는 정확하다** — 문제는 스크린샷 합성 단계에만 있다.

**Why:** [[headless-intersection-observer-limitation]]에 기록된 "약 700~900px 이상 점프하면
블랙 프레임" 관찰과 같은 계열의 버그로 보이며, 이번엔 그보다 훨씬 큰(~5500px) 점프에서도 동일하게
재현됐다. 앞단 섹션을 `display:none` 으로 죽여 문서 자체를 짧게 만들어도(즉 스크롤 거리를
줄여도) 이번엔 해결되지 않았다 — 오히려 그 시도에서 `dump-dom` 결과가 `"-1,549,260"` 같은 말이
안 되는 음수값을 뱉기도 했는데, 이건 스크롤 버그가 아니라 **같은 작업 디렉토리를 동시에 건드리는
다른 세션이 `_debug_*.html` 을 검증 도중 지우거나 덮어써서** 생긴 별개의 오염이었다
([[gopumgyeok-live-edit-during-verification]] 참고 — 이 프로젝트는 여러 에이전트 세션이 동시에
같은 파일을 편집할 수 있는 공유 작업 디렉토리다).

**How to apply:**
1. 큰 스크롤 이동 후의 **레이아웃**을 스크린샷으로 보고 싶다면, 실제 `scrollTo` 대신 **목표
   CSS 클래스를 직접 주입**해 "스크롤한 것처럼 보이는 상태"를 만들고(예: `.receipt-col`에
   `in-view` 직접 add), [[tall-viewport-fixed-modal-confound]]에서 쓰는 초대형 `window-size`
   풀페이지 기법으로 스크롤 자체를 없앤 채 캡처한다. 이 조합이 지금까지 가장 안전했다.
2. 큰 스크롤 이동 후의 **DOM 값 정확성**(카운트업 최종값 등)만 필요하면 `--dump-dom` 을 쓴다.
   스크린샷과 달리 이 버그의 영향을 받지 않았다.
3. `_debug_*.html` 을 만들고 Chrome 을 실행하고 결과를 읽고 파일을 지우는 전체 과정을 **하나의
   Bash 호출 안에서 원자적으로** 끝낸다. 이 프로젝트는 다른 세션이 같은 파일명 패턴을 정리/수정할
   수 있어(실제로 이번 세션 중 `_debug_full.html` 에 추가한 CSS 한 줄이 다음 Bash 호출 사이에
   통째로 사라져 원본 `index.html` 사본 상태로 되돌아간 것을 목격), 여러 Bash 호출에 걸쳐 같은
   디버그 파일을 재사용하면 언제 그 파일이 다른 세션에 의해 건드려질지 보장할 수 없다.
4. 결과가 이상하면 먼저 "헤드리스 한계"를 의심하기 전에 관련 소스 파일들의 mtime 이 검증
   도중 안정적이었는지(`stat -f "%Sm"` 을 몇 초 간격으로 재확인) 체크하는 게 더 싸고 확실하다.
