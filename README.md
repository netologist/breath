# 🌿 Breath — Minimalist Digital Garden & Engineering Blog

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-FF5D01.svg?style=flat-square&logo=astro)](https://astro.build)
[![Obsidian Ready](https://img.shields.io/badge/Obsidian-Ready%20Vault-7C3AED.svg?style=flat-square&logo=obsidian)](https://obsidian.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/netologist/breath/actions/workflows/github-pages.yml/badge.svg)](https://github.com/netologist/breath/actions/workflows/github-pages.yml)

**Breath** is a minimalist, hyper-fast **Digital Garden & Engineering Blog** template for [Astro 5+](https://astro.build) with native, zero-setup **Obsidian Vault** integration.

Designed for software engineers, systems thinkers, and technical writers who want to seamlessly combine structured long-form essays with an evolving associative knowledge garden.

---

## ✨ Highlights

- **🌱 4-Stage Note Maturity Ladder:** Evolve ideas across a structured growth cycle (`📥 Captured` → `🌱 Seedling` → `🌿 Budding` → `🌲 Evergreen`).
- **🔮 Native Obsidian Vault:** Open this repository directly in [Obsidian](https://obsidian.md) as a fully configured vault with pre-configured `[[wikilinks]]`, templates, and digital garden property badges.
- **⚙️ Centralized Configuration (`src/site.config.ts`):** Single typed configuration file for your full name, nickname (`a.k.a @...`), avatar, bio, dynamic social links, and sidebar navigation.
- **📚 Andy Matuschak Stacked Notes (Desktop):** Click note links to slide new notes in horizontally as smooth accordion columns (`‹`), collapse side-strips, and sync state in URL query parameters.
- **📱 100% Mobile Responsive:** Clean direct page navigation on mobile, full-screen slide-out TOC and navigation drawers, and touch-optimized list items.
- **⚡ Zero-FOUT Self-Hosted Typography:** Bundled `Yanone Kaffeesatz` & `JetBrains Mono` with `<head>` preloading and `font-display: block` for instant, shift-free first-frame rendering.
- **🔒 Auth-Gated Private Notes:** Protect raw research and personal notes behind Cloudflare Pages HTTP Basic Auth (`/notes/private/*`), while keeping the rest of your garden public.
- **📂 Clean Content Separation:** Your personal content lives in root `content/` outside `src/` (gitignored), while the theme ships with self-seeding `example-content/` for effortless upstream template updates.
- **🔗 Recursive Bi-directional Wikilinks & Backlinks:** Write `[[note-id]]` or `[[note-id|Custom Label]]` with automatic recursive resolution across subdirectories and build-time safety warnings against leaking private links in public posts.
- **🔍 Instant Zero-Dependency Search & Sort:** Real-time search across titles, descriptions, and tags with top-corner `Updated` / `Created` timeline sorting.
- **🖼️ Rich Embeds & Link Previews:** Automatic responsive 16:9 YouTube embeds, native X/Twitter embed widgets, and floating OpenGraph hover cards for external URLs.

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

## 🔮 Native Obsidian Integration

You can open this project directory directly in **Obsidian** as an out-of-the-box digital garden vault:

1. Open **Obsidian** → Click **"Open folder as vault"**.
2. Select your `breath` project folder.
3. Everything is pre-configured and ready:
   - **`[[Wikilinks]]` Auto-Completion:** Typing `[[` auto-suggests notes and links them cleanly.
   - **Visual Growth Badges:** Frontmatter properties render colored badges for `stage` (`🌱 seedling`, `🌿 budding`, `🌲 evergreen`, `📥 captured`).
   - **Attachment Routing:** Drag-and-dropped images automatically save to `public/images/`.
   - **Pre-configured Templates (`Ctrl/Cmd + T`):**
     - `new-note.md` — Standard seedling note
     - `new-evergreen.md` — Deep reference note
     - `new-blog-post.md` — Blog article
     - `new-capture.md` — Private research capture

---

## ⚙️ Configuration (`src/site.config.ts`)

Customize author identity, navigation links, social icons, and site metadata in `src/site.config.ts`:

```typescript
export const siteConfig = {
  // Author & Identity
  author: {
    name: 'John Doe',
    nickname: 'johndoe',          // Rendered as "a.k.a @johndoe"
    avatar: '/avatar.svg',
    bio: 'Engineer, tinkerer, and systems thinker.',
  },

  // Social Links in Sidebar (SVG icons rendered automatically)
  social: [
    { platform: 'github',   href: 'https://github.com/your-name', label: 'GitHub' },
    { platform: 'linkedin', href: 'https://linkedin.com/in/your-name', label: 'LinkedIn' },
    { platform: 'x',        href: 'https://x.com/your-handle', label: 'X / Twitter' },
    { platform: 'rss',      href: '/rss.xml', label: 'RSS Feed' },
  ],

  // Sidebar Navigation Items
  nav: [
    { href: '/about',      label: 'about' },
    { href: '/blog',       label: 'posts' },
    { href: '/notes',      label: 'notes' },
    { href: '/categories', label: 'categories' },
    { href: '/series',     label: 'series' },
    { href: '/tags',       label: 'tags' },
    { href: '/archive',    label: 'archive' },
  ],

  // Source Repository Link
  sourceLink: {
    href: 'https://github.com/your-username/my-garden',
    label: 'github repo',
  },

  // Site Metadata
  site: {
    title: 'Breath',
    description: 'A minimalist digital garden and engineering blog.',
    url: 'https://your-domain.com',
  },
};
```

---

## 📂 Project Structure

```text
├── .obsidian/                # Obsidian vault configuration, templates & CSS snippets
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
├── public/
│   ├── fonts/                # Self-hosted woff2 font files
│   ├── images/               # Image attachments (used by Obsidian & Astro)
│   ├── avatar.svg            # Profile avatar
│   └── favicon.svg           # Site favicon
├── src/
│   ├── site.config.ts        # Centralized site & author configuration
│   ├── content.config.ts     # Content collections schema (Astro Content Layer)
│   ├── components/           # UI components (Sidebar, Popovers, etc.)
│   ├── layouts/              # BaseLayout, BlogLayout, NoteLayout
│   ├── pages/                # File-based routes (blog, notes, tags, categories)
│   ├── plugins/              # remark-wikilinks, rehype-embeds
│   └── styles/               # CSS variables, typography, and global layout
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
updated: 2026-08-28
---

Notes can link to other notes seamlessly with `[[note-slug]]` or `[[note-slug|Custom Label]]`.
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
