# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@docs/TECH-STACK-PRIORITY.md

---

# 고품격대패 — 프랜차이즈 창업 랜딩페이지 (시안A_v2)

빌드 도구 없이 동작하는 단일 페이지 랜딩. `index.html` + `assets/css`(스타일, 역할별 4파일 —
`init.css`/`fonts.css`/`animations.css`/`style.css`) + `assets/js`(스크립트) + `assets/fonts`(웹폰트)
+ `assets/imgs`(이미지) + `data/content.json`(콘텐츠)이 전부다. **2026-09-02 에 `style.css`/
`animations.css`/`script.js`가 프로젝트 루트에서 `assets/css`·`assets/js` 로, 이미지가
`assets/*.jpg` 평면 구조에서 `assets/imgs/` 로 이동했고, 그 뒤 CSS 는 다시 초기화/폰트/키프레임/
컴포넌트 4개 파일로 나뉘었다** — 오래된 문서나 커밋 메시지에서 루트의 `style.css`, `script.js`,
`assets/파일명.jpg`, 또는 CSS 한 덩어리를 보게 되면 실제 위치가 아니라 이동 전 기록임을 감안할 것.

**형제 폴더와 성격이 다르다.** `0001`~`0006`은 재사용 가능한 컴포넌트 데모지만, 이 폴더는
**실제 클라이언트(고품격대패)에게 제출할 랜딩 시안**이다. 구조를 임의로 재작성하지 않는다.
`0007` 은 `component-zip` 저장소의 독립 폴더이며 형제 폴더에 의존하지 않는다. 저장소 전체가
GitHub Pages 로 배포된다(`.github/workflows/static.yml`) — 빌드 단계 없음.

작업 전 **`README.md` 를 먼저 읽는다.** 이 시안은 claude.ai 웹 대화에서 만들어져
CLI 로 인계된 것이라, 확정된 결정과 이미 제거된 요소가 그 문서에 정리되어 있다.
색상 토큰·타이포그래피 크기 표·컴포넌트별 규칙 같은 디자인 세부 값은 **`docs/design.md`** 가
정본이다 — 이 파일(CLAUDE.md)은 "왜 이렇게 짜여 있는지"를, `docs/design.md` 는 "정확히 몇 px/
몇 hex 인지"를 다룬다.

