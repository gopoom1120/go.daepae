---
name: local-tooling
description: 로컬 macOS 환경에서 실제로 쓸 수 있는 이미지 도구와 없는 도구 (asset-optimizer 작업 시작 전 확인용)
metadata:
  type: project
---

이 환경(`which` 확인 결과)에서:

- `sips` (macOS 내장) — 있음. 리사이즈(`--resampleHeightWidth`), 포맷 변환(`-s format jpeg`),
  JPEG 품질(`-s formatOptions <0-100>`), 픽셀/알파 조회(`-g pixelWidth -g pixelHeight -g hasAlpha`)
  전부 이 하나로 처리 가능. PNG→JPEG 변환 시 알파 채널은 **흰색으로 자동 플래튼**된다(옵션 없음,
  기본 동작) — 이 프로젝트 셀프바 원형 썸네일들이 흰 배경 위 원형 접시 사진이라 우연히도 잘 맞는다.
- `cwebp` (`/opt/homebrew/bin/cwebp`) — 있음. webp로 바꿔야 할 때 사용 가능.
- `pngquant`, `imagemagick`(`convert`/`magick`) — **없음**. PNG 팔레트 압축이 필요하면 설치를
  제안만 하고 임의로 `brew install` 하지 않는다(사용자 지시).

**Why:** 매번 `which` 로 재확인하는 대신 이 기록으로 어떤 도구가 가용한지 먼저 파악하고
불필요한 설치 제안/탐색을 줄인다.
**How to apply:** PNG 최적화만 필요하고 pngquant 가 없으면 "설치가 필요하다"고 보고하고
직접 설치하지 않는다. 리사이즈+JPEG 재인코딩이면 `sips` 만으로 충분하다.
