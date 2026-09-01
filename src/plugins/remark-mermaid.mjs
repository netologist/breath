import { visit } from 'unist-util-visit';

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * remark-mermaid — Transforms ```mermaid code blocks into interactive
 * mermaid containers that can be rendered dynamically and clicked for modal zoom.
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!node.lang) return;
      const lang = node.lang.toLowerCase();
      if (lang !== 'mermaid' && lang !== 'mmd') return;
      if (!parent || typeof index !== 'number') return;

      const code = node.value || '';
      const encoded = encodeURIComponent(code);

      const htmlNode = {
        type: 'html',
        value: `<div class="mermaid-block-wrapper" data-mermaid="${encoded}"><pre class="mermaid" style="display:none;">${escapeHtml(code)}</pre><div class="mermaid-placeholder"><div class="mermaid-skeleton"><span>Rendering diagram...</span></div></div></div>`,
      };

      parent.children.splice(index, 1, htmlNode);
    });
  };
}

export default remarkMermaid;
