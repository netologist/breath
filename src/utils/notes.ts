/**
 * Shared predicates for note visibility.
 *
 * A note is **private** when its frontmatter says so (`private: true`).
 * Private notes are:
 *  - excluded from every public listing surface (index, tags, categories,
 *    search API, tag clouds, OG cache scan);
 *  - still built as static pages under `/notes/private/...` so they can be
 *    served behind an auth wall (see the Cloudflare guide note).
 */
export function isPrivateNote(note: { id: string; data: { private?: boolean } }): boolean {
  return note.data.private === true;
}
