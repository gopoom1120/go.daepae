# 프로젝트 원칙

아이스크림 제품 카드 컴포넌트. **빌드 도구 없는 순수 정적 파일**로만 구성한다.

## 절대 규칙

- **빌드 단계를 도입하지 않는다.** npm, webpack, Vite, Sass, TypeScript 모두 사용하지 않는다.
  브라우저가 파일을 그대로 읽어서 동작해야 한다.
- **프레임워크를 도입하지 않는다.** React, Vue, jQuery 없이 바닐라 JS 로 작성한다.
- **외부 리소스는 웹폰트만 허용한다.** 그 외 CDN 스크립트·스타일시트를 추가하지 않는다.

## 파일 구조

```
index.html          마크업 + <template> 카드 구조
css/style.css       토큰 → 레이아웃 → 컴포넌트 → 반응형 순서
js/app.js           JSON 로드 → 카드 렌더링
js/popsicle.js      이미지 없을 때 쓰는 SVG 대체 일러스트
data/palettes.json  카드 데이터 (단일 진실 공급원)
imgs/               제품컷 PNG (투명 배경)
```

## 동작 보장 범위

`index.html` 을 **`file://` 로 직접 열어도 동작해야 한다.**
`fetch` 가 CORS 로 막히므로 `js/app.js` 의 `FALLBACK` 상수가 그 경우를 담당한다.
데이터를 바꿀 때는 `data/palettes.json` 과 `FALLBACK` 을 **항상 함께** 수정한다.

## 확인 방법

```bash
python3 -m http.server 8765   # http://localhost:8765/index.html
```
