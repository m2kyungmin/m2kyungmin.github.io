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

const lp = (m: string) => `https://click.linkprice.com/click.php?m=${m}&a=${LINKPRICE_ID}&l=0000`;

export const OFFERS: Offer[] = [
  { id: "mycredit1", name: "NICE지키미 신용점수 조회", desc: "NICE평가정보의 신용점수·신용정보 조회 서비스. 대출 신청 전 내 점수를 먼저 확인해 보세요.", cta: "신용점수 확인하기", url: lp("mycredit1"), calcs: ["loan", "rent"] },
  { id: "allcredit", name: "올크레딧 신용점수 조회", desc: "KCB(코리아크레딧뷰로) 기준 신용점수 조회·관리 서비스. 은행마다 다른 기준을 함께 확인할 때 유용합니다.", cta: "KCB 점수 확인하기", url: lp("allcredit"), calcs: ["loan", "rent"] },
  { id: "barobill", name: "바로빌 전자세금계산서", desc: "사업자·프리랜서용 전자세금계산서 발급·관리 서비스. 부가세 신고 자료를 한곳에서 정리할 수 있습니다.", cta: "서비스 알아보기", url: lp("barobill"), calcs: ["vat"] },
  { id: "signgate", name: "한국정보인증 공동인증서", desc: "세금계산서 발급과 홈택스 신고에 필요한 사업자용 공동인증서(범용) 발급.", cta: "인증서 발급 안내", url: lp("signgate"), calcs: ["vat"] },
];

export const offersFor = (calc?: string) => (calc ? OFFERS.filter((o) => o.url && o.calcs.includes(calc)) : []);
