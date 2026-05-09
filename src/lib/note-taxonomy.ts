/**
 * Note taxonomy — single place for URL ↔︎ filesystem rules (folder layout under `src/content/notes/`).
 *
 * OOD rationale:
 * - **SRP**: Only this module decides how an entry id maps to topic path + slug; pages never split strings ad hoc.
 * - **Open/closed**: New topics/sub-topics are new folders only; routing and filters extend without editing this API.
 * - **Encapsulation**: Callers use `parseNoteId`, `noteDetailPath`, `topicListingPath`, and filters — not raw segments.
 */

import type { CollectionEntry } from 'astro:content';

type NoteEntry = CollectionEntry<'notes'>;

export type ParsedNoteId = {
  /** All path segments under `notes/` except the note slug, e.g. `ml/deep-learning`. */
  topicPath: string;
  /** Final path segment (file stem or folder name before `/index`). */
  slug: string;
  segments: string[];
};

function normalizeSegments(id: string): string[] {
  let parts = id.split('/').filter(Boolean);
  if (parts.length && parts[parts.length - 1] === 'index') {
    parts = parts.slice(0, -1);
  }
  return parts;
}

/**
 * Parse collection entry id (path without extension) into topic path + slug.
 *
 * Rule: last segment = slug; everything before = topic path (supports arbitrary depth).
 * `thoughts/2026-05-09-welcome` → topicPath `thoughts`, slug `2026-05-09-welcome`
 * `ml/deep-learning/intro` → topicPath `ml/deep-learning`, slug `intro`
 * `interviews/ood-framework/index` (stored as `interviews/ood-framework`) → unchanged
 */
export function parseNoteId(id: string): ParsedNoteId {
  const segments = normalizeSegments(id);
  if (segments.length >= 2) {
    const slug = segments[segments.length - 1]!;
    const topicPath = segments.slice(0, -1).join('/');
    return { topicPath, slug, segments };
  }
  /** Single-segment ids (legacy / mistake): bucket under `thoughts`. */
  if (segments.length === 1) {
    return {
      topicPath: 'thoughts',
      slug: segments[0]!,
      segments: ['thoughts', segments[0]!],
    };
  }
  return { topicPath: 'thoughts', slug: 'invalid', segments: [] };
}

export function rootTopic(topicPath: string): string {
  const first = topicPath.split('/').filter(Boolean)[0];
  return first ?? 'thoughts';
}

/** URL path for a topic path (encode each segment for safe links). */
export function topicPathToUrlSegments(topicPath: string): string {
  return topicPath
    .split('/')
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join('/');
}

/** Decode `[...topic]` route param back to a filesystem topic path. */
export function decodeTopicPathParam(param: string | undefined): string {
  if (param == null || param === '') return '';
  return param
    .split('/')
    .filter((s) => s.length > 0)
    .map((s) => decodeURIComponent(s))
    .join('/');
}

export function topicListingPath(topicPath: string): string {
  const enc = topicPathToUrlSegments(topicPath);
  return enc ? `/notes/${enc}/` : '/notes/';
}

export function noteDetailPath(topicPath: string, slug: string): string {
  return `${topicListingPath(topicPath)}${encodeURIComponent(slug)}/`;
}

/**
 * Notes shown on `/notes/{filterPath}/`: exact topic match or any deeper sub-topic/post under that path.
 */
export function isNoteUnderTopicPath(noteTopicPath: string, filterPath: string): boolean {
  if (!filterPath) return true;
  if (noteTopicPath === filterPath) return true;
  return noteTopicPath.startsWith(`${filterPath}/`);
}

/** Every topic prefix that should appear in nav (parents + full paths). */
export function topicNavPrefixes(notes: readonly NoteEntry[]): string[] {
  const set = new Set<string>();
  for (const n of notes) {
    const { topicPath } = parseNoteId(n.id);
    const parts = topicPath.split('/').filter(Boolean);
    for (let i = 1; i <= parts.length; i++) {
      set.add(parts.slice(0, i).join('/'));
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function formatTopicPathDisplay(topicPath: string): string {
  return topicPath.split('/').filter(Boolean).join(' · ');
}

export type TopicCrumb = { label: string; href: string };

/** Breadcrumbs for a topic listing page (each ancestor is a link). */
export function topicBreadcrumbs(topicPath: string): TopicCrumb[] {
  const parts = topicPath.split('/').filter(Boolean);
  const out: TopicCrumb[] = [{ label: 'Notes', href: '/notes/' }];
  for (let i = 0; i < parts.length; i++) {
    const prefix = parts.slice(0, i + 1).join('/');
    out.push({
      label: parts[i]!,
      href: topicListingPath(prefix),
    });
  }
  return out;
}
