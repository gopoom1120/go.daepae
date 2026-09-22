---
name: gopumgyeok-shadcn-detour-reverted
description: "2026-09-04에 shadcn/ui 전면 재설계를 했다가 같은 날 사용자가 골드/레드/RixYeoljeongdo로 되돌린 경위 — 문서(CLAUDE.md 등)가 아직 shadcn 기준이라 코드와 어긋나 있다는 경고"
metadata:
  type: project
---

2026-09-04 하루 안에 이 프로젝트의 디자인 아이덴티티가 **골드/레드 스큐어모픽 → shadcn 뉴트럴
→ 다시 골드/레드 스큐어모픽**으로 왕복했다. 다음 세션이 `CLAUDE.md`/`docs/design.md`를 그대로
믿으면 안 되는 이유가 바로 이것이다.

## 무슨 일이 있었나

1. 사용자가 "docs/design.md 등 관련 문서에 shadcn/ui(https://ui.shadcn.com/) 와 100% 동일한
   디자인 철학을 적용해달라"고 요청. AskUserQuestion으로 범위를 확인하자 "전체 브랜드
   아이덴티티 100% 교체"(색상 토큰·타이포그래피·시그니처 장치 전부)와 "docs/design.md,
   CLAUDE.md, README.md, 해당 서브에이전트 모두" 문서 갱신을 명시적으로 선택함.
2. 이 결정에 따라 `assets/css/style.css`/`animations.css`/`fonts.css`, `index.html`,
   `assets/js/script.js`를 shadcn dark 테마 oklch 토큰 체계로 전면 재설계하고,
   `RixYeoljeongdo.woff2` 삭제, 워드마크 팝/샤인 애니메이션·펀치홀 노치·리본 코너·영수증
   프린터슬롯/스캘럽/바코드 전부 제거. `CLAUDE.md`, `README.md`, `docs/design.md`,
   `.claude/agents/*.md` 8개 전부를 이 새 시스템 기준으로 다시 썼다.
3. 곧이어 같은 세션에서 사용자가 방향을 두 번 되돌림:
   - 먼저 "히어로·섹션 타이틀 폰트 크기·타이포그래피는 이전과 동일하게, 대신 shadcn
     아이덴티티(색상)는 유지"를 요청 → `git show HEAD:./assets/css/style.css`로 재설계 직전
     커밋의 정확한 옛 폰트 크기표를 뽑아 색상은 shadcn 그대로 두고 크기/굵기/자간만 복원.
   - 그 다음 "RixYeoljeongdo 폰트도 쓸 거야, 색상도 이전과 똑같이" + "animations.css도
     이전과 동일하게, 이전 작업 괜찮았어"로 **색상·폰트·애니메이션까지 전부 원복** 요청.
4. 이때 쓴 방법이 핵심 노하우다: `git show HEAD:<path>`로 재설계 직전 커밋(당시 HEAD,
   해시 `92409a9`)의 `style.css`/`animations.css`/`fonts.css`/`script.js`/`index.html`을
   그대로 끌어와 **정본**으로 삼고, `diff`로 재설계 이전↔이후 차이를 대조해 "그 사이에 새로
   추가된 것"(문의하기 Bottom Sheet 팝업 — `.inquiry-sheet-*`, `initInquirySheet`)을
   식별했다. 단순 `git checkout`으로 전체를 되돌리지 않고, 옛 CSS/JS/HTML을 기준으로 재작성한
   뒤 Bottom Sheet 블록만 골드/화이트 톤으로 재배색해서 얹었다 — 새로 확정된 기능을 밀어버리지
   않으면서 "이전과 똑같이"를 만족시킨 방법.
5. 이 과정에서 기존 프로젝트 메모리([[gopumgyeok-design-system]])에 남아있던 컬러 토큰 기록
   (`--bg-card:#18140F`, `--text:#F3EEE2` 단일값)이 실제 코드(`--bg-card:#FFFFFF`,
   `--text:#333333`+`--text-invert:#F3EEE2` 분리)와 어긋나 있었다는 것도 이번에 발견해 정정함.
6. 최종 결과를 커밋(`d7841f0`)하고 푸시함.

## ⚠️ 지금 상태 — 코드와 문서가 어긋나 있다

**코드**(`assets/css/*.css`, `assets/js/script.js`, `index.html`)는 골드/레드/RixYeoljeongdo
스큐어모픽 디자인으로 **완전히 되돌아갔다** — [[gopumgyeok-design-system]]이 정확한 현재 상태다.

**문서**(`CLAUDE.md`, `README.md`, `docs/design.md`, `.claude/agents/*.md` 8개)는 여전히
2026-09-04 shadcn 재설계 버전 그대로다 — "shadcn 뉴트럴 토큰이 현재 시스템"이라고 적혀 있지만
**더 이상 사실이 아니다.** 이 되돌리기 작업 자체는 문서에 반영되지 않은 채 커밋됐다
(사용자에게 이 사실을 알렸고, 아직 후속 요청은 없었다).

**How to apply**: 다음 세션에서 디자인 관련 작업을 할 때 `CLAUDE.md`/`docs/design.md`의 "shadcn"
서술을 근거로 판단하지 말 것 — 반드시 `assets/css/style.css`의 실제 `:root` 토큰을 직접 읽어
확인한다. 문서를 갱신해달라는 요청이 오면 이 메모리와 [[gopumgyeok-design-system]]을 근거로
골드/레드/RixYeoljeongdo 체계로 다시 맞춰 쓸 것 — shadcn 서술을 정본으로 착각해 코드를 다시
shadcn으로 밀지 말 것.

**일반화할 교훈**: 사용자가 "예전처럼/이전과 동일하게 되돌려줘"라고 하면, 기억이나 대화 맥락으로
재구성하지 말고 `git show HEAD:<path>`(또는 관련 커밋)로 실제 옛 파일을 가져와 정본으로 삼는다.
그 사이에 정당하게 추가된 새 기능이 있는지 `diff`로 확인해 함께 보존한다 — 전체 되돌리기가 그
새 기능까지 지워버리는 회귀가 되지 않도록.
