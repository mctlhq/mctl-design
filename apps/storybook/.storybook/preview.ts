import type { Preview } from '@storybook/vue3-vite';

import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import '@mctlhq/css/prose.css';
import '@mctlhq/ui/style.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Surface theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'dark', title: 'Dark — Engineering' },
          { value: 'light', title: 'Light — Editorial' },
        ],
      },
    },
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
    (story, context) => ({
      components: { story },
      setup() {
        return {
          theme: context.globals.theme,
          accent: context.globals.accent,
        };
      },
      template:
        '<div :data-theme="theme" :data-accent="accent" ' +
        'style="background: var(--surface-bg); color: var(--surface-fg); ' +
        'padding: 32px; min-height: 100vh;"><story /></div>',
    }),
  ],
};

export default preview;
