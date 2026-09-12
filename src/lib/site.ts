export const SITE = {
  name: "머니계산기",
  tagline: "연봉·대출·퇴직금·부가세, 복잡한 계산을 3초 만에",
  description:
    "연봉 실수령액, 대출 이자, 퇴직금, 전월세 전환, 부가세, 복리, 시급 계산기까지. 광고 없이 빠르고 정확한 무료 생활 금융 계산기 모음.",
  locale: "ko_KR",
  author: "머니계산기",
};

export type Calc = {
  slug: string;
  title: string;
  short: string;
  description: string;
  keywords: string[];
  emoji: string;
  category: "급여" | "대출·부동산" | "세금" | "저축" | "생활";
};

export const CALCS: Calc[] = [
  { slug: "salary", title: "연봉 실수령액 계산기", short: "연봉 실수령액", emoji: "💰", category: "급여",
    description: "2026년 4대보험 요율과 간이세액 기준으로 연봉·월급의 실수령액을 계산합니다. 부양가족, 비과세액 반영.",
    keywords: ["연봉 실수령액", "월급 실수령액", "세후 연봉", "4대보험 계산"] },
  { slug: "hourly", title: "시급·주휴수당 계산기", short: "시급 → 월급", emoji: "⏰", category: "급여",
    description: "시급과 주 근무시간으로 주휴수당 포함 월급·연봉을 계산합니다. 2026년 최저시급 기준.",
    keywords: ["주휴수당 계산기", "시급 월급 계산", "최저시급 2026", "알바 월급"] },
  { slug: "severance", title: "퇴직금 계산기", short: "퇴직금", emoji: "🎁", category: "급여",
    description: "입사일·퇴사일과 최근 3개월 급여로 퇴직금과 세후 예상액을 계산합니다.",
    keywords: ["퇴직금 계산기", "퇴직금 계산 방법", "평균임금", "퇴직소득세"] },
  { slug: "loan", title: "대출 이자 계산기", short: "대출 이자", emoji: "🏦", category: "대출·부동산",
    description: "원리금균등, 원금균등, 만기일시 상환 방식별 월 상환액과 총 이자를 비교합니다. 상환 스케줄 제공.",
    keywords: ["대출 이자 계산기", "원리금균등 계산", "주택담보대출 이자", "월 상환금"] },
  { slug: "rent", title: "전월세 전환 계산기", short: "전월세 전환", emoji: "🏠", category: "대출·부동산",
    description: "전세 보증금을 월세로, 월세를 전세로 환산합니다. 법정 전월세 전환율 반영.",
    keywords: ["전월세 전환율", "전세 월세 계산", "보증금 월세 환산", "전월세전환 계산기"] },
  { slug: "vat", title: "부가세 계산기", short: "부가세", emoji: "🧾", category: "세금",
    description: "공급가액↔합계금액 부가가치세 10%를 즉시 계산합니다. 사업자·프리랜서 필수.",
    keywords: ["부가세 계산기", "부가가치세 계산", "공급가액 계산", "vat 계산"] },
  { slug: "compound", title: "예적금·복리 계산기", short: "예적금 이자", emoji: "📈", category: "저축",
    description: "예금·적금의 세전/세후 이자와 복리 효과를 계산합니다. 이자소득세 15.4% 반영.",
    keywords: ["적금 이자 계산기", "복리 계산기", "예금 이자 계산", "세후 이자"] },
  { slug: "bmi", title: "BMI 계산기", short: "BMI", emoji: "⚖️", category: "생활",
    description: "키와 몸무게로 체질량지수(BMI)와 비만도 판정, 정상 체중 범위를 계산합니다.",
    keywords: ["bmi 계산기", "체질량지수", "정상 체중 계산", "비만도 계산"] },
  { slug: "dday", title: "D-day 계산기", short: "D-day", emoji: "📅", category: "생활",
    description: "특정 날짜까지 남은 일수, 두 날짜 사이 기간, N일 후 날짜를 계산합니다.",
    keywords: ["디데이 계산기", "날짜 계산기", "며칠 남았는지", "날짜 차이 계산"] },
];

export const CATEGORIES = [...new Set(CALCS.map((c) => c.category))];
export const getCalc = (slug: string) => CALCS.find((c) => c.slug === slug);
