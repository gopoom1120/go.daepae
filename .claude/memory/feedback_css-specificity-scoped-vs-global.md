---
name: feedback_css-specificity-scoped-vs-global
description: "0007 CSS에서 05 인라인 폼은 스코프 없는 전역 셀렉터(label/input,select,textarea/form), 문의 모달(.inquiry-sheet-form)은 같은 태그를 class+type으로 다시 스코프해뒀다 — 공용 컴포넌트를 두 곳에 넣을 때 겪는 특이성 함정"
metadata:
  type: feedback
---

`assets/css/style.css`에서 05 매장위치 맨 아래 인라인 문의 폼(`#inquiryForm`)은 `label{...}`,
`input, select, textarea{...}`, `form{...}` 처럼 **스코프 없는 전역 타입 셀렉터**로 스타일이
잡혀 있다. 그런데 문의하기 Bottom Sheet 모달(`.inquiry-sheet-form`)은 **같은 태그(label,
input/select/textarea)를 `.inquiry-sheet-form label{...}`, `.inquiry-sheet-form input,
select, textarea{...}` 처럼 class+type으로 따로 다시 스코프**해뒀고, 이 쪽 값(font-size:14px,
font-weight:500, margin-bottom:6px, border:#DCD5C4, border-radius:6px 등)이 전역값과 다르다.

두 곳 모두에서 쓰는 공용 컴포넌트(예: 2026-09-11에 추가한 `.form-agree` 동의 체크박스,
`.select-field` 커스텀 드롭다운)를 만들면, `.inquiry-sheet-form` 안에서는 **클래스 하나짜리
셀렉터(`.form-agree`, specificity 0,1,0)가 `.inquiry-sheet-form label`(0,1,1)에게 특이성으로
밀린다** — CSS 명세상 selector당 특이성이 아니라 **선언한 속성 하나하나**를 개별 비교해서
이기고 지는 것이라, 이 함정은 한 번에 다 드러나지 않고 **속성별로 하나씩** 나타난다:

- 1차 수정에서는 `display:flex`가 깨지는 것만 보여서 `.inquiry-sheet-form .form-agree{
  display:flex; }`만 덮어썼다. 체크박스(`.form-agree-input`)가 숨겨지지 않고 컨테이너
  전체 폭으로 늘어나는 것도 같은 원인이라 같이 고쳤다.
- 그런데 `font-size`/`font-weight`/`margin-bottom`은 그때 건드리지 않아서, 실제로는
  "개인정보처리방침 동의" 글자만 몰래 14px/500굵기로 깔리고 옆의 "전문보기"(직접 18px를
  선언한 `<a>`라 이 함정에 안 걸림)만 정상 크기로 남는 회귀가 남아 있었다 — 사용자가
  스크린샷으로 "텍스트 크기/간격이 안 맞는다"고 지적하고 나서야 원인을 다시 추적해 찾았다.
- `.select-field-trigger`(버튼 태그)도 같은 이유로 `.inquiry-sheet-form input,select,
  textarea{border:#DCD5C4;border-radius:6px;}`를 못 물려받아, 옆 `<input>`은 연한 테두리인데
  트리거만 진한 기본 테두리(`var(--line)`)로 남아 또 지적받았다.

**Why**: "표시만 고치고 끝났다"고 착각하기 쉽다 — 눈에 보이는 문제(레이아웃 깨짐)부터
고치고 나면 화면이 "그럭저럭 동작"하는 것처럼 보여서, 같은 규칙이 다른 속성에도 이미 이겨
있다는 걸 놓친다. 이 프로젝트는 05 폼처럼 전역 스코프와 모달처럼 로컬 스코프가 같은 태그에
공존하는 구조라 이 문제가 구조적으로 반복된다.

**How to apply**: `#inquiryForm`/`.inquiry-sheet-form`/`.sticky-inquiry-bar` 셋 중 둘 이상에서
재사용할 공용 컴포넌트(class 셀렉터 하나로 스타일 전체를 정의하는 방식)를 새로 만들 때는:
1. 그 컴포넌트가 쓰는 태그(label/input/select/textarea/button/a)가 `.inquiry-sheet-form`
   스코프 안에서 로컬 규칙(전역보다 specificity가 높은 `.inquiry-sheet-form <tag>{...}`)과
   겹치는지 먼저 grep으로 확인한다.
2. 겹치면 **display 하나만 고치고 끝내지 말고**, 그 로컬 규칙이 선언한 속성 전부(font-size,
   font-weight, color, margin, padding, border, border-radius, background, width/height 등)를
   `.inquiry-sheet-form .내-컴포넌트{...}`로 통째로 다시 선언한다 — 부분만 덮으면 나머지
   속성이 조용히 새는 회귀가 남는다.
3. 수정 후 `getComputedStyle()`로 실제 렌더된 값(font-size 등)을 직접 찍어 확인하는 것이
   스크린샷 눈대중보다 안전하다 — 실제로 이 세션에서 `getComputedStyle(...).fontSize`로
   재검증하고 나서야 회귀가 없다고 확신할 수 있었다.

관련: [[gopumgyeok-design-system]]의 "하단 고정 문의 폼 바 + shadcn Select" 문단,
[[gopumgyeok-landing-project]].
