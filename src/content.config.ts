import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Optional display label only; URLs use the folder path under `notes/` (topics and sub-topics). */
    topic: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.string().url(),
    demo: z.string().url().optional(),
    tech: z.array(z.string()).optional().default([]),
    /** Relative to the project file, e.g. `./screenshot.png` */
    image: z.string().optional(),
    featured: z.boolean().default(false),
    pinnedOrder: z.number().optional(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { notes, projects };
