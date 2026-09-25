---
name: gopumgyeok-landing-project
description: "0007 폴더는 고품격대패(대패삼겹살 프랜차이즈) 랜딩 시안A_v2이며, 인계문서가 같은 폴더에 있음"
metadata: 
  node_type: memory
  type: project
  originSessionId: 64490a38-09ba-439e-83a5-66505594f155
  modified: 2026-09-22T00:00:00.000Z
---

`component-zip/0007/`은 단순 컴포넌트 데모가 아니라 **GospelFix의 실제 클라이언트 "고품격대패"(대패삼겹살 프랜차이즈) 랜딩페이지 시안A_v2**다. claude.ai 웹 대화에서 만들어진 것을 CLI로 인계받은 상태이며, 전체 맥락은 `0007/README.md`(2026-09-01 작성)에 정리되어 있다 — 0007 작업 전에 이 문서를 먼저 읽을 것.

핵심 상태:
- 5섹션 구조(경쟁력/메뉴/수익분석/창업비용/매장위치) + 히어로.
- **2026-09-22 Next.js 14 App Router 프로젝트(`src/`, `package.json`)가 저장소 루트에
  생겼고, 2026-09-24 구 정적 사이트(`index.html`/`assets/`/`data/`)가 완전히 삭제됐다** —
  한동안 두 버전이 공존했지만 지금은 Next.js가 유일한 소스다. 자세한 내용은
  [[gopumgyeok-nextjs-migration]] 참고.
- 최종 프로덕션 방향은 **Next.js + Supabase**(문의폼 실제 연동, 관리자모드, 도메인/호스팅까지가
  계약 범위) — Next.js 전환은 시작됐고, Supabase는 별도 저장소 `go.daepae.cms.api`(백오피스)
  쪽에 이미 구축되어 있다.
- 미해결: 창업비용 실제 금액 미확보(전부 "상담 시 안내"), 시안A/A_v2/B 중 클라이언트 컨펌 미완.
  문의폼은 더 이상 목업이 아니다 — [[gopumgyeok-cms-integration]] 참고.
- 이전 환경(claude.ai 컨테이너)엔 브라우저가 없어 CSS 수정이 한동안 시각 검증되지 않았으나,
  현재는 로컬 Chrome 헤드리스/CDP로 검증 가능하다([[gopumgyeok-headless-verification]]).

**Why:** 폴더만 보면 다른 번호 폴더들과 같은 성격으로 오인하기 쉽지만, 실제 납품 대상이라 임의 구조 변경·재작성 리스크가 크다.

**How to apply:** 0007 관련 요청이 오면 인계문서의 확정 사항(Pretendard 단독 폰트, 골드/블랙 컬러 토큰, 영수증 카드 구현 규칙 등)을 존중하고, 이미 사용자가 명시적으로 제거한 요소(Song Myung 세리프, 히어로 오픈일 스트립, 매출 "원" 단위)를 되살리지 말 것. [[user-profile]]
