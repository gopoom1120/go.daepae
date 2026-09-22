---
name: gopumgyeok-headless-verification
description: 이 폴더에서 CSS를 시각 검증하는 방법 — 브라우저 확장이 없어 헤드리스 크롬 + iframe 래퍼를 쓴다
metadata:
  type: feedback
---

`0007`의 CSS는 눈으로 확인하지 않으면 안 된다([[gopumgyeok-landing-project]]). 그런데 이 환경에는 함정이 몇 개 있다.

**Claude in Chrome 확장은 연결돼 있지 않다.** `tabs_context_mcp`가 "Browser extension is not connected"로 실패한다. 실제 브라우저 조작이 필요하면 사용자에게 요청할 것. 그 전까지는 헤드리스 크롬으로 해결한다.

```bash
python3 -m http.server 8765 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 \
  --screenshot=out.png "http://localhost:8765/index.html"
```

**특정 섹션을 찍으려면 iframe 래퍼가 필요하다.** 이유 두 가지:
- `index.html#profit`로 여는 건 `html{scroll-behavior:smooth}` 때문에 엉뚱한 위치에서 찍힌다.
- 창 높이를 8000px로 키워 전체 페이지를 담으려 해도, 히어로가 `100vh`라 히어로 혼자 8000px이 되어 나머지가 안 보인다.

그래서 임시 `_shot.html`을 만들어 iframe에 `index.html`을 넣고, 고정 크기(예: 1440×900)를 준 뒤 `contentWindow.scrollTo(0, 대상.offsetTop + 오프셋)`로 이동시켜 찍는다. **찍고 나면 임시 파일을 지울 것.**

**헤드리스에서 CSS 트랜지션은 흐르지 않는다.** `--virtual-time-budget` 아래에서 첫 렌더 이후의 트랜지션은 진행되지 않아 `max-height`가 시작값에 멈춘 채 측정된다. 그래서:
- 애니메이션 **완료 상태**를 보려면 래퍼에서 `*{transition:none !important}`를 주입하고 찍는다.
- 애니메이션 **동작 여부**는 스크린샷 대신 **클래스 토글을 측정**해서 확인한다(예: `.in-view`가 붙고 떨어지는지).
- IntersectionObserver는 **첫 `scrollTo`를 `load` 핸들러에서 동기로** 호출해야 발화한다. 첫 스크롤을 `setTimeout` 안에 넣으면 콜백이 아예 안 온다(이후 단계는 `setTimeout` 체인으로 이어도 된다).

**픽셀 대신 숫자로 검증하면 훨씬 정확하다.** 텍스트 잘림·정렬 같은 건 래퍼에서 `getBoundingClientRect()`나 `Range.getBoundingClientRect()`로 재서 `document.title`에 적고 `--dump-dom | grep '<title>'`로 뽑는다. 실제로 이 방법으로 "매출 숫자 글자폭 = 폰트 크기의 5.83배"를 구해 `16cqw`라는 상한을 계산했고, 슬롯과 종이 폭이 0.0px 차이로 일치하는 것도 확인했다.

**Why:** 인계문서에 "모든 CSS가 시각 검증되지 않았다"고 적혀 있을 만큼 이 폴더는 눈으로 확인하는 게 중요한데, 위 함정들 때문에 순진하게 찍으면 검은 화면이나 접힌 카드만 나온다.

**2026-09-09에 추가로 확인된 함정들:**

- **검증 도중 파일이 실시간으로 계속 바뀔 수 있다.** 사용자가 같은 세션에서 짧은 간격으로
  연달아 수정 요청을 보내면(예: 문의 FAB 버튼을 하루에 다섯 번 다시 디자인), 스크린샷 검증을
  시작한 시점과 끝난 시점 사이에 코드가 이미 여러 버전 지나가 있을 수 있다. 검증 시작 전과
  끝나기 직전 두 번 관련 CSS/HTML을 다시 grep/Read해서 대상 코드가 안정됐는지(mtime이 더
  안 바뀌는지) 확인하고, 지시문이 묘사하는 "방금 바뀐 상태"가 아니라 **그 순간 디스크에 실제로
  있는 최종 상태**를 기준으로 보고한다.
