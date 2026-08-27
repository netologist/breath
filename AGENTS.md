## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Content Model & Privacy Rules for AI Agents

When authoring or modifying content in this digital garden, AI agents MUST follow these strict rules:

### 1. Note Lifecycle & Growth Stages

The digital garden follows a 4-stage maturity ladder:
- **`stage: captured`** — Raw, unorganized AI research captures or brainstorms. Stored in `content/notes/private/`. Private by default.
- **`stage: seedling`** — Initial thoughts, verified concepts, or early drafts.
- **`stage: budding`** — Growing, interconnected ideas with supporting references and backlinks.
- **`stage: evergreen`** — Mature, polished mental models or reference documents.

### 2. Privacy Boundary (Strict Rule)

- Notes in `content/notes/private/` or marked `private: true` or `stage: 'captured'` are **private**.
- **NEVER** link (`[[wikilink]]` or markdown link) to private or captured notes from any **public** post (`content/blog/`) or public note (`content/notes/*.md`).
- Wikilinks between private notes (private ↔ private) are allowed.
- Distillation: When turning captured research into a public note, extract the verified concepts into a new public seedling note rather than publishing raw capture files directly.

### 3. Local Knowledge Graph (Graphify / LLM-Wiki)

- Knowledge graphs generated via Graphify (`graphify-out/`) are local authoring aids and are gitignored.
- Agents querying local graphs may see private notes, but MUST NOT leak private titles or excerpts into public posts or public notes.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
