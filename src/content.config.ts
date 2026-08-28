import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { contentDirName } from './utils/content-dir.mjs';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${contentDirName}/blog` }),
  schema: z.object({
    title: z.string().default('Untitled Post'),
    description: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),   // tek kategori
    series: z.string().optional(),     // seri adı
    seriesOrder: z.number().optional(),// seri içi sıra
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${contentDirName}/notes` }),
  schema: z.object({
    title: z.string().default('Untitled Note'),
    description: z.string().optional(),
    stage: z.enum(['captured', 'seedling', 'budding', 'evergreen']).default('seedling'),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    para: z.enum(['projects', 'areas', 'resources', 'archives']).optional(),
    source: z.string().optional(),
    created: z.coerce.date().default(() => new Date()),
    updated: z.coerce.date().optional(),
    private: z.boolean().default(false),
  }),
});

export const collections = { blog, notes };
