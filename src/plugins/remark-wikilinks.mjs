import { visit } from 'unist-util-visit';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

/** Converts text into a clean URL-friendly slug */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Scans the notes directory and builds a lookup map: { title/id -> id }
 * Supports linking via note ID, title, or alias.
 */
function buildNoteMap() {
  const map = {};
  const dir = join(process.cwd(), 'src/content/notes');

  let files;
  try {
    files = readdirSync(dir);
  } catch {
    return map;
  }

  for (const file of files) {
    if (!/\.mdx?$/.test(file)) continue;
    const id = file.replace(/\.mdx?$/, '');

    map[id] = id;
    map[slugify(id)] = id;

    try {
      const raw = readFileSync(join(dir, file), 'utf8');
      const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        map[title.toLowerCase()] = id;
        map[slugify(title)] = id;
      }
    } catch {
      // Fallback to filename ID if read fails
    }
  }

  return map;
}

/**
 * Remark plugin: [[target]] and [[target|custom label]] -> <a href="/notes/id">label</a>
 */
export function remarkWikilinks() {
  const noteMap = buildNoteMap();
  const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

  return (tree) => {
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

        parts.push({
          type: 'link',
          url: `/notes/${id}`,
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
