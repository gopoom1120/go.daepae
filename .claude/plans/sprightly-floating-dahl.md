# 고품격대패 랜딩 ↔ CMS 백오피스 연동 (가맹문의 / 팝업 / 공지사항)

## Context

고품격대패 랜딩페이지(`go_daepae`, 정적 사이트)의 가맹문의 폼 3곳(인라인폼/Bottom
Sheet/스티키바)은 전부 목업이라 실제 전송이 없고(`preventDefault` 후 버튼 텍스트만 교체),
팝업·공지사항 기능은 아예 없다. 별도 저장소 `go_daepae.cms.api`(Next.js+Supabase 기반
백오피스, 실제 GitHub 이름 `statkit.cms.api`)에는 이미 프랜차이즈 도메인(가맹문의/팝업/매장/
메뉴)이 상당 부분 구현돼 있다:

- **franchise_inquiries** 테이블 + RLS(`anon` insert 허용) + 관리자 조회/CSV/메모 화면까지
  완비. 다만 **공개 제출 API 라우트는 없다** — 기존 `/api/v1/[resource]` 는 GET 전용이고,
  개인정보 리드 데이터라 `statkit_content_api_configs` 에도 의도적으로 시드되지 않았다.
- **franchise_popups** 테이블 + `franchise_popups_public` 뷰(발행+노출기간 필터) + 관리자
  CRUD + `statkit_content_api_configs` 시드까지 완비. `is_enabled=false` 상태일 뿐 구조는
  끝나 있다.
- **공지사항**은 DB에 아예 없다. 사용자 확인 결과 별도 테이블을 새로 만들지 않고
  **franchise_popups 데이터를 그대로 재사용**해 프론트에서 "팝업(모달)"과 "공지 목록(리스트)"
  두 가지 형태로 렌더링하기로 함.

기존 `/api/v1/[resource]` 는 전부 `X-API-Key`(`INTERNAL_API_KEY`) 필수인데, 랜딩은 서버가
없는 정적 사이트라 이 키를 그대로 박아넣으면 노출된다. 사용자는 **문의 제출은 CMS에 신규
공개 POST 라우트를 추가**하고, **팝업/공지 조회는 별도의 무인증 공개 GET 라우트를 신설**해
기존 `INTERNAL_API_KEY` 를 정적 JS에 노출시키지 않는 방향을 선택했다. 팝업은 "오늘 하루
보지 않기" UX를 적용한다.

추가로 스키마 불일치를 하나 발견했다: 랜딩의 "창업유형" 드롭다운 값(`신규 창업`/
`기존 매장 전환`/`다점포 확장`/`상담 후 결정`)은 `franchise_inquiries.inquiry_type` enum
(`방문예약`/`창업상담`/`제휴문의`/`기타`)과 의미가 다르다. `inquiry_type` 은 랜딩 제출 시
고정값 `'창업상담'` 으로 채우고, 랜딩 고유 값은 새 컬럼 `franchise_type` 에 별도 저장한다.
랜딩 폼에는 자유 텍스트 `message` 필드가 없으므로 `message` 컬럼도 nullable 로 완화한다.

## 백엔드 변경 (`go_daepae.cms.api`)

### 1. 마이그레이션 `supabase/migrations/0010_franchise_inquiries_landing_fields.sql`
- `franchise_inquiries` 에 `region text`, `franchise_type text` 컬럼 추가
- `message` 컬럼 `not null` 제약 제거(`alter column message drop not null`)
- 참고 패턴: `supabase/migrations/003_franchise_domain.sql`, `009_franchise_popups.sql`

### 2. 가맹문의 공개 제출 라우트 — `src/app/api/v1/franchise-inquiries/route.ts` (신규)
Next.js App Router는 정적 세그먼트(`franchise-inquiries`)를 동적 세그먼트(`[resource]`)보다
우선 매칭하므로 기존 `[resource]/route.ts` 와 충돌하지 않는다.

- `POST` 핸들러만 구현, **`X-API-Key` 검증 없음** (RLS의 `franchise_inquiries_public_insert`
  정책이 이미 이 용도로 설계돼 있음 — `003_franchise_domain.sql:112`)
- zod로 `name`(필수), `phone`(필수), `franchiseType`(필수, enum: 신규 창업/기존 매장 전환/
  다점포 확장/상담 후 결정), `region`(선택), 허니팟 필드(예: `website`, 채워져 있으면 200을
  반환하되 실제 insert는 하지 않음) 검증
- `request.headers` 에서 `x-forwarded-for`→`ip_address`, `user-agent`→`user_agent`,
  `referer`→`referer` 추출해 함께 저장
- 최소 스팸 방지: 동일 `phone` 값이 최근 60초 이내 등록된 적이 있으면 429 (Supabase count 쿼리)
- Supabase **anon 클라이언트**로 insert (service role 아님 — RLS 정책을 그대로 신뢰).
  `inquiry_type` 은 항상 `'창업상담'` 고정, `franchise_type` 에 드롭다운 값, `message` 는
  null 또는 "웹 문의" 같은 짧은 기본값
- 참고: 기존 anon/service 클라이언트 생성 패턴은 `src/libs/supabase/queries/franchise-inquiries.admin.ts` 및 인접 쿼리 파일에서 확인 후 재사용

### 3. 팝업/공지 공개 조회 라우트 — `src/app/api/v1/public/franchise-popups/route.ts` (신규)
- `GET` 핸들러만, **`X-API-Key` 검증 없음** (기존 `[resource]` 의 인증 모델과 분리된 새 계열)
- `franchise_popups_public` 뷰를 `sort_order asc` 로 조회해 그대로 반환 (뷰가 이미 발행+
  노출기간 필터링을 함 — `009_franchise_popups.sql:34-41`)