- **`--window-size` 폭이 500px 미만이면 무시되고 500px로 렌더된 뒤 크롭된다.** 진짜 390px
  같은 좁은 모바일 폭을 테스트하려 해도 헤드리스 Chrome이 이 값을 존중하지 않아, 텍스트가
  잘린 것처럼 보이는 가짜 오버플로우가 생긴다. 500px 이상 값으로만 신뢰할 수 있다.
- **큰 폭(예: 5000px 이상) 스크롤 뒤 `--screenshot`을 찍으면 검은 프레임만 나올 때가 있다.**
  실제 스크롤로 먼 거리를 이동시키는 대신, 대상 요소에 `in-view` 같은 클래스를 스크립트로
  직접 주입하거나 `scrollTo` 목표 지점을 트리거 지점 바로 근처로 좁혀서 우회한다.
- **`initReceiptReveal`은 더 이상 `IntersectionObserver`가 아니라 순수 `scroll` 이벤트
  리스너**(`window.scrollY >= triggerTop` 비교)로 바뀌었다(2026-09-09). 그래서 이 반복 리빌을
  검증할 때는 `IntersectionObserver` 콜백 재발화 함정([[gopumgyeok-headless-verification]]
  위쪽 내용) 대신, `window.scrollTo(0, 목표값)` 직후 `window.dispatchEvent(new
  Event('scroll'))`을 명시적으로 호출해야 `update()`가 실행된다 — 헤드리스에서는 진짜 스크롤이
  일으키는 네이티브 scroll 이벤트가 프로그래매틱 `scrollTo`만으로는 안 붙는 경우가 있다.
- **`component-zip` 저장소에는 `0007`과 형제 폴더 `0007-B`가 공존하고, 둘 다 같은 포트
  (8765)로 로컬 서버를 띄우는 관례가 있다.** 다른 세션이 동시에 `0007-B`용 서버를 8765에
  띄워 놓으면 이쪽에서 `python3 -m http.server 8765`를 실행해도 실제로는 기존 서버가 응답해
  엉뚱한(0007-B) 콘텐츠를 캡처하게 된다. 캡처 전에 `lsof -a -p <PID> -d cwd`로 서버 프로세스의
  작업 디렉터리가 `0007`인지 확인하거나, 포트를 다른 값으로 바꿔 뜨는 것이 안전하다. **8765
  서버 프로세스 자체가 예고 없이 죽어 있는 경우도 잦다**(다른 세션이 같은 포트를 잡으려고
  기존 프로세스를 죽였다 살렸다 하는 것으로 추정) — 캡처 직전에 항상 `curl -s -o /dev/null
  -w '%{http_code}'`로 200이 오는지 먼저 확인한다.
- **`requestAnimationFrame` 기반 애니메이션(예: 숫자 카운트업)은 `--virtual-time-budget`으로
  타이밍을 신뢰성 있게 검증할 수 없다.** `--virtual-time-budget`을 3000ms→15000ms로 5배
  늘려도 rAF 루프의 진행률은 거의 늘지 않았다(1.1초짜리 카운트업이 15초 예산 안에서도 목표값의
  1% 근처에서 멈춤). `requestAnimationFrame`/`performance.now()`는 virtual time budget이
  아니라 진짜 wall-clock 페이싱을 따르는 것으로 보이고, 헤드리스 프로세스 자체는 스크립트
  실행 후 거의 즉시 스냅샷을 뜨기 때문에 실제 경과 시간이 몇 ms밖에 안 된다. **rAF 타이밍
  애니메이션은 헤드리스로 "몇 %까지 진행됐는지" 검증하려 하지 말고**, 대신 (1) 코드 로직을
  정적으로 읽어 이징 공식·클램프가 맞는지 확인하고, (2) 값이 0에서 벗어나 단조 증가하는지만
  (예산을 바꿔가며 두 번 찍어 비교) 확인해 "애니메이션 루프 자체가 정상적으로 도는지"만
  증명하는 선에서 정직하게 보고한다.
- **`window.scrollTo()`가 `html{scroll-behavior:smooth}`(이 프로젝트 전역 설정) 때문에
  헤드리스에서 즉시 반영되지 않고 `window.scrollY`가 0에 머무는 경우가 있다.** 반드시
  `window.scrollTo({top: N, behavior:'instant'})` 처럼 `behavior:'instant'`를 명시해서
  스무스 스크롤 애니메이션 자체를 우회해야 한다 — 그냥 `scrollTo(0, N)` 두 인자 형태는
  전역 CSS의 smooth 를 상속해 헤드리스에서 씹히는 사례가 있었다.
