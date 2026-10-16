#!/usr/bin/env node
// Structural checks over the two generated exports nothing else inspects.
// Run after `pnpm build`.
//
//   packages/css/dist/tailwind.css     every var() in the runtime block names
//                                      a variable theme.css defines, and no
//                                      theme variable references itself (that
//                                      would void theme.css's value at runtime);
//                                      then it is compiled with tailwindcss 4
//                                      and the mapped utilities are asserted
//   packages/tokens/dist/tokens.dtcg.json
//                                      every alias resolves to a token of the
//                                      same $type; colours carry a hex and
//                                      dimensions a px/rem unit
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const TW = 'packages/css/dist/tailwind.css';
const THEME = 'packages/css/dist/theme.css';
const DTCG = 'packages/tokens/dist/tokens.dtcg.json';

for (const file of [TW, THEME, DTCG]) {
  if (!existsSync(file)) {
    console.error(`check-generated: ${file} is missing -- run \`pnpm build\` first.`);
    process.exit(1);
  }
}

const problems = [];

// tailwind.css
const tw = readFileSync(TW, 'utf8');
const themeVars = new Set([...readFileSync(THEME, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
// A `reference` block is never emitted, so `--shadow-sm: var(--shadow-sm)`
// there only tells utilities which runtime var to use. In an emitted block the
// same line would be a self-reference that voids theme.css's value.
let refs = 0;
for (const [, options, body] of tw.matchAll(/@theme([^{]*)\{([^}]*)\}/g)) {
  const emitted = !/\breference\b/.test(options);
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    for (const [, ref] of value.matchAll(/var\((--[\w-]+)\)/g)) {
      refs++;
      if (ref === name && emitted) problems.push(`${TW}: ${name} references itself in an emitted @theme block`);
      else if (ref !== name && !themeVars.has(ref)) problems.push(`${TW}: ${name} uses ${ref}, which theme.css does not define`);
      else if (ref === name && !themeVars.has(ref)) problems.push(`${TW}: ${name} points at ${ref}, which theme.css does not define`);
    }
  }
}

// Zero references checked would read exactly like all references passing:
// a parser that stopped matching the generator's output must fail, not pass.
if (refs === 0) problems.push(`${TW}: no var() references found -- the @theme parser no longer matches this file`);

// Compile it with the real Tailwind v4 (the devDependency of @mctlhq/css) and
// check what the utilities resolve to: a theme sheet can be internally
// consistent and still map a utility to the wrong variable.
const require = createRequire(join(process.cwd(), 'packages/css/package.json'));
const { compile } = require('tailwindcss');
const twIndex = join(dirname(require.resolve('tailwindcss/package.json')), 'index.css');
const sheets = { tailwindcss: twIndex, './theme.css': THEME, './tailwind.css': TW };
const compiler = await compile('@import "tailwindcss";\n@import "./theme.css";\n@import "./tailwind.css";', {
  base: process.cwd(),
  loadStylesheet: async (id) => ({ path: sheets[id], base: process.cwd(), content: readFileSync(sheets[id], 'utf8') }),
});
const expected = {
  'bg-surface-card': 'background-color: var(--surface-card)',
  'text-accent': 'color: var(--accent)',
  'bg-accent/50': 'color-mix(in oklab, var(--accent) 50%, transparent)',
  'text-syntax-key': 'color: var(--syntax-key)',
  'font-mono': 'font-family: var(--font-mono)',
  'shadow-md': '--tw-shadow: var(--shadow-md)',
  'text-hero': 'font-size: var(--text-hero)',
  'p-mctl-5': 'padding: var(--spacing-mctl-5)',
  'max-w-pagew': 'max-width: var(--spacing-pagew)',
  // The MCTL scale must not clobber Tailwind's own numeric keys.
  'p-5': 'padding: calc(var(--spacing) * 5)',
  'duration-base': 'transition-duration: 200ms',
  'outline-focus': 'outline-width: var(--focus-ring-width)',
};
const built = compiler.build(Object.keys(expected));
for (const [utility, declaration] of Object.entries(expected)) {
  const selector = `.${utility.replace('/', '\\/')} {`;
  const start = built.indexOf(selector);
  const end = start === -1 ? -1 : built.indexOf('\n  }', start);
  if (start === -1) problems.push(`tailwind v4: ${utility} produced no rule`);
  else if (end === -1) problems.push(`tailwind v4: cannot delimit the ${utility} rule -- the compiled output format changed`);
  else if (!built.slice(start, end).includes(declaration)) problems.push(`tailwind v4: ${utility} does not contain "${declaration}"`);
}
for (const [, name, ref] of built.matchAll(/(--[\w-]+):\s*var\((--[\w-]+)\);/g)) {
  if (name === ref) problems.push(`tailwind v4: compiled output emits self-referencing ${name}`);
}

// Parity with the v3 preset: every key it extends must yield a working v4
// utility, or be one of the README's documented differences -- in which case
// the documented v4 replacement must work instead. Unknown utilities compile
// to nothing without a warning, so a dropped family would otherwise go
// unnoticed by everyone but the consumer.
const { default: preset } = await import(new URL('../packages/css/dist/tailwind-preset.js', import.meta.url));
const ext = preset.theme.extend;
const flat = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flat(v, [...prefix, k]) : [[...prefix, k]],
  );
const name = (path) => path.filter((k) => k !== 'DEFAULT').join('-');
const parity = new Map(); // candidate -> preset key it stands for
const add = (candidate, key) => parity.set(candidate, key);
for (const p of flat(ext.colors)) add(`bg-${name(p)}`, `colors.${p.join('.')}`);
for (const k of Object.keys(ext.fontFamily)) add(`font-${k}`, `fontFamily.${k}`);
for (const k of Object.keys(ext.fontWeight)) add(`font-${k}`, `fontWeight.${k}`);
for (const k of Object.keys(ext.fontSize)) add(`text-${k}`, `fontSize.${k}`);
for (const k of Object.keys(ext.letterSpacing)) add(`tracking-${k}`, `letterSpacing.${k}`);
for (const k of Object.keys(ext.spacing)) add(/^\d+$/.test(k) ? `p-mctl-${k}` : `p-${k}`, `spacing.${k}`);
for (const k of Object.keys(ext.borderRadius)) add(`rounded-${k}`, `borderRadius.${k}`);
for (const k of Object.keys(ext.boxShadow)) add(`shadow-${k}`, `boxShadow.${k}`);
for (const k of Object.keys(ext.screens)) add(`${k}:p-1`, `screens.${k}`);
for (const k of Object.keys(ext.width)) add(`w-${k}`, `width.${k}`);
for (const k of Object.keys(ext.height)) add(`h-${k}`, `height.${k}`);
for (const k of Object.keys(ext.transitionTimingFunction)) add(`ease-${k}`, `transitionTimingFunction.${k}`);
// Documented differences (README, "Tailwind -- npm"): the v4 replacement.
const kebab = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
add('max-w-pagew', 'maxWidth.page');
add('max-w-(--container-prose)', 'maxWidth.prose');
for (const k of Object.keys(ext.transitionDuration)) add(`duration-${k}`, `transitionDuration.${k}`);
for (const k of Object.keys(ext.opacity)) add(`opacity-${kebab(k)}`, `opacity.${k}`);
// borderWidth.none is Tailwind's own border-none (border-style: none).
for (const k of Object.keys(ext.borderWidth)) add(`border-${k}`, `borderWidth.${k}`);
add('outline-focus', 'outlineWidth.focus');
add('outline-offset-focus', 'outlineOffset.focus');
const covered = new Set([
  'colors', 'fontFamily', 'fontWeight', 'fontSize', 'letterSpacing', 'spacing', 'borderRadius',
  'boxShadow', 'screens', 'width', 'height', 'transitionTimingFunction', 'maxWidth',
  'transitionDuration', 'opacity', 'borderWidth', 'outlineWidth', 'outlineOffset',
]);
for (const group of Object.keys(ext)) {
  if (!covered.has(group)) problems.push(`tailwind v4 parity: preset group "${group}" is not mapped in check-generated`);
}
const parityCss = compiler.build([...parity.keys()]);
// CSS.escape-style: punctuation gets a backslash, a leading digit becomes a
// code-point escape (2xl -> \32 xl).
const escape = (c) =>
  c.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`).replace(/^(\d)/, (d) => `\\3${d} `);
for (const [candidate, key] of parity) {
  if (!parityCss.includes(`.${escape(candidate)}`)) {
    problems.push(`tailwind v4 parity: ${key} -> \`${candidate}\` produces no rule`);
  }
}

