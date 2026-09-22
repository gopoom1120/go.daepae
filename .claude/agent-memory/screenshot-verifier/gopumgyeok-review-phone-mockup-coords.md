---
name: gopumgyeok-review-phone-mockup-coords
description: assets/imgs/iphone.png(1622x3238) 알파 채널 실측으로 뽑은 .review-phone__screen 정확 좌표 — 2026-09-08 iphone.png 교체 검증 시 도출. 이미지가 다시 교체되면 무효
metadata:
  type: project
---

`#reviews`(소비자 찐후기) `.review-phone` 은 `iphone.png`(프레임, 위 레이어) +
`review1/2/3.png`(스크린샷, 아래 레이어)를 겹치는 합성이다. 2026-09-08 `iphone.png`가
2000x2000 정사각형 → 1622x3238(약 1:2)로 교체됐고, 사용자가 `.review-phone__screen`
좌표를 옛 값(`left:33.5% top:13.5% width:33% height:72.5%`, border-radius:14px, 정사각형
프레임 기준)에서 `left:9.5% top:5.25% width:81.44% height:89.59%`(border-radius:18px)로
갱신했다. 이 새 값이 새 이미지 비율에 정확한지 알파 채널 실측으로 검증했다.

**PIL로 iphone.png 알파 채널을 직접 스캔해 나온 실측 결과** (threshold: opaque=alpha>200,
transparent=alpha<10):
- 전체 이미지: 1622 x 3238
- 불투명 프레임 바디(phone silhouette) bbox: x[64,1563] y[82,3177]
- 화면 구멍(투명 홀) 진짜 경계: **left=106px, right=1525px, top=110px, bottom=3147px**
  (row/column 스캔으로 "양쪽 끝이 모두 해당 임계값에 도달하는 지점"을 찾아 다이나믹 아일랜드
  오탐을 배제한 값. 다이나믹 아일랜드 자체는 프레임에 구워진 **불투명** 검정 필이라 홀이 아님 —
  다만 상단 베젤 선(~y85-105)과 아일랜드(~y145-250) 사이에 얇은 투명 슬릿이 있어 center x
  기준 top이 이미 y≈110부터 시작함. 좌우 폭이 가득 차는 지점은 y≈278이지만, 프레임이 스크린샷
  위에 z-index:1로 덮이므로 스크린샷 rect가 실제 홀보다 커도(=코너 밖으로 삐져나와도) 프레임
  코너가 가려주기 때문에 문제 없음 — 반대로 rect가 홀보다 **작으면** 진짜 갭이 생긴다.
- 퍼센트 환산(1622x3238 기준, 컨테이너 `.review-phone`이 동일 aspect-ratio라 그대로 전용 가능):
  **`left:6.5%; top:3.4%; width:87.6%; height:93.9%;`** (right/bottom 여유를 위해 살짝
  넉넉하게 반올림 — right=94.1%, bottom=97.3%, 실측 94.02%/97.19%보다 근소하게 크게 잡아도
  프레임이 덮으므로 안전)

**검증한 CSS 값과의 비교** (2026-09-08 시점, 사용자가 적용한 `left:9.5% top:5.25%
width:81.44% height:89.59%`): 네 변 모두 실측 홀보다 작음(언더슈트) — 좌 3%p, 상 1.85%p,
우 3.05%p, 하 2.35%p 만큼 스크린샷이 홀에 못 미침. 다만 **실제 렌더 스크린샷(1440px 데스크톱
+ 800px/1024px 모바일)을 픽셀 단위로 샘플링해 확인한 결과 육안/픽셀 색상 비교로는 갭이 거의
안 보였다** — `--bg:#0E0C0A`(rgb 14,12,10)와 프레임 베젤 실제 색(rgb 5,5,5)이 둘 다 거의 순검정이라
우연히 색이 겹쳐, 몇 px의 언더슈트 갭이 시각적으로 프레임 베젤과 구분이 안 됨. 즉 "수학적으로는
부정확하지만 이 프로젝트의 다크 배경에서는 우연히 안전"한 케이스였다 — 배경색이 바뀌거나 다른
곳에 이 프레임을 재사용하면 즉시 티가 날 수 있으니, 정밀 교정 시엔 위 실측 %(6.5/3.4/87.6/93.9)를
쓸 것.

**Why:** 이 종류의 asset-swap 좌표 재계산은 도구 없이 육안으로 맞추기 매우 어렵고(고품격대패
CLAUDE.md가 "이 프로젝트에서 가장 깨지기 쉬운 부분"이라 명시), PIL alpha 스캔이 유일하게 신뢰
가능한 방법이었다. 단순 row/col min/max 스캔은 다이나믹 아일랜드 같은 내부 불투명 장식에
오염되므로, "양쪽 끝이 모두 목표 폭에 도달하는 행/열"만 plateau로 채택하는 필터링이 필요했다.

**How to apply:** `iphone.png`가 다시 교체되면 이 메모는 무효 — 반드시 재실측한다. 재실측
스크립트 패턴: `PIL.Image.open(...).convert('RGBA')` → alpha 배열에서 opaque bbox 구함 →
각 행에서 opaque 구간의 좌/우 끝 사이 transparent gap의 min/max x 계산 → 목표 폭(대략 전체
opaque 폭의 85%+)에 도달하는 행들의 y range를 "top/bottom plateau"로, 그 행들에서의 min(gl)/
max(gr)를 "left/right"로 채택. 아일랜드 노치가 있는 프레임이라면 top은 plateau보다 살짝 이르게
(베젤 직후) 잡아도 무방 — 프레임이 덮으므로 안전.
