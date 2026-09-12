import { readdirSync } from 'node:fs';
import { getCollection, type CollectionKey } from 'astro:content';
import { projectsDirPath, talksDirPath, publicationsDirPath } from './content-dir.mjs';

/**
 * Checks if a directory contains any markdown files without triggering Astro's
 * empty-collection warning.
 */
export function getDirMarkdownCount(dirPath: string): number {
  try {
    const files = readdirSync(dirPath);
    return files.filter((f) => !f.startsWith('.') && /\.(md|mdx)$/i.test(f)).length;
  } catch {
    return 0;
  }
}

/**
 * Safely fetches a collection only if markdown files exist in its folder.
 * Returns an empty array if empty, avoiding Astro collection warning spam.
 */
export async function getSafeCollection(
  name: 'projects' | 'talks' | 'publications'
): Promise<any[]> {
  const dirMap = {
    projects: projectsDirPath,
    talks: talksDirPath,
    publications: publicationsDirPath,
  };

  const count = getDirMarkdownCount(dirMap[name]);
  if (count === 0) return [];

  try {
    return await getCollection(name as CollectionKey);
  } catch {
    return [];
  }
}
