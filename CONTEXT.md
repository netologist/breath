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

- **Captured Note** — raw, unprocessed content (including AI-generated) kept as
  a capture before distillation. Mechanism under discussion.
- **Draft** — content excluded from the public build; already exists for posts,
  planned for notes.
