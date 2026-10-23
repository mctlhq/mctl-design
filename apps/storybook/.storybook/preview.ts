import { setup, type Preview } from '@storybook/vue3-vite';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { computed, ref, watchEffect } from 'vue';

import '@mctlhq/css/theme.css';
import '@mctlhq/css/global.css';
import '@mctlhq/css/prose.css';
import '@mctlhq/css/site.css';
import '@mctlhq/css/telegram.css';
import '@mctlhq/ui/style.css';

import { mctlDark, mctlLight } from './mctl-theme';

const DEFAULT_ACCENT = 'terracotta';

// useId() numbers per app, and a docs page mounts one app per story, so give
// each its own prefix. Without it every MAccordion on the page shares one
// exclusive group and MTabs/MField/MTooltip ids repeat.
let storyApp = 0;
setup((app) => {
  app.config.idPrefix = `s${++storyApp}`;
});

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
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals?: { accent?: unknown } }) => {
  if (globals && 'accent' in globals) {
    accentName.value = String(globals.accent ?? DEFAULT_ACCENT);
  }
});

// Initial attributes so the iframe root is themed before the first story
// renders — avoids a default-surface flash.
document.documentElement.setAttribute('data-theme', 'dark');
applyAccent(DEFAULT_ACCENT);

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    // Fail the story tests (pnpm test:a11y) on any axe violation, not just
    // list it in the panel. A story with a known, explained exception sets
    // its own a11y parameter.
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Components',
          'Patterns',
          [
            'Telegram',
            ['Introduction', 'Foundations', 'Components', 'Patterns', 'Rewards', 'PairDesk'],
          ],
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
    // '' follows the dark-mode toggle. 'light' / 'dark' pin the canvas theme,
    // so a story can be opened (?globals=theme:light) or tested in either one
    // without the manager UI: the story tests and screenshots rely on it.
    theme: '',
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
      const pinned = context.globals.theme;
      // Mini App stories sit on the --tg-* surface they ship on, not on the
      // desktop paper/ink, so their contrast is judged where it applies.
      const surface = context.title.startsWith('Telegram/')
        ? 'background: var(--tg-bg); color: var(--tg-ink);'
        : 'background: var(--surface-bg); color: var(--surface-fg);';
      // A fullscreen story (the public-site shell) draws its own gutters and
      // full-bleed header and footer, so the canvas adds no padding of its own.
      const padding = context.parameters.layout === 'fullscreen' ? '0' : '32px';
      return {
        components: { story },
        setup() {
          const theme = computed(() =>
            pinned === 'light' || pinned === 'dark' ? pinned : isDark.value ? 'dark' : 'light',
          );
          watchEffect(() => {
            document.documentElement.setAttribute('data-theme', theme.value);
            applyAccent(accentName.value);
          });
        },
        template: `<div style="${surface} padding: ${padding}; min-height: 100vh;"><story /></div>`,
      };
    },
  ],
};

export default preview;
