import type { NoteEntry } from '@/lib/notes';

export function tagsFromNotes(notes: NoteEntry[]): string[] {
  const set = new Set<string>();
  for (const n of notes) {
    for (const t of n.data.tags) {
      set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function notesByTag(notes: NoteEntry[], tag: string): NoteEntry[] {
  return notes.filter((n) => n.data.tags.includes(tag));
}

export function tagUrl(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}
