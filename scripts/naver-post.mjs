// naver/queue/*.json 중 아직 올리지 않은 글을 네이버 블로그 글쓰기 API로 발행합니다 (GitHub Actions에서 실행).
import fs from "node:fs";
import path from "node:path";

const { NAVER_CLIENT_ID: cid, NAVER_CLIENT_SECRET: csec, NAVER_REFRESH_TOKEN: rtok } = process.env;
if (!cid || !csec || !rtok) { console.log("네이버 시크릿 미설정: 건너뜀"); process.exit(0); }

const QUEUE = "naver/queue";
const POSTED = "naver/posted.json";
const posted = fs.existsSync(POSTED) ? JSON.parse(fs.readFileSync(POSTED, "utf8")) : [];
const only = process.env.ONLY_FILE; // 수동 실행 시 특정 파일만
const files = fs.readdirSync(QUEUE).filter((f) => f.endsWith(".json") && !posted.some((p) => p.file === f) && (!only || f === only)).sort();
if (files.length === 0) { console.log("발행할 글 없음"); process.exit(0); }

const tokenRes = await (await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${encodeURIComponent(cid)}&client_secret=${encodeURIComponent(csec)}&refresh_token=${encodeURIComponent(rtok)}`)).json();
if (!tokenRes.access_token) { console.error("토큰 갱신 실패:", tokenRes); process.exit(1); }

const MAX_PER_RUN = Number(process.env.MAX_PER_RUN || 1); // 하루 1편 원칙
let count = 0;
for (const f of files) {
  if (count >= MAX_PER_RUN) break;
  const post = JSON.parse(fs.readFileSync(path.join(QUEUE, f), "utf8"));
  const body = new URLSearchParams({ title: post.title, contents: post.html });
  const res = await fetch("https://openapi.naver.com/blog/writePost.json", {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenRes.access_token}`, "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body,
  });
  const text = await res.text();
  console.log(`[${f}] HTTP ${res.status} ${text.slice(0, 300)}`);
  if (res.status >= 400) process.exit(1);
  let info = {}; try { info = JSON.parse(text); } catch {}
  posted.push({ file: f, title: post.title, date: new Date().toISOString().slice(0, 10), result: info?.message?.result || info });
  count++;
}
fs.writeFileSync(POSTED, JSON.stringify(posted, null, 2) + "\n");
