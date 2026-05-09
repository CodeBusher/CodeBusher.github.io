import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

/** `leetmate/index` → `leetmate`; `tool.md` id → `tool` */
export function projectSlugFromId(id: string): string {
  return id.replace(/\/index$/, '');
}

export function projectDetailUrl(entry: ProjectEntry): string {
  return `/projects/${projectSlugFromId(entry.id)}/`;
}

export function projectHasDetailPage(entry: ProjectEntry): boolean {
  if ((entry.body ?? '').trim().length > 0) return true;
  const html = entry.rendered?.html ?? '';
  return html.replace(/<[^>]+>/g, '').trim().length > 0;
}

export function projectCardHref(entry: ProjectEntry): string {
  return projectHasDetailPage(entry)
    ? projectDetailUrl(entry)
    : entry.data.repo;
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const all = await getCollection('projects');
  return [...all].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function featuredProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return projects
    .filter((p) => p.data.featured)
    .sort((a, b) => {
      const ao = a.data.pinnedOrder ?? 999;
      const bo = b.data.pinnedOrder ?? 999;
      if (ao !== bo) return ao - bo;
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    });
}
