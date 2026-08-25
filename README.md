# 🌿 Breath — Minimalist Digital Garden & Engineering Blog

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-FF5D01.svg?style=flat-square&logo=astro)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/netologist/breath/actions/workflows/deploy.yml/badge.svg)](https://github.com/netologist/breath/actions/workflows/deploy.yml)

**Breath** is a clean, hyper-fast, and minimalist **Digital Garden & Engineering Blog** theme for [Astro](https://astro.build).

It blends long-form structured essays with an associative knowledge garden where thoughts evolve from rough seedlings into polished evergreen notes.

---

## ✨ Features

- **🌱 Digital Garden Architecture:** Classify notes by growth maturity (`🌱 Seedling` → `🌿 Budding` → `🌲 Evergreen`).
- **🔗 Bi-directional Wikilinks:** Connect notes using intuitive `[[note-slug]]` or `[[note-slug|Custom Label]]` syntax.
- **📑 Stacked Note Drawer Previews:** Click any internal note link to preview it in an Andy Matuschak-style slide-over panel without losing reading context.
- **📖 Interactive Table of Contents:** Maggie Appleton-style sticky TOC on desktop with active scrollspy highlight, transforming into a smooth full-screen drawer on mobile.
- **🔍 Instant Client-side Search:** Fast, zero-dependency search across titles, descriptions, and tags.
- **📱 100% Mobile Responsive:** Optimized top bar and off-canvas drawers for both navigation and table of contents.
- **⚡ Zero JS Framework Overhead:** 100% pure Astro and vanilla TypeScript for maximum performance and lightweight assets.
- **✒️ Distinctive Typography:** Powered by *Yanone Kaffeesatz* for headers/body and *JetBrains Mono* for code blocks.
- **🚀 One-click GitHub Pages Deployment:** Built-in GitHub Actions workflow ready for instant deployment.
- **📡 Built-in RSS Feed:** Auto-generated `/rss.xml` for all blog posts.

---

## 🚀 Quick Start

### 1. Clone or Fork the Repository

```bash
git clone https://github.com/netologist/breath.git my-garden
cd my-garden
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Local Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` in your browser.

---

## 📂 Project Structure

```text
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions deployment to GitHub Pages
├── public/
│   ├── avatar.svg            # Site profile avatar
│   └── favicon.svg           # Site favicon
├── src/
│   ├── content/
│   │   ├── blog/             # Long-form blog posts (.md / .mdx)
│   │   └── notes/            # Digital garden notes (.md / .mdx)
│   ├── components/
│   │   └── Sidebar.astro     # Responsive sidebar & mobile header drawer
│   ├── layouts/
│   │   ├── BaseLayout.astro  # HTML head, global styles, and layout shell
│   │   ├── BlogLayout.astro  # Blog article layout with sticky TOC
│   │   └── NoteLayout.astro  # Digital garden note layout with backlinks & drawers
│   ├── pages/
│   │   ├── index.astro       # Homepage with recent writings
│   │   ├── about.astro       # About page
│   │   ├── blog/             # Blog index and [slug] pages
│   │   ├── notes/            # Digital garden index and [slug] pages
│   │   ├── categories/       # Category index and [category] pages
│   │   ├── series/           # Multi-part series index
│   │   ├── tags/             # Tag index and [tag] pages
│   │   ├── archive/          # Chronological archive
│   │   ├── rss.xml.ts        # RSS 2.0 Feed endpoint
│   │   └── api/notes.json.ts # Search & preview metadata endpoint
│   ├── plugins/
│   │   └── remark-wikilinks.mjs # Remark AST plugin for [[wikilinks]]
│   ├── styles/
│   │   └── global.css        # Design tokens, typography, and theme CSS
│   └── utils/
│       └── backlinks.ts      # Bi-directional backlink graph builder
├── astro.config.mjs          # Astro configuration
└── package.json
```

---

## ✍️ Content Authoring

### Writing Blog Posts (`src/content/blog/my-post.md`)

```markdown
---
title: "Mastering Distributed Consensus"
description: "A deep dive into Paxos, Raft, and distributed state machines."
date: 2025-01-15
updated: 2025-02-01
tags: ["distributed-systems", "raft", "go"]
category: "engineering"
series: "Distributed Systems"
seriesOrder: 1
---

Your content goes here with full Markdown and [[wikilinks]] support!
```

### Writing Garden Notes (`src/content/notes/my-note.md`)

```markdown
---
title: "Abstractions Should Hide Complexity"
description: "Deep modules provide powerful functionality through narrow interfaces."
stage: evergreen # seedling | budding | evergreen
tags: ["architecture", "simplicity"]
category: "design"
created: 2024-11-20
updated: 2025-01-10
---

Notes can link to other notes seamlessly using [[other-note-id|Custom Label]] syntax.
```

---

## ⚙️ Configuration

1. **Site Identity:** Update site author, metadata, and social links in `src/components/Sidebar.astro` and `src/layouts/BaseLayout.astro`.
2. **Avatar:** Replace `public/avatar.svg` with your own image or avatar.
3. **Deployment URL:** Set your repository URL or custom domain in `astro.config.mjs`.

---

## 🚢 Deployment

### GitHub Pages (Automated)

This theme includes an automated GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push your repository to GitHub.
2. In your repository settings on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The site will automatically build and deploy on every push to the `main` branch.

### Vercel / Netlify / Cloudflare Pages

You can also deploy with standard static build commands:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 📄 License

MIT © [Breath Contributors](LICENSE)
