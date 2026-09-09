#!/usr/bin/env node
// The CDN serves /<version>/mctl.css with a one-year immutable cache
// (nginx.conf). That is only honest if a given version's bytes never change,
// and ui.mctl.ai deploys on every merge to main rather than on a tag — so
// nothing but this check stands between "immutable" and a lie.
//
// Rule: a change under packages/tokens/src or packages/css/src must come with
// a root version bump. Everything else — Storybook, docs, CI, components that
// do not feed theme.css — is free to land without one.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = process.env.BASE_REF || 'origin/main';

const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

let changed;
try {
  changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
} catch {
  // No base to compare against (a shallow clone, or main itself). Nothing to
  // assert — better than failing a build for a reason unrelated to its diff.
  console.log(`check-token-version-bump: no ${base} to diff against, skipping.`);
  process.exit(0);
}

const SOURCES = ['packages/tokens/src/', 'packages/css/src/'];
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
