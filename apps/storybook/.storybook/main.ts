import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@vueless/storybook-dark-mode'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  // Load the design system's signature font families into the story canvas.
  // Without this the editorial serif and display sans silently fall back to
  // Georgia / system-ui — which is exactly why the serif tagline read poorly.
  previewHead: (head) =>
    `${head}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap">`,
  core: {
    // Suppress the default "What's new in Storybook" toast — a leftover
    // upstream artifact, not part of the MCTL showcase.
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  managerHead: (head) =>
    `${head.replace(
      /<link rel="icon"[^>]*>/gi,
      '',
    )}
    <title>MCTL UI</title>
    <link rel="icon" type="image/svg+xml" href="/brand/favicon.svg?v=9dc770313d10">
    <meta property="og:title" content="MCTL UI">
    <meta property="og:description" content="Design tokens, CSS theme, and Vue 3 components for MCTL products.">
    <meta property="og:url" content="https://ui.mctl.ai">
    <meta property="og:image" content="https://ui.mctl.ai/brand/sidebar-dark.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root { --font-display: 'Onest', system-ui, -apple-system, sans-serif; }
      /* Hide "Storybook X.Y.Z" version badge in sidebar footer */
      [class*='sidebar_footer'] a[href*='storybook.js.org'],
      [class*='sidebar_footer'] > div:last-child { display: none !important; }
      body, button, input, textarea, select {
        font-family: var(--font-display) !important;
      }
    </style>
    <script>
      // Storybook rewrites document.title to "<story> ⋅ Storybook" at runtime.
      // Rebrand the suffix to MCTL so the browser tab carries no upstream artifact.
      (function () {
        var rebrand = function () {
          var next = document.title.replace(/⋅ Storybook$/, '⋅ MCTL UI');
          if (next !== document.title) document.title = next;
        };
        new MutationObserver(rebrand).observe(
          document.querySelector('title'),
          { childList: true, characterData: true, subtree: true }
        );
        rebrand();
      })();
      // Storybook also injects ./favicon.svg into index.html outside managerHead.
      // That URL is a 7-day Cloudflare HIT of the old cyan square — drop it.
      (function () {
        var href = '/brand/favicon.svg?v=9dc770313d10';
        var apply = function () {
          document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(function (el) {
            if (el.getAttribute('href') !== href) el.parentNode.removeChild(el);
          });
          if (!document.querySelector('link[rel="icon"][href="' + href + '"]')) {
            var l = document.createElement('link');
            l.rel = 'icon';
            l.type = 'image/svg+xml';
            l.href = href;
            document.head.insertBefore(l, document.head.firstChild);
          }
        };
        apply();
        new MutationObserver(apply).observe(document.head, { childList: true, subtree: true });
      })();
    </script>`,
};

export default config;
