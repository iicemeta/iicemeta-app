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

export type Photo = z.infer<typeof photoSchema>;

export const photosCollection = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/photos'
  }),
  schema: photoSchema,
});
