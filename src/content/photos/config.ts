import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const photoSchema = z.object({
  title: z.string(),
  date: z.date(),
  location: z.string().optional(),
  camera: z.string().optional(),
  film: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string(),
  mood: z.enum(['joy', 'calm', 'nostalgic', 'melancholy', 'excited', 'peaceful']).default('calm'),
});

// 使用 zod 的 infer 类型工具
export type Photo = import('astro:schema').infer<typeof photoSchema>;

export const photosCollection = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/photos'
  }),
  schema: photoSchema,
});
