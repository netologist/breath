# ADR-004: Private notes — single build with an auth-gated path

## Status
Accepted

## Date
2026-08-27

## Context

The author wants private notes on the theme: notes that exist for the author
but are not publicly readable. The site is fully static (GitHub Pages by
default). GitHub Pages cannot enforce HTTP authentication — any static file it
serves is public. The author also wants to rotate the access password from time
to time without code changes.

## Decision

- **Content contract:** a note is private when its frontmatter says
  `private: true`; it must live under `content/notes/private/`. It is still
  built as a static page at `/notes/private/{slug}/` (the notes route is a
  rest parameter, `[...slug]`), but it is excluded from every public surface:
  notes index, tag and category pages, blog tag pages, the search API
  (`/api/notes.json`), backlinks, and the OG cache scan.
- **Enforcement:** HTTP Basic Auth at the edge. A Cloudflare Pages Function
  (`functions/private/_middleware.js`) gates `/notes/private/*` and returns
  401 without a valid `Authorization: Basic` header.
- **Credentials & rotation:** username/password/realm come from Cloudflare
  secrets (`AUTH_USER`, `AUTH_PASSWORD`, `AUTH_REALM`) — never from the repo.
  Rotation is a dashboard edit or `wrangler pages secret put`, no code change,
  no redeploy. The theme documents defaults (`admin` / `changeme`) as
  placeholders only.
- **Pipelines:** `.github/workflows/github-pages.yml` remains the ACTIVE
  pipeline. `.github/workflows/cloudflare.yml.disabled` is shipped disabled
  (rename to `cloudflare.yml` to enable) with all parameters
  (`workflow_dispatch` inputs + secrets); Wrangler deploys the prebuilt `dist`
  with `--functions=functions`. Only one pipeline should be active per repo.

## Alternatives Considered

### Separate private build / second site
- Pros: hard isolation of artifacts.
- Cons: two content sources, two deploys; wikilinks between public and private
  notes break.
- Rejected.

### Standalone Cloudflare Worker gate
- Pros: auth logic lives outside the site repo; can gate multiple sites.
- Cons: extra routing/infrastructure; identical rotation story to the Pages
  Function.
- Documented in the guide note as a drop-in alternative.

### GitHub Pages + client-side "obscurity" (unlisted links, no auth)
- Pros: zero infrastructure.
- Cons: no real protection; the author explicitly wanted HTTP auth.
- Rejected.

## Consequences

- Private HTML is present in the deployed artifact; the edge middleware is the
  enforcement boundary. Owners should keep their Git repo private as a second
  layer.
- A private note deployed only via the GitHub Pages pipeline is public (no
  auth there) — the guide note warns about this.
- Public pages can link to private notes; the link renders but leads to the
  auth wall.
- The author's personal blog moves to a private repo deployed on Cloudflare
  Pages (recorded in docs/tech-debt.md).
