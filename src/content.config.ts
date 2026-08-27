import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),   // tek kategori
    series: z.string().optional(),     // seri adı
    seriesOrder: z.number().optional(),// seri içi sıra
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    stage: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    private: z.boolean().default(false),
  }),
});

export const collections = { blog, notes };
