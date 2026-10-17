#!/usr/bin/env node
// Lints each published package as a consumer would install it: publint
// checks the packed manifest (exports, files, types paths), and
// arethetypeswrong checks that every JS entry point resolves to its types.
// CSS subpaths are not JS entry points, so attw skips them. Reads dist/, so
// it runs after the build.
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packages = [
  { dir: 'packages/tokens', cssEntries: ['tokens.css'] },
  {
    dir: 'packages/css',
    cssEntries: ['theme.css', 'global.css', 'prose.css', 'telegram.css', 'tailwind.css'],
  },
  { dir: 'packages/ui', cssEntries: ['style.css'] },
];

let failed = false;
const run = (args, cwd) => {
  try {
    execFileSync('pnpm', ['exec', ...args], { cwd, stdio: 'inherit' });
  } catch {
    failed = true;
  }
};

for (const { dir, cssEntries } of packages) {
  const cwd = join(root, dir);
  run(['publint', '--strict', '.'], cwd);
  run(
    ['attw', '--pack', '.', '--profile', 'esm-only', '--exclude-entrypoints', ...cssEntries],
    cwd,
  );
}

if (failed) process.exit(1);