// tokens.dtcg.json
const dtcg = JSON.parse(readFileSync(DTCG, 'utf8'));
const leaves = new Map();
const walk = (node, path) => {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const id = [...path, key].join('.');
    if (value && typeof value === 'object' && '$value' in value) leaves.set(id, value);
    else if (value && typeof value === 'object') walk(value, [...path, key]);
  }
};
walk(dtcg, []);
for (const [id, token] of leaves) {
  const v = token.$value;
  if (typeof v === 'string' && /^\{.+\}$/.test(v)) {
    const target = leaves.get(v.slice(1, -1));
    if (!target) problems.push(`${DTCG}: ${id} aliases ${v}, which does not exist`);
    else if (target.$type !== token.$type) problems.push(`${DTCG}: ${id} ($type ${token.$type}) aliases ${v} ($type ${target.$type})`);
  } else if (token.$type === 'color' && !/^#[0-9a-f]{6}$/.test(v?.hex ?? '')) {
    problems.push(`${DTCG}: ${id} is a color without a hex`);
  } else if (token.$type === 'dimension' && !['px', 'rem'].includes(v?.unit)) {
    problems.push(`${DTCG}: ${id} is a dimension without a px/rem unit`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\ncheck-generated: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(
  `check-generated: ${refs} tailwind.css references, ${Object.keys(expected).length} asserted utilities, ${parity.size} preset keys at v4 parity and ${leaves.size} DTCG tokens are consistent.`,
);
