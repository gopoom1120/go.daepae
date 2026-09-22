/** 숫자를 3자리 콤마 형식으로 변환한다 */
export const formatWon = (n: number) => n.toLocaleString("ko-KR");

/** 숫자만 입력받아 "-"를 자동으로 끼워 넣는다(010-0000-0000 / 010-000-0000 형태) —
 *  10자리(구형 번호)까지는 3-3-4, 11자리(대부분의 휴대폰 번호)는 3-4-4 로 나뉜다. */
export const formatPhoneNumber = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return digits.replace(/(\d{3})(\d+)/, "$1-$2");
  if (digits.length < 11) return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
  return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};
