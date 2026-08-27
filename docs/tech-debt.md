# Technical Debt & Open Decisions

Tracking intentional trade-offs and decisions still open. Add entries when a
decision is made with a known future cost; keep the "Open decisions" section
for things explicitly parked.

## Decided debt

### 1. Theme distribution is a GitHub template (npm package deferred)
**Decision (2026-08-27):** Distribute Breath as a GitHub template repo
(Option A). Users clone/fork, add an `upstream` remote, and update via
`git pull upstream main`.
**Debt:** No `npm install` story. Converting to an npm package + Astro
integration (Starlight model) would give clean `npm update` but requires
layouts/components to resolve the consumer's Content Directory from integration
options. Revisit if template demand grows. **Revisit when:** a second theme
repo or install-based users appear.

### 2. Five hardcoded content paths → single `CONTENT_DIR` source
**Decision (2026-08-27):** Content moves out of `src/` to the Content
Directory (`CONTENT_DIR` env, default `content/`).
**Debt:** Until refactored, these consumers read `src/content/...` directly:
- `src/content.config.ts` (glob base ×2)
- `src/plugins/remark-wikilinks.mjs`
- `src/utils/backlinks.ts`
- `scripts/build-og-cache.mjs`

All must be unified behind one shared module reading `process.env.CONTENT_DIR`.

### 3. Vestigial drawer code in `notes/index.astro`
The old "click to open in side panel" drawer (`#note-drawer`,
`#note-drawer-backdrop`, `loadNoteIntoDrawer`) predates the stacked-notes
accordion model (ADR-001) and is dead. Remove it and its CSS/JS when touching
that page.

## Open decisions (parked by the author)

- **i18n / single vs multiple blogs — DEFERRED (2026-08-27).** Two blogs:
  `hozgan.com` (Turkish, legacy — possibly no new content) and
  `netologist.org` (English, new). Full single-repo i18n was costed and
  deferred: it does **not** complicate the notes/wikilink layer (the language
  split would be blog-only), but it still costs ~2–3 days of theme work plus
  permanent translation maintenance:
  - Astro i18n config (`locales: ['en','tr']`, routing strategy) — small
  - Blog content split `content/blog/{en,tr}/` + `getStaticPaths` locale loop
    in ~8 page files — medium
  - Locale-aware URL helper replacing every `url('/blog/...')` call — medium
  - UI string dictionary (~40 strings × 2, sidebar/layouts/pages) — medium
  - Per-locale RSS + locale-aware date formatting — small
  Also: i18n in the theme would impose translation maintenance on every
  template user, delaying theme distribution.
  **Revisit triggers:** the author commits to continued Turkish writing.
  **Options when revisited:** (A) single English site + `hozgan.com` as a
  static archive, migrating only evergreen posts; (C) two sites sharing the
  theme (template + upstream, ADR-003); (B) full i18n in one repo.
  Does **not** change ADR-003's Content Directory layout — no locale
  subdirectories needed either way.

## Decided (2026-08-27) — private notes & pipelines

- **Private notes architecture (T3):** single build, auth-gated path (Option A).
  Notes marked `private: true` under `content/notes/private/` are excluded from
  all public surfaces but still built at `/notes/private/{slug}/`.
- **Personal blog hosting:** private GitHub repo + Cloudflare Pages deploy.
  GitHub Pages is kept as the theme's default/active pipeline; Cloudflare is
  the personal blog's path (the only one that can enforce HTTP auth).
- **Pipeline split:** `.github/workflows/github-pages.yml` is ACTIVE;
  `.github/workflows/cloudflare.yml.disabled` is shipped disabled (rename to
  `cloudflare.yml` to enable). Only one should run per push.
 - **Auth mechanism — RESOLVED:** Pages Function
   (`functions/private/_middleware.js`) implemented (2026-08-27). Standalone
   Worker remains a documented drop-in alternative in the guide note.

## Pending implementation (decided 2026-08-27, not yet coded)

Ordered by dependency; #1 and #2 are independent of each other.

1. **CONTENT_DIR refactor (ADR-003).** Move content from `src/content/` to the
   Content Directory (`CONTENT_DIR`, default `content/`); unify the five
   hardcoded consumers behind one shared module; add `example-content/` +
   idempotent seed script (`predev`/`prebuild`); gitignore `content/`; update
   README.
2. **Notes schema (ADR-006).** Add `captured` to the stage enum (ladder:
   captured → seedling → budding → evergreen), `para`
   (`projects|areas|resources|archives`), and `source` (optional string);
   `isPrivateNote` treats `stage: captured` as private; UI stage
   label/badge for `captured`; example captured note in example content.
3. **Wikilinks recursive + private-aware (ADR-007).** Recursive note map;
   public → private/captured links emit a build warning.
4. **AGENTS.md + graphify workflow doc (ADR-007).** Agent rule: public output
   must not carry links to private/captured notes; document the local
   Graphify workflow (gitignored, never deployed) in the guide.
5. **Dead drawer cleanup.** Remove the vestigial `#note-drawer` /
   `#note-drawer-backdrop` / `loadNoteIntoDrawer` code in
   `src/pages/notes/index.astro` (see Decided debt #3).
6. **README update.** Document private notes, captured workflow, pipelines
   (`github-pages.yml` active, `cloudflare.yml.disabled`), and the default
   credentials for the template audience.
