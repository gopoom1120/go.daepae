# 데이터 계약

`data/palettes.json` 이 카드 데이터의 **단일 진실 공급원**이다.

## 스키마

```jsonc
{
  "section": {
    "eyebrow": "string",     // 상단 소제목
    "title": "string",       // 페이지 제목
    "subtitle": "string"
  },
  "items": [
    {
      "id": "kebab-case",              // 필수. 고유. SVG 시드로도 쓰임
      "title": "string",               // 필수. 대문자 변환은 CSS 담당
      "script": "palette",             // 제목에 겹치는 필기체 문구
      "description": "string",         // 필수. 2줄 이내 권장
      "image": "./imgs/....png | null", // 사진 경로. null 이면 SVG 대체
      "art": {                          // image 가 null 일 때 사용
        "coat": "#hex",
        "coatShade": "#hex",
        "core": "#hex",
        "sauce": "#hex",
        "chips": ["#hex"],
        "stick": "#hex"
      }
    }
  ]
}
```

## 규칙

- `id`, `title`, `description` 은 필수다.
- `image` 와 `art` 중 **최소 하나**는 있어야 한다. 둘 다 없으면 제품컷이 비어버린다.
- `image` 경로는 프로젝트 루트 기준 상대경로(`./imgs/...`)로 적는다.
- **`section` 의 키는 `index.html` 의 `data-bind` 속성값과 1:1로 대응한다.**
  키를 추가하려면 HTML 에 `data-bind="키이름"` 요소를 함께 추가한다.

## 동기화 의무

`data/palettes.json` 을 수정하면 `js/app.js` 의 `FALLBACK` 상수도 **같은 내용으로** 갱신한다.
`file://` 로 열었을 때 쓰이는 데이터이며, 어긋나면 환경에 따라 다른 화면이 나온다.

`.claude/hooks/validate-palettes.sh` 훅이 이 정합성을 자동으로 검사한다.
훅이 차단하면 무시하지 말고 실제로 두 곳을 맞춘다.

## 항목 추가 절차

1. `data/palettes.json` 의 `items` 에 추가
2. `js/app.js` 의 `FALLBACK.items` 에 동일하게 추가
3. 사진을 쓴다면 `imgs/` 에 투명 배경 PNG 를 넣고 경로 연결
4. 4개 이상이 되면 `css/style.css` 의 `grid-template-columns` 검토
