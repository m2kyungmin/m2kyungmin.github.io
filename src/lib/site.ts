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
  /** 검색 결과에 보이는 <title> (h1은 title 그대로) */
  seoTitle: string;
  short: string;
  description: string;
  keywords: string[];
  emoji: string;
  category: "급여" | "대출·부동산" | "세금" | "저축" | "생활";
};

export const CALCS: Calc[] = [
  { slug: "salary", title: "연봉 실수령액 계산기", seoTitle: "2026 연봉 실수령액 계산기 - 4대보험·소득세 자동 공제", short: "연봉 실수령액", emoji: "💰", category: "급여",
    description: "연봉·월급을 넣으면 2026년 4대보험 요율과 간이세액 기준 월 실수령액을 바로 계산합니다. 부양가족·자녀·비과세 식대·퇴직금 포함 연봉까지 반영하고 공제 내역을 항목별로 보여 줍니다.",
    keywords: ["연봉 실수령액", "월급 실수령액", "세후 연봉", "4대보험 계산"] },
  { slug: "hourly", title: "시급·주휴수당 계산기", seoTitle: "시급 월급 계산기 - 주휴수당 포함 (2026 최저시급 10,320원)", short: "시급 → 월급", emoji: "⏰", category: "급여",
    description: "시급과 주 근무시간을 넣으면 주휴수당 포함 주급·월급·연봉을 계산합니다. 2026년 최저시급 10,320원 기준, 주 15시간 미만 주휴수당 제외와 연장근로 1.5배까지 반영합니다.",
    keywords: ["주휴수당 계산기", "시급 월급 계산", "최저시급 2026", "알바 월급"] },
  { slug: "severance", title: "퇴직금 계산기", seoTitle: "퇴직금 계산기 - 평균임금·퇴직소득세 세후 금액까지", short: "퇴직금", emoji: "🎁", category: "급여",
    description: "입사일·퇴사일과 최근 3개월 급여, 상여금·연차수당을 넣으면 평균임금 기준 퇴직금과 퇴직소득세를 뺀 세후 수령액을 계산합니다. 1년 미만 근무 여부도 확인해 줍니다.",
    keywords: ["퇴직금 계산기", "퇴직금 계산 방법", "평균임금", "퇴직소득세"] },
  { slug: "loan", title: "대출 이자 계산기", seoTitle: "대출 이자 계산기 - 원리금균등·원금균등·만기일시 비교", short: "대출 이자", emoji: "🏦", category: "대출·부동산",
    description: "대출금·금리·기간을 넣으면 원리금균등, 원금균등, 만기일시 상환의 월 상환액과 총 이자를 한 번에 비교합니다. 회차별 상환 스케줄표와 거치기간도 지원합니다.",
    keywords: ["대출 이자 계산기", "원리금균등 계산", "주택담보대출 이자", "월 상환금"] },
  { slug: "rent", title: "전월세 전환 계산기", seoTitle: "전월세 전환 계산기 - 보증금↔월세 환산, 전환율 상한 안내", short: "전월세 전환", emoji: "🏠", category: "대출·부동산",
    description: "전세 보증금을 월세로, 월세를 전세로 환산합니다. 전환율을 넣어 보증금 조정 시 월세를 계산하고, 주택임대차보호법상 전환율 상한(기준금리+2%p)도 함께 확인하세요.",
    keywords: ["전월세 전환율", "전세 월세 계산", "보증금 월세 환산", "전월세전환 계산기"] },
  { slug: "vat", title: "부가세 계산기", seoTitle: "부가세 계산기 - 공급가액·세액·합계 역산 (10%)", short: "부가세", emoji: "🧾", category: "세금",
    description: "합계금액에서 공급가액과 부가세를 역산하거나, 공급가액에 부가세 10%를 더한 합계를 계산합니다. 세금계산서·견적서 작성용 원 단위 절사 옵션도 있습니다.",
    keywords: ["부가세 계산기", "부가가치세 계산", "공급가액 계산", "vat 계산"] },
  { slug: "compound", title: "예적금·복리 계산기", seoTitle: "적금 이자 계산기 - 예금·복리 세후 만기 수령액", short: "예적금 이자", emoji: "📈", category: "저축",
    description: "예금·적금의 단리·월복리 이자와 이자소득세 15.4%(비과세·세금우대 선택)를 뺀 세후 만기 수령액을 계산합니다. 월 납입액·기간·금리별로 비교해 보세요.",
    keywords: ["적금 이자 계산기", "복리 계산기", "예금 이자 계산", "세후 이자"] },
  { slug: "bmi", title: "BMI 계산기", seoTitle: "BMI 계산기 - 한국 기준 비만도·정상 체중 범위", short: "BMI", emoji: "⚖️", category: "생활",
    description: "키와 몸무게로 체질량지수(BMI)를 계산하고 대한비만학회 한국 기준(23 이상 과체중, 25 이상 비만)으로 판정합니다. 내 키의 정상 체중 범위도 함께 보여 줍니다.",
    keywords: ["bmi 계산기", "체질량지수", "정상 체중 계산", "비만도 계산"] },
  { slug: "dday", title: "D-day 계산기", seoTitle: "D-day 계산기 - 날짜 차이·며칠 남았는지·N일 후", short: "D-day", emoji: "📅", category: "생활",
    description: "오늘부터 특정 날짜까지 남은 일수(디데이), 두 날짜 사이 기간, N일 후·전 날짜를 계산합니다. 시험·전역일·출산 예정일·기념일 100일 계산에 쓰세요.",
    keywords: ["디데이 계산기", "날짜 계산기", "며칠 남았는지", "날짜 차이 계산"] },
];

export const CATEGORIES = [...new Set(CALCS.map((c) => c.category))];
export const getCalc = (slug: string) => CALCS.find((c) => c.slug === slug);
