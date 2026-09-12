// 매일 실행되어 블로그 글 1편을 자동 생성합니다 (GitHub Actions cron).
// ANTHROPIC_API_KEY 가 없으면 아무것도 하지 않고 정상 종료합니다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const TOPICS_FILE = path.join(here, "topics.json");
const USED_FILE = path.join(here, "used-topics.json");
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5";
// 초기 부스트: 글이 BOOST_UNTIL_POSTS편에 도달하면 하루 1편으로 자동 복귀
const BOOST_UNTIL_POSTS = Number(process.env.BOOST_UNTIL_POSTS || 40);
const existingPosts = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).length : 0;
const POSTS_PER_RUN = existingPosts >= BOOST_UNTIL_POSTS ? 1 : Number(process.env.POSTS_PER_RUN || 1);
console.log(`현재 글 ${existingPosts}편 · 이번 실행 ${POSTS_PER_RUN}편 생성`);

if (!process.env.ANTHROPIC_API_KEY) {
  console.log("ANTHROPIC_API_KEY 미설정: 글 생성을 건너뜁니다.");
  process.exit(0);
}

const CALC_INFO = {
  salary: "연봉 실수령액 계산기 (/calc/salary)",
  hourly: "시급·주휴수당 계산기 (/calc/hourly)",
  severance: "퇴직금 계산기 (/calc/severance)",
  loan: "대출 이자 계산기 (/calc/loan)",
  rent: "전월세 전환 계산기 (/calc/rent)",
  vat: "부가세 계산기 (/calc/vat)",
  compound: "예적금·복리 계산기 (/calc/compound)",
  bmi: "BMI 계산기 (/calc/bmi)",
  dday: "D-day 계산기 (/calc/dday)",
};

const readJson = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : d);
const topics = readJson(TOPICS_FILE, {});
const used = readJson(USED_FILE, []);

const client = new Anthropic();

const PostSchema = z.object({
  title: z.string().describe("검색 의도를 담은 한국어 제목, 40자 이내"),
  description: z.string().describe("메타 설명, 80~120자"),
  slug: z.string().describe("영문 소문자와 하이픈만 사용한 URL 슬러그, 3~6단어"),
  tags: z.array(z.string()).describe("핵심 키워드 3~5개"),
  products: z.array(z.string()).describe("이 글 독자가 실제로 구매할 만한 관련 상품의 쿠팡 검색어 2~3개. 없으면 빈 배열"),
  body_markdown: z.string().describe("본문 마크다운. H1 없이 H2/H3부터 시작"),
});

const SYSTEM = `당신은 한국의 생활 금융 정보 블로그 '머니계산기'의 전문 필진입니다.
독자는 금융 지식이 많지 않은 20~40대 직장인·프리랜서·자영업자입니다.

작성 원칙:
- 검색 유입을 목표로 하되, 사람이 읽고 실제로 도움을 받는 글이어야 합니다. 키워드 반복이나 뻔한 서론은 금지.
- 첫 문단에서 결론(핵심 숫자나 답)을 먼저 제시하고, 그 다음 근거와 계산 과정을 설명합니다.
- 구체적인 계산 예시를 마크다운 표로 최소 1개 포함합니다. 숫자는 명시한 가정(세율, 요율 등)에 근거해 직접 계산하고, 가정을 본문에 밝힙니다.
- 확실하지 않은 통계·수치·법령 개정 사항은 만들어내지 말고, "정확한 수치는 공식 기관(국세청, 고용노동부 등) 확인 권장"처럼 안내합니다.
- 2026년 기준 제도로 작성하되, 매년 바뀌는 값(최저시급, 보험요율 등)은 "2026년 기준"이라고 명시합니다.
- 본문 중간과 끝에서 관련 계산기 링크를 자연스럽게 안내합니다. 링크는 상대 경로(/calc/...)로 씁니다.
- 분량 1,800~2,800자(공백 포함). H2 3~5개, 필요 시 H3. 마지막 H2는 '정리' 또는 'FAQ'.
- 존댓말(~합니다체). 이모지 사용 금지. 과장·낚시성 표현 금지.
- 투자 권유나 특정 금융상품 추천은 하지 않습니다.`;

