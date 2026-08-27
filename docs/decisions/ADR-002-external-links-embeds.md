# ADR-002: External link indicators, site-wide link preview, and media embeds

## Status
Accepted — partially superseded by ADR-005 (side preview panel → hover popover;
X/Twitter iframe embed → official widget)

## Date
2026-08-26

## Context

ADR-001 introduced a link preview panel for external links, but only on note
pages (`NoteLayout.astro`). The user wants three refinements:

1. **Link-type visibility at a glance** — external and internal links should be
   distinguishable immediately, without hovering.
2. **Site-wide link preview** — the external-link preview panel should work on
   every page (posts, notes, listing pages, about), not just notes.
3. **Media embeds** — pasting a YouTube or X/Twitter link into markdown should
   render an embed, not just a link.

Constraints: the site is fully static (`output: "static"`, GitHub Pages). There
is no server at request time; build-time tooling must do the heavy lifting.
Most external sites refuse iframe embedding (`X-Frame-Options`), so embeds are
only viable for platforms that allow it (YouTube, X).

## Decision

### 1. External link indicator (↗)

A global client-side script marks every external link with an ↗ indicator:

- On page load, JS finds all `a[href^="http"]` whose host differs from the
  site's own host and adds `class="ext-link"`.
- CSS renders the arrow via `.ext-link::after { content: "↗" }`.
- Links that are media embeds (see below) are excluded — the embed itself is
  the indicator.

Chosen over build-time injection because it requires zero template changes and
covers sidebar/footer/header links automatically. SEO impact: none (purely
visual, content already in HTML).

### 2. Site-wide link preview panel

The preview panel (HTML + script + styles) moves from `NoteLayout.astro` into
`BaseLayout.astro`, which every page already uses:

- One shared `#ext-panel` instance and one shared script handle external-link
  clicks on all pages.
- Clicking an external link opens the OG metadata card fed by the build-time
  `og-cache.json` (already site-wide; only the panel was note-scoped).
- `NoteLayout.astro` keeps its stacked-notes engine but stops owning the panel;
  it reuses the shared one.
- Internal note links still re-root/stack; external links open the panel.

### 3. Media embeds (YouTube, X/Twitter)

A new build-time rehype plugin (`src/plugins/rehype-embeds.mjs`) transforms
standalone platform links into embeds:

- **Trigger**: a markdown paragraph whose entire content is a single link to a
  supported platform (YouTube `youtube.com/watch`, `youtu.be`, `youtube.com/embed`;
  X `x.com/…/status/…`, `twitter.com/…/status/…`). Inline links inside prose are
  untouched.
- **Output**: the original link is preserved (clickable, opens externally) and
  an embed block is inserted beneath it:
  - YouTube → `<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID">`
    (privacy-enhanced, no X-Frame-Options problem).
  - X → `<iframe src="https://platform.twitter.com/embed/Tweet.html?id=TWEET_ID">`.
- Embeds carry `loading="lazy"`, `title`, and a fixed 16:9 aspect ratio wrapper
  via CSS.
- Build-time (not client-side) because it keeps embeds in the HTML for SEO and
  no-JS users, matching the existing wikilink plugin pattern.

## Alternatives Considered

### ↗ icon at build time (rehype + template edits)
- Pros: Works without JS.
- Cons: Requires touching every template (Sidebar, BaseLayout, blog layouts);
  embed exclusion needs plugin coordination.
- Rejected: The global client-side pass is one file and covers everything.

### Pure CSS `::after` on `a[href^="http"]`
- Pros: Zero JS.
- Cons: Cannot exclude embedded links (they would get an arrow too) and cannot
  distinguish same-site absolute links from external ones reliably.
- Rejected: Lacks the embed-exclusion logic the user explicitly chose.

### Client-side embed conversion
- Pros: No build changes.
- Cons: No SEO, no no-JS rendering; duplicates the platform-link detection
  logic in the browser.
- Rejected: Build-time matches the existing remark-wikilinks plugin pattern and
  the static-site constraint.

## Consequences

- `BaseLayout.astro` gains a small script + panel markup; every page gets the
  preview behavior for free.
- `og-cache.json` remains the single source of external-link metadata, refreshed
  at build time.
- New embeds require a rebuild (already the deploy flow).
- The ↗ indicator appears on sidebar/footer links too (user's explicit choice).
- Note pages: external links open the shared panel; internal note links keep
  the re-root stacking behavior from ADR-001.
