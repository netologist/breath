import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkWikilinks } from './src/plugins/remark-wikilinks.mjs';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';
import rehypeEmbeds from './src/plugins/rehype-embeds.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://netologist.github.io',
  base: process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/breath' : '/'),
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkWikilinks, remarkMermaid],
    rehypePlugins: [rehypeEmbeds],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
