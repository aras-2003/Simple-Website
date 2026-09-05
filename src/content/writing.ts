import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../lib/site';

export type WritingEntry = CollectionEntry<'writing'>;

export async function getWriting(locale: Locale): Promise<WritingEntry[]> {
  const entries = await getCollection('writing', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getWritingEntry(locale: Locale, slug: string): Promise<WritingEntry | undefined> {
  const entries = await getWriting(locale);
  return entries.find((entry) => entry.data.slug === slug);
}
