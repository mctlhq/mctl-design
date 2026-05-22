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
  managerHead: (head) =>
    `${head}
    <title>MCTL UI</title>
    <meta property="og:title" content="MCTL UI">
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
    </style>`,
};

export default config;
