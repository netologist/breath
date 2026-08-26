# Breath

A minimalist Astro digital garden and engineering blog. Long-form essays (blog)
live alongside an interlinked knowledge garden (notes) where thoughts mature
from seedlings to evergreens.

## Language

**Note**:
A single evergreen-style page in the digital garden, stored under
`src/content/notes/`. Notes link to each other and to blog posts.
_Avoid_: page, entry

**Post**:
A long-form essay under `src/content/blog/`. Chronologically ordered, belongs
to categories and optional series.
_Avoid_: article, writing

**Root (note)**:
The note currently rendered as the page itself — server-rendered, SEO-friendly,
and the widest column when a stack is open.
_Avoid_: primary, main note

**Trail**:
The ordered list of notes to the LEFT of the root, encoded in the URL as
repeated `?stackedNotes=` parameters. The trail is client-injected.
_Avoid_: history, stack queue

**Stacked note**:
A trail column showing a previously-visited note, injectable/collapsible/
closeable.
_Avoid_: drawer note

**Collapse / Collapsed column**:
Shrinking a column to a 28px vertical strip labeled with its title.
_Avoid_: minimize

**External link**:
A link pointing outside the site (absolute `http(s)://` URL). Identified by a
small ↗ indicator and opens the link preview panel on click.
_Avoid_: outbound link, outlink

**Internal link**:
A link within the site — to a note (`/notes/…`), a post (`/blog/…`), or any
other site page. Rendered plainly with no indicator.
_Avoid_: inbound link

**Link preview panel**:
The slide-in panel showing an OpenGraph metadata card (title, description,
image, hostname) for a clicked external link. Fed by the build-time
`og-cache.json`.
_Avoid_: link preview drawer, external panel

**Embedded link**:
A platform link (YouTube/X) that renders as an embed. The link itself stays
clickable beneath the embed but carries no ↗ indicator — the embed is the
indicator.
_Avoid_: widget link
