#!/usr/bin/env node
// site.css contract: every class in REQUIRED is both defined as a selector and
// named in the sheet's leading contract comment, and the language switcher
// keeps the properties its recipe promises (24px targets, a 2px neutral
// current-language underline, a focus ring). The Storybook play functions
// check the rendered result; this runs in CI without a browser and fails the
// moment the class is renamed, dropped or left out of the contract comment.
//
//   node scripts/check-site-contract.mjs            check packages/css/src/site.css
//   node scripts/check-site-contract.mjs --selftest prove each mutation fails
import { readFileSync } from 'node:fs';

const SITE = 'packages/css/src/site.css';

const REQUIRED = ['.mctl-site-lang'];

function rulesFor(css, selector) {
  // Declaration blocks of every rule whose selector list contains `selector`.
  const out = [];
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (sel.split(',').some((s) => s.trim() === selector)) out.push(body);
  }
  return out;
}

export function check(source) {
  const problems = [];
  const head = source.match(/^\s*\/\*([\s\S]*?)\*\//)?.[1] ?? '';
  const css = source.replace(/\/\*[\s\S]*?\*\//g, ' ');
  for (const cls of REQUIRED) {
    if (!head.includes(cls)) problems.push(`${cls} is not named in the leading contract comment`);
    if (rulesFor(css, cls).length === 0) problems.push(`${cls} has no rule`);
  }
  const link = rulesFor(css, '.mctl-site-lang a').join(';');
  if (!/min-width:\s*24px/.test(link) || !/min-height:\s*24px/.test(link)) {
    problems.push('.mctl-site-lang a no longer guarantees 24px targets');
  }
  const current = rulesFor(css, ".mctl-site-lang a[aria-current='page']").join(';');
  if (!/text-decoration-thickness:\s*2px/.test(current) || /var\(--accent/.test(current)) {
    problems.push('the current language must be a 2px underline and never the accent');
  }
  if (rulesFor(css, '.mctl-site-lang a:focus-visible').length === 0) {
    problems.push('.mctl-site-lang a has no :focus-visible rule');
  }
  return problems;
}

if (process.argv.includes('--selftest')) {
  const good = readFileSync(SITE, 'utf8');
  if (check(good).length > 0) {
    console.error('check-site-contract selftest: the committed sheet is not green:', check(good));
    process.exit(1);
  }
  const mutations = {
    'class renamed': (s) => s.replaceAll('.mctl-site-lang', '.mctl-site-language'),
    'comment drops the class': (s) =>
      s.replace(' *   - language switcher (.mctl-site-lang)', ' *   - language switcher'),
    'target shrinks': (s) => s.replace('min-height: 24px;', 'min-height: 16px;'),
    'current uses accent': (s) =>
      s.replace(
        /(\.mctl-site-lang a\[aria-current='page'\] \{\s*)color: var\(--surface-fg\);/,
        '$1color: var(--accent);\n  text-decoration-color: var(--accent);',
      ),
    'focus ring removed': (s) =>
      s.replace('.mctl-site-lang a:focus-visible', '.mctl-site-lang a:active'),
  };
  let bad = 0;
  for (const [name, mutate] of Object.entries(mutations)) {
    const mutated = mutate(good);
    if (mutated === good) {
      console.error(`selftest: mutation "${name}" did not change the sheet`);
      bad++;
    } else if (check(mutated).length === 0) {
      console.error(`selftest: mutation "${name}" was not caught`);
      bad++;
    }
  }
  if (bad > 0) process.exit(1);
  console.log(`check-site-contract selftest: ${Object.keys(mutations).length} mutations caught`);
} else {
  const problems = check(readFileSync(SITE, 'utf8'));
  if (problems.length > 0) {
    for (const p of problems) console.error(`check-site-contract: ${p}`);
    process.exit(1);
  }
  console.log('check-site-contract: ok');
}
