import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),                          // ISO date e.g. "2026-05-01"
    author: z.string().default('Guus Langelaar'),
    excerpt: z.string(),
    readingTime: z.number(),                   // minutes
  }),
})

export const collections = { blog }
