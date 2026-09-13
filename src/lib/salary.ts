// 연봉 실수령액 계산 (2026년 기준). 계산기 페이지와 프로그래매틱 페이지가 함께 사용합니다.
// 매년 이 파일의 상수만 갱신하면 됩니다.
export const YEAR = 2026;
export const RATES = { np: 0.045, npCap: 6370000, hi: 0.03595, ltc: 0.1314, ei: 0.009 };
const BRACKETS: [number, number][] = [[14000000, 0.06], [50000000, 0.15], [88000000, 0.24], [150000000, 0.35], [300000000, 0.38], [500000000, 0.40], [1000000000, 0.42], [Infinity, 0.45]];

function earnedIncomeDeduction(y: number) {
  if (y <= 5e6) return y * 0.7;
  if (y <= 1.5e7) return 3.5e6 + (y - 5e6) * 0.4;
  if (y <= 4.5e7) return 7.5e6 + (y - 1.5e7) * 0.15;
  if (y <= 1e8) return 1.2e7 + (y - 4.5e7) * 0.05;
  return Math.min(1.475e7 + (y - 1e8) * 0.02, 2e7);
}
function progressive(base: number) {
  let t = 0, prev = 0;
  for (const [lim, rate] of BRACKETS) { if (base > prev) { t += (Math.min(base, lim) - prev) * rate; prev = lim; } else break; }
  return t;
}
function earnedIncomeTaxCredit(tax: number, y: number) {
  const c = tax <= 1.3e6 ? tax * 0.55 : 715000 + (tax - 1.3e6) * 0.3;
  let cap: number;
  if (y <= 3.3e7) cap = 740000;
  else if (y <= 7e7) cap = Math.max(660000, 740000 - (y - 3.3e7) * 0.008);
  else if (y <= 1.2e8) cap = Math.max(500000, 660000 - (y - 7e7) / 2 * 0.01);
  else cap = Math.max(200000, 500000 - (y - 1.2e8) / 2 * 0.01);
  return Math.min(c, cap);
}
// 간이세액표가 가정하는 특별소득·세액공제 상당액
function specialDeduction(y: number) {
  if (y <= 3e7) return 3.1e6 + y * 0.04;
  if (y <= 4.5e7) return 3.1e6 + y * 0.04 - (y - 3e7) * 0.05;
  if (y <= 7e7) return 3.1e6 + y * 0.015;
  return 3.1e6 + y * 0.005;
}
export function childCredit(c: number) { if (c <= 0) return 0; if (c === 1) return 250000; if (c === 2) return 550000; return 650000 + (c - 3) * 300000; }

export type SalaryResult = { grossMonthly: number; np: number; hi: number; ltc: number; ei: number; tax: number; ltax: number; net: number };

/** annualTaxable: 비과세 제외 연간 과세급여, taxfreeMonthly: 월 비과세, family: 본인 포함 부양가족, children: 8~20세 자녀, div: 12 또는 13 */
export function calcSalary(annualTaxable: number, taxfreeMonthly: number, family: number, children: number, div: number): SalaryResult {
  const grossMonthly = annualTaxable / div + taxfreeMonthly;
  const taxableMonthly = annualTaxable / div;
  const np = Math.min(taxableMonthly, RATES.npCap) * RATES.np;
  const hi = taxableMonthly * RATES.hi;
  const ltc = hi * RATES.ltc;
  const ei = taxableMonthly * RATES.ei;
  const y = annualTaxable;
  let base = Math.max(0, y - earnedIncomeDeduction(y) - 1.5e6 * family - np * 12 - specialDeduction(y));
  let tax = progressive(base);
  tax -= earnedIncomeTaxCredit(tax, y);
  tax -= childCredit(children);
  tax = Math.max(0, tax) / 12;
  const ltax = tax * 0.1;
  const net = grossMonthly - np - hi - ltc - ei - tax - ltax;
  return { grossMonthly, np, hi, ltc, ei, tax, ltax, net };
}

/** 연봉(비과세 포함 총액) 기준 편의 함수. 기본: 월 비과세 20만, 1인 가구 */
export function calcAnnual(annual: number, opts: { taxfree?: number; family?: number; children?: number; div?: number } = {}) {
  const { taxfree = 200000, family = 1, children = 0, div = 12 } = opts;
  return calcSalary(Math.max(0, annual - taxfree * div), taxfree, family, children, div);
}
