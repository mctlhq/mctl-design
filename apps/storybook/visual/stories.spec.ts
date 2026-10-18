import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { serveLocalFonts } from './fonts';

interface IndexEntry {
  id: string;
  title: string;
  type: 'story' | 'docs';
}

const index = JSON.parse(
  readFileSync(fileURLToPath(new URL('../storybook-static/index.json', import.meta.url)), 'utf8'),
) as { entries: Record<string, IndexEntry> };

const stories = Object.values(index.entries).filter((e) => e.type === 'story');

for (const theme of ['dark', 'light'] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(story.id, async ({ page }) => {
        await serveLocalFonts(page);
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
        // Rendered and any play function finished (or failed, which fails here).
        await page.waitForFunction(() => {
          const render = (
            window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }
          ).__STORYBOOK_PREVIEW__?.currentRender;
          return ['finished', 'errored', 'aborted'].includes(render?.phase ?? '');
        });
        await expect(page.locator('body')).not.toHaveClass(/sb-show-errordisplay/);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, { fullPage: true });
      });
    }
  });
}
