# "매장 인테리어 소개" 섹션 추가 (REVIEWS ↔ PROFIT 사이)

## Context

사용자가 PROFIT(수익분석)과 REVIEWS(소비자 찐후기) 사이에 매장 인테리어를 보여주는 새 섹션을
추가해달라고 요청했다. 타이틀 "밝고 깔끔한 공간, 브랜드를 담은 인테리어", 본문 1단락, 3D
인테리어 렌더링 이미지 5장(모두 1536×828px)을 제공했다.

**중요 확인 사항**: 실제 `src/app/page.tsx`의 섹션 순서는 `Hero → Competitiveness → Menu →
Reviews → Profit → PromiseBanner → Cost → Location`이다. 즉 REVIEWS가 PROFIT보다 먼저
나온다. 사용자가 말한 "PROFIT, REVIEWS 사이"는 이 둘이 인접한 유일한 지점 — `<Reviews/>`와
`<Profit profit={...}/>` 사이 — 을 가리키는 것으로 해석해 그 자리에 삽입한다.

## 핵심 결정 사항

### 1) 콘텐츠 소스: content.json이 아니라 컴포넌트 하드코딩
`Hero.tsx`/`PromiseBanner.tsx`를 확인한 결과 텍스트·이미지 경로가 전부 하드코딩되어 있다.
`content.json`은 "경쟁력 카드·고기 9종·셀프바·매장 카드"처럼 **반복되는 배열형** 콘텐츠의
단일 진실 공급원 역할이고, 새 섹션은 고정 타이틀 1개 + 본문 1개 + 역할이 다른 이미지 5장
(대표컷 1 + 보조컷 4)으로 배열 패턴이 아니다. `Hero`/`PromiseBanner`와 동일하게
**`src/components/sections/Interior.tsx`에 전부 하드코딩**한다. `content.json`,
`src/types/content.ts`는 건드리지 않는다.

### 2) 다크/라이트 톤: 밝은 배경(`--bg-card`) 채택
`Reviews`는 어두운 배경(`--text: var(--text-invert)`), `Profit`은 밝은 배경(`--bg-card`,
`--text` 재선언 없이 `:root` 기본 `#333333` 사용, `--text-dim: #6b6b6b` 로컬 재선언)이다.
이미지가 베이지/우드 톤이라 밝은 배경 위에서 카드처럼 떠 보여야 잘 보이므로 `.profit`과 같은
밝은 톤 패턴을 그대로 재사용한다 — `.interior { background: var(--bg-card); --text-dim: #6b6b6b; }`,
`--text` 재선언 없음. `Cost → Location`처럼 같은 톤 섹션이 연속되는 전례가 이미 있어
`Reviews(다크) → Interior(라이트) → Profit(라이트)` 흐름은 문제없다.

### 3) kicker 번호: 재배치 불필요
번호 체계 확인: `01 · COMPETITIVENESS`(Competitiveness) → `02 · MENU`(Menu) →
`REAL REVIEW`(Reviews, 번호 없음) → `03 · PROFIT ANALYSIS`(Profit) →
`START FRANCHISE`(PromiseBanner, 번호 없음) → `04 · FRANCHISE COST`(Cost) →
`05 · STORE LOCATIONS`(Location). 이 프로젝트는 "번호 있는 퍼널 섹션"과 "번호 없이 끼어드는
인터루드 섹션"(Reviews, PromiseBanner) 두 계열을 이미 운영 중이다. 새 섹션은 퍼널 단계가
아니라 브랜드 비주얼 인터루드이므로 **번호 없는 kicker**(`STORE INTERIOR`)를 쓴다 — 03/04/05
어느 kicker 번호도 바꾸지 않는다. `SiteHeader.tsx`의 `NAV_LINKS`에도 추가하지 않는다
(PromiseBanner도 네비게이션에 없음, 동일하게 비노출 인터루드로 취급).

### 4) `.wave` 디바이더는 쓰지 않음
전 컴포넌트 grep 결과 `.wave` SVG 디바이더는 어떤 `.tsx`에서도 실제로 쓰이지 않는 죽은 CSS였다
(CLAUDE.md의 "장식이므로 유지한다" 서술은 과거 정적 HTML 시절 기록). 새 섹션에도 추가하지
않는다.

