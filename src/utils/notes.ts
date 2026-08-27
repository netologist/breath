/**
 * Shared predicates and constants for note visibility and lifecycle stages.
 *
 * A note is **private** when:
 *  - `private: true` in frontmatter, OR
 *  - `stage: 'captured'` (ADR-006: captured notes are private by default), OR
 *  - id begins with `private/`
 *
 * Private notes are:
 *  - excluded from every public listing surface (index, tags, categories,
 *    search API, tag clouds, OG cache scan);
 *  - still built as static pages under `/notes/private/...` so they can be
 *    served behind an auth wall (see the Cloudflare guide note).
 */

export type NoteStage = 'captured' | 'seedling' | 'budding' | 'evergreen';

export const stageOrder: Record<string, number> = {
  evergreen: 0,
  budding: 1,
  seedling: 2,
  captured: 3,
};

export const stageLabel: Record<string, string> = {
  captured: '📥 Captured',
  seedling: '🌱 Seedling',
  budding: '🌿 Budding',
  evergreen: '🌲 Evergreen',
};

export const stageSectionLabel: Record<string, string> = {
  evergreen: '🌲 Evergreen Notes',
  budding: '🌿 Budding Ideas',
  seedling: '🌱 Seedling Thoughts',
  captured: '📥 Captured Research',
};

export const stageCls: Record<string, string> = {
  captured: 'stage-captured',
  seedling: 'stage-seedling',
  budding: 'stage-budding',
  evergreen: 'stage-evergreen',
};

export function isPrivateNote(note: { id: string; data: { private?: boolean; stage?: string } }): boolean {
  return note.data.private === true || note.data.stage === 'captured' || note.id.startsWith('private/');
}
