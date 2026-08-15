import type { Preview } from '@storybook/vue3-vite';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { computed, ref, watchEffect } from 'vue';

import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import '@mctlhq/css/prose.css';
import '@mctlhq/css/telegram.css';
import '@mctlhq/ui/style.css';

import { mctlDark, mctlLight } from './mctl-theme';

const DEFAULT_ACCENT = 'terracotta';

// theme.css: terracotta is :root (no data-accent). cyan / lime / lilac /
// vermilion (terracotta alias) flip --accent via [data-accent='…'] on <html>.
function applyAccent(accent: unknown) {
  const value = typeof accent === 'string' && accent ? accent : DEFAULT_ACCENT;
  if (value === DEFAULT_ACCENT || value === 'vermilion') {
    delete document.documentElement.dataset.accent;
    return;
  }
  document.documentElement.dataset.accent = value;
}

// The dark-mode addon owns the light/dark switch — it themes the Storybook
// chrome and emits DARK_MODE_EVENT_NAME. A single module-scope listener keeps
// `isDark` in sync so the story canvas decorator can mirror it via data-theme.
const isDark = ref(true);
addons.getChannel().on(DARK_MODE_EVENT_NAME, (dark: boolean) => {
  isDark.value = dark;
});

// Toolbar globals do not remount the Vue decorator on Storybook 9. Read the
// channel so cyan/lime/lilac actually land on <html> without a story change.
const accentName = ref(DEFAULT_ACCENT);
addons.getChannel().on(
  GLOBALS_UPDATED,
  ({ globals }: { globals?: { accent?: unknown } }) => {
    if (globals && 'accent' in globals) {
      accentName.value = String(globals.accent ?? DEFAULT_ACCENT);
    }
  },
);

// Initial attributes so the iframe root is themed before the first story
// renders — avoids a default-surface flash.
document.documentElement.setAttribute('data-theme', 'dark');
applyAccent(DEFAULT_ACCENT);

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Components',
          'Patterns',
          ['Telegram', ['Introduction', 'Foundations', 'Components', 'Patterns', 'Rewards', 'PairDesk']],
        ],
      },
    },
    darkMode: {
      dark: mctlDark,
      light: mctlLight,
      current: 'dark',
      stylePreview: true,
    },
  },
  // Storybook 8+ ignores globalTypes.defaultValue; URL/toolbar accent only
  // sticks when the key is declared here.
  initialGlobals: {
    accent: DEFAULT_ACCENT,
  },
  globalTypes: {
    accent: {
      description: 'Accent color',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: ['terracotta', 'cyan', 'lime', 'lilac'],
      },
    },
  },
  decorators: [
    (story, context) => {
      // Theme the iframe root (not just the wrapper div) so global.css — which
      // styles <body> — resolves the same surface as the story canvas.
      accentName.value = String(context.globals.accent ?? DEFAULT_ACCENT);
      applyAccent(accentName.value);
      return {
        components: { story },
        setup() {
          const theme = computed(() => (isDark.value ? 'dark' : 'light'));
          watchEffect(() => {
            document.documentElement.setAttribute('data-theme', theme.value);
            const live = context.globals.accent;
            if (live != null) accentName.value = String(live);
            applyAccent(accentName.value);
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