### 5) 레이아웃: 대표컷 1장(좌, 2행 높이) + 보조컷 2×2 그리드(우) — bento 비대칭 구성
균등 5분할 대신 시각적 위계를 준다. 이미지 매핑(원본 → 역할):

| 원본 파일 | 내용 | 역할 | 새 파일명 |
|---|---|---|---|
| `8.jpeg` | "자연을 담은 Salad Bar" 월사인, 물결 조명 클로즈업 | 대표컷 | `interior_salad_bar.jpg` |
| `9.jpeg` | 메뉴 가격 월사인("대패삼겹 30,000원" 등) | 보조컷1 | `interior_menu_wall.jpg` |
| `10.jpeg` | 홀 와이드 뷰 | 보조컷2 | `interior_hall_1.jpg` |
| `11.jpeg` | 홀 와이드 뷰(근접 각도) | 보조컷3 | `interior_hall_2.jpg` |
| `12.jpeg` | 홀 코너 각도(입구 방향) | 보조컷4 | `interior_hall_3.jpg` |

기존 "포토 카드" 관례(`.profit-card__photo`: `border-radius:20px; border:1px solid var(--line);
overflow:hidden; img{object-fit:cover}`, `src/styles/legacy/style.css:1176` 부근)를 재사용 —
새 비주얼 언어를 만들지 않는다. `interior1~4.jpg`(기존 미사용 백업, CLAUDE.md)는 비율·내용이
달라 재활용하지 않고 새 파일명을 쓴다.

