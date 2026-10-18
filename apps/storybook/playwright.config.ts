import { defineConfig, devices } from '@playwright/test';

// Screenshots of every story in both themes, compared against the baselines
// committed under visual/__screenshots__. Font rendering differs between
// machines, so baselines are only valid from the pinned Playwright image:
// generate them with `pnpm test:visual:update` (scripts/browser-tests-docker.sh),
// which is what CI runs too.
export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
    baseURL: 'http://127.0.0.1:6007',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixels: 0 },
  },
  webServer: {
    // storybook-static must already be built (pnpm build:storybook).
    command: 'vite preview --outDir storybook-static --host 127.0.0.1 --port 6007 --strictPort',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
