---
name: hidden-attr-vs-display-cascade
description: 이 프로젝트에서 [hidden] 토글 컴포넌트는 반드시 opacity/visibility 로 숨겨야 한다 — class 의 display 선언이 hidden 속성을 이긴다
metadata:
  type: project
---

`index.html` 에 `hidden` 속성으로 시작하는 컴포넌트(`#inquirySheetBackdrop`, `#popupBackdrop`,
`#noticeBar` 등)에 `.클래스{ display:flex; ... }` 를 조건 없이(즉 `:not([hidden])` 없이) 걸면,
브라우저 UA 스타일시트의 `[hidden]{ display:none }` 은 "normal 중요도"라 저자 스타일시트의
`display:flex`(역시 normal)가 특이성과 무관하게 항상 이긴다 — 즉 `hidden` 속성이 붙어 있어도
CSS 만으로 이미 보이는 상태가 된다.

**Why:** 2026-09-17 CMS 연동 검토에서 `.notice-bar{ display:flex }`(`assets/css/style.css:76`)에
이 문제가 실제로 있었다 — 헤드리스 스크린샷으로 CMS 미기동(공지 0건) 상태에서도 빈 "공지"
배지 바가 페이지 로드 즉시 노출되는 것을 확인했다(`initNoticeList()` 가 항목이 없어 `hidden` 을
그대로 둬도 소용없음). 반면 같은 파일의 `.inquiry-sheet-backdrop`/`.popup-backdrop` 은 우연히
안전한데, 이들은 `display:flex` 와 별개로 `opacity:0; visibility:hidden` 을 자체 규칙에 갖고
있어서 실제 숨김은 그 두 속성이 담당하기 때문이다(`hidden` 속성 자체에 의존하지 않음).

**How to apply:** 이 프로젝트에서 새 `hidden` 토글 컴포넌트를 검토/작성할 때는 "`display:flex`
같은 layout 속성 하나만 걸고 `hidden` 속성에 숨김을 맡기고 있지 않은지"를 확인한다. 안전한
패턴은 기본 규칙에 `opacity:0; visibility:hidden`(또는 `display:none` 을 명시하고 JS 로만 여닫는
`.is-open`류 클래스에서 override)을 포함시키는 것 — `.inquiry-sheet-backdrop`/`.popup-backdrop`
이 이미 이 패턴을 쓰고 있으니 새 모달/바 컴포넌트도 그대로 따라가면 된다.
