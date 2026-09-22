---
name: no-main-wrapper-sibling-push
description: 이 프로젝트는 <main> 래퍼 없이 header.nav/notice-bar/각 section이 body 직속 형제라, 고정 요소가 늘어날 때 콘텐츠를 밀어내려면 일반 형제결합자(~)를 쓴다
metadata:
  type: feedback
---

`index.html`은 `<main>` 래퍼 없이 `header.nav`, (2026-09 추가된) `#noticeBar`, 각
`<section>`이 전부 `body`의 직속 형제다. 고정(`position:fixed`) 요소를 하나 더 쌓을 때
(예: 헤더 아래 공지바) JS/마크업을 건드리지 않고 "그 요소가 떠 있을 때만 뒤따르는 콘텐츠를
밀어내기"를 CSS만으로 하려면, `hidden` 속성 유무를 `:not([hidden])`으로 확인하고 일반
형제결합자(`~`)로 뒤따르는 모든 섹션에 오프셋을 더한다:

```css
#noticeBar:not([hidden]) ~ .hero{ padding-top:calc(170px + 44px); }
#noticeBar:not([hidden]) ~ section{ scroll-margin-top:calc(84px + 44px); }
```

**Why:** 팀 리드가 "CSS만으로 처리하기 어려우면 자연스럽게"라고 요청했을 때, HTML에 래퍼
`<div>`를 새로 감싸거나 JS로 body padding을 계산하는 방법은 css-stylist 역할 범위(스타일
파일만 수정) 밖이었다. 마크업이 이미 고정된 구조(래퍼 없는 flat 형제 리스트)라는 점을
이용하면 순수 CSS로 해결 가능했다.

**How to apply:** 새로운 고정(fixed) 오버레이 바를 헤더 근처에 추가할 때마다 이 패턴을 먼저
검토한다. 단, 이 트릭은 대상 요소가 실제로 `body`(또는 같은 부모)의 형제일 때만 통한다 —
`.location`처럼 이미 wrap 안에 중첩된 요소에는 적용 안 됨.

또한 헤더처럼 고정폭이 CSS 변수/토큰으로 노출되지 않는 요소의 정확한 렌더링 높이(패딩+콘텐츠
합산)는 계산으로 유추하지 말고 실측한다 — Chrome DevTools Protocol(CDP)을 헤드리스 Chrome에
`--remote-debugging-port`로 띄우고 Node의 내장 WebSocket으로 `Runtime.evaluate`
(`getBoundingClientRect()`/`offsetHeight`)를 호출하면 브라우저 없이는 알 수 없는 정확한 px
값(이 프로젝트는 데스크톱 86px/모바일 81px)을 구할 수 있다. `--screenshot` 단발 스크린샷보다
훨씬 정밀하다.
