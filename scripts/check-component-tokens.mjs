#!/usr/bin/env node
// Component styles take borders, focus rings, opacities, durations and
// stacking from tokens, not literals. 0.11.0 moved them over; this keeps a
// later edit from quietly reintroducing `1px solid`, a `0.5` disabled state
// or a `0.2s` transition that a token change and reduced motion no longer
// reach. MTg*.vue is exempt: those components keep literal fallbacks inside
// var() on purpose, for Mini Apps that load telegram.css without theme.css.
//
// Known limits, so nobody reads more into a pass than it says:
// - only <style> blocks are read; a literal in a template `style` or
//   `:style` binding is not seen;
// - the MTg exemption covers the whole file, not just its var() fallbacks;
// - easings are not checked: MTgSheet keeps a curve no token matches.
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(root, 'packages/ui/src/components');

// Each rule sees one declaration's property and value, with var() fallbacks
// removed so `var(--x, 1px)` is not mistaken for a literal.
// A declaration is reported once, under the first rule it breaks.
const PX = /\b\d*\.?\d+px\b/;
const RULES = [
  {
    why: 'a literal border/outline width (use --mctl-border-width-* or --focus-ring-width)',
    test: (prop, value) =>
      /^(border|outline)(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-width)?$/.test(
        prop,
      ) && PX.test(value),
  },
  {
    why: 'a literal radius (use --mctl-radius-*)',
    test: (prop, value) => /^border(-[a-z]+)*-radius$/.test(prop) && PX.test(value),
  },
  {
    why: 'a literal shadow (use --control-focus-shadow*, --shadow-* or --mctl-shadow-*)',
    test: (prop, value) => prop === 'box-shadow' && /\b\d*\.?\d+(px|%)/.test(value),
  },
  {
    why: 'a literal focus offset (use --focus-ring-offset)',
    test: (prop, value) => prop === 'outline-offset' && PX.test(value),
  },
  {
    why: 'a fractional opacity (use --mctl-opacity-*)',
    test: (prop, value) => prop === 'opacity' && /^0?\.\d+$/.test(value.trim()),
  },
  {
    why: 'a literal duration (use --mctl-motion-duration-*)',
    test: (prop, value) =>
      /^(transition|animation)(-duration|-delay)?$/.test(prop) && /\b\d*\.?\d+m?s\b/.test(value),
  },
  {
    why: 'a literal z-index (use --mctl-z-index-*)',
    test: (prop, value) => prop === 'z-index' && /^\s*-?\d+\s*$/.test(value),
  },
];

// var(--name, fallback) -> var(--name), innermost first.
function stripFallbacks(value) {
  let prev;
  do {
    prev = value;
    value = value.replace(/var\(\s*(--[\w-]+)\s*,[^()]*(?:\([^()]*\)[^()]*)*\)/g, 'var($1)');
  } while (value !== prev);
  return value;
}

export function findLiterals(source) {
  const found = [];
  for (const block of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const offset = block.index + block[0].indexOf(block[1]);
    const css = block[1].replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
    for (const decl of css.matchAll(/([-\w]+)\s*:\s*([^;{}]+)/g)) {
      const [, prop, raw] = decl;
      if (prop.startsWith('--')) continue;
      const value = stripFallbacks(raw);
      const rule = RULES.find((r) => r.test(prop, value));
      if (rule) {
        const line = source.slice(0, offset + decl.index).split('\n').length;
        found.push({ line, text: `${prop}: ${raw.trim().replace(/\s+/g, ' ')}`, why: rule.why });
      }
    }
  }
  return found;
}

if (process.argv.includes('--selftest')) {
  // One declaration per rule, in RULES order, so each must be caught once
  // and under its own rule.
  const bad = `<style>
.a { border-left-width: 3px; border-radius: 4px; box-shadow: 0 0 0 3px red; }
.b { outline-offset: 2px; opacity: 0.5; transition: color 0.2s ease; z-index: 100; }
</style>`;
  const good = `<style>
.a { border: var(--mctl-border-width-hairline) solid red; border-radius: var(--mctl-radius-md); opacity: 0; }
.b { transition: color var(--mctl-motion-duration-fast, 120ms) ease; z-index: var(--mctl-z-index-sticky, 100); }
.c { outline-offset: calc(-1 * var(--focus-ring-offset)); margin: 0 1px; box-shadow: var(--control-focus-shadow); }
</style>`;
  const badFound = findLiterals(bad).map((f) => f.why);
  const goodFound = findLiterals(good);
  const expected = RULES.map((r) => r.why);
  const problems = [];
  if (badFound.join('\n') !== expected.join('\n'))
    problems.push(
      `bad fixture reported\n    ${badFound.join('\n    ')}\n  expected\n    ${expected.join('\n    ')}`,
    );
  if (goodFound.length)
    problems.push(
      `false positives in the good fixture: ${goodFound.map((f) => f.text).join('; ')}`,
    );
  if (problems.length) {
    console.error(`check-component-tokens selftest failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log(
    `check-component-tokens: selftest ok (each of ${RULES.length} rules catches its literal once, no false positives).`,
  );
  process.exit(0);
}

// Recursive, so a component moved into a subdirectory stays covered.
const files = readdirSync(dir, { recursive: true }).filter(
  (f) => f.endsWith('.vue') && !basename(f).startsWith('MTg'),
);
const failures = files.flatMap((f) =>
  findLiterals(readFileSync(join(dir, f), 'utf8')).map(
    (x) => `${f}:${x.line}  ${x.text}  -- ${x.why}`,
  ),
);
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(
    `\ncheck-component-tokens: ${failures.length} literal value(s) in component styles.`,
  );
  process.exit(1);
}
console.log(`check-component-tokens: ${files.length} components take these values from tokens.`);
