import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Every story renders in real Chromium, runs its play function, and must pass
// axe (parameters.a11y.test = 'error' in .storybook/preview.ts) — once per
// theme, since colour contrast differs between them. jsdom in packages/ui
// has no layout or colour, so this is the only a11y pass that sees either.
export default defineConfig({
  test: {
    projects: (['dark', 'light'] as const).map((theme) => ({
      extends: true,
      plugins: [storybookTest({ configDir: '.storybook' })],
      define: { 'import.meta.env.VITE_STORY_THEME': JSON.stringify(theme) },
      test: {
        name: `stories-${theme}`,
        setupFiles: ['.storybook/vitest.setup.ts'],
        browser: {
          enabled: true,
          headless: true,
          provider: playwright(),
          instances: [{ browser: 'chromium' as const }],
        },
      },
    })),
  },
});
