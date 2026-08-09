import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const ctf = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ctf' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    event: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const leetcode = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leetcode' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    problemNumber: z.number(),
    problemUrl: z.string().url(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.array(z.string()).default([]),
    timeComplexity: z.string().optional(),
    spaceComplexity: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, ctf, leetcode, projects };