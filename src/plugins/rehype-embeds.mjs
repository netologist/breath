/**
 * rehype-embeds — build-time media embeds for standalone platform links.
 *
 * Transforms a markdown paragraph whose ENTIRE content is a single link to a
 * supported platform (YouTube, X/Twitter) into an embed block:
 *
 *   https://www.youtube.com/watch?v=abc123
 *
 * becomes
 *
 *   <a href="https://www.youtube.com/watch?v=abc123" class="embed-link">…</a>
 *   <div class="embed-wrap embed-youtube">
 *     <iframe src="https://www.youtube-nocookie.com/embed/abc123" …></iframe>
 *   </div>
 *
 * Inline links inside prose are untouched. The original link is preserved and
 * stays clickable beneath the embed (per ADR-002).
 */
import { visit } from 'unist-util-visit';

/** Extract video ID from various YouTube URL shapes. */
function youtubeId(url) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return m ? m[1] : null;
}

/** Extract tweet/status ID from X/Twitter URLs. */
function xTweetId(url) {
  const m = url.match(
    /(?:x\.com|twitter\.com)\/[a-zA-Z0-9_]{1,15}\/status\/(\d{6,})/
  );
  return m ? m[1] : null;
}

export default function rehypeEmbeds() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only paragraphs: <p> containing exactly one <a>
      if (node.tagName !== 'p') return;
      if (!parent || typeof index !== 'number') return;
      const anchors = node.children.filter((c) => c.tagName === 'a');
      if (anchors.length !== 1) return;

      const a = anchors[0];
      const href = a.properties?.href;
      if (typeof href !== 'string') return;

      let embed = null;
      let kind = null;

      const yt = youtubeId(href);
      if (yt) {
        kind = 'youtube';
        embed = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['embed-wrap', 'embed-youtube'] },
          children: [
            {
              type: 'element',
              tagName: 'iframe',
              properties: {
                src: `https://www.youtube-nocookie.com/embed/${yt}`,
                title: 'YouTube video player',
                loading: 'lazy',
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                allowFullscreen: true,
                referrerPolicy: 'strict-origin-when-cross-origin',
              },
              children: [],
            },
          ],
        };
      }

      if (!embed) {
        const tweet = xTweetId(href);
        if (tweet) {
          kind = 'x';
          embed = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['embed-wrap', 'embed-x'] },
            children: [
              {
                type: 'element',
                tagName: 'iframe',
                properties: {
                  src: `https://platform.twitter.com/embed/Tweet.html?id=${tweet}`,
                  title: 'X (Twitter) post',
                  loading: 'lazy',
                  allowFullscreen: true,
                },
                children: [],
              },
            ],
          };
        }
      }

      if (!embed) return;

      // Mark the anchor as an embedded link (JS/CSS will skip the ↗ arrow)
      a.properties.className = [...(a.properties?.className ?? []), 'embed-link'];

      // Insert the embed block right after the paragraph
      parent.children.splice(index + 1, 0, embed);
      // Track kind on the paragraph for CSS scoping
      node.properties = { ...(node.properties ?? {}), className: [...(node.properties?.className ?? []), `embed-paragraph embed-${kind}`] };
    });
  };
}
