#!/usr/bin/env node
// Enforces lockstep versioning: every workspace package.json version must
// equal the root version. Run in CI and before publish.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const expected = rootPkg.version;

const dirs = ['packages', 'apps'];
const mismatches = [];

for (const dir of dirs) {
  const base = join(root, dir);
  if (!existsSync(base)) continue;
  for (const entry of readdirSync(base)) {
    const pkgPath = join(base, entry, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg.private) continue;
    if (pkg.version !== expected) {
      mismatches.push(`  ${pkg.name}: ${pkg.version} (expected ${expected})`);
    }
  }
}

// Optional: when GIT_TAG is set (publish workflow), the tag must match too.
const gitTag = process.env.GIT_TAG;
if (gitTag && gitTag !== expected) {
  mismatches.push(`  git tag: ${gitTag} (expected ${expected})`);
}

if (mismatches.length > 0) {
  console.error(`Version mismatch — expected ${expected}:\n${mismatches.join('\n')}`);
  process.exit(1);
}

console.log(`All published packages are at ${expected}.`);
