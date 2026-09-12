import { ADSENSE_CLIENT } from "../lib/monetize";
// 애드센스 승인 후 필요한 ads.txt. PUBLIC_ADSENSE_CLIENT가 설정되면 자동 생성됩니다.
export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = ADSENSE_CLIENT ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
