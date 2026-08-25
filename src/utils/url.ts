/**
 * Normalized base URL without trailing slash.
 * E.g. '' in local development, or '/breath' on GitHub Pages.
 */
export const base = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : (process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/breath' : ''))
).replace(/\/$/, '');

/**
 * Prefixes a path with the site's base URL.
 * E.g. url('/about') -> '/breath/about' or '/about'
 * E.g. url('/avatar.svg') -> '/breath/avatar.svg' or '/avatar.svg'
 */
export function url(path: string = '/'): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return base ? `${base}/` : '/';
  }
  return `${base}${cleanPath}`;
}
