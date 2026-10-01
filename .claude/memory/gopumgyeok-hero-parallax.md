---
name: gopumgyeok-hero-parallax
description: 히어로 sticky 패럴랙스 구조와 z-index·웨이브 투과 함정. 2026-10-01 nav-toggle도 같은 함정으로 재발 + iOS Safari fixed 요소 유령 잔상 버그(translateZ(0) 대응)
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

---

**2026-10-01 추가 — 같은 "페인트 순서" 함정이 모바일 네비 토글에서도 재발했다.**
`.nav-toggle`(헤더 우측 햄버거/닫기 버튼)이 열린 상태에서 완전히 안 보이는 버그가 있었다 —
원인은 `.nav-links`(모바일 플라이아웃, `position:fixed`)가 **z-index:auto 인 positioned
요소라 static 형제인 `.nav-toggle`보다 항상 위에 칠해졌기 때문**이다(이 메모리 위쪽의
웨이브/footer 함정과 완전히 같은 CSS 규칙 — "positioned 요소는 z-index:auto 여도 static
형제보다 항상 나중에 그려진다"). `.nav-toggle`에 `position:relative; z-index:1`을 줘서
고쳤다. **일반화**: 이 프로젝트에서 fixed/sticky 요소를 새로 추가할 때마다 "그 요소와 겹치는
static 형제가 가려지지 않는지"를 항상 확인해야 한다 — 벌써 3번째(웨이브/footer, 그리고 이번
nav-toggle) 같은 패턴으로 터졌다.

같은 세션에서 햄버거 아이콘 자체도 CSS `<span>` 3개 + `transform(rotate/translateY)`로
수동으로 X 모양을 접던 방식에서 **`lucide-react`의 `Menu`/`X` 컴포넌트를 상태에 따라
그대로 교체 렌더링**하는 방식으로 바꿨다(`SiteHeader.tsx`) — 수치 계산이 미세하게
어긋나 삐뚤어진 X로 보이던 문제도 같이 해결됨. `lucide-react`는 이미 의존성에 있었지만
이게 프로젝트에서 **처음으로 실제 임포트된 사용처**다.

**2026-10-01 추가 — iOS Safari 전용 "fixed 요소 유령 잔상" 버그 (실기기에서만 재현, Chrome/
Playwright로는 검증 불가).** 사용자가 아이폰 14 사파리에서 스크린샷을 보내 "텍스트가 헤더
위로 겹쳐 보인다"고 제보했다. 이 페이지엔 겹친 fixed/sticky 레이어가 많다(고정 헤더, 스티키
히어로, 고정 우측 탭 `.inquiry-fab`, PC용 하단 고정 폼 바) — iOS Safari가 스크롤 중 이런
레이어를 재합성(repaint)할 때 한 프레임 쌓임 순서/잔상이 꼬이는 알려진 버그 유형이다.
**1차 시도로 `header.nav`와 `.hero`에 `transform:translateZ(0)`(GPU 레이어 강제 승격)를
추가했는데, 사용자가 같은 증상의 새 스크린샷을 다시 보내 확인해보니 실제로 겹쳐 보인 건
헤더가 아니라 `.inquiry-fab`(우측 세로 "창업 문의" 탭) 자신의 잔상이었다** — 첫 스크린샷
만으로 겹친 요소를 단정하지 말고, 재현 스크린샷의 색상/텍스트로 정확히 어느 컴포넌트인지
다시 확인해야 한다. `.inquiry-fab`은 `transform:translateY(-50%)`만 쓰고 있었는데,
`translate3d(0,-50%,0)` + `will-change:transform`으로 바꿔 명시적으로 자체 GPU 레이어를
강제해서 고쳤다(2026-10-01, 커밋 `a2b80ae`).

**Why:** 실기기 Safari 버그라 로컬(Chrome 헤드리스/Playwright)로는 재현도 검증도 안 된다 —
"로컬에서 멀쩡해 보이니 안 고쳤다"고 판단하면 안 된다. `transform:translateZ(0)` /
`translate3d(...)` + `will-change:transform` 조합은 이 프로젝트에서 fixed/sticky 요소가
iOS Safari에서 잔상/쌓임 문제를 보일 때 시도할 1차 대응으로 검증됐다 — 다만 **어느 요소가
실제로 깨졌는지는 매번 스크린샷으로 재확인해야 한다(헤더가 범인이라고 가정하지 말 것)**.
아직 완전히 해결됐다는 최종 확인(사용자 실기기 재테스트)은 받지 못한 상태다 — 다음 세션에서
같은 제보가 또 오면 `.sticky-inquiry-bar`(PC 전용 하단 고정 바)나 `.inquiry-sheet-backdrop`
같은 나머지 fixed 요소들도 같은 방식으로 의심해볼 것.
