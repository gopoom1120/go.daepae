---
name: gopumgyeok-nextjs-migration
description: "고품격대패 랜딩의 Next.js 마이그레이션 — 2026-09-22 환경세팅+콘텐츠 이식, 2026-09-24 구 정적 사이트(index.html/assets/data) 완전 삭제로 Next.js가 유일한 소스가 됨"
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
   슬래시만 추가). 당시엔 기존 정적 사이트를 그대로 배포 가능한 상태로 유지하기 위한 선택이었으나,
   **2026-09-24에 원본 `index.html`/`assets/`/`data/`(87개 파일)가 완전히 삭제됐다** — 사용자가
   "이전에 작업했던 정적인 파일은 모두 삭제해줘"라고 명시적으로 요청. `public/assets/*`와
   `src/data/content.json`에 이미 동일 내용이 복사돼 있었기 때문에 Next.js 앱 동작에는 영향
   없었다(빌드/lint 통과 확인). **이제 이 저장소에 정적 사이트 버전은 존재하지 않는다** — Next.js가
   유일한 소스. GitHub Pages 배포 워크플로(`.github/workflows/static.yml`)도 이미 존재하지
   않는 상태였다(CLAUDE.md는 아직 있다고 서술하지만 실제로는 없다).
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

**2026-09-24 후속 작업 두 가지**:
- CMS 팝업 모달(`CmsPopupModal.tsx`)의 좌우 화살표를 Swiper 기본 폰트 아이콘(`swiper-icons`
  `::after`)에서 05 매장위치와 동일한 Lucide 인라인 SVG chevron으로 교체하고, 상단 X 닫기
  버튼을 제거했다(배경 클릭/ESC/하단 "닫기" 버튼으로는 여전히 닫힘). **작업 중 사용자가 명시
  교정**: "assets/css 수정하지 말고, src/styles 기반 Next.js 코드에서 수정해줘" — 그 시점엔
  정적 사이트가 아직 존재해서 `assets/css/style.css`를 먼저 고쳤다가 되돌리고
  `src/styles/legacy/style.css` + 컴포넌트 쪽으로 다시 작업했다. **정적 사이트가 삭제된 지금은
  이 구분 자체가 무의미해졌다** — 수정 대상은 이제 `src/` 하나뿐이다.
- 재사용을 위해 `docs/TECH-STACK-PRIORITY.md`(범용 기술스택 선택 우선순위 체크리스트)를
  작성하고 `CLAUDE.md`에 `@docs/TECH-STACK-PRIORITY.md`로 import했다. 다른 프로젝트에 이식할
  때는 "전역 1벌 참조" 대신 **프로젝트마다 파일을 복사하고 그 프로젝트의 CLAUDE.md에 동일하게
  `@경로` import 한 줄을 추가하는 방식**을 사용자가 선택했다(이견 없이 확정) — 프로젝트별로
  독립적으로 커스터마이징할 여지를 남기는 쪽을 선호하는 것으로 보인다.

**남은 후속 작업**:
- **배포**: 로컬에는 `.vercel/` 프로젝트 링크도 `vercel` CLI도 없지만, 사용자는 "GitHub에
  커밋/푸시만 하면 Vercel이 CI/CD로 자동 배포한다"고 확인했다(Vercel 대시보드 쪽 Git 연동으로
  추정, 저장소 안에서는 그 연결을 코드로 확인할 방법이 없다). **앞으로 "배포해줘" 요청은 별도
  배포 명령 없이 `main`에 push(이미 push돼 있으면 그걸로 끝)까지만 하면 된다** — `vercel --prod`
  같은 CLI 배포를 시도할 필요 없음.
- 배포 전 `NEXT_PUBLIC_CMS_API_BASE_URL`을 프로덕션 도메인으로 교체해야 함. **그런데 CMS
  백엔드(`go.daepae.cms.api`)도 아직 배포된 적이 없다**(그쪽 저장소에 `vercel.json`은 있지만
  `.vercel/` 링크 없음, 2026-09-24 확인) — 프론트만 먼저 배포해도 프로덕션에서 문의폼/팝업은
  `localhost:3001`을 바라보다 실패한다. CMS 백엔드 배포가 선행돼야 프론트의 env 값을 확정할 수
  있다.
- **CLAUDE.md는 이 Next.js 마이그레이션을 전혀 반영하지 않은 상태다** — "빌드 도구 없이 동작하는
  단일 페이지 랜딩"이라는 서술도, `index.html`/`assets/`/`data/` 아키텍처 설명도 이제 전부
  부정확하다(그 파일들 자체가 삭제됐다). CLAUDE.md를 다음에 갱신할 일이 생기면 Next.js 구조
  기준으로 다시 쓸 것.