**2026-09-04, 이 골드/레드 디자인을 하루 동안 [shadcn/ui](https://ui.shadcn.com/) 뉴트럴 톤으로
전면 재설계했다가, 같은 날 사용자가 "이전과 똑같이" 되돌려달라고 요청해 색상·RixYeoljeongdo
폰트·애니메이션·스큐어모픽 디테일을 전부 원복했다.** 이 CLAUDE.md 와 `docs/design.md` 는 그
원복 이후 기준이다. 다른 문서(README.md 등)나 커밋 메시지에서 "shadcn 뉴트럴 토큰"을 보게
되면 그 하루 동안의 이력이지 지금 상태가 아님을 감안할 것.

---

## 명령어

```bash
# 로컬 서버
python3 -m http.server 8765     # http://localhost:8765/index.html

# ⚠ file:// 로 더블클릭해 열면 data/content.json 이 CORS 로 막혀 콘텐츠가 안 나온다
#   (화면에 안내 문구가 뜬다). 반드시 위 로컬 서버로 볼 것.

# JSON 유효성
python3 -c "import json;json.load(open('data/content.json'));print('ok')"

# 헤드리스 스크린샷 (시각 검증)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1440,3000 --virtual-time-budget=9000 \
  --screenshot=/tmp/shot.png "http://localhost:8765/index.html"

# 에셋 참조 정합성 (참조하는데 없는 파일 찾기)
grep -oE 'assets/[A-Za-z0-9_./-]+' index.html assets/css/*.css assets/js/*.js data/content.json | sort -u | \
  while read f; do [ -f "$f" ] || echo "MISSING: $f"; done
```

테스트 러너·린터·빌드는 없다. 검증 수단은 위 스크린샷과 육안 확인이 전부다.
**지금까지의 CSS 는 브라우저로 한 번도 검증된 적이 없다** — 이전 작업 환경에 브라우저가 없었다.
CSS 를 만졌으면 반드시 실제로 렌더해서 확인한다.

---

## 아키텍처

### 콘텐츠는 `data/content.json` 하나가 단일 진실 공급원

경쟁력 카드·트러스트 스트립·고기 9종·셀프바·수익 3개 매장·창업비용표·매장 카드·연락처가
전부 이 JSON 에 있다. **문구나 이미지를 바꿀 일이 생기면 거의 항상 JSON 만 고치면 된다.**

`index.html` 에는 각 자리에 빈 컨테이너(`data-content` 속성 + id)만 있고, `assets/js/script.js` 가
`fetch` 로 읽어 채운다. `0003`~`0005` 처럼 JS 안에 `FALLBACK` 사본을 두지 **않았다** —
사본을 두면 JSON 을 고쳐도 화면이 안 바뀌는 함정이 생긴다. 대신 `fetch` 실패 시
(대개 `file://` 로 연 경우) 해당 자리에 이유를 적어 보여준다.

JSON 에서 `desc` 로 끝나는 필드만 `<b>` 같은 인라인 태그를 그대로 쓸 수 있고(HTML 로 삽입),
나머지 텍스트 필드는 `esc()` 로 이스케이프된다.

### JS 는 렌더 1곳 + 인터랙션 8곳

```
DOMContentLoaded
 └─ boot()  데이터 무관 인터랙션 5개 먼저 붙임(JSON 실패해도 동작해야 하므로) →
      data/content.json 을 fetch → renderAll() 로 8개 영역 렌더 →
      DOM 에 카드가 올라온 뒤에만 관찰 가능한 3개(initReceiptReveal/initProfitCountReveal/
      initGridReveal)와 initStoreSwiper() 를 붙임
 ├─ initSmoothScroll()    [data-target] 클릭 → scrollIntoView + 모바일 메뉴 닫기
 ├─ initMobileNav()       #navToggle → .nav-open 토글
 ├─ initScrollSpy()       스크롤 40px 넘으면 헤더 .scrolled / rootMargin 으로 nav active 갱신
 ├─ initInquiryForm()     05 섹션 인라인 폼(#inquiryForm) submit 가로채 버튼 텍스트만 교체 (목업)
 ├─ initInquirySheet()    문의하기 Bottom Sheet(#inquirySheetBackdrop) — [data-open-inquiry]
 │                        클릭으로만 열림(헤더/히어로/우측 스크롤바 세로 탭/창업비용/05 매장위치 CTA).
 │                        자체 폼(#inquirySheetForm)을 쓰며 05 의 인라인 폼과는 별개.
 │                        2026-09-04 신규, 2026-09-09에 #menu 섹션 자동 오픈을 제거하고
 │                        우측 스크롤바에 붙는 세로형 퀵 탭(`.inquiry-fab`) 클릭 방식으로 바꿈
 ├─ initReceiptReveal()   scroll 이벤트로 뷰포트 상단 vs #selfbarGrid(02 메뉴, 03 도착 전) 상단
 │                        좌표를 비교해 종이(.receipt-col) 펼침/접힘만 토글. 그 지점을 지날
 │                        때마다 반복 재생(disconnect 없음)
 ├─ initProfitCountReveal() initReceiptReveal 과 같은 scroll 이벤트 + getBoundingClientRect
 │                        방식(IntersectionObserver 아님 — 이 환경 헤드리스 검증에서 프로그래매틱
 │                        scrollTo 뒤 IO 콜백이 재발화하지 않는 한계가 확인돼 일관되게 피함)으로
 │                        영수증 카드(.receipt-col)가 40% 이상 보일 때 매출 숫자(.r-sales)를
 │                        0→실제값 카운트업, 벗어나면 0으로 리셋. initReceiptReveal 과 트리거를
 │                        일부러 분리했다(2026-09-09) — 종이는 03 섹션 도착 전에 미리 펼쳐지므로
 │                        같은 트리거를 쓰면 사용자가 눈으로 보기도 전에 카운트업이 끝나버려
 │                        인터랙션이 없는 것처럼 느껴졌다
 ├─ initGridReveal()      경쟁력 카드(.comp-card)/트러스트 카드(.trust-item)/고기 카드
 │                        (.meat-card)/후기 카드(.review-item) 스크롤 리빌, 한 번 보이면 unobserve
 └─ initStoreSwiper()     05 매장위치 Swiper 캐러셀 초기화 + 자동재생 타이머 링 갱신
```

모듈 시스템(`import`/`type="module"`)을 쓰지 않는다 — 파일 하나에 전역 함수로 둔다.

### 영수증 카드는 되돌리기 쉬운 함정이 있다

`03 수익분석`의 영수증 카드는 여러 차례 피드백으로 확정된 구조다. 아래를 "정리"하면 회귀다.

- 종이 그림자는 `.receipt-body` 에 **`filter: drop-shadow()`**. 종이 자체에 `box-shadow` 를 걸면
  하단 스캘럽 절취선의 투명한 틈으로 그림자가 새어 회색 띠가 생긴다.
- 절취선은 `clip-path` 지그재그가 아니라 **`mask-image: radial-gradient(circle …)` 둥근 스캘럽**
  (반지름 10px / 간격 14px — 원이 겹쳐야 뾰족해진다). 다른 곳에 절취선을 쓸 일이 생겨도 이 방식.
- 매출 숫자 뒤 **"원" 단위는 사용자 요청으로 삭제**됐다. 다시 붙이지 않는다.

### CSS 는 4개 파일로 역할이 나뉘어 있고, 섹션별로 미디어쿼리가 붙어 있다

`index.html` 은 `assets/css/init.css`(리셋) → `assets/css/fonts.css`(`@font-face`) →
`assets/css/animations.css`(`@keyframes`, 컴포넌트 전용이어도 예외 없이 전부 여기) →
`assets/css/style.css`(토큰 + 컴포넌트) 순으로 로드한다(2026-09-02 분리). 새 리셋/폰트/키프레임
규칙을 추가할 때 `style.css` 에 다시 섞어 넣지 않는다.

`style.css` 안에서는 형제 폴더의 "토큰 → 레이아웃 → 컴포넌트 → 반응형" 순서와 달리, 각 컴포넌트
블록 바로 뒤에 해당 `@media` 가 따라온다. 새 반응형 규칙도 파일 끝이 아니라 **해당 컴포넌트 옆에**
쓴다. **브레이크포인트는 `max-width:1024px` 하나만 쓴다** — 1024px 초과가 PC, 1024px 이하가
모바일이다(2026-09-02 확정. 이전에는 900/820/700px 세 값이 컴포넌트마다 섞여 있었으나 전부
1024px 로 통일했다). 새 값을 만들지 않는다. 맨 끝의 `@media (prefers-reduced-motion: reduce)`
블록은 유지한다.

디자인 토큰은 `assets/css/style.css` 의 `:root` 11개(`--bg` 계열 3, `--gold` 계열 2, 텍스트 3, `--line`, `--red`).
색을 새로 쓰지 말고 토큰에서 가져온다.

**폰트 크기는 프로젝트 전역 18px~96px 범위만 허용한다** (2026-09-02 확정). 고정값·
`clamp()` 의 최소/최대 모두 이 범위 안에 있어야 한다. **예외는 세 개뿐이다**: `.hero-wordmark`
(`clamp(72px,15vw,132px)`, 2026-09-03 사용자 요청으로 확정), `.form-agree`/`.form-agree-more`
(동의 체크박스 라벨·"전문보기" 링크, `16px`, 2026-09-11 사용자 요청으로 확정 — 본문과 같은
눈높이로 읽힐 필요 없는 보조 요소라는 이유), 그리고 **문의하기 Bottom Sheet
(`.inquiry-sheet-form`) 내부 전체**(`label`/`input`/`select`/`textarea`/`.select-field-trigger`/
`.select-field-item`, `14px`, 2026-09-17 사용자 요청으로 확정 — 이 모달은 원래부터
label/input이 14px였고, 창업유형 셀렉트박스만 전역 18px를 쓰고 있어 유독 커 보이는 불일치가
있었다. 전역 18px로 올리는 대신 기존 14px에 맞추기로 함) — 다른 요소에 이 예외들을 유추
확장하지 않는다. 정확한 요소별 크기표는 `docs/design.md` Typography 절 참고.

### 다크/라이트 섹션에서 텍스트 색이 뒤집힌다

히어로·경쟁력·메뉴·수익분석·창업비용·매장위치 전 섹션이 어두운 배경이라 해당 섹션에서
`--text: var(--text-invert)` 로 재선언한다 — 이제 섹션 전체가 흰 배경인 곳은 없다(2026-09-02에
경쟁력이 "임팩트가 약하다"는 피드백으로, 매장위치가 Swiper 캐러셀+배경사진 도입으로 각각 흰
배경 → 어두운 배경으로 되돌아갔다). 새 섹션이나 반대 밝기의 카드를 추가하면서 이 재선언을
빠뜨리면 텍스트가 배경에 묻혀 안 보이는 회귀가 난다 — 실제로 `--bg-card`/`--text` 토큰을 전역으로
흰색/검정으로 바꿨을 때 이 방식으로 발생했다. 경쟁력 섹션 안의 `.trust-item` 처럼 어두운 섹션
위에 다시 흰 카드를 올리는 경우는 그 카드 셀렉터에서 `--text`/`--text-dim` 을 한 번 더 뒤집어야
한다(중첩 스코핑) — 반대로 매장위치의 `.store-card` 는 부모가 흰 배경이던 시절엔 이 뒤집기가
필요했지만, 부모 자체가 어두운 배경이 된 지금은 카드와 부모 밝기가 같아져 오버라이드가 없어졌다.

### 시그니처 장치

`.wave` SVG 디바이더는 브랜드의 "물결형 인테리어" 정체성을 섹션 구분선으로 옮긴 것이다 —
장식이 아니므로 섹션을 재배치해도 유지한다.

### 05 매장위치 — 이 프로젝트 유일의 외부 JS 의존성

2026-09-02, 정적 3열 그리드를 Swiper.js 캐러셀(jsdelivr CDN `swiper@11/swiper-bundle.min.{css,js}`)
로 바꿨다. "빌드 도구 없는 정적 파일" 원칙은 여전히 지킨다(번들러 없이 `<link>`/`<script defer>`
만 추가) — 다만 이 섹션만큼은 순수 바닐라가 아니라 외부 런타임 라이브러리에 의존한다. 배경은
사용자가 제공한 매장 개업식 사진(`assets/imgs/bg.png`)을 블러 처리해 깔고, 캐러셀 컨트롤
아이콘은 Lucide(lucide.dev) SVG 를 그대로 인라인으로 가져다 썼다. 자세한 구성은
`docs/design.md` Components 절 "매장위치 캐러셀" 참고.

### 문의하기 Bottom Sheet (2026-09-04 신규, 2026-09-09 오픈 트리거 변경)

헤더/히어로/창업비용/05 매장위치의 CTA 버튼(`[data-open-inquiry]`, `<a href="#location">`
대신 `<button>`으로 바뀌었다)과 우측 스크롤바에 붙는 세로형 퀵 탭(`.inquiry-fab`, "창업 문의")을 누르면
열리는 모달 팝업이다(`initInquirySheet`, `#inquirySheetBackdrop`). 05 섹션 맨 아래의 원래
인라인 문의 폼(`#inquiryForm`)과는 완전히 별개 — 이 시트는 자체 `#inquirySheetForm`을 쓰고,
제출해도 버튼 텍스트만 바뀌는 목업이다. 시트 자체는 다크 섹션 스코프 밖(body 직속 형제)이라
`--text` 기본값을 그대로 쓴다. **2026-09-09, 02 메뉴 섹션에 스크롤로 진입할 때마다 자동으로
열리던 동작(`IntersectionObserver` 기반)을 사용자 요청으로 제거하고, 그 자리를 우측
스크롤바에 붙는 세로형 퀵 탭으로 대체했다** — 이제는 오직 클릭으로만 열린다. 옛 문서나 커밋 메시지에서
"#menu 진입 시 자동으로 열린다"는 서술을 보면 이 변경 이전 기록임을 감안할 것. 정확한
색상/크기 값은 `docs/design.md` Components 절 "문의하기 Bottom Sheet" 참고.

---

## ⚠️ `.claude/` 스캐폴딩이 이 폴더 내용과 맞지 않는다

`0007/.claude/` 는 `0003`(아이스크림 팔레트 카드)에서 통째로 복사된 것이고 갱신되지 않았다.
그대로 믿으면 안 된다.

| 파일 | 실제 상태 |
|---|---|
| `rules/01-project.md` ~ `04-data-contract.md` | 아이스크림 카드 기준. `data/palettes.json`, `js/app.js`, `FALLBACK` 등 **이 폴더에 없는 파일**을 전제로 한다 |
| `memory/` | **정리 완료.** 0003 사본이던 `decisions.md` 를 제거하고(동일 파일이 `0003/.claude/memory/` 에 그대로 있다) 이 폴더의 실제 메모리 `gopumgyeok-*.md` 5개 + `MEMORY.md` 를 넣었다. `SessionStart` 훅이 이걸 주입한다 |
| `hooks/validate-palettes.sh` | `data/palettes.json`/`js/app.js` 를 대상으로 하므로 여기서는 항상 무해하게 통과(no-op) |
| `agents/` | **2026-09-02 재구성 완료.** `router`(라우팅 오케스트레이터) + `content-editor`/`css-stylist`/`screenshot-verifier`/`code-reviewer`(신규) + `design-qa`/`markup-a11y`/`asset-optimizer`(0007 실제 경로·컴포넌트 기준으로 재작성) 총 8개. 모두 `name/description/tools/model/color/memory` 프론트매터를 갖추고 이 폴더의 실제 파일(`assets/css/style.css`, `data/content.json`, `assets/imgs/`)을 전제로 한다 — 더 이상 0003 사본이 아니다 |

이 폴더의 진짜 "왜"는 `README.md` 와 `0007/.claude/memory/gopumgyeok-*.md` 5개에 있다
(`SessionStart` 훅이 후자를 자동 주입한다). `rules/` 를 이 폴더에 맞게 다시 쓰기 전까지는 인용하지 않는다.

---

## 알려진 이슈

1. **창업비용 금액이 전부 "상담 시 안내"** — 카탈로그에 실제 금액이 없어서다. `index.html` 의
   `.cost-table` 은 정적이라 수치를 받으면 바로 채울 수 있다.
2. **셀프바 이미지 16장이 미사용** — `assets/imgs/sb_*.jpg` 20종 중 그리드에 8종만 노출된다.
   `interior1~4`, `hero_food`, `black_texture` 도 백업용으로만 남아 있다. 누락이 아니라 의도된 여분이다.
3. **에셋 44장이 전부 카탈로그 PDF 크롭본** — 저해상도다. 프로덕션에서는 클라이언트 원본 사진으로 교체.
4. **문의폼은 목업** — 최종 프로덕션은 Next.js + Supabase 로 마이그레이션 예정(관리자모드·도메인·호스팅 포함).

(과거 이슈였던 "Pretendard 가 Google Fonts 400 에러로 로드되지 않던 문제"는 2026-09-02에
`assets/fonts/Pretendard-*.woff2` self-host + `assets/css/fonts.css` 분리로 해결됐다.)

## 되살리면 안 되는 것

사용자가 명시적으로 제거를 지시한 항목이다. 개선처럼 보여도 되돌리지 않는다.

- Song Myung 등 **세리프 폰트** — Pretendard 단일 패밀리로 확정
- 히어로 하단 **"왕십리/천호/시흥은계 오픈일" 스트립** — 05 매장위치와 중복이라 제거
- 영수증 매출 숫자의 **"원" 단위**
