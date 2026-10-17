#!/usr/bin/env node
// Enforces lockstep versioning: every workspace package.json version must
// equal the root version. Run in CI and before publish.
import { execFileSync } from 'node:child_process';
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

// Every version needs its CHANGELOG.md entry before it merges: ui.mctl.ai
// serves a version as soon as it reaches main, and 0.6.0 and 0.7.0 went out
// with nothing written down. A prerelease may use its final version's
// heading (0.9.0-rc.1 is covered by "## 0.9.0").
const escapeRegExp = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const changelogPath = join(root, 'CHANGELOG.md');
const changelog = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '';
const hasHeading = (v) => new RegExp(`^## ${escapeRegExp(v)}(\\s|$)`, 'm').test(changelog);
const changelogProblems = [];
const release = expected.split('-')[0];
if (!hasHeading(expected) && !hasHeading(release)) {
  const which = release === expected ? `"## ${expected}"` : `"## ${expected}" or "## ${release}"`;
  changelogProblems.push(`  no ${which} entry`);
}

// Changes that are not released yet collect under "## Unreleased". The PR
// that bumps the version renames that heading to the new version; a bump
// that leaves it behind ships those changes under a heading that says they
// are not out. Only a PR knows it bumped, so this runs when BASE_REF names
// the branch it targets (CI sets it); locally and at publish it is skipped.
const baseRef = process.env.BASE_REF;
if (baseRef && hasHeading('Unreleased')) {
  const baseVersion = JSON.parse(
    execFileSync('git', ['show', `${baseRef}:package.json`], { cwd: root, encoding: 'utf8' }),
  ).version;
  if (baseVersion !== expected) {
    changelogProblems.push(
      `  "## Unreleased" is still there, but this change bumps ${baseVersion} to ${expected}: rename it to "## ${release}"`,
    );
  }
}

if (mismatches.length > 0) {
  console.error(`Version mismatch — expected ${expected}:\n${mismatches.join('\n')}`);
}
if (changelogProblems.length > 0) {
  console.error(`CHANGELOG.md is not ready for ${expected}:\n${changelogProblems.join('\n')}`);
}
if (mismatches.length > 0 || changelogProblems.length > 0) process.exit(1);

console.log(`All published packages are at ${expected}.`);
