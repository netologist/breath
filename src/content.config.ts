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

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${contentDirName}/projects` }),
  schema: z.object({
    title: z.string().default('Untitled Project'),
    description: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
    repo: z.string().optional(),
    status: z.enum(['active', 'completed', 'wip', 'archived']).default('active'),
    featured: z.boolean().default(false),
    role: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${contentDirName}/talks` }),
  schema: z.object({
    title: z.string().default('Untitled Talk'),
    description: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
    slidesUrl: z.string().optional(),
    event: z.string().optional(),
    location: z.string().optional(),
    language: z.string().default('en'),
    featured: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${contentDirName}/publications` }),
  schema: z.object({
    title: z.string().default('Untitled Publication'),
    description: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
    pdfUrl: z.string().optional(),
    venue: z.string().optional(),
    authors: z.array(z.string()).default([]),
    doi: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, notes, projects, talks, publications };