function pickTopic() {
  // 계산기별 사용 횟수가 가장 적은 카테고리를 우선해서 균형 있게 발행
  const counts = Object.fromEntries(Object.keys(topics).map((k) => [k, 0]));
  for (const u of used) if (u.calc in counts) counts[u.calc]++;
  const order = Object.keys(topics).sort((a, b) => counts[a] - counts[b]);
  for (const calc of order) {
    const t = topics[calc].find((title) => !used.some((u) => u.title === title));
    if (t) return { calc, title: t };
  }
  return null;
}

async function replenishTopics() {
  console.log("주제 은행이 비어 새 주제를 생성합니다.");
  const Schema = z.object({ topics: z.record(z.string(), z.array(z.string())) });
  const res = await client.messages.parse({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{
      role: "user",
      content: `다음 계산기 각각에 대해 아직 다루지 않은, 검색 수요가 있는 블로그 글 주제를 5개씩 제안하세요.\n계산기: ${JSON.stringify(CALC_INFO)}\n이미 쓴 제목: ${JSON.stringify(used.map((u) => u.title))}\n키는 계산기 slug, 값은 제목 배열인 JSON으로 답하세요.`,
    }],
    output_config: { format: zodOutputFormat(Schema) },
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) throw new Error("주제 생성 실패");
  for (const [calc, list] of Object.entries(res.parsed_output.topics)) {
    if (!(calc in CALC_INFO)) continue;
    topics[calc] = [...(topics[calc] || []), ...list];
  }
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2) + "\n");
}

function uniqueFilename(date, slug) {
  const base = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "post";
  let name = `${date}-${base}`;
  let i = 2;
  while (fs.existsSync(path.join(BLOG_DIR, `${name}.md`))) name = `${date}-${base}-${i++}`;
  return name;
}

async function writePost({ calc, title }) {
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  const date = kst.toISOString().slice(0, 10);
  console.log(`[${MODEL}] 생성 중: ${title}`);

  const res = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{
      role: "user",
      content: `주제: "${title}"\n연관 계산기: ${CALC_INFO[calc]}\n오늘 날짜: ${date}\n\n이 주제로 글을 작성하세요.`,
    }],
    output_config: { format: zodOutputFormat(PostSchema) },
  });

  if (res.stop_reason === "refusal") {
    console.warn("모델이 이 주제를 거부했습니다. 주제를 사용 처리하고 건너뜁니다:", res.stop_details?.explanation);
    return false;
  }
  const post = res.parsed_output;
  if (!post) throw new Error("응답 파싱 실패");

  const fm = {
    title: post.title,
    description: post.description,
    pubDate: date,
    tags: post.tags,
    calc,
    products: post.products,
  };
  const yaml = Object.entries(fm)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  const name = uniqueFilename(date, post.slug);
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, `${name}.md`), `---\n${yaml}\n---\n\n${post.body_markdown.trim()}\n`);
  console.log(`저장: src/content/blog/${name}.md (input ${res.usage.input_tokens} / output ${res.usage.output_tokens} tokens)`);
  return true;
}

for (let i = 0; i < POSTS_PER_RUN; i++) {
  let topic = pickTopic();
  if (!topic) {
    await replenishTopics();
    topic = pickTopic();
    if (!topic) break;
  }
  try {
    await writePost(topic);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) { console.error("요청 한도 초과, 다음 실행에 재시도합니다."); process.exit(0); }
    if (err instanceof Anthropic.AuthenticationError) { console.error("API 키가 올바르지 않습니다."); process.exit(1); }
    throw err;
  }
  used.push({ ...topic, date: new Date().toISOString().slice(0, 10) });
  fs.writeFileSync(USED_FILE, JSON.stringify(used, null, 2) + "\n");
}
