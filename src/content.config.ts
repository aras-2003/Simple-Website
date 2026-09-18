import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    locale: z.enum(['pl', 'en']),
    category: z.string().min(1),
    title: z.string().min(1),
    dek: z.string().min(1),
    order: z.number().int().positive(),
    publishedAt: z.coerce.date(),
    modifiedAt: z.coerce.date().optional(),
    sources: z.array(z.object({
      label: z.string().min(1),
      href: z.url(),
    })).min(1),
  }),
});

export const collections = { writing };
