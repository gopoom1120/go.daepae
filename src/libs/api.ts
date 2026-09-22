const CMS_API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || "http://localhost:3001/api/v1";

/**
 * CMS API 요청의 단일 진입점. endpoint(예: '/franchise-inquiries', '/public/franchise-popups')
 * 만 호출부마다 동적으로 넘기면, base URL 조합과 JSON body 가 있을 때의 기본 Content-Type
 * 헤더를 여기서 자동으로 붙인다.
 */
export const dataFetch = (endpoint: string, options: RequestInit = {}) => {
  const url = CMS_API_BASE_URL + endpoint;
  const headers = options.body
    ? { "Content-Type": "application/json", ...(options.headers as Record<string, string>) }
    : options.headers;
  return fetch(url, { ...options, headers });
};
