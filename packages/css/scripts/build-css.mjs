#!/usr/bin/env node
// Assembles the published CSS. theme.css is the self-contained artifact:
// raw token custom properties (from @mctlhq/tokens) inlined ahead of the
// semantic theme layer, so consumers need no @mctlhq/tokens at runtime.
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(pkgRoot, 'src');
const dist = join(pkgRoot, 'dist');
const require = createRequire(import.meta.url);

const version = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8')).version;

const tokensCss = readFileSync(require.resolve('@mctlhq/tokens/tokens.css'), 'utf8');
const semanticCss = readFileSync(join(src, 'theme.css'), 'utf8');
// The version is in the file, not only in the path it happens to be served
// from. A consumer that vendors this sheet (seerrsense does) then records
// exactly what it copied, and a mismatch is readable in a diff rather than
// inferred from HTTP last-modified. Nothing else varies per build — a build
// date here would make every consumer's vendored copy stale on every deploy.
const themeCss = `/* @mctlhq/css ${version} — raw tokens + semantic theme layer. */\n${tokensCss}\n${semanticCss}`;

writeFileSync(join(dist, 'theme.css'), themeCss);
// The same marker on every sheet that gets a versioned copy. A reader told the
// three move as a set will check a vendored global.css the way they check
// mctl.css, and finding no version there makes the set look like a claim
// rather than a fact.
for (const name of ['global.css', 'prose.css']) {
  writeFileSync(
    join(dist, name),
    `/* @mctlhq/css ${version} — ${name}. */\n${readFileSync(join(src, name), 'utf8')}`,
  );
}
copyFileSync(join(src, 'telegram.css'), join(dist, 'telegram.css'));

console.log('css: wrote theme.css, global.css, prose.css, telegram.css');

// Copy mctl.css bundle into the Storybook public dir so it's served at
// https://ui.mctl.ai/mctl.css for CDN consumers (e.g. mctl-telegram).
// Guard: only runs inside the monorepo where the storybook app exists.
const storybookPublic = join(pkgRoot, '../../apps/storybook/public');
if (existsSync(storybookPublic)) {
  copyFileSync(join(dist, 'theme.css'), join(storybookPublic, 'mctl.css'));
  copyFileSync(join(dist, 'global.css'), join(storybookPublic, 'global.css'));
  copyFileSync(join(dist, 'prose.css'), join(storybookPublic, 'prose.css'));
  console.log('css: copied mctl.css, global.css, prose.css to storybook/public');

  // Second copy under the version, served immutable so a consumer can pin it
  // (#75). /mctl.css keeps floating with main; this one does not move, which
  // is only true because scripts/check-token-version-bump.mjs refuses a change
  // to the token or theme sources that does not also bump the version.
  //
  // These are committed, like public/mctl.css already is, and that is what
  // keeps old pins alive: a build only ever writes the version it is building,
  // so an uncommitted directory would disappear from the image the moment the
  // next release is cut and every URL pinned to the previous one would 404.
  // All three, not only mctl.css. global.css owns body typography and base
  // element styles, so a snippet that pins the theme and leaves global.css
  // floating is pinned in name only — the reader believes they are covered.
  const versioned = join(storybookPublic, version);
  mkdirSync(versioned, { recursive: true });
  copyFileSync(join(dist, 'theme.css'), join(versioned, 'mctl.css'));
  copyFileSync(join(dist, 'global.css'), join(versioned, 'global.css'));
  copyFileSync(join(dist, 'prose.css'), join(versioned, 'prose.css'));
  console.log(`css: copied mctl.css, global.css, prose.css to storybook/public/${version}/`);
}
