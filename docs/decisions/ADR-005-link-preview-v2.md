# ADR-005: Link preview v2 — hover popover and auto-fit media embeds

## Status
Accepted (partially supersedes ADR-002: the side preview panel and the X iframe embed)

## Date
2026-08-27

## Context

ADR-002 introduced a full-screen side panel for external-link previews and
iframe-based embeds. Two problems surfaced in use:

1. The side panel interrupts reading flow when triggered from a link inside a
   sentence — a heavyweight modal for a lightweight question.
2. YouTube embeds left the raw URL paragraph above the video; X/Twitter
   iframes had a fixed min-height causing internal scrollbars or dead space.

## Decision

- **Hover popover:** external links inside prose stay normal inline links
  (open in a new tab). Hovering shows a small floating card near the link with
  favicon, hostname, OG title, description, and thumbnail from the build-time
  `og-cache.json`. The side panel markup and script are removed.
- **YouTube embeds:** a standalone YouTube link paragraph is replaced entirely
  by the 16:9 iframe embed (no duplicate URL text above the video).
- **X/Twitter embeds:** a standalone X link is replaced by the official
  `blockquote.twitter-tweet` widget; `widgets.js` renders an auto-sized card
  that fits the tweet exactly (no scrollbars, no dead space), with a graceful
  quote fallback when JavaScript is off or blocked.
- The OG cache scanner skips code-fenced URLs so documentation examples are
  not fetched (they would otherwise pollute the cache with placeholder hosts).

## Alternatives Considered

### Keep the side panel, fix placement only
- Rejected: still interrupts reading; the hover popover is strictly less
  intrusive and matches the digital-garden reading model.

### Twitter iframe + postMessage auto-resize
- Pros: keeps the iframe pattern.
- Cons: more moving parts than the official widget; no no-JS fallback.
- Rejected.

## Consequences

- `BaseLayout.astro` owns the popover + link marking; the stacked-notes engine
  in `NoteLayout.astro` is unchanged.
- `og-cache.json` remains the single metadata source for inline link previews.
- The X widget and popover are progressive enhancements; content degrades to
  plain links without JS.
