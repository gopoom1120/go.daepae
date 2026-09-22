// ===== 고품격대패 랜딩페이지 — 정규표현식 기반 유틸 전용 모듈 =====
//
// 정규식으로 문자열을 가공하는 함수를 이 파일 하나로 모은다. type="module" 을 쓰지 않는
// 프로젝트라 export 없이 전역에 그대로 노출한다 — index.html 에서 이 스크립트가 script.js
// 보다 먼저 로드되면(defer 는 문서 순서대로 실행된다) 아래 바인딩들을 script.js 에서 그대로
// 쓸 수 있다.

/** 사용자 데이터를 HTML 에 넣기 전 이스케이프한다 (desc 계열 필드는 예외 — script.js 의
 *  fill()/render* 함수들이 직접 판단한다) */
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

/** 숫자만 입력받아 "-"를 자동으로 끼워 넣는다(010-0000-0000 / 010-000-0000 형태) —
 *  10자리(구형 번호)까지는 3-3-4, 11자리(대부분의 휴대폰 번호)는 3-4-4 로 나뉜다. 입력
 *  중간에 자릿수가 넘어갈 때마다 하이픈 위치가 다시 계산되는 건 이 방식의 일반적인 동작이다. */
const formatPhoneNumber = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return digits.replace(/(\d{3})(\d+)/, '$1-$2');
  if (digits.length < 11) return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
  return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};
