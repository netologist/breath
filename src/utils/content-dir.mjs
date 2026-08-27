import { resolve, join } from 'node:path';

export const contentDirName = process.env.CONTENT_DIR || 'content';
export const contentDirPath = resolve(process.cwd(), contentDirName);
export const blogDirPath = join(contentDirPath, 'blog');
export const notesDirPath = join(contentDirPath, 'notes');
