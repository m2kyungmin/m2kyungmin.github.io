// 네이버 블로그 글쓰기 API 최초 인증 (한 번만 실행). 사용자 터미널에서 실행하세요.
// 사용법: node scripts/naver-auth.mjs
// 흐름: Client ID/Secret 입력 → 인증 URL 열기 → 로그인·동의 → 리다이렉트된 주소 붙여넣기 → 토큰 교환 → GitHub 시크릿 저장
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const REPO = "m2kyungmin/m2kyungmin.github.io";
const REDIRECT = "https://mintech.ai.kr/naver-callback";
const rl = readline.createInterface({ input: stdin, output: stdout });

const clientId = (await rl.question("네이버 개발자센터 Client ID: ")).trim();
const clientSecret = (await rl.question("Client Secret: ")).trim();
const state = crypto.randomBytes(8).toString("hex");
const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(REDIRECT)}&state=${state}`;

console.log("\n1) 아래 주소를 Chrome(moneycalc5 로그인 상태)에서 여세요:\n\n" + authUrl + "\n");
try { execFileSync("open", [authUrl]); } catch {}
console.log("2) 로그인·동의 후 주소창이 https://mintech.ai.kr/naver-callback?code=... 로 바뀝니다(페이지는 404여도 정상).");
const pasted = (await rl.question("3) 그 주소창의 전체 URL을 붙여넣으세요: ")).trim();
rl.close();

const u = new URL(pasted);
const code = u.searchParams.get("code");
if (!code) { console.error("URL에 code 값이 없습니다."); process.exit(1); }
if (u.searchParams.get("state") !== state) { console.error("state 값이 다릅니다. 처음부터 다시 실행하세요."); process.exit(1); }

const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(code)}&state=${state}`;
const tok = await (await fetch(tokenUrl)).json();
if (!tok.refresh_token) { console.error("토큰 발급 실패:", tok); process.exit(1); }

// 발급 확인: 프로필 조회
const me = await (await fetch("https://openapi.naver.com/v1/nid/me", { headers: { Authorization: `Bearer ${tok.access_token}` } })).json();
console.log("\n인증된 네이버 계정:", me?.response?.id || me?.response?.email || "(확인 불가)");

for (const [k, v] of [["NAVER_CLIENT_ID", clientId], ["NAVER_CLIENT_SECRET", clientSecret], ["NAVER_REFRESH_TOKEN", tok.refresh_token]]) {
  execFileSync("gh", ["secret", "set", k, "-R", REPO, "--body", v], { stdio: ["ignore", "inherit", "inherit"] });
  console.log("GitHub 시크릿 저장:", k);
}
console.log("\n완료. 이제 Claude에게 '네이버 인증 끝'이라고 알려주세요.");
