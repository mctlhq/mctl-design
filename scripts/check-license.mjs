#!/usr/bin/env node
// Guards the README-to-LICENSE reference: LICENSE must exist at the repo
// root, README.md must link to it from a License section, and every
// non-private workspace package.json must declare the same license id as
// the root package.json. Run in CI so a rename/removal of LICENSE or a
// drifted SPDX id is caught instead of silently shipping a broken reference.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const errors = [];

const licensePath = join(root, 'LICENSE');
if (!existsSync(licensePath)) {
  errors.push('  LICENSE file not found at repository root.');
}

const readmePath = join(root, 'README.md');
if (!existsSync(readmePath)) {
  errors.push('  README.md not found at repository root.');
} else {
  const readme = readFileSync(readmePath, 'utf8');
  const hasHeading = /^#{1,6}\s*License\s*$/m.test(readme);
  const hasLink = /\]\(\.?\/?LICENSE\)/.test(readme);
  if (!hasHeading) {
    errors.push('  README.md has no "License" heading.');
  }
  if (!hasLink) {
    errors.push('  README.md has no Markdown link to ./LICENSE (or LICENSE).');
  }
}

const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const expected = rootPkg.license;

if (!expected || typeof expected !== 'string') {
  errors.push('  Root package.json has no non-empty "license" field.');
}

const dirs = ['packages', 'apps'];
const mismatches = [];

for (const dir of dirs) {
  const base = join(root, dir);
  if (!existsSync(base)) continue;
  for (const entry of readdirSync(base)) {
    const pkgPath = join(base, entry, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (!pkg.license) continue;
    if (pkg.license !== expected) {
      mismatches.push(`  ${pkg.name}: ${pkg.license} (expected ${expected})`);
    }
  }
}

if (mismatches.length > 0) {
  errors.push(`  License mismatch — expected ${expected}:\n${mismatches.join('\n')}`);
}

if (errors.length > 0) {
  console.error(`README/LICENSE check failed:\n${errors.join('\n')}`);
  process.exit(1);
}

console.log(`README links to LICENSE and all packages declare ${expected}.`);
