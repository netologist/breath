import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../site.config';
import { base } from '../utils/url';

export async function GET(context: APIContext) {
  const blog = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    site: context.site ?? siteConfig.site.url ?? 'https://netologist.github.io/breath/',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `${base}/blog/${post.id}/`,
      categories: [post.data.category, ...(post.data.tags ?? [])].filter(Boolean) as string[],
    })),
    customData: `<language>${siteConfig.site.language ?? 'en-us'}</language>`,
  });
}
