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

- **Single vs multiple blogs / multi-language (i18n):** the author runs two
  blogs and is weighing consolidation into one vs multi-language support.
  Affects the Content Directory layout (e.g. per-locale subdirectories) and
  whether the theme ships i18n routing. Parked — revisit before restructuring
  content.

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
- **Auth mechanism — PENDING:** Pages Function (`functions/private/_middleware.js`)
  vs standalone Worker. Both support password rotation via Cloudflare secrets
  (no code/deploy change); recommendation is the Pages Function. Blocks the
  guide note + middleware file.
