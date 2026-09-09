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

// --no-renames, because rename detection is on by default and `--name-only`
// prints only the destination of a detected rename. `git mv` of a published
// directory somewhere out of the way would otherwise show up as paths that no
// longer look like a version directory at all, and the frozen check below would
// never see the source it is meant to protect.
const changed = git('diff', '--no-renames', '--name-only', `${base}...HEAD`)
  .split('\n')
  .filter(Boolean);

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

const current = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;

// Already-published version directories are frozen, and this runs before the
// early exit below because the diffs that reach them touch no source at all.
// `SOURCES` guards the inputs to a versioned sheet; nothing guarded the sheets
// themselves, and ci.yml's cleanliness step compares against HEAD, so a
// *committed* edit leaves the tree clean. A repo-wide `**/*.css` sweep — one
// hex value replaced everywhere, a formatter pass, a renamed custom property —
// or a `git rm` of what reads as a stale build artifact would both pass every
// other gate while rewriting or deleting a URL consumers have cached immutable
// for a year and cannot refresh.
//
// "Published" is "present on the base ref", not "not the current version". The
// version-named exemption reopened the hole on a rollback: set the root back to
// an already-shipped value and its live directory becomes writable again —
// worse, the cleanliness step then *demands* the commit that rewrites it,
// because the build regenerates those files from newer sources. A freshly cut
// directory is absent from the base and stays writable; anything already on
// main does not, whatever the version field says.
//
// The shape is the semver one nginx.conf matches, with a trailing slash: a path
// *inside* a version directory. A bare digit test also fires on a 404.html or a
// 2x/ asset directory, failing safe but with a message naming something that
// was never on the CDN.
// Left to throw. `git cat-file -e` cannot separate "path absent from the tree"
// from "object store unreadable" by exit code, and onBase treats every failure
// as absent — i.e. as writable. Asserting the base tree is readable once, up
// front, turns a broken or partial object store into a loud failure and leaves
// onBase answering only the question it can actually answer.
git('rev-parse', '--verify', `${base}^{tree}`);

const onBase = (p) => {
  try {
    // stdio ignored: a miss is the expected answer for a freshly cut
    // directory, and git writes "exists on disk, but not in <ref>" to stderr
    // for every one of them.
    execFileSync('git', ['cat-file', '-e', `${base}:${p}`], {
      cwd: root,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
};
const frozen = changed.filter(
  (f) => /^apps\/storybook\/public\/\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?\//.test(f) && onBase(f),
);
if (frozen.length > 0) {
  console.error(
    `A published version directory changed:\n\n` +
      frozen.map((f) => `  ${f}`).join('\n') +
      `\n\nThose files are served immutable for a year, so consumers pinned to ` +
      `them can never pick up an edit and never recover from a deletion. Cut a ` +
      `new version instead.\n`,
  );
  process.exit(1);
}

// Read above the early exit for the same reason `frozen` sits there: a version
// rollback touches no source at all.
const previous = JSON.parse(git('show', `${base}:package.json`)).version;

// A version moving backwards puts an already-published directory back under the
// build, and without this the author never hears that. `frozen` is empty on the
// first push — nothing under a published directory is *committed* as changed
// yet — so the only failure is the cleanliness step saying "Generated CSS is not
// committed", whose obvious remedy is to commit the regenerated 0.5.0 sheets.
// That commit is precisely what poisons the URL, and only then does `frozen`
// print the right diagnosis. Refusing the rollback itself puts the correct
// message first.
const order = (v) => {
  const [core, pre] = v.split('-');
  // A prerelease sorts below the release it leads to; the exact identifier
  // ordering does not matter here, only that 0.6.0-rc.1 < 0.6.0.
  return [...core.split('.').map(Number), pre === undefined ? 1 : 0];
};
const movedBackwards = (a, b) => {
  const [x, y] = [order(a), order(b)];
  for (let i = 0; i < x.length; i += 1) {
    if (x[i] !== y[i]) return x[i] < y[i];
  }
  return false;
};
if (movedBackwards(current, previous)) {
  console.error(
    `The root version moved backwards: ${previous} -> ${current}.\n\n` +
      `apps/storybook/public/${current}/ is already published and served ` +
      `immutable for a year, so the build would regenerate it from newer ` +
      `sources and CI would then ask you to commit the result. Cut a higher ` +
      `version instead, or revert the whole release including its version ` +
      `directory.\n`,
  );
  process.exit(1);
}

if (touched.length === 0) {
  console.log('check-token-version-bump: no token or theme sources touched.');
  process.exit(0);
}

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
