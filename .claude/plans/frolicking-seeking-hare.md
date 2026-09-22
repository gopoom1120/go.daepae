# 05 매장위치 — Swiper.js 슬라이더 + 배경 이미지 전환

## Context

`05 매장위치` 섹션은 지금 흰 배경(`--bg-card`) 위에 3열 정적 그리드(`.store-grid`)로 매장 카드
3개를 나열하는 구조다. 사용자가 참고 이미지로 보여준 레퍼런스(처음이어도 할 수 있어요! 스타일
슬라이더 — 어두운 블러 배경 + 좌측 텍스트 컬럼 + 원형 이전/일시정지/다음 버튼 + 우측 슬라이드가
살짝 겹쳐 보이는 카드 캐러셀)처럼 이 섹션을 **다시 작성**해달라는 요청이다. 배경에는 사용자가 새로
전달한 매장 개업식 사진(`assets/imgs/bg.png`, 1584×672 — 이미 프로젝트에 복사되어 있음)을 쓴다.
슬라이드 매커니즘은 Swiper.js 로 구현한다(이 프로젝트 최초의 외부 JS 의존성).

카드 자체의 시각 디자인(사진 + 오픈일 + 매장명 + 네이버 지도 버튼)은 사용자가 보여준 현재
스크린샷에서 이미 승인된 형태이므로 유지한다 — 바뀌는 것은 **컨테이너를 그리드에서 Swiper
캐러셀로 바꾸는 것**과 **섹션 전체를 흰 배경에서 어두운 배경+사진 컨셉으로 바꾸는 것**이다.
레퍼런스의 고객 인용구("- 더 바른 차담소")는 이 프로젝트에 해당 데이터가 없으므로 그대로
베끼지 않는다 — `gopumgyeok-brand-data` 메모리 원칙(카피·수치를 지어내지 않는다)에 따라, 왼쪽
텍스트 컬럼은 기존 h2 + 사실 기반의 짧은 보조 문장 + 캐러셀 컨트롤로 구성한다.

캐러셀 컨트롤 아이콘(이전/일시정지/재생/다음)은 사용자 지정에 따라 **Lucide**(lucide.dev,
MIT 라이선스) 아이콘을 쓴다. Lucide 는 npm/CDN 패키지가 아니라 `chevron-left`/`chevron-right`/
`pause`/`play` 각각의 SVG 마크업(`viewBox 0 0 24 24`, `fill:none`, `stroke:currentColor`,
`stroke-width:2`, round cap/join)만 그대로 인라인으로 가져와 붙인다 — 이미 프로젝트가 쓰는
"인라인 data-URI/SVG 아이콘" 관례(`PIN_SVG`, `.comp-card::after`, `.trust-item::after`)와
정확히 같은 방식이라 새 스크립트·CDN 태그가 필요 없고, `stroke:currentColor` 라 버튼의 `color`
토큰만 바꾸면 아이콘 색도 같이 바뀐다.

## 구현 방침

### 1. `index.html` — Swiper CDN + 05 섹션 마크업 재구성

`<head>` 에 Swiper CSS 를, `</body>` 직전(기존 `assets/js/script.js` 앞)에 Swiper JS 를 CDN 으로
추가한다 (jsdelivr `swiper-bundle` — 번들판이라 모듈을 따로 안 챙겨도 navigation/autoplay 가 다
들어있다). `defer` 로 순서를 보장하므로 `script.js` 보다 먼저 태그만 두면 된다:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
...
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
<script src="assets/js/script.js" defer></script>
```

05 섹션(현재 113~146행)을 좌/우 2단 레이아웃으로 바꾼다. 인라인 화살표/일시정지 아이콘은
기존 `PIN_SVG` 처럼 인라인 SVG 로 유지한다:

```html
<section class="location" id="location">
  <div class="location-bg" aria-hidden="true"></div>
  <div class="location-overlay" aria-hidden="true"></div>
  <div class="wrap">
    <div class="location-layout">
      <div class="location-left">
        <div class="section-head">
          <div class="kicker">05 · STORE LOCATIONS</div>
          <h2>세 곳의 매장,<br><span class="h2-accent">확장을 증명하는 기록</span></h2>
          <p>왕십리를 시작으로 천호, 시흥 은계까지 — 꾸준히 늘어난 매장이 브랜드의 신뢰를 증명합니다.</p>
        </div>
        <div class="store-nav">
          <button type="button" class="store-nav-btn store-nav-prev" aria-label="이전 매장">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" class="store-nav-btn store-nav-toggle" id="storeAutoplayToggle" aria-label="자동 재생 일시정지">
            <svg class="icon-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
            <svg class="icon-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </button>
          <button type="button" class="store-nav-btn store-nav-next" aria-label="다음 매장">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="location-right">
        <div class="swiper store-swiper">
          <div class="swiper-wrapper" id="storeGrid" data-content><!-- data/content.json → stores --></div>
        </div>
      </div>
    </div>

    <div class="inquiry-grid"> <!-- 기존 그대로 유지 --> </div>
  </div>
