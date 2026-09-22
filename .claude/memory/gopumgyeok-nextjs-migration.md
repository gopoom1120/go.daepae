---
name: gopumgyeok-nextjs-migration
description: "2026-09-22, 고품격대패 랜딩이 정적 HTML에서 Next.js로 마이그레이션 시작됨 — 환경 세팅+콘텐츠 이식 완료, 기존 정적 사이트는 삭제 없이 그대로 공존 중"
metadata:
  type: project
---

2026-09-22, [[gopumgyeok-landing-project]]의 오랜 숙원이던 "Next.js + Supabase 마이그레이션"
([[gopumgyeok-open-issues]] 참고)이 실제로 시작됐다. 같은 세션에서 두 단계를 이어서 완료:

**1단계 — Next.js 환경 세팅**: 저장소 **루트**에 Next.js 14.2.35(App Router) + TypeScript +
Tailwind v4 환경을 새로 구축했다. 기존 `index.html`/`assets/`/`data/`는 **하나도 건드리지
않고 그대로 유지**된다 — `package.json`/`src/`/`public/` 등 Next.js 관련 파일만 루트에
추가된 형태라 두 사이트가 같은 저장소 안에 물리적으로 공존한다.

**2단계 — 콘텐츠 마이그레이션**: `index.html`의 12개 섹션 + 3개 오버레이(문의 Bottom Sheet/
CMS 팝업/스티키 바)를 `src/components/`의 React 컴포넌트로, `assets/js/{script,dataFetch,
regexr}.js`의 렌더링·인터랙션 로직을 `src/hooks/`의 커스텀 훅으로 포팅했다. 실제 브라우저(CDP)로
스크롤 위치별 스크린샷을 원본과 픽셀 단위로 비교 검증했고, 카운트업 애니메이션 타이밍까지 일치를
확인했다.

**핵심 아키텍처 결정 (다음 단계 작업 시 반드시 참고)**

1. **패키지 버전은 형제 프로젝트 `go.daepae.cms.api`와 동일하게 맞춘다** — Next 14.2.35(React
   18, Tailwind v4, shadcn 기반 등)까지 정확히 일치시켰다. **한쪽에서 보안 패치로 버전을 올리면
   반드시 다른 쪽도 같이 올려야 한다** — 이번 세션에서 실제로 CVE-2025-55184/67779 대응으로
   `next@14.2.3→14.2.35`를 두 저장소 모두에 적용했다(사용자가 "레퍼런스 쪽도 같이 올려줘"라고
   명시적으로 요청).
2. **레거시 CSS는 Tailwind로 재작성하지 않고 그대로 global import 한다** — `assets/css/*.css`를
   `src/styles/legacy/`에 복사(`url()` 경로만 `/assets/...`로 기계적 치환)해 `layout.tsx`에서
   `globals.css` 다음에 로드한다. 이미 여러 번 픽셀 단위로 확정된 골드/레드 스큐어모픽 디자인을
   흔들지 않기 위한 의도적 선택 — [[gopumgyeok-shadcn-detour-reverted]]에서 한 번 shadcn 뉴트럴
   톤으로 갈아엎었다가 되돌린 전례가 있어, 이번에도 **shadcn/ui 컴포넌트 프리미티브(Button/
   Dialog/Select 등)를 도입하지 않고** 기존 커스텀 CSS 클래스(`.comp-card`, `.select-field` 등)
   그대로 컴포넌트 경계만 씌웠다.
3. **에셋/데이터는 이동이 아니라 복사** — `assets/imgs`→`public/assets/imgs`, `assets/fonts`→
   `public/assets/fonts`, `data/content.json`→`src/data/content.json`(이미지 경로에 선행
   슬래시만 추가). 기존 정적 사이트가 그대로 배포 가능한 상태를 유지하기 위함.
4. **CMS API 연동은 실제로 살아있다** — [[gopumgyeok-cms-integration]]에서 이미 확인된 대로
   문의폼 3곳이 진짜로 `franchise-inquiries`에 POST하고 팝업도 실제 fetch한다. Next.js 버전에서도
   동일 로직을 `src/libs/api.ts`로 포팅했고, 하드코딩됐던 `CMS_API_BASE_URL`을
   `NEXT_PUBLIC_CMS_API_BASE_URL` 환경변수로 뺐다(`.env.local`, 현재 값은 로컬 개발용
   `http://localhost:3001/api/v1`). **기존 정적 사이트의 `assets/js/dataFetch.js`는 여전히
   하드코딩된 채로 안 건드렸다** — 두 버전의 API 연동 방식이 다르다는 점에 주의.
5. **Swiper는 CDN 대신 npm `swiper/react` 패키지로 전환**.

**Why**: 사용자가 두 프로젝트(랜딩 프론트엔드 + `go.daepae.cms.api` 백오피스)를 "동일 기술스택
프로젝트"로 취급하길 원한다 — 버전 불일치나 컨벤션 차이를 최소화해 코드 공유·유지보수 부담을
줄이려는 의도로 보인다.

**How to apply**: 다음 세션에서 이어질 가능성이 높은 후속 작업:
- 기존 정적 사이트(`index.html`)를 언제/어떻게 은퇴시킬지(삭제 vs 그대로 아카이브) 아직 결정 안 됨
- 배포 방식 전환(GitHub Pages 정적 배포 → Next.js를 위한 Vercel/Node 호스팅) 필요
- 배포 전 `NEXT_PUBLIC_CMS_API_BASE_URL`을 프로덕션 도메인으로 교체해야 함
- **CLAUDE.md는 이 Next.js 마이그레이션을 전혀 반영하지 않은 상태다** — "빌드 도구 없이 동작하는
  단일 페이지 랜딩"이라는 현재 서술이 이제 부정확하다. CLAUDE.md를 다음에 갱신할 일이 생기면 이
  내용도 함께 반영할 것.
