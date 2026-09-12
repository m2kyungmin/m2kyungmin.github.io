import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// SITE_URL은 배포 환경 변수로 덮어쓸 수 있습니다 (커스텀 도메인 연결 시).
const site = process.env.SITE_URL || "https://mintech.ai.kr";

export default defineConfig({
  site,
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [sitemap()],
});
