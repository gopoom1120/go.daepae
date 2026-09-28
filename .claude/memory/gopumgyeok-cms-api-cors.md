---
name: gopumgyeok-cms-api-cors
description: "go.daepae.cms.api의 공개 API는 Origin 화이트리스트 방식 CORS라 curl로는 정상(200)처럼 보여도 브라우저에선 막힐 수 있다. 실서버 도메인 확정값과 2026-09-28 화이트리스트 수정 내역"
metadata:
  type: project
---

**실서버 도메인 확정 (2026-09-28 curl/`.env` 확인)**
- 랜딩: `https://xn--i89a2dz9q2p1bhpb.com` (고품격대패.com의 퓨니코드)
- 관리자 CMS 패널: `https://admin.xn--i89a2dz9q2p1bhpb.com`
- CMS API 배포 주소: `https://go-daepae-cms-api.vercel.app` — 관리자 패널과 공개 API
  (`/api/v1/public/*`)가 **같은 Next.js 앱(같은 배포)**이며, `admin.xn--i89a2dz9q2p1bhpb.com`은
  이 배포에 연결된 커스텀 도메인으로 보인다([[gopumgyeok-nextjs-migration]]에서 이미 확인된
  "백엔드 배포 완료" 상태와 일치).
- 랜딩 프로덕션 `.env`의 `NEXT_PUBLIC_CMS_API_BASE_URL=https://go-daepae-cms-api.vercel.app/`로
  이미 이 주소를 가리키고 있었다(`.env`는 gitignore 대상이라 로컬에서만 확인 가능, Vercel
  대시보드 값과 반드시 같다는 보장은 없지만 실제 브라우저 요청 캡처와 일치함).

**CORS 아키텍처와 함정** — `go.daepae.cms.api/src/middleware.ts`의 `ALLOWED_ORIGINS` 배열이
공개 API(`/api/v1/*`)에 대한 CORS 허용 오리진 화이트리스트다. 요청의 `Origin` 헤더가 이 배열에
없으면 `Access-Control-Allow-Origin` 헤더 자체를 응답에서 생략한다(차단 응답을 따로 안 주고
그냥 헤더를 뺀다) — **응답 status는 정상 200/204고 body도 정상 반환되므로, curl로 테스트하면
아무 문제 없어 보인다.** curl은 CORS를 검사하지 않기 때문이다. 실제 문제는 브라우저가 응답을
받고 나서 JS에 전달하지 않고 콘솔에 CORS 에러를 띄우는 것 — 서버 로그나 curl 재현으로는 절대
안 잡히고, 브라우저 개발자도구 콘솔/네트워크 탭으로만 확인 가능하다.

2026-09-28 실제로 이 문제가 발생했다: `ALLOWED_ORIGINS`에 `https://go-daepae.vercel.app`과
`http://localhost:3000`만 있고 실서버 도메인 두 개가 빠져 있어서, 랜딩(`xn--i89a2dz9q2p1bhpb.com`)
에서 팝업 조회(`/api/v1/public/franchise-popups`)가 브라우저에서만 막혔다. `https://xn--i89a2dz9q2p1bhpb.com`,
`https://admin.xn--i89a2dz9q2p1bhpb.com`을 추가해 커밋(`da6a97e`)·push 완료.

**Why**: 이 프로젝트(랜딩 저장소)에서 "관리자 페이지와 통신이 안 된다"는 보고를 받으면, 먼저
curl로 재현하려는 시도는 이 CORS 방식 때문에 오히려 "정상"으로 보여 오진단으로 이어지기 쉽다.

**How to apply**: 랜딩↔CMS API 간 "브라우저에서만 실패, curl/서버는 정상" 증상을 보면 가장
먼저 `go.daepae.cms.api/src/middleware.ts`의 `ALLOWED_ORIGINS`부터 확인할 것. 새 프로덕션
도메인(서브도메인 포함)을 추가로 연결할 때마다 이 배열에 등록이 빠지지 않았는지 함께 점검한다.
`go.daepae.cms.api`는 별도 git 저장소(`github.com/gopoom1120/go.daepae.cms.api`)이므로 수정 시
그쪽 저장소에서 커밋·push해야 하고, main에 연결된 Vercel 자동배포가 있다는 전제
([[gopumgyeok-nextjs-migration]])는 이 저장소에도 동일하게 적용된다고 가정하고 진행했다(별도
확인은 안 함).
