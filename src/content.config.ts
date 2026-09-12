import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    calc: z.string().optional(), // 연관 계산기 slug
    products: z.array(z.string()).default([]), // 쿠팡 검색 키워드
  }),
});

export const collections = { blog };
