import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedNotes, noteUrl, sortNotesByDateDesc } from '@/lib/notes';
import { site } from '@/site.config';

export async function GET(context: APIContext) {
  const notes = sortNotesByDateDesc(await getPublishedNotes());
  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? new URL('https://example.invalid'),
    items: notes.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: noteUrl(post),
    })),
    customData: `<language>en-us</language>`,
  });
}
