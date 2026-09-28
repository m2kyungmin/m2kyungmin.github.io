// 색인 대상 롱테일 페이지 목록 — 페이지(noindex 메타)와 astro.config.mjs(사이트맵 필터)가 함께 쓴다.
// 새 도메인은 크롤링 예산이 작아 비슷한 자동 생성 페이지 190여 개가 "발견됨-미색인"에 묶인다(Search Console 2026-09-28).
// 수요가 있는 금액만 색인하고, 나머지 페이지는 사용자용으로 남기되 noindex,follow 로 둔다.

export const MIN_WAGE_2026 = 10320;

// 연봉 2,000만 ~ 1억5,000만원, 100만원 단위 (만원)
export const SALARY_AMOUNTS = Array.from({ length: 131 }, (_, i) => 2000 + i * 100);
// 500만원 단위 + Search Console 에서 노출이 확인된 금액
const SALARY_EXTRA = [5800, 8100, 13900, 14800];
export const isIndexedSalary = (man) => man % 500 === 0 || SALARY_EXTRA.includes(man);

// 시급 9,000~13,000원은 100원 단위, 13,000~20,000원은 500원 단위, 2026년 최저시급 포함
export const WAGES = Array.from(
  new Set([
    ...Array.from({ length: 41 }, (_, i) => 9000 + i * 100),
    ...Array.from({ length: 15 }, (_, i) => 13000 + i * 500),
    MIN_WAGE_2026,
  ])
).sort((a, b) => a - b);
export const isIndexedWage = (w) =>
  w === MIN_WAGE_2026 || w % 1000 === 0 || (w >= 10000 && w <= 13000 && w % 500 === 0);

export const INDEXED_SALARY = SALARY_AMOUNTS.filter(isIndexedSalary);
export const INDEXED_WAGES = WAGES.filter(isIndexedWage);

/** 사이트맵에 넣을 URL 인지 (noindex 롱테일 페이지 제외) */
export function inSitemap(url) {
  const { pathname } = new URL(url);
  let m = pathname.match(/^\/salary\/(\d+)$/);
  if (m) return isIndexedSalary(Number(m[1]));
  m = pathname.match(/^\/hourly\/(\d+)$/);
  if (m) return isIndexedWage(Number(m[1]));
  return true;
}
