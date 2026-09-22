---
name: selfbar-thumbnail-convention
description: 02 메뉴 셀프바 원형 썸네일(.sb-item .circle img) 20장의 표준 규격 — 새/교체 이미지가 이 규격을 벗어나면 즉시 리사이즈 대상
metadata:
  type: project
---

`assets/imgs/sb_*.{jpg,png}` (data/content.json `selfbar` 배열, `.selfbar-grid` → `.sb-item .circle`)
는 실측 표시 크기가 데스크탑에서도 최대 지름 ~120px(`.wrap` 1120px - 32px*2 패딩, 8열 grid,
gap 14px 기준 계산)에 불과한 아주 작은 원형 썸네일이다.

**표준 규격(기존 15장 기준)**: 180×180px JPEG, 파일당 5~10KB. 알파 채널 없음(흰 배경으로
플래튼된 원형 접시 사진).

2026-09-16, 5장(`sb_albaechu`, `sb_goguma`, `sb_kongnamul`, `sb_romaine`, `sb_sangchu`)이
새 카탈로그 사진으로 교체되면서 PNG 알파 포함 1254×1254 전후, 2~2.5MB 짜리로 들어온 적이
있었다 — 표시 크기 대비 약 10배 픽셀, 약 300배 용량 낭비. `sips`로 180×180 리사이즈 +
JPEG quality 50 재인코딩해 7.5~10KB로 맞추고([[local-tooling]] 참고), `data/content.json`의
확장자도 `.png → .jpg`로 함께 갱신해 해결했다.

**Why:** 이 그리드는 8열/4열 촘촘한 그리드라 표시 크기가 극단적으로 작다. 다른 컴포넌트
(고기 카드, 매장 사진)와 달리 "레티나 2~3배"를 적용해도 300~400px면 충분하다 — 원본 그대로
쓰면 절대 안 된다.
**How to apply:** 셀프바 이미지가 교체/추가될 때마다 `sips -g pixelWidth -g pixelHeight`로
확인해 180×180 근방·수 KB~수십 KB 대에서 크게 벗어나면 이 규격으로 리사이즈를 제안(또는 직접
수행, 이번처럼 명시적으로 요청받았을 때만)한다. quality 50이 이 크기에서는 육안상 손실이
거의 안 보였다(원형 접시 사진, 디테일이 커봐야 잎맥 정도).
