// 대출·적금·시급 계산용 순수 함수 모음. 빌드 타임(프로그래매틱 SEO 페이지)과
// 클라이언트(계산기) 양쪽에서 재사용할 수 있도록 부작용 없이 작성합니다.

/** 2026년 최저시급(고용노동부 고시). 매년 이 값만 갱신하면 됩니다. */
export const MIN_WAGE_2026 = 10320;

// ---------------------------------------------------------------------------
// 대출
// ---------------------------------------------------------------------------

/** 원리금균등 상환: 매달 동일한 금액(원금+이자)을 상환합니다. */
export function equalPayment(principal: number, annualRate: number, months: number) {
  const i = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  const monthly = i > 0 ? (principal * i) / (1 - Math.pow(1 + i, -n)) : principal / n;
  const total = monthly * n;
  const totalInterest = total - principal;
  return { monthly, totalInterest, total };
}

/** 원금균등 상환: 매달 동일한 원금 + 남은 잔액의 이자를 상환합니다. */
export function equalPrincipal(principal: number, annualRate: number, months: number) {
  const i = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  const princPerMonth = principal / n;
  let balance = principal;
  let totalInterest = 0;
  let firstMonthly = 0;
  let lastMonthly = 0;
  for (let t = 1; t <= n; t++) {
    const interest = balance * i;
    const princ = t === n ? balance : princPerMonth;
    const pay = princ + interest;
    if (t === 1) firstMonthly = pay;
    if (t === n) lastMonthly = pay;
    balance = Math.max(0, balance - princ);
    totalInterest += interest;
  }
  return { firstMonthly, lastMonthly, totalInterest, total: principal + totalInterest };
}

/** 만기일시 상환: 매달 이자만 납부하고 만기에 원금을 한 번에 상환합니다. */
export function bulletTotalInterest(principal: number, annualRate: number, months: number) {
  const i = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  const monthlyInterest = principal * i;
  const totalInterest = monthlyInterest * n;
  return { monthlyInterest, totalInterest, total: principal + totalInterest };
}

// ---------------------------------------------------------------------------
// 예금·적금
// ---------------------------------------------------------------------------

/** 이자소득세(기본 15.4%)를 뗀 세후 이자를 계산합니다. */
export function afterTax(interest: number, taxRate = 0.154) {
  const tax = interest * taxRate;
  return { tax, net: interest - tax };
}

/** 정기예금 이자. compoundMonthly=true면 월복리, false면 단리입니다. */
export function depositInterest(principal: number, annualRate: number, months: number, compoundMonthly: boolean) {
  const r = annualRate / 100;
  const n = Math.max(1, Math.round(months));
  if (compoundMonthly) {
    return principal * (Math.pow(1 + r / 12, n) - 1);
  }
  return principal * r * (n / 12);
}

/** 정기적금 이자(단리). 매월 납입액 × 연이율/12 × n(n+1)/2 공식입니다. */
export function installmentInterest(monthly: number, annualRate: number, months: number) {
  const rm = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  return monthly * rm * (n * (n + 1)) / 2;
}

// ---------------------------------------------------------------------------
// 시급·주휴수당
// ---------------------------------------------------------------------------

export type WeeklyPayResult = {
  basePay: number;
  overtimePay: number;
  holidayPay: number;
  holidayEligible: boolean;
  weekly: number;
  monthly: number;
  annual: number;
};

/**
 * 시급 기준 주급/월급/연봉을 계산합니다.
 * 주휴수당은 1주 소정근로시간이 15시간 이상일 때 지급 대상이며,
 * 주휴시간 = min(8, 주근무시간/40*8) 입니다.
 */
export function weeklyPay(
  hourly: number,
  hoursPerDay: number,
  daysPerWeek: number,
  overtimeHoursPerWeek = 0
): WeeklyPayResult {
  const weeklyHours = hoursPerDay * daysPerWeek;
  const holidayEligible = weeklyHours >= 15;
  const basePay = hourly * weeklyHours;
  const overtimePay = hourly * 1.5 * overtimeHoursPerWeek;
  const holidayHours = holidayEligible ? Math.min(8, (weeklyHours / 40) * 8) : 0;
  const holidayPay = hourly * holidayHours;
  const weekly = basePay + overtimePay + holidayPay;
  const monthly = weekly * 4.345;
  const annual = monthly * 12;
  return { basePay, overtimePay, holidayPay, holidayEligible, weekly, monthly, annual };
}
