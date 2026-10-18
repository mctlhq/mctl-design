import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { Page } from '@playwright/test';

// The preview loads Onest, Instrument Serif and JetBrains Mono from Google
// Fonts. Over the network that is neither offline-safe nor guaranteed to
// return the same bytes twice, so the tests answer those requests from the
// @fontsource packages instead: same families, weights and subsets, pinned by
// the lockfile. The public build keeps Google Fonts.
const require = createRequire(import.meta.url);
const pkgDir = (name: string) => dirname(require.resolve(`${name}/package.json`));

const SHEETS: Array<[pkg: string, files: string[]]> = [
  ['@fontsource/onest', ['300', '400', '500', '600', '700', '800']],
  ['@fontsource/instrument-serif', ['400', '400-italic']],
  ['@fontsource/jetbrains-mono', ['400', '500', '600', '700']],
];

const FONT_HOST = 'https://fonts.test';

const css = SHEETS.flatMap(([pkg, files]) =>
  files.map((f) =>
    readFileSync(join(pkgDir(pkg), `${f}.css`), 'utf8').replaceAll(
      'url(./files/',
      `url(${FONT_HOST}/${pkg}/files/`,
    ),
  ),
).join('\n');

export async function serveLocalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: css }),
  );
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route(`${FONT_HOST}/**`, (route) => {
    const path = new URL(route.request().url()).pathname.slice(1);
    const [scope, name, ...rest] = path.split('/');
    const file = join(pkgDir(`${scope}/${name}`), ...rest);
    const type = file.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
    return route.fulfill({ contentType: type, body: readFileSync(file) });
  });
}
