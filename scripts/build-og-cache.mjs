#!/usr/bin/env node
/**
 * Build-time OpenGraph metadata cache.
 *
 * Scans all markdown content for external URLs, fetches each page's
 * OpenGraph metadata (title, description, image) plus favicon, and writes
 * a static `public/og-cache.json` for the client-side external-link preview
 * panel.
 *
 * Why build-time? The site is fully static (GitHub Pages) — there is no
 * server at request time, and browser-side fetches are blocked by CORS /
 * X-Frame-Options on most sites.
 *
 * Network failures are non-fatal: the entry falls back to `null` and the
 * panel renders hostname + URL only. New links appear after the next build.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blogDirPath, notesDirPath } from '../src/utils/content-dir.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDirs = [blogDirPath, notesDirPath];
const outFile = join(root, 'public/og-cache.json');

const TIMEOUT_MS = 8000;
const UA = 'Mozilla/5.0 (compatible; BreathBot/1.0; +https://github.com/netologist/breath)';

/** Extract external URLs from markdown: [text](url) and bare https:// URLs. */
function extractUrls(md) {
   const urls = new Set();
  // Skip code fences and inline code — example URLs in docs must not be fetched.
  const text = md.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  // [text](url)
    for (const m of text.matchAll(/\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1].replace(/["<>]+$/, ''));
  // bare URLs in text (excluding code fences is overkill for a theme cache)
    for (const m of text.matchAll(/(?<![\(\w])(https?:\/\/[^\s)<>"]+)/g)) urls.add(m[1]);
  return [...urls];
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      // Private notes are not part of the public OG cache.
      if (e.name === 'private') continue;
      out.push(...await walk(p));
    } else if (e.isFile() && /\.(md|mdx)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

function meta(doc, prop) {
  // prop like "og:title" or "twitter:image" — match both name and property attrs
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${prop}["'][^>]*>`, 'i');
  const m = doc.match(re);
  if (!m) return null;
  const content = m[0].match(/content=["']([^"']*)["']/i);
  return content ? content[1].trim() : null;
}

async function fetchOg(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,*/*;q=0.8' },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const html = await res.text();
    const doc = html.slice(0, 200_000); // head is enough for OG tags

    const title =
      meta(doc, 'og:title') ||
      meta(doc, 'twitter:title') ||
      doc.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
      null;
    const description =
      meta(doc, 'og:description') ||
      meta(doc, 'twitter:description') ||
      meta(doc, 'description') ||
      null;
    const image = meta(doc, 'og:image') || meta(doc, 'twitter:image') || null;
    let favicon = null;
    const link = doc.match(/<link[^>]+rel=["']?(?:shortcut\s+)?icon["']?[^>]*>/i);
    if (link) {
      const href = link[0].match(/href=["']([^"']+)["']/i)?.[1];
      if (href) favicon = new URL(href, url).href;
    }

    return { url, title, description, image, favicon };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const all = new Set();
for (const dir of contentDirs) {
  for (const file of await walk(dir)) {
    const md = await readFile(file, 'utf8');
    for (const u of extractUrls(md)) all.add(u);
  }
}

const results = {};
const entries = [...all].filter(u => !u.includes('localhost') && !u.includes('127.0.0.1'));
console.log(`[og-cache] scanning ${entries.length} external URL(s)...`);

// Fetch sequentially to be polite to origin servers
for (const url of entries) {
  const meta = await fetchOg(url);
  results[url] = meta;
  console.log(`[og-cache] ${meta ? 'ok  ' : 'FAIL'} ${url}${meta?.title ? ' — ' + meta.title.slice(0, 60) : ''}`);
}

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(results, null, 2) + '\n');
console.log(`[og-cache] wrote ${Object.keys(results).length} entr${Object.keys(results).length === 1 ? 'y' : 'ies'} to ${outFile}`);