- **이 저장소는 다른 세션(또는 사용자 본인)이 동시에 커밋까지 하고 있을 수 있다.** 검증용으로
  만든 `_debug_*.html`이 내가 지우기도 전에 다른 세션의 커밋에 포함돼 저장소 히스토리에 남는
  사고가 실제로 있었다(`git log`에서 확인). 디버그 파일은 다 쓰자마자 즉시 삭제하고, 작업
  중간중간 `git log --oneline -5`로 내가 만들지 않은 새 커밋이 없는지 확인하는 습관이 필요하다.

**2026-09-17에 추가로 확인된 것 — Claude in Chrome 확장 대신 CDP를 직접 쓰는 법:**

- **`tabs_context_mcp`가 이번에도 "Browser extension is not connected"로 실패했다.** 클릭
  → 화면 전환 → 스크린샷처럼 실제 상호작용이 필요한 검증(캐러셀 다음 버튼 클릭 후 상태 확인,
  모달 열기 등)은 정적 `--screenshot` 한 방으로는 안 된다. 이럴 때 `google-chrome
  --headless=new --remote-debugging-port=PORT`로 띄우고, `curl -X PUT
  "http://localhost:PORT/json/new?URL"`로 탭을 연 뒤, Python `websockets` 패키지(이 환경에
  설치돼 있었다 — `pip3 list`로 먼저 확인)로 `webSocketDebuggerUrl`에 직접 연결해 CDP
  (`Page.navigate`, `Runtime.evaluate`, `Page.captureScreenshot`)를 호출하면 진짜 클릭/폼
  입력/슬라이드 전환을 재현하면서 검증할 수 있다. `Runtime.evaluate`에
  `document.getElementById(id).click()`이나 `dispatchEvent(new Event('input',
  {bubbles:true}))`를 넘기면 실제 이벤트 리스너가 그대로 발화한다.
- **`Page.captureScreenshot`이 가끔 응답 없이 멈춘다(수십 초~영구 hang).** 재현 조건은
  불명확하지만, 같은 프로필/포트를 여러 스크립트에서 재사용하거나 세션이 길어지면 잦아지는
  듯하다. 매 검증 라운드마다 **새 `--user-data-dir` 프로필 + 새 포트**로 크롬을 새로 띄우면
  훨씬 안정적이었다. 스크린샷이 꼭 필요 없고 좌표/치수(`getBoundingClientRect()`)만 확인하면
  되는 경우는 `Page.captureScreenshot` 호출 자체를 생략하는 게 더 빠르고 안전하다.
- **백그라운드로 Python 스크립트를 띄울 때 `asyncio.wait_for` 타임아웃을 반드시 걸어야 한다.**
  안 걸면 CDP 응답이 안 올 때 스크립트가 무한 대기하며 셸을 막는다. `(python3 x.py > out.log
  2>&1 &)` 형태로 서브셸에 백그라운드로 던지고 `sleep N; cat out.log`로 폴링하는 패턴이
  이 환경(Bash 도구가 `run_in_background`를 지원하지만 매번 켜기 번거로운 1회성 스크립트)에서
  가장 마찰이 적었다.
- **실제 CMS API(`localhost:3001`, go_daepae.cms.api 개발 서버)에 의존하는 기능(팝업 목록
  fetch)을 헤드리스로 반복 검증할 때는 응답이 세션마다 달라져(발행된 팝업 개수·이미지 로딩
  성공 여부가 실시간 서버 상태에 좌우됨) 재현성이 없었다.** 특히 이미지 디코딩 타이밍처럼
  수십~수백 ms 단위로 민감한 버그를 재현할 땐, `Page.addScriptToEvaluateOnNewDocument`로
  `window.fetch`를 몽키패치해 해당 엔드포인트만 고정된 모의 데이터(로컬 SVG data URI 등)로
  가로채는 편이 훨씬 결정적이고 빨랐다 — 실제 네트워크/이미지 CDN 상태와 무관하게 같은
  타이밍으로 반복 재현 가능.
