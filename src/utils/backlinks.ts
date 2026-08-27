import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { notesDirPath, blogDirPath } from './content-dir.mjs';

const base = (process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/breath' : '')).replace(/\/$/, '');

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function scanDirRecursively(dir: string, baseDir: string = dir, results: { fullPath: string; id: string }[] = []): { fullPath: string; id: string }[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirRecursively(fullPath, baseDir, results);
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      const relPath = relative(baseDir, fullPath).replace(/\\/g, '/');
      const id = relPath.replace(/\.mdx?$/, '');
      results.push({ fullPath, id });
    }
  }

  return results;
}

function buildNoteMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const scanned = scanDirRecursively(notesDirPath);

  for (const file of scanned) {
    const id = file.id;
    map[id] = id;
    map[slugify(id)] = id;

    const baseName = id.split('/').pop();
    if (baseName && !map[baseName]) {
      map[baseName] = id;
      map[slugify(baseName)] = id;
    }

    try {
      const raw = readFileSync(file.fullPath, 'utf8');
      const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        map[title.toLowerCase()] = id;
        map[slugify(title)] = id;
      }
    } catch {
      // ignore
    }
  }
  return map;
}

export interface BacklinkEntry {
  id: string;
  url: string;
  title: string;
  type?: 'note' | 'blog';
}

export function buildBacklinks(): Record<string, BacklinkEntry[]> {
  const noteMap = buildNoteMap();
  const backlinks: Record<string, BacklinkEntry[]> = {};
  const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g;
  const MD_LINK_RE = /\[([^\]]+)\]\((?:\/breath)?\/notes\/([^\s\)]+)\)/g;

  function scanDir(dirPath: string, type: 'note' | 'blog') {
    const files = scanDirRecursively(dirPath);

    for (const file of files) {
      const sourceId = file.id;
      let raw: string;
      try {
        raw = readFileSync(file.fullPath, 'utf8');
      } catch {
        continue;
      }

      // Extract title from frontmatter
      const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      const sourceTitle = titleMatch ? titleMatch[1].trim() : sourceId;
      const sourceUrl = type === 'blog' ? `${base}/blog/${sourceId}` : `${base}/notes/${sourceId}`;

      // Scan [[wikilinks]]
      WIKILINK_RE.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = WIKILINK_RE.exec(raw)) !== null) {
        const target = match[1].trim();
        const targetId =
          noteMap[target] ??
          noteMap[target.toLowerCase()] ??
          noteMap[slugify(target)] ??
          slugify(target);

        if (targetId && targetId !== sourceId) {
          if (!backlinks[targetId]) backlinks[targetId] = [];
          if (!backlinks[targetId].some(b => b.id === sourceId && b.type === type)) {
            backlinks[targetId].push({
              id: sourceId,
              url: sourceUrl,
              title: sourceTitle,
              type,
            });
          }
        }
      }

      // Scan standard Markdown links to /notes/*
      MD_LINK_RE.lastIndex = 0;
      let mdMatch: RegExpExecArray | null;
      while ((mdMatch = MD_LINK_RE.exec(raw)) !== null) {
        const targetId = mdMatch[2].replace(/\/$/, '').trim();
        if (targetId && targetId !== sourceId) {
          if (!backlinks[targetId]) backlinks[targetId] = [];
          if (!backlinks[targetId].some(b => b.id === sourceId && b.type === type)) {
            backlinks[targetId].push({
              id: sourceId,
              url: sourceUrl,
              title: sourceTitle,
              type,
            });
          }
        }
      }
    }
  }

  scanDir(notesDirPath, 'note');
  scanDir(blogDirPath, 'blog');

  return backlinks;
}
