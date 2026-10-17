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

// A tagged release must have its CHANGELOG.md entry; 0.6.0 and 0.7.0 went
// out with nothing written down. A prerelease may use its final version's
// heading (0.9.0-rc.1 is covered by "## 0.9.0").
if (gitTag) {
  const changelog = join(root, 'CHANGELOG.md');
  const text = existsSync(changelog) ? readFileSync(changelog, 'utf8') : '';
  const heading = (v) => new RegExp(`^## ${v.replace(/[.+]/g, '\\$&')}(\\s|$)`, 'm');
  if (!heading(expected).test(text) && !heading(expected.split('-')[0]).test(text)) {
    mismatches.push(`  CHANGELOG.md: no "## ${expected}" entry`);
  }
}

if (mismatches.length > 0) {
  console.error(`Version mismatch — expected ${expected}:\n${mismatches.join('\n')}`);
  process.exit(1);
}

console.log(`All published packages are at ${expected}.`);
