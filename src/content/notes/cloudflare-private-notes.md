---
title: "Private Notes on Cloudflare Pages (Basic Auth Guide)"
description: "How Breath's private notes work and how to protect them with HTTP Basic Auth on Cloudflare Pages"
stage: evergreen
tags: ["guide", "cloudflare", "auth", "privacy"]
category: "meta"
created: 2026-08-27
---

# Private Notes on Cloudflare Pages (Basic Auth Guide)

Breath ships a **private notes** capability: a note marked `private: true` is
excluded from every public surface (notes index, tags, categories, search API,
backlinks, OG cache) but is still built as a static page, so it can be served
behind an HTTP Basic Auth wall.

> **Why not GitHub Pages?** GitHub Pages cannot enforce HTTP auth. Cloudflare
> Pages (or Workers) can, with a ~25-line middleware — the auth layer lives at
> the edge, in front of your static files.

## How it works

- **One repo, one build.** Private notes live under `content/notes/private/`
  and carry `private: true` in the frontmatter.
- They render at `/notes/private/{slug}/` — normal static HTML, no app server.
- A Cloudflare Pages Function (`functions/private/_middleware.js`) gates
  `/notes/private/*`: requests without a valid `Authorization: Basic ...`
  header get a `401`.
- Public pages never list private notes; the URL is only reachable with
  credentials.

## 1. Content contract

```md
---
title: "My private capture"
stage: seedling
private: true            # ← hidden from all public listings
created: 2026-08-27
---

Raw thoughts here. Not public yet.
```

Rules:

- Place private notes under `content/notes/private/` so the URL carries the
  gated prefix.
- `private: true` removes them from the notes index, tags, categories, search
  API (`/api/notes.json`), and OG cache scan.
- Wikilinks still resolve between private notes; links from public notes to
  private notes render but lead to the auth wall.

## 2. Cloudflare Pages setup

1. Create a Pages project (dashboard → Workers & Pages → Create → Pages →
   connect your Git repo). Framework preset: **Astro**, build command
   `npm run build`, output directory `dist`.
2. Add environment variables in **Settings → Variables and Secrets**:

| Variable       | Default     | Notes                          |
|----------------|-------------|--------------------------------|
| `AUTH_USER`    | `admin`     | Basic Auth username            |
| `AUTH_PASSWORD`| `changeme`  | **Change before going live**   |
| `AUTH_REALM`   | `Private Notes` | Shown in the browser's login dialog |

The middleware file `functions/private/_middleware.js` ships with the theme —
no code changes needed. (If you prefer a standalone Worker gate instead of a
Pages Function, move the same logic to a Worker and point its route at
`/notes/private/*`; the secrets story is identical.)

## 3. Rotating the password

The password is a Cloudflare **secret**, never a repo file. Rotate it any
time — no code change, no redeploy:

```bash
# CLI (after wrangler auth): value is read from stdin
printf '%s\n' 'new-password' | npx wrangler pages secret put AUTH_PASSWORD --project-name=<name>
```

…or edit the variable in the dashboard. The example note in this theme shows
the documented defaults (`admin` / `changeme`) — treat them as placeholders.

## 4. GitHub Actions pipeline (disabled by default)

The theme ships `.github/workflows/cloudflare.yml.disabled`. Enable it:

1. `git mv .github/workflows/cloudflare.yml.disabled .github/workflows/cloudflare.yml`
2. Add repository secrets (**Settings → Secrets and variables → Actions**):

| Secret                  | Value                                                        |
|-------------------------|--------------------------------------------------------------|
| `CLOUDFLARE_API_TOKEN`  | API token with `Cloudflare Pages:Edit` permissions           |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID                                   |
| `CLOUDFLARE_PROJECT_NAME` | The Pages project name                                     |
| `AUTH_USER`             | Basic Auth username (default `admin`)                        |
| `AUTH_PASSWORD`         | Basic Auth password (default `changeme` — rotate)            |

The workflow builds with `SITE_URL` / `BASE_PATH` / `CONTENT_DIR` (all
overridable via `workflow_dispatch` inputs), deploys with Wrangler
(`--functions=functions` bundles the auth gate), and pushes the auth secrets
to the Pages project.

**Keep only one pipeline active.** The default is
`.github/workflows/github-pages.yml` (GitHub Pages). Enable Cloudflare only
when you deploy there.

## 5. Verify

```bash
curl -I https://your-site.pages.dev/notes/private/example-capture/   # 401
curl -u admin:changeme -I https://your-site.pages.dev/notes/private/example-capture/  # 200
```

## Security notes

- Change the default password before going live.
- Cloudflare Pages forces HTTPS on your custom domain (free).
- Private notes are still present in the built artifact; the middleware is the
  enforcement boundary. Keep your Git repo **private** as a second layer.
- GitHub Pages cannot enforce auth — a private note deployed only to GitHub
  Pages is public. Use Cloudflare (or delete the private content) there.
