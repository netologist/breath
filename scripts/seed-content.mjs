#!/usr/bin/env node
import { existsSync, cpSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const contentDirName = process.env.CONTENT_DIR || 'content';
const targetDir = resolve(root, contentDirName);
const exampleDir = resolve(root, 'example-content');

function isEmptyDir(dir) {
  try {
    const files = readdirSync(dir);
    return files.length === 0;
  } catch {
    return true;
  }
}

if (!existsSync(targetDir) || isEmptyDir(targetDir)) {
  if (existsSync(exampleDir)) {
    mkdirSync(targetDir, { recursive: true });
    cpSync(exampleDir, targetDir, { recursive: true });
    console.log(`[seed-content] Seeded ${contentDirName}/ from example-content/`);
  } else {
    console.warn(`[seed-content] Warning: example-content/ directory not found at ${exampleDir}`);
  }
}