</section>
```

`data-content` 속성은 `storeGrid`(이제 `swiper-wrapper`)에 그대로 둔다 — `showDataError()` 가
`[data-content]` 전체를 순회해 에러 문구를 넣는 기존 동작과 호환된다.

### 2. `assets/js/script.js` — 슬라이드 래핑 + Swiper 초기화

`renderStores` 를 각 카드에 `.swiper-slide` 래퍼를 씌우도록 수정한다(카드 내부 마크업은 무변경):

```js
const renderStores = (list = []) => fill('storeGrid', list.map(({ name, date, image, mapUrl }) => `
  <div class="swiper-slide">
    <div class="store-card">
      <div class="photo"><img src="${esc(image)}" alt="${esc(name)}"></div>
      <div class="meta">
        <div class="date">${esc(date)}</div>
        <h4>${esc(name)}</h4>
        ${mapUrl ? `<a class="map-btn" href="${esc(mapUrl)}" target="_blank" rel="noopener noreferrer"
           aria-label="${esc(name)} 네이버 지도에서 보기 (새 창)">${PIN_SVG} 네이버 지도로 보기</a>` : ''}
      </div>
    </div>
  </div>`).join(''));
```

새 함수 `initStoreSwiper()` 를 추가하고, `renderStores` 호출 뒤(데이터가 DOM 에 올라온 후)
`boot()` 안에서 `initReceiptReveal()`/`initGridReveal()` 과 같은 자리에 호출한다. 기존
`prefers-reduced-motion` 존중 패턴(CSS 쪽 마지막 미디어쿼리)과 대칭을 맞춰 JS 에서도
`matchMedia` 로 감속 모션을 체크해 자동재생을 끈다:

```js
const initStoreSwiper = () => {
  const track = document.getElementById('storeGrid');
  if (!track || typeof Swiper === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggleBtn = document.getElementById('storeAutoplayToggle');

  const swiper = new Swiper('.store-swiper', {
    slidesPerView: 1.08,
    spaceBetween: 20,
    loop: true,
    speed: reduceMotion ? 0 : 550,
    autoplay: reduceMotion ? false : { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { prevEl: '.store-nav-prev', nextEl: '.store-nav-next' },
    a11y: { enabled: true },
    breakpoints: { 1025: { slidesPerView: 1.35, spaceBetween: 28 } },
  });

  if (!toggleBtn || !swiper.autoplay) return;
  let playing = !reduceMotion;
  toggleBtn.classList.toggle('is-paused', !playing);
  toggleBtn.addEventListener('click', () => {
    playing ? swiper.autoplay.stop() : swiper.autoplay.start();
    playing = !playing;
    toggleBtn.classList.toggle('is-paused', !playing);
    toggleBtn.setAttribute('aria-label', playing ? '자동 재생 일시정지' : '자동 재생 시작');
  });
};
```

일시정지 버튼의 ⏸/▶ 아이콘 전환은 두 SVG 를 버튼 안에 같이 두고 `.is-paused` 클래스로
`display` 를 토글하는 CSS 로 처리한다(JS 에서 매번 innerHTML 을 바꾸지 않는다).

`boot()` 의 `try` 블록 성공 경로 마지막, `initGridReveal()` 다음 줄에 `initStoreSwiper();` 를
추가한다.

### 3. `assets/css/style.css` — LOCATION 블록 재작성 (다크 섹션 + 배경사진 + 캐러셀)

현재 480~500행의 `LOCATION` 블록을 대체한다. `.location` 을 다른 어두운 섹션들(`.menu`,
`.cost`, `.competency`)과 같은 `--text: var(--text-invert);` 패턴으로 바꾸고, `.hero-bg`/
`.hero-overlay` 와 같은 절대배치 배경 레이어 방식을 재사용해 `bg.png` + 블러 + 어두운
그라디언트를 얹는다. `store-card` 는 이미 어두운 카드(`--bg-card-2`)였으므로 "밝은 배경을
다시 뒤집는" 기존 주석/오버라이드는 더 이상 필요 없어 제거한다:

```css
/* LOCATION */
.location{ position:relative; overflow:hidden; --text: var(--text-invert); }
.location-bg{
  position:absolute; inset:0; z-index:0;
  background-image:url('../imgs/bg.png');
  background-position:center; background-size:cover;
  filter:blur(6px); transform:scale(1.08);
}
.location-overlay{
  position:absolute; inset:0; z-index:1;
  background:linear-gradient(100deg, rgba(14,12,10,.94) 0%, rgba(14,12,10,.82) 40%, rgba(14,12,10,.55) 75%, rgba(14,12,10,.35) 100%);
}
.location .wrap{ position:relative; z-index:2; }

.location-layout{ display:grid; grid-template-columns:0.85fr 1.15fr; gap:56px; align-items:center; }
.location-left .section-head{ margin-bottom:40px; }

.store-nav{ display:flex; align-items:center; gap:14px; }
.store-nav-btn{
  width:48px; height:48px; border-radius:50%; flex-shrink:0;
  border:1px solid rgba(243,238,226,.35); background:rgba(14,12,10,.4);
  color:var(--text); display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:border-color .2s ease, background-color .2s ease;
}
.store-nav-btn svg{ width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; }
.store-nav-btn:hover{ border-color:var(--gold); background:rgba(201,162,39,.15); }
.store-nav-toggle .icon-play{ display:none; }
.store-nav-toggle.is-paused .icon-pause{ display:none; }
.store-nav-toggle.is-paused .icon-play{ display:block; }
.store-nav-btn.swiper-button-disabled{ opacity:.35; cursor:default; }

.store-swiper{ overflow:hidden; }
.swiper-slide{ height:auto; }
.store-card{ background:var(--bg-card-2); border:1px solid var(--line); height:100%; }
.store-card .photo{ aspect-ratio:16/9; overflow:hidden; }
.store-card .photo img{ width:100%; height:100%; object-fit:cover; }
.store-card .meta{ padding:22px 24px 26px; }
.store-card .meta .date{ color:var(--gold); font-size:18px; letter-spacing:0.04em; margin-bottom:8px; }
.store-card .meta h4{ font-size:18px; color:var(--text); font-weight:700; }
.map-btn{ /* 기존 규칙 그대로 유지 */ }
.map-btn svg{ /* 기존 규칙 그대로 유지 */ }
.map-btn:hover{ /* 기존 규칙 그대로 유지 */ }

@media (max-width:1024px){
  .location-layout{ grid-template-columns:1fr; gap:32px; }
}
```

`.map-btn` 관련 3개 규칙은 이미 존재하므로 그대로 옮기기만 하고, `@media (max-width:1024px){
.store-grid{...} }` 규칙은 `.store-grid` 자체가 사라지므로 삭제한다.

### 4. 새 애니메이션 필요 없음

캐러셀 전환은 Swiper 내장 트랜지션을 쓰므로 `animations.css` 에 새 `@keyframes` 를 추가할
필요가 없다. `prefers-reduced-motion` 대응은 JS 의 `speed:0`/`autoplay:false` 분기로 처리한다
(기존 CSS 쪽 `@media (prefers-reduced-motion: reduce)` 블록은 그대로 둔다).

### 5. 문서 동기화

- `CLAUDE.md`: 이 프로젝트 최초의 외부 JS 의존성(Swiper.js, CDN)임을 아키텍처 절에 명시하고,
  05 섹션이 이제 어두운 배경(`bg.png`)+캐러셀 구조라는 점을 기존 "흰 배경 섹션" 서술에서 갱신한다.
- `docs/design.md`: Components 절에 "05 매장위치 캐러셀" 서브섹션을 추가 — Swiper 설정값
  (slidesPerView/breakpoints/autoplay 딜레이), 배경 이미지 처리(blur+overlay), 컨트롤 버튼 스펙을 기록한다.
- `.claude/memory/gopumgyeok-design-system.md`: "5섹션 구조" 항목 5(매장위치)를 캐러셀 구조로
  갱신하고, Swiper.js 최초 외부 의존성 사실을 한 줄 추가한다.

## 검증

1. `python3 -m http.server 8765` 로컬 서버 기동.
2. 헤드리스 Chrome 스크린샷으로 데스크톱(`--window-size=1440,3000`, 05 섹션 영역)과 모바일
   (`--window-size=390,2600`, `max-width:1024px` 분기) 두 폭에서 캡처해 육안 확인:
   - 좌측 텍스트 컬럼과 원형 버튼 3개(이전/일시정지/토글 후 재생/다음)가 레퍼런스 비율대로 보이는지
   - 우측에 카드 1.x개가 겹쳐 보이는(peeking) 효과가 나오는지
   - 배경 사진이 블러+어두운 그라디언트로 깔려 텍스트 대비가 충분한지
3. 콘솔 에러 확인 — Swiper 로드 실패나 `new Swiper(...)` 예외가 없는지
   (`mcp__claude-in-chrome__read_console_messages` 또는 헤드리스 `--enable-logging` 출력).
4. 이전/다음 버튼 클릭, 일시정지 버튼 토글이 실제로 동작하는지 확인(가능하면 Chrome 자동화로,
   여의치 않으면 코드 로직 재검토로 대체).
5. 에셋 참조 정합성 grep(`assets/imgs/bg.png` 포함)으로 누락 파일이 없는지 확인.
6. Lucide 아이콘(`chevron-left`/`chevron-right`/`pause`/`play`) 경로 데이터는 구현 시점에
   lucide.dev 소스와 대조해 정확한 `<path>`/`<rect>`/`<polygon>` 좌표를 확인한 뒤 적용한다
   (본 계획서의 마크업은 형태를 보여주기 위한 스케치이며, 실제 삽입 전 1회 검증한다).
7. `python3 -c "import json;json.load(open('data/content.json'));print('ok')"` — content.json 은
   이번 변경에서 스키마가 안 바뀌므로 무해성 확인 차원.
