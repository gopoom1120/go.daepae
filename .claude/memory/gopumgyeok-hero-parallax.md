---
name: gopumgyeok-hero-parallax
description: 히어로 sticky 패럴랙스 구조와, 그 때문에 생긴 z-index·웨이브 투과 함정
metadata:
  type: project
---

`0007` 히어로는 **화면에 고정(sticky)되고 다음 섹션이 그 위를 덮으며 올라오는** 패럴랙스다([[gopumgyeok-design-system]]). 2026-09-01 사용자 요청으로 두 단계에 걸쳐 만들어졌다.

1단계 — 배경만 고정. 참고 자료는 사용자 본인 예제(`younhoso.github.io/younhoso/blogExample/Parallax_Scroll/`)이고 거기 쓰인 기법이 `background-attachment:fixed`다. 이걸 쓰려면 배경이 `<img>`가 아니라 CSS 배경이어야 해서 `.hero-bg`의 `<img>`를 `background-image`로 바꾸고 `role="img"` + `aria-label`로 대체 텍스트를 유지했다.

2단계 — **문구·버튼까지 고정.** 배경만 고정하니 텍스트가 위로 밀려 올라가 어색하다는 피드백. `.hero{position:sticky; top:0}`으로 히어로 박스 전체를 붙였다. `position:fixed`가 아닌 이유는, `fixed`면 히어로가 문서 흐름에서 빠져 아래 섹션이 화면 맨 위로 올라오고 별도 스페이서가 필요해지기 때문이다. `sticky`는 100vh 자리를 그대로 차지해서 JS도 마크업 변경도 필요 없다.

**반드시 같이 지켜야 하는 것 (이걸 놓치면 화면이 깨진다):**
- `sticky`는 위치 지정 요소라 **뒤따르는 '정적' 형제보다 위에 그려진다.** `section`은 `position:relative`라 괜찮지만 `.wave`와 `footer`는 정적이라 히어로 뒤로 숨었다 → 둘에 `position:relative; z-index:1`을 줬다. **최상위에 새 정적 블록을 추가하면 같은 처리를 해야 한다.**
- 웨이브 SVG는 아래쪽 절반만 칠해져 윗부분이 투명하다. 전에는 그 틈으로 body 배경이 보였지만 이제 **고정된 히어로가 비친다** → 웨이브에 바로 위 섹션 색을 배경으로 깔았다. **실제 남아있는 웨이브는 `.wave--from-profit`(03 수익분석 → 04 창업비용 사이, `#1B0E0C` = profit 그라디언트 끝색) 하나뿐이다** — `.wave--from-card` 클래스는 CSS에도 없다(예전엔 있었을 수 있으나 지금 기준 존재하지 않음, 2026-09-04 확인). 웨이브를 추가/이동하면 이 배경색도 맞춰야 한다.

**예외 처리:** iOS Safari는 `background-attachment:fixed`를 무시하고 `cover` 계산까지 어긋난다 → `@media (max-width:820px), (hover:none)`에서 `scroll`로 되돌린다. `prefers-reduced-motion`에서도 끈다.

**세로 위치 조절 레버:** `.hero`는 `justify-content:center`라 **위/아래 패딩 차이의 절반**만큼 콘텐츠가 밀린다. 위로 올리려면 아래 패딩을 키운다(현재 `150px 24px 120px` = 정중앙보다 15px 아래). 상단 150px은 고정 헤더를 피하는 값이라 줄이지 말 것.

**Why:** sticky 전환은 한 줄 같아 보이지만 페인트 순서를 통째로 바꾼다. 위 두 가지는 실제로 화면이 깨진 뒤에 찾아낸 것이다.
