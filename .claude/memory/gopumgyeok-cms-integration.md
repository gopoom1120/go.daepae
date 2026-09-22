---
name: gopumgyeok-cms-integration
description: "2026-09-17, 고품격대패 랜딩이 백오피스 go_daepae.cms.api와 실제로 연동됨 — 문의폼 전송, 팝업 기능 신규, script.js가 dataFetch.js/regexr.js로 분리됨(CLAUDE.md 아직 미반영)"
metadata:
  type: project
---

2026-09-17, [[gopumgyeok-landing-project]]가 별도 저장소 `go_daepae.cms.api`(Next.js+Supabase
백오피스)와 실제로 연동됐다. **CLAUDE.md는 아직 이 변화를 전혀 반영하지 않았다** — "JS는 렌더
1곳 + 인터랙션 8곳" 서술이 이제 부정확하고(파일이 3개로 나뉨), 팝업 기능 자체가 CLAUDE.md에
전혀 언급이 없다. 다음에 CLAUDE.md를 갱신할 일이 생기면 이 내용도 함께 반영할 것.

**1. 가맹문의 폼 실전송 연동** — [[gopumgyeok-open-issues]] 7번 항목이 이걸로 해소됨. 3개 폼
(05 인라인/문의하기 Bottom Sheet/하단 고정 바) 모두 `submitInquiry()`(`script.js`)가
`dataFetch('/franchise-inquiries', {method:'POST', body:...})`로 실제 전송한다. 성공 시
"접수되었습니다" 문구를 2.5초 보여준 뒤 `resetInquiryForm()`이 입력 필드·커스텀 select-field·
동의 체크박스·버튼 텍스트를 전부 초기화한다(2026-09-17 사용자 요청). 연락처 필드는
`formatPhoneNumber()`로 숫자만 입력해도 자동으로 하이픈이 붙는다(정규식 기반, 10자리는
3-3-4, 11자리는 3-4-4).

**2. 팝업 기능 신규 구현(CLAUDE.md 미반영)** — `franchise_popups` 테이블을 공개 GET
(`/public/franchise-popups`)으로 조회해 `#popupBackdrop` 모달에 Swiper.js(05 매장위치와
같은 라이브러리, 이번엔 `effect:'fade', fadeEffect:{crossFade:true}`로 좌우 슬라이드가 아니라
크로스페이드)로 렌더한다. "오늘 하루 보지 않기"는 서버/쿠키가 아니라 **localStorage**에
`popupDismiss:<팝업id>` = 오늘 날짜(`YYYY-MM-DD`) 형태로 저장된다(브라우저별, 팝업 id별
개별 관리). `autoHeight:true`라서 슬라이드마다 이미지 비율이 다르면 모달 높이가 바뀌는데,
좌우 화살표(`#popupPrev`/`#popupNext`)를 그 높이 변화에 맞춰 재배치하는 `centerPopupNav()`가
초기 로드 시 이미지 디코딩 타이밍과 어긋나 어긋나 보이는 버그가 있었다 — `ResizeObserver` +
0~600ms 지연 재계산 체인으로 고쳤다(모의 데이터로 0.5초 내 수렴 확인, 실제 CMS 서버 응답은
세션마다 팝업 개수/이미지가 달라 재현성이 낮았다).

**3. `script.js`가 3개 파일로 분리됨(2026-09-17, 사용자 명시적 요청)** — 사용자가 "서버
통신 로직"과 "정규표현식 함수"를 각각 별도 파일로 관리해달라고 요청했다:
- `assets/js/dataFetch.js` — `CMS_API_BASE_URL` 상수 + `dataFetch(endpoint, options)` 커스텀
  fetch 함수(엔드포인트를 인자로 받아 base URL 조합 + JSON body 시 Content-Type 헤더 자동
  부여). 파일명은 사용자가 "dataFetch"로 직접 지정했다.
- `assets/js/regexr.js` — 정규식 기반 유틸 `esc()`(HTML 이스케이프)와 `formatPhoneNumber()`.
  파일명은 사용자가 "regexr"로 직접 지정했다(오타 아님 — "regexer"가 아니라 "regexr").
- `assets/js/script.js` — 나머지 전부(렌더러, 인터랙션 8개 등). 이 세 파일은 여전히
  `type="module"`이 아니라 전역 스코프 공유 방식(defer 스크립트가 문서 순서대로 실행되며
  top-level `const`를 공유)이라, `index.html`에서 **dataFetch.js → regexr.js → script.js**
  순서로 로드돼야 한다(순서가 깨지면 `dataFetch`/`esc`/`formatPhoneNumber`가 정의되기 전에
  `script.js`가 참조해서 깨진다).

**Why**: 사용자가 유틸리티 관심사별로 파일을 쪼개는 것을 선호한다는 신호 — 프로젝트 초기
"모듈 시스템을 쓰지 않는다"는 원칙(CLAUDE.md)은 여전히 유효하지만(각 파일이 export 없이
전역에 바로 노출), "파일 하나에 다 몰아넣기"까지는 아니라는 게 이번에 명확해졌다. 앞으로
비슷한 성격의 새 유틸 뭉치가 생기면 사용자가 먼저 분리를 요청할 가능성이 높다.

**How to apply**: 새 CMS API 호출을 추가할 땐 `script.js`에 직접 `fetch`를 쓰지 말고
`dataFetch.js`의 `dataFetch()`를 통해서 쓸 것. 새 정규식 유틸이 필요하면 `regexr.js`에
추가할 것. `index.html`의 `<script defer>` 순서를 바꾸지 않도록 주의.
