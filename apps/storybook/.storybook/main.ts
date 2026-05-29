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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap">`,
  core: {
    // Suppress the default "What's new in Storybook" toast — a leftover
    // upstream artifact, not part of the MCTL showcase.
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  managerHead: (head) =>
    `${head}
    <title>MCTL Design System</title>
    <link rel="icon" type="image/svg+xml" href="./favicon.svg">
    <meta property="og:title" content="MCTL Design System">
    <meta property="og:description" content="Design tokens, CSS theme, and Vue 3 components for MCTL products.">
    <meta property="og:url" content="https://ui.mctl.ai">
    <meta property="og:image" content="https://ui.mctl.ai/mctl-logo-light.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
      /* Hide "Storybook X.Y.Z" version badge in sidebar footer */
      [class*='sidebar_footer'] a[href*='storybook.js.org'],
      [class*='sidebar_footer'] > div:last-child { display: none !important; }
      body, button, input { font-family: 'JetBrains Mono', ui-monospace, monospace !important; }
    </style>
    <script>
      // Storybook rewrites document.title to "<story> ⋅ Storybook" at runtime.
      // Rebrand the suffix to MCTL so the browser tab carries no upstream artifact.
      (function () {
        var rebrand = function () {
          var next = document.title.replace(/⋅ Storybook$/, '⋅ MCTL Design System');
          if (next !== document.title) document.title = next;
        };
        new MutationObserver(rebrand).observe(
          document.querySelector('title'),
          { childList: true, characterData: true, subtree: true }
        );
        rebrand();
      })();
    </script>`,
};

export default config;
