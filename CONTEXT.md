# Context — Breath Theme

This glossary captures the domain language of the Breath project. Glossary only —
no implementation details, no specs.

## Terms

- **Breath** — the Astro digital garden & engineering blog theme.
- **Site Owner** — the person who uses Breath for their own blog (as opposed to
  the theme author shipping the template).
- **Theme Repo** — the Breath repository itself, distributed as a GitHub template.
- **Site Repo** — a Site Owner's repository that uses Breath (fork/copy with an
  `upstream` remote pointing at the Theme Repo).
- **Site Content** — the Site Owner's own notes and posts. Lives **outside**
  `src/`, in the Content Directory. Never tracked by the Theme Repo, never
  touched by upstream updates.
- **Example Content** — demo content shipped inside the Theme Repo under
  `example-content/`. Seeded into the Content Directory on first build if the
  directory is absent, so the theme can demo itself and new sites start with
  working examples.
- **Content Directory** — where Site Content lives. Selected via the
  `CONTENT_DIR` environment variable; defaults to `content/`.
- **Upstream Update** — pulling theme changes from the Theme Repo via the
  `upstream` git remote. Safe because the Content Directory is gitignored.
- **Stacked Notes** — the Andy Matuschak–style accordion navigation for notes
  (see ADR-001).
- **Embed** — a build-time replacement of a standalone YouTube/X link with a
  media player (see ADR-002).
- 
   for external links (see ADR-002).
- **Private Note** — a note hidden from every public listing surface (notes
  index, tags, categories, search API, backlinks, OG cache). It is still built
  as a static page under `/notes/private/...` so an auth wall can serve it.
  The enforcement mechanism (Cloudflare Pages Function vs standalone Worker)
  is under selection.

## Open terms (not yet resolved)

- **Captured Note** — a note in the `captured` stage: raw, unprocessed content
  (typically AI-generated) kept for research before distillation. Captured
  notes are private by default (auth-gated, see ADR-004) and live under
  `content/notes/private/`. They carry an optional `source` string recording
  provenance (LLM, URL, or document).
- **Distillation** — the author's manual process of turning Captured Notes into
  mature notes/documents (CODE: Capture → Organize → Distill → Express).
- **PARA** — the organizing scheme applied as an optional frontmatter field
  (`para: projects | areas | resources | archives`), orthogonal to the topical
  `category` and the lifecycle `stage`.
- **Draft** — content excluded from the public build. Exists for **posts**
  (schema + all surfaces filter it). Notes deliberately do **not** have drafts:
  private/public is sufficient.
- **LLM-Wiki** — the author's personal workflow: a **local** Graphify knowledge
  graph over the site content (indexed incl. private/captured notes), queried
  by AI agents to generate research captures. The graph is gitignored and never
  deployed (privacy boundary, see ADR-007).
