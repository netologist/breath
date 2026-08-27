# ADR-008: Single-language (English) theme scope and deferred i18n

## Status
Accepted

## Date
2026-08-27

## Context

The author operates two blogs: `hozgan.com` (Turkish, legacy/archive) and `netologist.org` (English, active engineering garden). As Breath is prepared for public distribution as an Astro template, the question arose whether to build full multi-language (i18n) support into the theme core or keep the theme single-language (English).

Full i18n was costed:
- Astro i18n configuration (`locales: ['en', 'tr']`, routing strategies).
- Splitting blog collections (`content/blog/{en,tr}/` or per-locale filtering) and rewriting ~8 page routes with `getStaticPaths` across locales.
- Locale-aware URL helpers replacing all internal `url('/blog/...')` callsites.
- UI string dictionary (~40 strings × 2 languages for sidebar, headers, stage labels, metadata).
- Per-locale RSS feeds and locale-aware date formatting.

Furthermore, bundling i18n into the theme template forces all downstream consumers to manage translation dictionaries and bilingual configuration from day one, unnecessarily complicating the starter experience.

## Decision

- **Theme v1 is strictly single-language (English):** The Breath theme ships with English UI strings and a clean, un-prefixed content directory layout (`content/blog/` and `content/notes/`).
- **No locale prefixing in URLs:** URLs remain `/blog/[slug]` and `/notes/[...slug]`.
- **Multi-site strategy over i18n monolith:** If the author or consumers wish to run a Turkish site and an English site, they can instantiate two template instances sharing the same theme core via git `upstream` remote (ADR-003).
- **Legacy content migration:** The legacy Turkish blog (`hozgan.com`) will remain as a static archive or have selected evergreen articles translated to English and published in the new garden.
- **Revisit trigger:** Re-evaluate built-in i18n only if downstream template users explicitly request bilingual site support as a primary feature.

## Consequences

- The `CONTENT_DIR` refactor (ADR-003) does not need locale subdirectory branching.
- Template consumers enjoy a minimalist, uncluttered setup experience with zero translation overhead.
- Total technical complexity in routing and template files is kept minimal.
