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
};
const built = compiler.build(Object.keys(expected));
for (const [utility, declaration] of Object.entries(expected)) {
  const selector = `.${utility.replace('/', '\\/')} {`;
  const start = built.indexOf(selector);
  const rule = start === -1 ? '' : built.slice(start, built.indexOf('\n  }', start));
  if (!rule) problems.push(`tailwind v4: ${utility} produced no rule`);
  else if (!rule.includes(declaration)) problems.push(`tailwind v4: ${utility} does not contain "${declaration}"`);
}
for (const [, name, ref] of built.matchAll(/(--[\w-]+):\s*var\((--[\w-]+)\);/g)) {
  if (name === ref) problems.push(`tailwind v4: compiled output emits self-referencing ${name}`);
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
  `check-generated: ${refs} tailwind.css references, ${Object.keys(expected).length} compiled utilities and ${leaves.size} DTCG tokens are consistent.`,
);
