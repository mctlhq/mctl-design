#!/usr/bin/env node
// The CDN serves /<version>/mctl.css with a one-year immutable cache
// (nginx.conf). That is only honest if a given version's bytes never change,
// and ui.mctl.ai deploys on every merge to main rather than on a tag — so
// nothing but this check stands between "immutable" and a lie.
//
// Rule: a change under packages/tokens/src, packages/css/src, or either
// package's scripts/ directory must come with a root version bump — the
// generators produce the published bytes as much as the sources do.
// Everything else — Storybook, docs, CI, components that do not feed
// theme.css — is free to land without one.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = process.env.BASE_REF || 'origin/main';

const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

// Skip only when the base ref genuinely is not there — a fork without the
// remote, or a local run on a fresh clone. Everything else must be loud: a
// swallowed git error would print `skipping`, exit 0, and leave a green check
// named "Check token changes carry a version bump" that never checked
// anything, which is worse than having no check at all.
try {
  git('rev-parse', '--verify', `${base}^{commit}`);
} catch {
  console.log(`check-token-version-bump: no ${base} to diff against, skipping.`);
  process.exit(0);
}

const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);

// The scripts belong here as much as the sources do: dist/tokens.css is
// emitted by packages/tokens/scripts/gen-assets.mjs and the sheet is assembled
// by packages/css/scripts/build-css.mjs, so a change to either rewrites the
// published bytes without touching src/ at all. Renaming a custom property in
// gen-assets.mjs would otherwise ship a materially different sheet under a
// version already cached immutable for a year.
const SOURCES = [
  'packages/tokens/src/',
  'packages/css/src/',
  'packages/tokens/scripts/',
  'packages/css/scripts/',
];
const touched = changed.filter((f) => SOURCES.some((s) => f.startsWith(s)));
if (touched.length === 0) {
  console.log('check-token-version-bump: no token or theme sources touched.');
  process.exit(0);
}

const current = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const previous = JSON.parse(git('show', `${base}:package.json`)).version;

if (current === previous) {
  console.error(
    `The published CSS changed but the version did not.\n\n` +
      touched.map((f) => `  ${f}`).join('\n') +
      `\n\nhttps://ui.mctl.ai/${current}/mctl.css is served immutable for a year, ` +
      `so shipping different bytes under ${current} would hand consumers a sheet ` +
      `they can never refresh. Bump the root version and the three published ` +
      `package.json files (pnpm check:versions enforces lockstep).\n`,
  );
  process.exit(1);
}

console.log(`check-token-version-bump: ${previous} -> ${current} for ${touched.length} changed source file(s).`);
