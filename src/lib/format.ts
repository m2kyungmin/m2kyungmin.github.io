export const won = (n: number) => Math.round(n).toLocaleString("ko-KR") + "원";
export const num = (n: number) => Math.round(n).toLocaleString("ko-KR");
/** 4,000만원 / 1.2억원 같은 한국식 축약 */
export const kor = (n: number) => {
  n = Math.round(n);
  if (n >= 100000000) return (n / 100000000).toFixed(n % 100000000 ? 1 : 0).replace(/\.0$/, "") + "억원";
  if (n >= 10000) return Math.round(n / 10000).toLocaleString("ko-KR") + "만원";
  return n.toLocaleString("ko-KR") + "원";
};
