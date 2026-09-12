import { resolve, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

export const contentDirName = process.env.CONTENT_DIR || 'content';
export const contentDirPath = resolve(process.cwd(), contentDirName);
export const blogDirPath = join(contentDirPath, 'blog');
export const notesDirPath = join(contentDirPath, 'notes');
export const projectsDirPath = join(contentDirPath, 'projects');
export const talksDirPath = join(contentDirPath, 'talks');
export const publicationsDirPath = join(contentDirPath, 'publications');

for (const dir of [blogDirPath, notesDirPath, projectsDirPath, talksDirPath, publicationsDirPath]) {
  if (!existsSync(dir)) {
    try { mkdirSync(dir, { recursive: true }); } catch {}
  }
}

