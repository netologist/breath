# 🌿 Breath — Minimalist Digital Garden & Engineering Blog

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-FF5D01.svg?style=flat-square&logo=astro)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/netologist/breath/actions/workflows/github-pages.yml/badge.svg)](https://github.com/netologist/breath/actions/workflows/github-pages.yml)

**Breath** is a minimalist, hyper-fast **Digital Garden & Engineering Blog** template for [Astro](https://astro.build).

Designed for software engineers, systems thinkers, and technical writers who want to combine structured long-form essays with an evolving associative knowledge base.

---

## ✨ Highlights

- **🌱 4-Stage Note Lifecycle:** Evolve ideas across a clear maturity ladder (`📥 Captured` → `🌱 Seedling` → `🌿 Budding` → `🌲 Evergreen`).
- **🔒 Auth-Gated Private Notes:** Protect raw research and personal notes behind Cloudflare Pages HTTP Basic Auth (`/notes/private/*`), while keeping the rest of your garden public.
- **📂 Clean Content Separation:** Your content lives in root `content/` outside `src/` (gitignored), while the theme ships with self-seeding `example-content/` for effortless upstream template updates.
- **📚 Andy Matuschak Stacked Notes:** Click note links to slide new notes in horizontally as an accordion (`‹`), collapse side-strips, and navigate history via URL sync.
- **🔗 Recursive Bi-directional Wikilinks & Backlinks:** Write `[[note-id]]` or `[[note-id|Custom Label]]` with automatic recursive resolution across subdirectories and build-time safety warnings against leaking private links in public posts.
- **🖼️ Rich Embeds & Link Previews:** Automatic responsive 16:9 YouTube embeds, native X/Twitter embed widgets, and floating OpenGraph hover cards for external URLs.
- **🔍 Instant Zero-Dependency Search:** Ultra-fast client-side search across titles, descriptions, and tags.
- **📐 Documented ADRs:** All architectural decisions (stacked notes, content separation, private notes, LLM-Wiki boundaries) are documented in [`docs/decisions/`](docs/decisions/).

---

## 🚀 Quick Start

Breath is distributed as a **GitHub Template Repository**.

### 1. Create your repository

Click **"Use this template"** on GitHub or clone the repository:

```bash
git clone https://github.com/netologist/breath.git my-garden
cd my-garden
```

### 2. Set up Upstream Remote (for seamless theme updates)

```bash
git remote rename origin upstream
git remote add origin https://github.com/your-username/my-garden.git
git push -u origin main
```

### 3. Install & Start

```bash
npm install
npm run dev
```

> **Automatic Content Seeding:** On first run, `scripts/seed-content.mjs` automatically populates root `content/` from `example-content/`. Your local `content/` directory is gitignored so upstream theme updates (`git pull upstream main`) will never overwrite your personal notes!

Visit `http://localhost:4321` in your browser.

---

## 📂 Project Structure

```text
├── content/                  # Your site content (gitignored by default)
│   ├── blog/                 # Public blog articles (.md / .mdx)
│   └── notes/                # Public garden notes (.md / .mdx)
│       └── private/          # Private / captured notes (auth-gated)
├── example-content/          # Tracked demo content for fresh clones
├── docs/
│   ├── decisions/            # Architecture Decision Records (ADR-001 to ADR-008)
│   └── tech-debt.md          # Technical debt & open decision registry
├── functions/
│   └── private/
│       └── _middleware.js    # Cloudflare Pages Basic Auth middleware
├── .github/workflows/
│   ├── github-pages.yml      # GitHub Pages deployment workflow (active)
│   └── cloudflare.yml.disabled # Cloudflare Pages deployment workflow (optional)
├── public/
│   ├── avatar.svg            # Profile avatar
│   └── favicon.svg           # Site favicon
├── src/
│   ├── content.config.ts     # Content collections schema (Astro Content Layer)
│   ├── components/           # UI components (Sidebar, Popover, etc.)
│   ├── layouts/              # BaseLayout, BlogLayout, NoteLayout
│   ├── pages/                # File-based routes (blog, notes, tags, categories)
│   ├── plugins/              # remark-wikilinks, rehype-embeds
│   ├── styles/               # CSS tokens, typography, and global styles
│   └── utils/                # backlinks, content-dir, notes, date, url
└── astro.config.mjs
```

---

## ✍️ Content Authoring

### Writing Blog Posts (`content/blog/my-post.md`)

```markdown
---
title: "Building Resilient Distributed Systems"
description: "Patterns for high-availability Raft state machines and consensus."
date: 2026-08-27
updated: 2026-08-28
tags: ["distributed-systems", "raft", "go"]
category: "engineering"
series: "Distributed Systems"
seriesOrder: 1
draft: false
---

Blog posts support full Markdown, code formatting, responsive embeds, and [[wikilinks]].
```

### Writing Garden Notes (`content/notes/my-note.md`)

```markdown
---
title: "Abstractions Should Hide Complexity"
description: "Deep modules provide powerful functionality through narrow interfaces."
stage: evergreen        # captured | seedling | budding | evergreen
tags: ["architecture", "design-patterns"]
category: "architecture"
para: resources         # projects | areas | resources | archives (optional)
created: 2026-08-27
---

Notes can link to other notes seamlessly with `[[note-slug]]` or `[[note-slug|Custom Label]]`.
```

### Writing Private / Captured Notes (`content/notes/private/my-capture.md`)

```markdown
---
title: "AI Research Capture: Byzantine Faults"
description: "Raw capture exploring consensus under untrusted node assumptions."
stage: captured         # captured notes are automatically private
para: resources
source: "Claude 3.7 research session"
tags: ["consensus", "byzantine"]
created: 2026-08-27
private: true
---

Private notes live in `content/notes/private/` and are excluded from all public listings.
On Cloudflare Pages, accessing `/notes/private/*` requires HTTP Basic Auth.
```

---

## 🔒 Private Notes Setup (Cloudflare Pages)

Breath includes zero-config HTTP Basic Auth for Cloudflare Pages:

1. **Pages Function:** `functions/private/_middleware.js` intercepts requests to `/notes/private/*`.
2. **Environment Variables:** Set credentials in Cloudflare dashboard (**Settings → Variables and Secrets**):
   - `AUTH_USER` (default: `admin`)
   - `AUTH_PASSWORD` (default: `changeme` — **rotate before going live!**)
   - `AUTH_REALM` (default: `Private Notes`)
3. **Pipeline:** Enable `.github/workflows/cloudflare.yml.disabled` by renaming it to `cloudflare.yml` and configuring GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME`, `AUTH_USER`, `AUTH_PASSWORD`).

For full details, read [`content/notes/cloudflare-private-notes.md`](content/notes/cloudflare-private-notes.md).

---

## 🤖 LLM-Wiki & AI Agent Guidelines

If you use AI coding tools (Claude Code, Cursor, Aider) or knowledge graph tools like **Graphify**:

- Run `/graphify` locally to build an index in `graphify-out/`.
- `graphify-out/` is gitignored and is never deployed with the site.
- AI subagents consult `AGENTS.md` to guarantee that references and titles from private captures never leak into public blog posts.

---

## 📐 Architecture Decision Records (ADRs)

Key architectural decisions are documented in [`docs/decisions/`](docs/decisions/):

- [ADR-001](docs/decisions/ADR-001-stacked-notes.md): Andy Matuschak Stacked Notes navigation model
- [ADR-002](docs/decisions/ADR-002-external-links-embeds.md): External Link Previews & Media Embeds
- [ADR-003](docs/decisions/ADR-003-theme-distribution-content-separation.md): GitHub Template Distribution & Content Directory Separation
- [ADR-004](docs/decisions/ADR-004-private-notes-auth-gated.md): Single-Build Auth-Gated Private Notes Architecture
- [ADR-005](docs/decisions/ADR-005-link-preview-v2.md): Link Preview Popover & Media Embed Architecture
- [ADR-006](docs/decisions/ADR-006-note-content-model.md): Note Content Model (Captured Stage, PARA, Provenance)
- [ADR-007](docs/decisions/ADR-007-llm-wiki-local-graph.md): LLM-Wiki Local Knowledge Graph with Privacy Boundary
- [ADR-008](docs/decisions/ADR-008-single-language-theme-scope.md): Single-Language Theme Scope & Deferred i18n

---

## 🚢 Deployment

### GitHub Pages (Default)

The repository ships with `.github/workflows/github-pages.yml` active:
1. In your GitHub repo: **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` — your site builds and deploys automatically.

### Cloudflare Pages (with Private Notes Auth)

1. Connect your repository to Cloudflare Pages (Preset: **Astro**, Build: `npm run build`, Output: `dist`).
2. Add secrets `AUTH_USER` and `AUTH_PASSWORD`.
3. Enable `.github/workflows/cloudflare.yml.disabled` (rename to `.yml`).

---

## 📄 License

MIT © [Breath Contributors](LICENSE)
