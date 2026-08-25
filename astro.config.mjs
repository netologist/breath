import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkWikilinks } from './src/plugins/remark-wikilinks.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://netologist.github.io',
  base: process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/breath' : '/'),
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkWikilinks],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
