// ===== 고품격대패 랜딩페이지 — CMS API 통신 전용 모듈 =====
//
// go_daepae.cms.api(백오피스) 와 통신하는 모든 요청은 이 파일의 dataFetch() 하나를 거친다.
// script.js 의 각 호출부는 매번 달라지는 endpoint 값만 인자로 넘기고, base URL 조합·기본
// 헤더 같은 세부사항은 여기서 한 번만 처리한다. type="module" 을 쓰지 않는 프로젝트라
// export 없이 전역에 dataFetch/CMS_API_BASE_URL 을 그대로 노출한다 — index.html 에서 이
// 스크립트가 script.js 보다 먼저 로드되면 (defer 는 문서 순서대로 실행되므로) 아래 두
// 바인딩을 script.js 에서 그대로 쓸 수 있다.

// 아직 배포 전이라 로컬 개발 서버를 가리킨다 — 배포되면 실제 도메인(예:
// https://xxx.vercel.app/api/v1)으로 교체할 것.
const CMS_API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * CMS API 요청의 단일 진입점. endpoint(예: '/franchise-inquiries', '/public/franchise-popups')
 * 만 호출부마다 동적으로 넘기면, CMS_API_BASE_URL 조합과 JSON body 가 있을 때의 기본
 * Content-Type 헤더를 여기서 자동으로 붙인다.
 *
 * 네트워크 자체가 끊긴 경우(fetch 가 reject)는 그대로 다시 throw 하고, HTTP 상태코드
 * 기반의 성공/실패(res.ok) 판단은 호출부가 직접 한다 — 폼 제출은 실패 시 버튼 문구를
 * 바꾸고, 팝업 조회는 실패 시 조용히 빈 배열로 넘어가는 등 호출부마다 처리 방식이 달라
 * 여기서 임의로 흡수하지 않는다.
 */
const dataFetch = (endpoint, options = {}) => {
  const url = CMS_API_BASE_URL + endpoint;
  const headers = options.body
    ? { 'Content-Type': 'application/json', ...options.headers }
    : options.headers;
  return fetch(url, { ...options, headers });
};
