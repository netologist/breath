import { visit } from 'unist-util-visit';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { notesDirPath } from '../utils/content-dir.mjs';

const base = (process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/breath' : '')).replace(/\/$/, '');

/** Converts text into a clean URL-friendly slug */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Recursively collects all markdown files under a directory */
function scanFilesRecursively(dir, baseDir = dir, results = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFilesRecursively(fullPath, baseDir, results);
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      const relPath = relative(baseDir, fullPath).replace(/\\/g, '/');
      const id = relPath.replace(/\.mdx?$/, '');
      results.push({ fullPath, id, fileName: entry.name });
    }
  }

  return results;
}

/**
 * Scans the notes directory recursively and builds note metadata & lookup maps:
 * lookupMap: { title/id -> noteId }
 * noteInfo: { noteId -> { isPrivate: boolean, title: string } }
 */
function buildNoteMap() {
  const map = {};
  const noteInfo = {};
  const files = scanFilesRecursively(notesDirPath);

  for (const file of files) {
    const { id, fullPath } = file;
    let isPrivate = id.startsWith('private/');
    let title = id;

    try {
      const raw = readFileSync(fullPath, 'utf8');
      if (/private:\s*true/i.test(raw) || /stage:\s*["']?captured["']?/i.test(raw)) {
        isPrivate = true;
      }
      const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
        map[title.toLowerCase()] = id;
        map[slugify(title)] = id;
      }
    } catch {
      // Fallback
    }

    map[id] = id;
    map[slugify(id)] = id;

    // Also support short filename (e.g. [[example-capture]] linking to private/example-capture)
    const baseName = id.split('/').pop();
    if (baseName && !map[baseName]) {
      map[baseName] = id;
      map[slugify(baseName)] = id;
    }

    noteInfo[id] = { isPrivate, title };
  }

  return { map, noteInfo };
}

/**
 * Remark plugin: [[target]] and [[target|custom label]] -> <a href="/breath/notes/id">label</a>
 * Emits build warnings when public content links to private or captured notes.
 */
export function remarkWikilinks() {
  const { map: noteMap, noteInfo } = buildNoteMap();
  const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

  return (tree, file) => {
    const filePath = file?.history?.[0] || file?.path || '';
    const isSourcePrivate = filePath.includes('/notes/private/') || (typeof file?.value === 'string' && (/private:\s*true/i.test(file.value) || /stage:\s*["']?captured["']?/i.test(file.value)));

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !node.value.includes('[[')) return;

      const parts = [];
      let lastIndex = 0;
      let match;

      WIKILINK_RE.lastIndex = 0;

      while ((match = WIKILINK_RE.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        const rawTarget = match[1].trim();
        const displayText = match[2]?.trim() ?? rawTarget;

        const id =
          noteMap[rawTarget] ??
          noteMap[rawTarget.toLowerCase()] ??
          noteMap[slugify(rawTarget)] ??
          slugify(rawTarget);

        const targetInfo = noteInfo[id];
        if (!isSourcePrivate && targetInfo?.isPrivate) {
          console.warn(`[wikilinks] Warning: Public content "${filePath || 'note'}" links to private/captured note "${id}".`);
        }

        parts.push({
          type: 'link',
          url: `${base}/notes/${id}`,
          title: null,
          data: {
            hProperties: {
              className: 'internal-note-link',
              'data-note-id': id,
            },
          },
          children: [{ type: 'text', value: displayText }],
        });

        lastIndex = match.index + match[0].length;
      }

      if (parts.length === 0) return;

      if (lastIndex < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...parts);
    });
  };
}
