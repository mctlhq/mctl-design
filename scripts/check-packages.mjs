#!/usr/bin/env node
// Lints each published package as a consumer would install it: publint
// checks the packed manifest (exports, files, types paths), and
// arethetypeswrong checks that every JS entry point resolves to its types.
// The package list and the CSS subpaths attw skips both come from disk, so
// a new package or export is checked without editing this file. attw
// resolves JSON subpaths itself; a CSS subpath has nothing to resolve to.
// Reads dist/, so it runs after the build.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packages = [];
for (const dir of ['packages', 'apps']) {
  const base = join(root, dir);
  if (!existsSync(base)) continue;
  for (const entry of readdirSync(base)) {
    const pkgPath = join(base, entry, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg.private) continue;
    const cssEntries = Object.keys(pkg.exports ?? {})
      .filter((key) => key.endsWith('.css'))
      .map((key) => key.replace(/^\.\//, ''));
    packages.push({ name: pkg.name, cwd: join(base, entry), cssEntries });
  }
}

let failed = false;
const run = (args, name, cwd) => {
  try {
    execFileSync('pnpm', ['exec', ...args], { cwd, stdio: 'inherit' });
  } catch (err) {
    // A shape violation has already printed; this line names the tool, and
    // is the only output when the tool never ran (pnpm or attw missing).
    console.error(
      `check:packages: ${args[0]} failed for ${name}${err.code ? ` (${err.code})` : ''}`,
    );
    failed = true;
  }
};

if (packages.length === 0) {
  console.error('check:packages: no published package found');
  process.exit(1);
}
for (const { name, cwd, cssEntries } of packages) {
  run(['publint', '--strict', '.'], name, cwd);
  const exclude = cssEntries.length > 0 ? ['--exclude-entrypoints', ...cssEntries] : [];
  run(['attw', '--pack', '.', '--profile', 'esm-only', ...exclude], name, cwd);
}

if (failed) process.exit(1);
console.log(`check:packages: ${packages.map((p) => p.name).join(', ')} pass publint and attw.`);
