import { getCollection, type CollectionEntry } from 'astro:content';
import {
  formatTopicPathDisplay,
  noteDetailPath,
  parseNoteId,
  topicListingPath,
  topicNavPrefixes,
  isNoteUnderTopicPath,
} from '@/lib/note-taxonomy';

export type NoteEntry = CollectionEntry<'notes'>;

export {
  parseNoteId,
  topicListingPath,
  topicNavPrefixes,
  isNoteUnderTopicPath,
  formatTopicPathDisplay,
  topicBreadcrumbs,
} from '@/lib/note-taxonomy';
export type { ParsedNoteId, TopicCrumb } from '@/lib/note-taxonomy';

export function noteUrl(entry: NoteEntry): string {
  const { topicPath, slug } = parseNoteId(entry.id);
  return noteDetailPath(topicPath, slug);
}

/** Topic listing URL for this note's topic path. */
export function noteTopicListingUrl(entry: NoteEntry): string {
  return topicListingPath(parseNoteId(entry.id).topicPath);
}

/**
 * Short label for listings: optional frontmatter `topic` overrides display only
 * (filesystem path remains the source of truth for URLs).
 */
export function topicOf(entry: NoteEntry): string {
  if (entry.data.topic) return entry.data.topic;
  return formatTopicPathDisplay(parseNoteId(entry.id).topicPath);
}

export async function getPublishedNotes(): Promise<NoteEntry[]> {
  const all = await getCollection('notes');
  return all.filter((e) => !e.data.draft);
}

export function sortNotesByDateDesc(notes: NoteEntry[]): NoteEntry[] {
  return [...notes].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
