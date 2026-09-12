// 수익화 설정. 값이 비어 있으면 해당 요소는 렌더링되지 않습니다.
// GitHub Actions → Settings → Variables 에 등록하면 빌드 시 주입됩니다.
export const ADSENSE_CLIENT = import.meta.env.PUBLIC_ADSENSE_CLIENT || ""; // 예: ca-pub-1234567890123456
export const ADSENSE_SLOT_TOP = import.meta.env.PUBLIC_ADSENSE_SLOT_TOP || "";
export const ADSENSE_SLOT_BOTTOM = import.meta.env.PUBLIC_ADSENSE_SLOT_BOTTOM || "";
export const ADFIT_UNIT = import.meta.env.PUBLIC_ADFIT_UNIT || ""; // 카카오 애드핏 광고단위 ID
export const COUPANG_ID = import.meta.env.PUBLIC_COUPANG_ID || ""; // 쿠팡 파트너스 ID (예: AF1234567)
export const GA_ID = import.meta.env.PUBLIC_GA_ID || ""; // 구글 애널리틱스 G-XXXX

export function coupangSearchUrl(keyword: string) {
  const q = encodeURIComponent(keyword);
  // 쿠팡 파트너스 "검색 링크" 형식. 파트너스 대시보드에서 발급되는 형식과 다르면 여기만 수정하세요.
  return COUPANG_ID
    ? `https://link.coupang.com/re/AFFSRP?lptag=${COUPANG_ID}&pageKey=${q}&subid=moneycalc`
    : `https://www.coupang.com/np/search?q=${q}`;
}
