import type { Preview } from '@storybook/vue3-vite';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { computed, ref, watchEffect } from 'vue';

import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import '@mctlhq/css/prose.css';
import '@mctlhq/ui/style.css';

import { mctlDark, mctlLight } from './mctl-theme';

// The dark-mode addon owns the light/dark switch — it themes the Storybook
// chrome and emits DARK_MODE_EVENT_NAME. A single module-scope listener keeps
// `isDark` in sync so the story canvas decorator can mirror it via data-theme.
const isDark = ref(true);
addons.getChannel().on(DARK_MODE_EVENT_NAME, (dark: boolean) => {
  isDark.value = dark;
});

// Initial attribute so the iframe root is themed before the first story
// renders — avoids a default-surface flash.
document.documentElement.setAttribute('data-theme', 'dark');

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components'],
      },
    },
    darkMode: {
      dark: mctlDark,
      light: mctlLight,
      current: 'dark',
      stylePreview: true,
    },
  },
  globalTypes: {
    accent: {
      description: 'Accent color',
      defaultValue: 'cyan',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: ['cyan', 'lime', 'vermilion', 'lilac'],
      },
    },
  },
  decorators: [
    (story, context) => {
      // Theme the iframe root (not just the wrapper div) so global.css — which
      // styles <body> — resolves the same surface as the story canvas.
      // The decorator re-runs on every render, so the accent global stays in
      // sync here; the theme is reactive because the dark-mode addon flips
      // `isDark` without triggering a re-render.
      document.documentElement.setAttribute(
        'data-accent',
        String(context.globals.accent),
      );
      return {
        components: { story },
        setup() {
          const theme = computed(() => (isDark.value ? 'dark' : 'light'));
          watchEffect(() => {
            document.documentElement.setAttribute('data-theme', theme.value);
          });
        },
        template:
          '<div style="background: var(--surface-bg); color: var(--surface-fg); ' +
          'padding: 32px; min-height: 100vh;"><story /></div>',
      };
    },
  ],
};

export default preview;
