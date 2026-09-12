# 머니계산기 (money-calc)

한국어 생활·금융 계산기 사이트 + Claude가 매일 글을 자동 발행하는 블로그.
GitHub Pages에 무료로 자동 배포되며, 광고(애드센스/애드핏)와 제휴(쿠팡 파트너스)로 수익을 냅니다.

- 사이트: https://m2kyungmin.github.io
- 스택: Astro 7 (정적 빌드) · GitHub Actions · Anthropic SDK

## 어떻게 돈이 되나

| 수익원 | 방식 | 필요한 것 |
|---|---|---|
| Google AdSense | 계산기·글 페이지 상단/하단 광고 | 애드센스 계정 승인 + `PUBLIC_ADSENSE_*` 변수 |
| 카카오 애드핏 | 애드센스 승인 전 대체 광고 | 애드핏 계정 + `PUBLIC_ADFIT_UNIT` |
| 쿠팡 파트너스 | 글/계산기 하단 관련 상품 링크 | 파트너스 계정 + `PUBLIC_COUPANG_ID` |

트래픽은 검색 유입(계산기 키워드 + 매일 쌓이는 롱테일 글)으로 확보합니다. 값이 비어 있으면 광고·제휴 요소는 렌더링되지 않으므로, 계정이 준비되는 대로 변수만 넣으면 됩니다.

## 자동으로 돌아가는 것

1. **배포**: `main`에 푸시되면 `.github/workflows/deploy.yml`이 빌드해 GitHub Pages에 올립니다.
2. **글 발행**: 매일 09:30 KST에 `.github/workflows/generate.yml`이 `scripts/generate-post.mjs`를 실행해 Claude로 글 1편을 생성하고 커밋한 뒤 배포를 트리거합니다.
   - 주제는 `scripts/topics.json`에서 계산기별로 균형 있게 꺼내 쓰고, `scripts/used-topics.json`에 기록합니다.
   - 주제가 소진되면 Claude가 새 주제를 만들어 `topics.json`에 채워 넣습니다.
3. **SEO**: sitemap, RSS, robots.txt, ads.txt, Open Graph, JSON-LD(WebApplication/FAQ/Article)가 자동 생성됩니다.

## 사람이 한 번만 해야 하는 것 (계정 관련)

### 1. Anthropic API 키 등록 (글 자동 생성)
GitHub 저장소 → Settings → Secrets and variables → Actions → **Secrets** → `ANTHROPIC_API_KEY`.
키가 없으면 워크플로는 조용히 건너뜁니다. 기본 모델은 `claude-opus-5`이며, 비용을 줄이려면 **Variables**에 `CLAUDE_MODEL=claude-sonnet-5`를 추가합니다. 글 1편당 대략 입력 2K·출력 4K 토큰 수준입니다.

### 2. 검색엔진 등록 (트래픽의 시작)
- Google Search Console: 속성 추가 → HTML 태그 인증 코드를 Variables `PUBLIC_GOOGLE_VERIFY`에 → 사이트맵 `https://m2kyungmin.github.io/sitemap-index.xml` 제출
- 네이버 서치어드바이저: 동일하게 `PUBLIC_NAVER_VERIFY` → 사이트맵/RSS 제출

### 3. 수익화 계정 (승인되는 대로)
- **쿠팡 파트너스**(가장 빠름, 즉시 승인): AF로 시작하는 ID를 `PUBLIC_COUPANG_ID`에. 파트너스 대시보드의 검색 링크 형식이 다르면 `src/lib/monetize.ts`의 `coupangSearchUrl`만 수정.
- **카카오 애드핏**: 광고단위 ID를 `PUBLIC_ADFIT_UNIT`에.
- **Google AdSense**: 승인 후 `PUBLIC_ADSENSE_CLIENT`(ca-pub-…), `PUBLIC_ADSENSE_SLOT_TOP`, `PUBLIC_ADSENSE_SLOT_BOTTOM`.
- (선택) Google Analytics: `PUBLIC_GA_ID`.

### 4. 커스텀 도메인 (강력 권장)
애드센스는 `github.io` 서브도메인 사이트를 승인하지 않는 경우가 많습니다. 도메인(연 1~2만원)을 사서 저장소 Settings → Pages → Custom domain에 연결하고, Variables `SITE_URL`을 새 주소로 바꾸면 끝입니다. `public/robots.txt`의 Sitemap 주소도 함께 바꿔 주세요.

변수를 바꾼 뒤에는 Actions 탭에서 "Deploy to GitHub Pages"를 수동 실행하거나 아무 커밋이나 푸시하면 반영됩니다.

## 로컬 개발

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ 생성
ANTHROPIC_API_KEY=sk-... npm run generate   # 글 1편 생성 테스트
```

## 구조

```
src/lib/site.ts          계산기 목록(제목·설명·키워드) — 새 계산기는 여기에 등록
src/lib/monetize.ts      광고·제휴 설정
src/pages/calc/*.astro   계산기 페이지 (클라이언트 JS)
src/components/CalcShell 계산기 공통 레이아웃(FAQ, JSON-LD, 광고, 관련 글)
src/content/blog/*.md    블로그 글 (자동 생성 결과가 여기에 쌓임)
scripts/generate-post.mjs  Claude 글 생성 스크립트
scripts/topics.json      주제 은행
```

## 매년 갱신할 값

- `src/pages/calc/salary.astro` 상단 `R` 상수(4대보험 요율), 세율 구간
- `src/pages/calc/hourly.astro` 최저시급
- `src/pages/calc/rent.astro` 전월세 전환율 기본값

## 면책

계산 결과는 참고용 추정치입니다. 특정 금융상품 추천이나 투자 권유를 하지 않으며, 자동 생성 글도 같은 원칙으로 작성되도록 프롬프트에 명시되어 있습니다.
