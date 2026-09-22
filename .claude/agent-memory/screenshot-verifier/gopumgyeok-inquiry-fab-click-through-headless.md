---
name: gopumgyeok-inquiry-fab-click-through-headless
description: 헤드리스 스크린샷만으로 버튼 클릭 인터랙션(문의 시트 오픈 등)을 검증하는 방법 — puppeteer 없이 injected setTimeout+.click() 트릭
metadata:
  type: project
---

이 환경(`0007`)에는 puppeteer/CDP 클라이언트가 없어(`node -e "require.resolve('puppeteer')"` 실패),
정적 스크린샷만으로는 클릭 같은 인터랙션을 검증할 수 없다. 우회법: `index.html`을
`_debug_*.html`로 복사한 뒤 `</body>` 직전에 `window.addEventListener('load', ...)` +
`setTimeout(() => selector.click(), N)` 스크립트를 주입하고, `--virtual-time-budget`을
그 지연시간보다 충분히 크게 잡아 헤드리스로 캡처하면 "클릭 후" 화면을 스크린샷으로 얻을 수
있다. `--virtual-time-budget`은 실제 wall-clock이 아니라 브라우저의 가상 시계를 밀어붙이는
값이라 `setTimeout`도 그 시계를 따라간다 — 예산이 지연시간보다 작으면 클릭이 발생하기 전에
캡처가 끝나버린다.

**요소의 실제 computed style/좌표를 알고 싶을 때**는 스크린샷 대신, 같은 주입 스크립트에서
`getBoundingClientRect()`/`getComputedStyle()` 결과를 `JSON.stringify`해 화면에 보이는
`<pre>` 엘리먼트로 `body.appendChild`한 뒤 캡처하면, 스크린샷 자체가 디버그 출력이 된다 —
픽셀을 눈대중으로 비교하며 배경색 변화나 z-index 겹침을 추측하는 것보다 훨씬 빠르고 정확하다.
실제로 이 방법으로 "클릭 후 배경색이 이상하게 바뀐 것처럼 보였던" 현상이 z-index 버그가 아니라
[[gopumgyeok-live-edit-during-verification]]에서 설명한 파일 실시간 수정 때문이었음을 확인했다.

이 프로젝트의 문의 시트(`initInquirySheet`)는 트리거 버튼 자체(`btn.addEventListener('click', open)`)에
리스너를 붙이므로, 버튼 내부 마크업(아이콘 유무, span 구성 등)을 바꿔도 클릭 버블링에는 영향이
없다 — 자식 요소의 마크업 변경만으로는 클릭 동작이 깨지지 않는다는 점을 코드 확인만으로도 충분히
판단할 수 있었고, 이 트릭으로 실제 렌더링까지 재확인해 교차검증했다.

작업이 끝나면 `_debug_*.html`은 반드시 삭제한다(커밋에 남기지 않음).