**`src/components/sections/Interior.tsx` (신규 파일)**
```tsx
export function Interior() {
  return (
    <section className="interior" id="interior">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">STORE INTERIOR</div>
          <h2>
            밝고 깔끔한 공간,
            <br />
            브랜드를 담은 인테리어
          </h2>
          <p>
            얇게 말린 대패의 형태를 모티브로 한 물결 디자인과 밝고 정돈된 공간 구성으로
            고품격대패만의 차별화된 매장 분위기를 완성했습니다.
          </p>
        </div>
        <div className="interior-gallery">
          <div className="interior-gallery__feature">
            <img
              src="/assets/imgs/interior_salad_bar.jpg"
              alt="고품격대패 매장 내 '자연을 담은 Salad Bar' 월사인과 물결 조명 인테리어"
            />
          </div>
          <div className="interior-gallery__sub">
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_menu_wall.jpg" alt="메뉴 가격이 새겨진 월사인 인테리어" />
            </div>
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_hall_1.jpg" alt="고품격대패 홀 테이블 좌석 전경" />
            </div>
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_hall_2.jpg" alt="고품격대패 넓은 다이닝홀 전경" />
            </div>
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_hall_3.jpg" alt="고품격대패 매장 입구 방향 다이닝홀 전경" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**CSS 삽입 위치**: `src/styles/legacy/style.css` 1163번째 줄(빈 줄) — `.reviews`의 반응형
블록이 끝나는 1162줄과 `/* PROFIT */` 주석이 시작되는 1164줄 사이. 컴포넌트 블록 바로 뒤에
반응형이 따라오는 이 프로젝트의 CSS 배치 관례를 따른다.

```css
/* INTERIOR — 매장 인테리어 소개, .profit 과 같은 밝은 배경 + 포토 카드 관례 재사용 */
.interior {
  background: var(--bg-card);
  --text-dim: #6b6b6b;
}
.interior-gallery {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  margin-top: 8px;
}
.interior-gallery__feature {
  grid-column: 1;
  grid-row: 1 / span 2;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--line);
}
.interior-gallery__feature img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.interior-gallery__sub {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}
.interior-gallery__item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  aspect-ratio: 4 / 3;
}
.interior-gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 1024px) {
  .interior-gallery {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .interior-gallery__feature {
    grid-column: 1;
    grid-row: auto;
    aspect-ratio: 16 / 9;
  }
  .interior-gallery__sub {
    grid-column: 1;
    grid-row: auto;
    margin-top: 20px;
    grid-template-columns: repeat(2, 1fr);
  }
}
```
데스크톱에서 `.interior-gallery__feature`는 `aspect-ratio`를 고정하지 않고 `grid-row: 1 / span 2`
셀 높이에 맞춰 보조컷 2×2 높이와 자동으로 맞춘다. 모바일은 그리드가 1열로 풀리므로
`aspect-ratio: 16/9`를 명시해 높이가 찌그러지지 않게 한다.

### 6) `src/app/page.tsx` 수정
```tsx
import { Interior } from "@/components/sections/Interior";
...
<Reviews />
<Interior />
<Profit profit={data.profit} />
```

### 7) 이미지 처리 — `public/assets/imgs/`로 복사 + 리사이즈 압축
원본(1536×828, 300~350KB)은 품질 옵션만으로는 크게 줄지 않아 **폭 리사이즈**를 함께 적용한다.
대표컷은 더 크게 보이므로 1400px, 보조컷 4장은 그리드 안에서 작게 보이므로 1000px로 리사이즈.

```bash
cd /Users/mac/Documents/work/GospelFix/go_daepae/go.daepae
SRC=/Users/mac/.claude/image-cache/8df3fcaf-cb66-4b51-9b94-798c6503068d

sips -s format jpeg -s formatOptions 82 --resampleWidth 1400 \
  "$SRC/8.jpeg" --out public/assets/imgs/interior_salad_bar.jpg
sips -s format jpeg -s formatOptions 80 --resampleWidth 1000 \
  "$SRC/9.jpeg" --out public/assets/imgs/interior_menu_wall.jpg
sips -s format jpeg -s formatOptions 80 --resampleWidth 1000 \
  "$SRC/10.jpeg" --out public/assets/imgs/interior_hall_1.jpg
sips -s format jpeg -s formatOptions 80 --resampleWidth 1000 \
  "$SRC/11.jpeg" --out public/assets/imgs/interior_hall_2.jpg
sips -s format jpeg -s formatOptions 80 --resampleWidth 1000 \
  "$SRC/12.jpeg" --out public/assets/imgs/interior_hall_3.jpg
```
변환 후 `sips -g pixelWidth -g pixelHeight public/assets/imgs/interior_*.jpg` 및 `ls -la`로
치수·용량 확인(예상 총합 ≈ 540KB, 원본 합계 ~1.6MB 대비 큰 폭 절감).

## 작업 순서
1. 이미지 5장 변환·복사 (`sips` 커맨드, 위 참고).
2. `src/components/sections/Interior.tsx` 신규 생성.
3. `src/styles/legacy/style.css`에 `.interior` 블록 + 미디어쿼리 삽입 (1163번째 줄).
4. `src/app/page.tsx`에 import 추가 + `<Reviews/>`와 `<Profit/>` 사이에 `<Interior/>` 삽입.
5. `yarn dev`로 로컬 서버 실행, claude-in-chrome로 1440px·420px 뷰포트에서 실제 렌더 확인
   (대표컷/보조컷 그리드 정렬, 모바일 2열 그리드가 찌그러지지 않는지, 앞뒤 섹션과의 색상/여백
   전환이 자연스러운지).
6. `yarn lint`, `yarn prettier --check` 로 포맷/린트 확인.
7. 확인 후 `pkill -f "next dev"`로 개발 서버 정리.

### 수정/생성 파일
- `src/app/page.tsx` (수정 — import + 섹션 삽입)
- `src/components/sections/Interior.tsx` (신규)
- `src/styles/legacy/style.css` (수정 — `.interior` 블록 추가)
- `public/assets/imgs/interior_salad_bar.jpg`, `interior_menu_wall.jpg`, `interior_hall_1.jpg`,
  `interior_hall_2.jpg`, `interior_hall_3.jpg` (신규, 원본은
  `/Users/mac/.claude/image-cache/8df3fcaf-cb66-4b51-9b94-798c6503068d/{8,9,10,11,12}.jpeg`)
- `src/components/sections/Profit.tsx` (참고용, 수정하지 않음)
