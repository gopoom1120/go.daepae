---
name: gopumgyeok-dev-port-collision
description: "localhost:3000 이 다른 프로젝트(가스펄픽스)의 dev 서버일 수 있다 — 렌더 검증 전 <title> 확인, 아니면 다른 포트(예: 3107)로 띄운다"
metadata:
  type: reference
---

2026-10-30 모바일 렌더 확인 중 `curl localhost:3000` 이 200 을 줬지만 실제로는 **다른 프로젝트(title
"가스펄픽스")** 의 dev 서버였다. 200 응답만 보고 검증하면 엉뚱한 사이트를 보게 된다.

**Why:** 사용자 머신에서 여러 Next.js 프로젝트가 동시에 떠 있고 3000 번을 먼저 선점한 쪽이 있다.
**How to apply:** CSS 렌더 확인 전에 페이지 `<title>`(이 사이트는 "고품격대패 …")을 확인한다.
다르면 `yarn next dev -p 3107` 처럼 별도 포트로 띄우고, 끝나면 `pkill -f "next dev -p 3107"` 로 정리한다.
[[gopumgyeok-headless-verification]] 와 함께 적용.
