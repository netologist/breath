# ADR-001: Andy Matuschak–style stacked notes navigation with re-root

## Status
Accepted

## Date
2026-08-26

## Context

Breath's note pages (`/notes/[id]`) originally had two independent browsing
models bolted together:

1. A right-side drawer that fetched a linked note's HTML on click and previewed
   it in an overlay.
2. A later "stacked columns" iteration where the root note stayed fixed as the
   leftmost column and clicked notes were appended to the right via client-side
   fetch-and-inject.

The user asked for a browsing experience modeled on
[Andy Matuschak's evergreen notes](https://notes.andymatuschak.org):

- Clicking a note link should **re-root**: the clicked note becomes the primary
  (widest, rightmost) note and the previous notes shift left as a trail.
- Open notes should **collapse like an accordion** — thin vertical strips that
  slide left to reclaim space as the stack deepens.
- Columns should be **closeable from the middle** (✕) and reopenable.
- The initial page view must look like a **normal note page** until the user
  clicks a link — no stack chrome visible when there is no stack.
- External links should be **visible when clicked** (link preview), not silently
  navigate away.

Key constraint: Breath is a **fully static site** (`output: "static"`, deployed
to GitHub Pages). There is no server at request time, so query parameters such
as `?stackedNotes=...` cannot be read at build time and differ per visitor.

## Decision

Adopt a **server-rendered root + client-injected trail** architecture:

- The note page itself (`/notes/[id]`) is always the root and is rendered by
  Astro at build time — normal, SEO-friendly, and visually natural when visited
  without a stack.
- On page load, client-side JS reads `?stackedNotes=id1&id2&...` from the URL
  and injects those notes as **narrow columns to the LEFT of the root** by
  fetching each note's own static HTML page and extracting `article.note-article`.
- Clicking an internal note link performs a **real navigation** (enabled by
  Astro View Transitions for smooth column slide) to
  `/notes/{clicked}?stackedNotes={prevRoot}&{trail}`. The clicked note becomes
  the new server-rendered root; the trail is re-injected client-side. This is
  the "slides left" behavior.
- Closing a column (✕) removes it from the DOM **and** from the URL via
  `history.pushState` (no navigation); the browser Back button restores it.
- Collapsing (`‹`) shrinks a column to a 28px vertical strip labeled with the
  note title. **Auto-collapse**: when the trail reaches 4+ columns, the oldest
  columns automatically collapse to strips so the focus stays on the newest root.
- External links open a **link preview panel** showing an OpenGraph metadata
  card (title, description, hostname, favicon). Metadata is gathered at **build
  time** (GitHub Actions has network access) into a static `og-cache.json` —
  client-side fetching is impossible because most sites (github.com, medium.com,
  linkedin.com) send `X-Frame-Options: deny`/`SAMEORIGIN` or no CORS headers.

### Widths & layout

| Column | Width |
|---|---|
| Root (focused note) | ~620px |
| Trail columns | ~420px |
| Auto-collapsed (trail ≥ 4) | 28px strip |

Stacked mode only activates when the URL contains `stackedNotes` params; a bare
note page keeps the existing single-column layout with no collapse strips, no
body scroll lock, and no stack container. Mobile (≤768px) disables stacking
entirely — links navigate normally.

## Alternatives Considered

### Client-side fetch-and-inject with fixed root (previous implementation)
- Pros: No navigation, no full page reloads.
- Cons: Root never changes (contradicts re-root), URL cannot represent the
  focused note, columns append right instead of sliding left, and the stack
  chrome is visible even with an empty stack (violates the "natural first
  view" requirement).
- Rejected: It is the mirror image of the requested model and cannot express
  re-rooting.

### Server-side rendering of the full stack
- Pros: Stack columns arrive pre-rendered; no client fetch.
- Cons: Impossible on a static site — `?stackedNotes` is per-visitor and
  unknowable at build time. Pre-building every combination explodes
  combinatorially.
- Rejected: Architecture constraint, not a preference.

### iframe preview panel for external links
- Pros: Shows the actual page when embedding is allowed.
- Cons: github.com (`X-Frame-Options: deny`), medium.com and linkedin.com
  (`SAMEORIGIN`) — exactly the sites the user links — refuse to render.
  Degrades to a "Preview unavailable" dead end.
- Rejected: The preview would fail for the most important links.

### Client-side OG metadata fetching
- Pros: Always fresh, no build step.
- Cons: Most sites send no `Access-Control-Allow-Origin`, so browser fetches
  fail. Requires a proxy or API key.
- Rejected: Unreliable without external infrastructure.

## Consequences

- The note page stays fully crawlable/SEO-friendly; stacking is a progressive
  enhancement layered on top of normal navigation.
- Shared URLs are meaningful: `/notes/complexity?stackedNotes=garden` opens with
  `garden` as a trail column and `complexity` focused — exactly what the sender
  saw.
- Each click is a real navigation, so the browser Back/Forward buttons walk the
  trail naturally at no extra cost.
- New external links require a rebuild to refresh `og-cache.json` — acceptable
  because deploys already rebuild.
- The old right-side drawer and the fixed-root stacked implementation are
  removed; `NoteLayout.astro` owns the single stacked-notes engine.