- 기존 `statkit_content_api_configs` 의 `franchise-popups` 리소스(`is_enabled` 토글)는
  건드리지 않음 — 이 새 라우트는 별개의 무인증 트랙이며, 팝업 노출 on/off 는 관리자가 각 행의
  `is_published`/`start_date`/`end_date` 로 제어

### 4. 미들웨어 `src/middleware.ts` 수정
- CORS preflight 응답의 `Access-Control-Allow-Methods` 를 `"GET, OPTIONS"` →
  `"GET, POST, OPTIONS"` 로 변경 (line 32) — `franchise-inquiries` POST 를 허용하기 위함
- `isPublicApiPath` 는 이미 `/api/v1/` prefix 전체를 허용하므로 신규 라우트 추가만으로 CORS
  헤더 주입(line 75-83)은 그대로 적용됨. 코드 변경 불필요, 확인만.

### 5. (선택, 낮은 우선순위) OpenAPI 스키마
`src/libs/openapi/schemas/` 에 신규 라우트 2개를 문서화 — 핵심 기능은 아니므로 시간이 없으면
생략 가능.

## 프론트엔드 변경 (`go_daepae`)

### 1. `assets/js/script.js`
- 상단에 `CMS_API_BASE_URL` 상수 추가 (예: `"https://<배포도메인>/api/v1"`) — **실제 배포
  URL은 사용자에게 확인 필요**, 구현 시작 전 확정
- `initInquiryForm()` / `initInquirySheet()` / `initStickyInquiryForm()` 3곳의 목업 submit
  로직을 공용 함수 `submitInquiry(fields, btn)` 로 통합해 호출:
  - `fetch(CMS_API_BASE_URL + '/franchise-inquiries', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, phone, franchiseType, region, website: honeypotValue})})`
  - 성공(2xx): 기존 UX 유지("접수되었습니다" + 버튼 disabled)
  - 실패(4xx/5xx/네트워크 에러): 버튼 재활성화 + "잠시 후 다시 시도해주세요" 문구로 교체(현재
    없는 에러 경로 신규 추가)
- 3개 폼 모두에 허니팟 hidden input 추가 처리와 값 읽기
- 신규 `initPopup()`: `DOMContentLoaded` → `renderAll()` 이후, `CMS_API_BASE_URL + '/public/franchise-popups'` fetch → 오늘자 `localStorage['popupDismiss:' + id]` 없는 첫 항목을
  `#popupBackdrop` 모달에 렌더 → "오늘 하루 보지 않기" 체크 시 닫힘 액션에서 localStorage에
  당일 날짜 저장. 모달 열기/닫기/포커스 트랩/Escape 처리는 `initInquirySheet()` 의 backdrop
  패턴(`assets/js/script.js` 397~437행) 재사용
- 신규 `initNoticeList()`: 같은 fetch 응답의 전체 목록(발행중 전부)을 간단한 리스트/티커
  형태로 `#noticeBar` 에 렌더 (제목 + 클릭 시 `link_url` 이동 또는 팝업과 동일 상세 노출)

### 2. `index.html`
- 3개 문의 폼에 허니팟 필드 추가 (`tabindex="-1" autocomplete="off"`, CSS로 시각적 숨김)
- `#inquirySheetBackdrop` 근처에 신규 `#popupBackdrop` 모달 스켈레톤 추가 (동일한
  `role="dialog" aria-modal="true"` 구조)
- 헤더 하단 또는 히어로 위에 빈 `#noticeBar` 컨테이너 추가 (JS가 채움, `data/content.json`
  과 무관 — CMS fetch 결과로 채워짐)

### 3. `assets/css/style.css` / `assets/css/animations.css`
- `.popup-modal` 스타일: 기존 `:root` 토큰만 사용, 문의하기 Bottom Sheet의 카드/그림자 언어
  재사용
- `.notice-bar` 스타일: 슬림 바 형태, 다크/라이트 섹션 텍스트 반전 규칙 준수
- 새 전환 애니메이션은 `animations.css` 에 추가하고 `prefers-reduced-motion` 블록에 예외 추가
- 폰트 크기는 18~96px 범위 준수 (기존 CLAUDE.md 규칙)
- 이 CSS 작업은 `css-stylist` 에이전트에게 위임 권장

### 4. 검증
- `screenshot-verifier` 에이전트로 팝업/공지바 실제 렌더 확인 (헤드리스 스크린샷)
- 로컬에서 `python3 -m http.server 8765` 로 랜딩 구동 + CMS는 `yarn dev`(포트 3001)로 구동,
  `CMS_API_BASE_URL` 을 로컬로 임시 교체해 문의 제출 → Supabase `franchise_inquiries` 테이블에
  실제 행 생성되는지, 팝업 → 관리자에서 발행한 팝업이 뜨는지, "오늘 하루 보지 않기" 후
  새로고침해도 안 뜨는지 수동 확인
- CMS 쪽은 `docs/ROADMAP.md`/기존 admin 화면에서 franchise_popups 최소 1건을 `is_published=true` 로 등록해 종단 테스트
- `code-reviewer` 에이전트로 CLAUDE.md의 "되살리면 안 되는 것"/폰트 크기/토큰 규칙 위반 여부
  최종 검토

## 남은 확인 필요 사항 (구현 착수 전 확정)
- CMS API의 실제 배포(프로덕션) URL — `CMS_API_BASE_URL` 값 확정 필요
- 로컬 개발 시 두 저장소를 동시에 띄워 실제 종단 테스트할지, 아니면 배포된 CMS를 바로 호출할지
