# JavaScript 규칙

## 문법 수준

**ES5 문법으로 작성한다.** 빌드 단계가 없고 `file://` 실행도 지원해야 하므로,
트랜스파일 없이 넓은 범위의 브라우저에서 그대로 돌아가야 한다.

- `var` 를 쓴다 (`const`/`let` 아님)
- `function () {}` 을 쓴다 (화살표 함수 아님)
- 문자열은 `+` 로 잇는다 (템플릿 리터럴 아님)
- 옵셔널 체이닝(`?.`), 스프레드, 구조분해를 쓰지 않는다

`fetch` 와 `Promise` 는 예외적으로 사용한다 (실패 시 `FALLBACK` 경로로 흡수됨).

## 구조

각 파일은 IIFE 로 감싸고 `"use strict"` 를 선언한다.
전역에는 `window.Popsicle` 같은 네임스페이스 하나만 노출한다.

```js
(function (global) {
  "use strict";
  // ...
  global.Popsicle = { render: render };
})(window);
```

## 렌더링

- 카드 마크업은 JS 문자열이 아니라 `index.html` 의 `<template>` 을 `cloneNode(true)` 해서 만든다.
- 텍스트는 `textContent` 로 넣는다. `innerHTML` 은 직접 만든 SVG 문자열에만 쓴다.
- DOM 삽입은 `DocumentFragment` 에 모아 **한 번만** 수행한다.

## 결정성

`Popsicle` 의 토핑 배치는 `Math.random()` 이 아니라 **시드 기반 난수**를 쓴다.
새로고침할 때마다 모양이 바뀌면 안 된다. 시드는 항목의 `id` 에서 해싱한다.

## 오류 처리

`fetch` 실패는 정상 경로다. `console.warn` 으로 알리고 `FALLBACK` 으로 렌더링한다.
사용자에게 에러 화면을 띄우지 않는다.
