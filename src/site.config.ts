/**
 * Global Site Configuration
 *
 * Central configuration file for author identity, sidebar navigation,
 * social profiles, and site metadata.
 */

export interface AuthorConfig {
  /** Full display name (e.g. 'John Doe') */
  name: string;
  /** Handle or nickname without @ (e.g. 'johndoe' -> 'a.k.a @johndoe') */
  nickname: string;
  /** Avatar path relative to public or absolute URL (e.g. '/avatar.svg') */
  avatar: string;
  /** Short bio for sidebar / about */
  bio?: string;
}

export interface SocialLink {
  /** Platform identifier ('github' | 'linkedin' | 'x' | 'twitter' | 'bluesky' | 'mastodon' | 'rss' | 'mail' | string) */
  platform: 'github' | 'linkedin' | 'x' | 'twitter' | 'bluesky' | 'mastodon' | 'rss' | 'mail' | 'youtube' | string;
  /** Target URL (external or relative path like '/rss.xml') */
  href: string;
  /** Tooltip and accessibility label */
  label: string;
}

export interface NavItem {
  /** Target route (e.g. '/blog', '/notes') */
  href: string;
  /** Display label in sidebar */
  label: string;
  /** Whether link opens in a new tab */
  external?: boolean;
}

export interface SourceLink {
  /** URL to repository or source */
  href: string;
  /** Display text in sidebar */
  label: string;
}

export interface SiteMeta {
  /** Website name */
  title: string;
  /** Default site description for SEO and RSS */
  description: string;
  /** Canonical base URL */
  url?: string;
  /** Default OG image */
  defaultImage?: string;
  /** Language tag for HTML and RSS */
  language?: string;
}

export interface SiteConfig {
  author: AuthorConfig;
  social: SocialLink[];
  nav: NavItem[];
  sourceLink: SourceLink;
  site: SiteMeta;
}

export const siteConfig: SiteConfig = {
  // Author & Identity
  author: {
    name: 'John Doe',
    nickname: 'johndoe',
    avatar: '/avatar.svg',
    bio: 'Engineer, tinkerer, and systems thinker.',
  },

  // Social Links in Sidebar
  social: [
    {
      platform: 'github',
      href: 'https://github.com/netologist/breath',
      label: 'GitHub',
    },
    {
      platform: 'linkedin',
      href: 'https://linkedin.com/in/johndoe',
      label: 'LinkedIn',
    },
    {
      platform: 'rss',
      href: '/rss.xml',
      label: 'RSS Feed',
    },
  ],

  // Main Sidebar Navigation Links
  nav: [
    { href: '/about', label: 'about' },
    { href: '/blog', label: 'posts' },
    { href: '/notes', label: 'notes' },
    { href: '/categories', label: 'categories' },
    { href: '/series', label: 'series' },
    { href: '/tags', label: 'tags' },
    { href: '/archive', label: 'archive' },
  ],

  // Repository / Source Code Link in Sidebar
  sourceLink: {
    href: 'https://github.com/netologist/breath',
    label: 'github repo',
  },

  // Site Metadata & SEO
  site: {
    title: 'Breath',
    description: 'A minimalist digital garden and engineering blog.',
    url: 'https://netologist.github.io/breath',
    defaultImage: '/og-default.png',
    language: 'en-us',
  },
};

export default siteConfig;
