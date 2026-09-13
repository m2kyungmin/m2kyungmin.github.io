// 링크프라이스 등 고단가 제휴 광고 배치 설정.
// 링크프라이스에서 머천트 승인 후 "링크 생성"으로 받은 URL을 그대로 url 에 넣으면 해당 페이지에 카드가 표시됩니다.
// url 이 비어 있는 항목은 렌더링되지 않습니다.
export type Offer = {
  id: string;
  name: string;      // 광고주/상품명 (예: "OO카드 신규 발급")
  desc: string;      // 한 줄 설명 (혜택 요약, 과장 금지)
  cta: string;       // 버튼 문구 (예: "카드 비교하기")
  url: string;       // 링크프라이스에서 생성한 제휴 링크 전체
  calcs: string[];   // 표시할 계산기 slug: salary | hourly | severance | loan | rent | vat | compound | bmi | dday
};

export const LINKPRICE_ID = "A100707690";

export const OFFERS: Offer[] = [
  // 예시 (승인 후 값 채우기):
  // { id: "card-a", name: "OO카드 신규 발급", desc: "연회비 1만원, 첫 달 최대 5만원 캐시백", cta: "카드 혜택 보기", url: "https://click.linkprice.com/click.php?m=...&a=A100707690&l=...", calcs: ["salary", "hourly"] },
];

export const offersFor = (calc?: string) => (calc ? OFFERS.filter((o) => o.url && o.calcs.includes(calc)) : []);
