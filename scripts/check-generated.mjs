#!/usr/bin/env node
// Structural checks over the two generated exports nothing else inspects.
// Run after `pnpm build`.
//
//   packages/css/dist/tailwind.css     every var() in the runtime block names
//                                      a variable theme.css defines, and no
//                                      theme variable references itself (that
//                                      would void theme.css's value at runtime)
//   packages/tokens/dist/tokens.dtcg.json
//                                      every alias resolves to a token of the
//                                      same $type; colours carry a hex and
//                                      dimensions a px/rem unit
import { existsSync, readFileSync } from 'node:fs';

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
for (const [, options, body] of tw.matchAll(/@theme([^{]*)\{([^}]*)\}/g)) {
  const emitted = !/\breference\b/.test(options);
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    for (const [, ref] of value.matchAll(/var\((--[\w-]+)\)/g)) {
      if (ref === name && emitted) problems.push(`${TW}: ${name} references itself in an emitted @theme block`);
      else if (ref !== name && !themeVars.has(ref)) problems.push(`${TW}: ${name} uses ${ref}, which theme.css does not define`);
      else if (ref === name && !themeVars.has(ref)) problems.push(`${TW}: ${name} points at ${ref}, which theme.css does not define`);
    }
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
console.log(`check-generated: tailwind.css and ${leaves.size} DTCG tokens are consistent.`);
