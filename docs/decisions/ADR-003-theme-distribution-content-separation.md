# ADR-003: Theme distribution as GitHub template with content outside the source tree

## Status
Accepted

## Date
2026-08-27

## Context

The theme is to be shared publicly. Two requirements conflict with the naive
"fork the repo and edit content in place" model:

1. The theme repo must ship **example content** so new users see a working
   garden and the theme can demo itself.
2. A site owner's **own content must never be overwritten** by upstream theme
   updates.

The site is an Astro static site; content currently lives inside `src/content/`
with five hardcoded path references (content config, wikilinks plugin,
backlinks util, OG cache script).

## Decision

- **Distribution:** GitHub template repo. Site owners fork/copy the theme and
  keep an `upstream` remote; updates arrive via `git pull upstream main`.
- **Content separation:** Site Content lives outside `src/` in the Content
  Directory, selected by the `CONTENT_DIR` environment variable, defaulting to
  `content/`. The five hardcoded path references are unified behind one shared
  module reading `process.env.CONTENT_DIR`.
- **Example content:** tracked in the theme repo under `example-content/`.
  `content/` is gitignored in site repos. A seed script copies
  `example-content/` → `content/` only when `content/` is absent (idempotent),
  wired into `predev`/`prebuild` so the theme's own demo build and new site
  builds both work with zero manual steps.
- **npm package:** deferred (see Alternatives).

## Alternatives Considered

### Content stays in `src/content` (AstroPaper model)
- Pros: no refactor.
- Cons: upstream pulls overwrite or collide with the owner's content — exactly
  the failure mode this decision avoids.
- Rejected.

### npm package + Astro integration (Starlight model)
- Pros: `npm update`; content never touched by updates.
- Cons: every layout/component must resolve the consumer's Content Directory
  from integration options; a substantial refactor.
- Deferred until template demand justifies it (tracked in docs/tech-debt.md).

## Consequences

- `git pull upstream` may still conflict if the owner customizes theme files —
  acceptable; the Content Directory itself is never at risk.
- Fresh clones build out of the box (auto-seed).
- The CONTENT_DIR refactor is pending work; until it lands, the five consumers
  still read `src/content/...` (tracked in docs/tech-debt.md).
