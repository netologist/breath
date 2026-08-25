import { getCollection } from 'astro:content';
import { buildBacklinks } from '../../utils/backlinks';

export async function GET() {
  const notes = await getCollection('notes');
  const backlinks = buildBacklinks();

  const data = notes.map(n => ({
    id: n.id,
    title: n.data.title,
    description: n.data.description ?? '',
    stage: n.data.stage,
    tags: n.data.tags ?? [],
    category: n.data.category ?? '',
    created: n.data.created.toISOString(),
    updated: n.data.updated ? n.data.updated.toISOString() : null,
    backlinks: backlinks[n.id] ?? [],
  }));

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
