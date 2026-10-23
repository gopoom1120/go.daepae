---
name: gopumgyeok-posthog-analytics
description: "PostHog 연동(2026-10-23) — 공식 마법사는 Next 14 미지원이라 posthog-js 수동 연결, 심은 이벤트 3종, NEXT_PUBLIC 빌드타임/재배포 함정, 프로덕션 데이터 필터법"
metadata:
  type: project
---

2026-10-23, 고품격대패 랜딩(Next.js 14)에 PostHog 를 `posthog-js` 수동 방식으로 연결하고
`cc2c0f1`까지 푸시했다. 로컬(localhost)에서 이벤트 수신은 사용자가 확인 완료.
프로덕션(`https://xn--i89a2dz9q2p1bhpb.com`) 수신 확인은 아직 확인 못 했다.

- 구성: `src/components/analytics/PostHogProvider.tsx`(layout.tsx 에 마운트, 키 없으면 no-op),
  `src/libs/analytics.ts`의 `track()`(초기화된 경우에만 capture).
- 이벤트: `inquiry_open`(`openInquirySheet()` 안 — 모든 CTA 공통), `inquiry_submit`
  (`useInquirySubmit` 성공 시, 속성은 `franchise_type`만), `contact_click`(스티키바 전화링크만).
- 환경변수: `NEXT_PUBLIC_POSTHOG_KEY`/`NEXT_PUBLIC_POSTHOG_HOST`. `.env`(gitignore)에 실제
  값이 있고 `.env.example`에는 키 이름만 있다.

**Why:** `npx @posthog/wizard`는 Next.js 15.3.0+ 만 지원해 14.2.35 에서 "not supported" 로
막힌다. 형제 프로젝트(`go.daepae.cms.api`)와 Next 버전을 맞추는 원칙([[gopumgyeok-nextjs-migration]],
`docs/TECH-STACK-PRIORITY.md`) 때문에 마법사 하나 쓰자고 한쪽만 15로 올리지 않는다.

**How to apply:**
- 마법사를 다시 돌리자고 하지 말 것 — Exit 후 수동 방식 유지. 마법사가 layout.tsx 등을 중복 수정할 수 있다.
- 이름/연락처 같은 개인정보는 `track()` props 에 절대 넣지 않는다.
- `NEXT_PUBLIC_*` 는 빌드타임 인라인이라 Vercel 환경변수 등록 후 **재배포**해야 프로덕션에 반영된다.
  프로덕션 이벤트가 없으면 1순위 의심: 환경변수 미등록/재배포 누락.
- 로컬 테스트 이벤트와 섞이므로 PostHog 에서 `$host`/`$current_url` 로 `localhost` 를 걸러 본다.
- 문의 제출(`inquiry_submit`)은 CMS API 성공 응답일 때만 찍힌다 — 로컬은 API(`localhost:3001`)가
  꺼져 있으면 안 나온다([[gopumgyeok-cms-integration]]).
- 세션 리플레이는 켜지 않았다. 켠다면 문의 폼 입력 마스킹 확인 필요.
