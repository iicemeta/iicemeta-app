import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  // 支持两种模式：
  // 1. 直接放在 posts 目录下的 .md/.mdx 文件
  // 2. 文件夹内的 index.md/index.mdx（如 how-to-say-thank-you/index.md）
  loader: glob({
    pattern: ['*.md', '*.mdx', '**/index.md', '**/index.mdx'],
    base: './src/content/posts'
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    readingTime: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
