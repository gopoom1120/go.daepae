---
name: gopumgyeok-open-issues
description: "고품격대패 랜딩의 미해결 항목과 다음 단계 — 창업비용 금액 미확보, 시안 컨펌 대기, Next.js+Supabase 마이그레이션"
metadata: 
  node_type: memory
  type: project
  originSessionId: 64490a38-09ba-439e-83a5-66505594f155
  modified: 2026-09-03T00:00:00.000Z
---

2026-09-01 CLI 인계 시점 기준 [[gopumgyeok-landing-project]]의 미해결 상태.

**블로커 / 확인 필요**
1. **창업비용 실제 금액 없음** — 카탈로그에 가맹비·교육비 등 구체 금액이 없어 04 섹션이 전부 "상담 시 안내"로만 채워져 있다. 이제 `data/content.json`의 `cost.rows[].price`만 고치면 반영된다.
2. **Pretendard가 아직도 로드되지 않는다** — `index.html`의 `<link>`가 여전히 `fonts.googleapis.com/css2?family=Pretendard…`이고 이 URL은 **HTTP 400**이다. 지금 화면은 `-apple-system` 폴백. 고치는 법은 [[gopumgyeok-design-system]]에 적어뒀지만 **2026-09-01 기준 아직 적용하지 않았다**(사용자가 다른 작업을 우선함).
3. **지점별 네이버 지도 링크가 검색 딥링크다** — 각 지점의 플레이스 ID를 확인할 방법이 없어 `map.naver.com/p/search/고품격대패 왕십리` 형태로 걸었다. 정확한 `map.naver.com/p/entry/place/{id}` URL을 받으면 `data/content.json`의 `stores[].mapUrl`만 교체하면 된다.
4. **03 수익분석 아래 웨이브의 fill 색이 아래 섹션과 다르다** — SVG `fill="#18140F"`인데 `.cost` 배경은 `#0E0C0A`라 얇은 띠가 보인다. 원래 있던 문제이고 한 글자만 고치면 되지만, 색은 디자인 판단이라 사용자 확인 대기 중.
5. **`file://` 더블클릭으로는 이제 콘텐츠가 안 뜬다** — `data/content.json`을 `fetch`하므로 로컬 서버가 필요하다(화면에 안내 문구가 뜬다). GitHub Pages 배포에는 영향 없음.
6. **최종 시안 미확정** — 시안A(다크 프리미엄) / 시안A_v2(=0007, 최신) / 시안B(라이트 에디토리얼) 중 클라이언트 컨펌 대기.
7. ~~문의폼 완전 목업~~ — **2026-09-17 해소됨.** 3개 문의 폼(05 인라인/문의하기 Bottom
   Sheet/하단 고정 바) 모두 `go_daepae.cms.api`(백오피스, `franchise_inquiries` 테이블)에
   실제 POST 전송하도록 연동됐다. 자세한 내용은 [[gopumgyeok-cms-integration]] 참고.
8. **이미지 저해상도** — 전부 카탈로그 PDF 크롭이라 프로덕션에선 클라이언트 고해상도 원본으로 교체하는 게 좋다([[gopumgyeok-brand-data]]).
9. **02 메뉴 png 이미지 9종이 무압축 상태(2026-09-03 신규)** — `meat_*.png`(나무 테이블 스타일)로
   전환하면서 개당 2.2~2.4MB, 9종 총합 약 20MB가 됐다(기존 jpg는 총 230KB 수준이었다). 리사이즈·
   압축을 아직 안 거쳤다 — asset-optimizer 에이전트로 최적화하는 게 다음 단계. 자세한 경위는
   [[gopumgyeok-brand-data]] 참고.
10. **`CMS_API_BASE_URL`이 아직 `http://localhost:3001/api/v1`로 하드코딩돼 있다(2026-09-17
    신규)** — `assets/js/dataFetch.js`. `go_daepae.cms.api`가 실제 배포되면 이 값을 프로덕션
    도메인으로 바꿔야 한다(아직 안 바꾸면 배포된 랜딩에서 문의 제출/팝업 조회가 전부 실패한다).
    자세한 내용은 [[gopumgyeok-cms-integration]] 참고.

**계약 범위 / 다음 단계** (디자인 맞춤제작 + 반응형 + 5섹션 + 자체 DB 수집 + 관리자모드 + 도메인 + 호스팅)
- ~~확정 시안을 Next.js 구조로 마이그레이션~~ — **2026-09-22 시작됨.** 환경 세팅 + 콘텐츠(정적
  HTML → React 컴포넌트) 이식까지 완료. 기존 정적 사이트는 삭제하지 않고 그대로 공존 중. 자세한
  내용과 남은 작업(정적 사이트 은퇴 시점, 배포 방식 전환, 프로덕션 API URL 교체)은
  [[gopumgyeok-nextjs-migration]] 참고. Supabase 자체는 이미 `go.daepae.cms.api`(백오피스) 쪽에
  구축되어 있고, 랜딩은 그 API를 통해 간접적으로만 연동한다(랜딩이 Supabase에 직접 연결하지 않음).
- 관리자모드: 로그인 + 문의내역 조회/CSV 다운로드 + 콘텐츠 CMS.
- 도메인 연결 및 호스팅 배포.

**기존 산출물**: 구축 기획서 v1→v2(docx/pdf/md), 유사 프랜차이즈 랜딩 11곳 벤치마킹 리스트, 시안A, 시안B, 시안A_v2(=0007). 원문 인계문서는 `0007/README.md`.
