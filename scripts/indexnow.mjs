// 배포 후 IndexNow(네이버·빙 등)에 새/변경 URL을 제출합니다.
// 사용: node scripts/indexnow.mjs <sitemap-url> [--all | --changed <file-list-path>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const keyFile = fs.readdirSync(path.join(here, "../public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.log("IndexNow 키 파일 없음, 건너뜀"); process.exit(0); }
const key = keyFile.replace(".txt", "");
const site = (process.env.SITE_URL || "https://mintech.ai.kr").replace(/\/$/, "");
const host = new URL(site).host;
const mode = process.argv.includes("--all") ? "all" : "changed";

async function sitemapUrls() {
  const idx = await (await fetch(`${site}/sitemap-index.xml`)).text();
  const maps = [...idx.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const m of maps) {
    const xml = await (await fetch(m)).text();
    urls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((x) => x[1]));
  }
  return urls;
}

// 변경된 소스 파일 목록 → URL. 페이지/레이아웃/라이브러리가 바뀌면 전체 제출.
function urlsFromChanged(files) {
  const urls = new Set();
  let all = false;
  for (const f of files) {
    const m = f.match(/^src\/content\/blog\/(.+)\.md$/);
    if (m) { urls.add(`${site}/blog/${m[1]}`); urls.add(`${site}/blog`); urls.add(`${site}/`); continue; }
    if (/^src\/(pages|layouts|components|lib)\//.test(f) || /^public\//.test(f)) all = true;
  }
  return { urls: [...urls], all };
}

let urls;
if (mode === "all") urls = await sitemapUrls();
else {
  const listPath = process.argv[process.argv.indexOf("--changed") + 1];
  const files = fs.existsSync(listPath) ? fs.readFileSync(listPath, "utf8").split("\n").filter(Boolean) : [];
  const r = urlsFromChanged(files);
  urls = r.all ? await sitemapUrls() : r.urls;
}
urls = [...new Set(urls)].filter((u) => u.startsWith(site)).slice(0, 10000);
if (urls.length === 0) { console.log("제출할 URL 없음"); process.exit(0); }

// 배포 직후에는 키 파일이 아직 CDN에 전파되지 않아 403이 날 수 있어 재시도합니다.
const body = JSON.stringify({ host, key, keyLocation: `${site}/${key}.txt`, urlList: urls });
for (let attempt = 1; attempt <= 6; attempt++) {
  const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body });
  console.log(`IndexNow 제출 ${urls.length}개 URL → HTTP ${res.status} (시도 ${attempt})`);
  if (res.status < 400) process.exit(0);
  if (attempt === 6) { console.error(await res.text()); process.exit(1); }
  await new Promise((r) => setTimeout(r, 60000));
}
