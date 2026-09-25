---
name: gopumgyeok-open-issues
description: "고품격대패 랜딩의 미해결 항목과 다음 단계 — 창업비용 금액 미확보, 시안 컨펌 대기, CMS 백엔드 미배포. 2026-09-24 정적 사이트 완전 삭제로 Next.js가 유일한 소스"
metadata: 
  node_type: memory
  type: project
  originSessionId: 64490a38-09ba-439e-83a5-66505594f155
  modified: 2026-09-03T00:00:00.000Z
---

2026-09-01 CLI 인계 시점 기준 [[gopumgyeok-landing-project]]의 미해결 상태였다. **2026-09-24,
`index.html`/`assets/`/`data/`(정적 사이트 소스 87개 파일)가 완전히 삭제되고 Next.js가 유일한
소스가 됐다** — 아래 중 정적 파일 경로를 직접 언급하는 항목은 그 경로가 이제 존재하지 않으니
Next.js 쪽 동급 경로(`src/data/content.json`, `src/styles/legacy/style.css` 등)로 치환해서
읽을 것. 자세한 경위는 [[gopumgyeok-nextjs-migration]] 참고.

**블로커 / 확인 필요**
1. **창업비용 실제 금액 없음** — 카탈로그에 가맹비·교육비 등 구체 금액이 없어 04 섹션이 전부 "상담 시 안내"로만 채워져 있다. `src/data/content.json`의 `cost.rows[].price`만 고치면 반영된다.
2. ~~Pretendard가 로드되지 않던 문제~~ — **해소됨.** self-host `woff2`로 이미 전환됐다(`src/styles/legacy/fonts.css`).
3. **지점별 네이버 지도 링크가 검색 딥링크다** — 각 지점의 플레이스 ID를 확인할 방법이 없어 `map.naver.com/p/search/고품격대패 왕십리` 형태로 걸었다. 정확한 `map.naver.com/p/entry/place/{id}` URL을 받으면 `src/data/content.json`의 `stores[].mapUrl`만 교체하면 된다.
4. **03 수익분석 아래 웨이브의 fill 색이 아래 섹션과 다르다** — SVG `fill="#18140F"`인데 `.cost` 배경은 `#0E0C0A`라 얇은 띠가 보인다. 색은 디자인 판단이라 사용자 확인 대기 중.
5. ~~`file://` 더블클릭 시 콘텐츠 안 뜨던 문제~~ — **더 이상 해당 없음.** `index.html` 자체가 삭제됐다(Next.js는 `next dev`/`next build`로만 구동).
6. **최종 시안 미확정** — 시안A(다크 프리미엄) / 시안A_v2(=현재 Next.js 버전) / 시안B(라이트 에디토리얼) 중 클라이언트 컨펌 대기.
7. ~~문의폼 완전 목업~~ — **2026-09-17 해소됨.** 3개 문의 폼 모두 `go_daepae.cms.api`(백오피스, `franchise_inquiries` 테이블)에 실제 POST 전송하도록 연동됐다. 자세한 내용은 [[gopumgyeok-cms-integration]] 참고.
8. **이미지 저해상도** — 전부 카탈로그 PDF 크롭이라 프로덕션에선 클라이언트 고해상도 원본으로 교체하는 게 좋다([[gopumgyeok-brand-data]]). 지금은 `public/assets/imgs/`에 있다.
9. **02 메뉴 png 이미지 9종이 무압축 상태** — `meat_*.png`(나무 테이블 스타일) 개당 2.2~2.4MB, 9종 총합 약 20MB. 리사이즈·압축을 아직 안 거쳤다. 자세한 경위는 [[gopumgyeok-brand-data]] 참고.
10. **`NEXT_PUBLIC_CMS_API_BASE_URL`이 아직 `http://localhost:3001/api/v1`(로컬 전용)이다**
    (`.env.local`). **CMS 백엔드(`go.daepae.cms.api`) 자체도 2026-09-24 기준 아직 어디에도
    배포되지 않았다**(그쪽 저장소에 `vercel.json`은 있지만 `.vercel/` 프로젝트 링크 없음) — 백엔드
    배포가 선행돼야 이 값을 프로덕션 도메인으로 확정할 수 있다. 안 바꾸면 배포된 랜딩에서 문의
    제출/팝업 조회가 전부 실패한다. 자세한 내용은 [[gopumgyeok-cms-integration]],
    [[gopumgyeok-nextjs-migration]] 참고.
11. **CLAUDE.md가 Next.js 마이그레이션과 정적 사이트 삭제를 전혀 반영하지 않은 상태(2026-09-24
    기준)** — `index.html`/`assets/` 아키텍처를 기준으로 서술돼 있는데 그 파일들 자체가 이제
    없다. 다음에 CLAUDE.md를 갱신할 일이 생기면 Next.js 구조 기준으로 다시 쓸 것.

**계약 범위 / 다음 단계** (디자인 맞춤제작 + 반응형 + 5섹션 + 자체 DB 수집 + 관리자모드 + 도메인 + 호스팅)
- ~~확정 시안을 Next.js 구조로 마이그레이션~~ — **2026-09-22 환경세팅+콘텐츠 이식 완료,
  2026-09-24 구 정적 사이트 삭제까지 완료.** Next.js가 유일한 소스. 자세한 내용과 남은 작업
  (CMS 백엔드 배포, 프로덕션 API URL 확정)은 [[gopumgyeok-nextjs-migration]] 참고. Supabase
  자체는 이미 `go.daepae.cms.api`(백오피스) 쪽에 구축되어 있고, 랜딩은 그 API를 통해
  간접적으로만 연동한다(랜딩이 Supabase에 직접 연결하지 않음).
- **프론트(go.daepae) 배포**: Vercel Git 연동으로 `main` push 시 자동 배포된다고 사용자가
  확인(2026-09-24) — `main`에 push만 되어 있으면 별도 배포 명령이 필요 없다.
- 관리자모드: 로그인 + 문의내역 조회/CSV 다운로드 + 콘텐츠 CMS.
- 도메인 연결.

**기존 산출물**: 구축 기획서 v1→v2(docx/pdf/md), 유사 프랜차이즈 랜딩 11곳 벤치마킹 리스트, 시안A, 시안B, 시안A_v2(=0007). 원문 인계문서는 `0007/README.md`.
