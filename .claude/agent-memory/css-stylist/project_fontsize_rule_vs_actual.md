---
name: fontsize-rule-vs-actual
description: CLAUDE.md의 "폰트 크기 18px~96px, 예외는 2개뿐" 규칙이 실제 코드(모달/폼 UI 텍스트 13~15px)와 이미 어긋나 있다
metadata:
  type: project
---

CLAUDE.md는 "폰트 크기는 프로젝트 전역 18px~96px 범위만 허용, 예외는 `.hero-wordmark`와
`.form-agree`/`.form-agree-more`(16px) 둘 뿐"이라고 명시하지만, 실제 `assets/css/style.css`의
`.inquiry-sheet-desc`(15px), `.inquiry-sheet-form label`(14px), `.inquiry-sheet-form
input/select/textarea`(14px), `.inquiry-sheet-submit`(15px) 등 2026-09-04~09-11에 추가된
문의하기 Bottom Sheet 모달 내부 UI 텍스트는 이미 13~15px를 광범위하게 쓰고 있다.

**Why:** 문서가 갱신되지 않은 채로 남아있고, 실제로는 "본문/헤드라인 타이포"에만 18px+
규칙이 적용되고 "모달·폼 같은 보조 UI 크롬 텍스트"는 관례적으로 더 작은 13~15px를 써왔다는
것이 실제 코드에서 드러난다.

**How to apply:** 새 모달/폼/배지류 UI(공지바, 팝업 등)를 추가할 때는 문서의 18px 최소값을
기계적으로 지키기보다, 바로 인접한 기존 모달 컴포넌트(`.inquiry-sheet-*`)의 실제 폰트 크기를
먼저 확인하고 그 관례를 따른다. 다만 이 판단을 조용히 넘어가지 말고 작업 보고 시 문서와
실제가 어긋난다는 점을 팀에 공유해 문서 쪽이 갱신되도록 유도한다(2026-09-17, 공지바/팝업
모달 작업에서 실제로 이렇게 보고함, [[no-main-wrapper-sibling-push]] 참고).
