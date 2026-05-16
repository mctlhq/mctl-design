#!/usr/bin/env node
// Emits the framework-agnostic token assets from the built ESM bundle:
//   dist/tokens.json  — machine-readable contract
//   dist/tokens.css   — flat CSS custom properties (--mctl-<group>-<path>)
// Runs after `tsup`, so dist/index.js exists.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokens } from '../dist/index.js';

const dist = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dist');

writeFileSync(join(dist, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');

const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const lines = [];
const walk = (prefix, obj) => {
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${kebab(key)}`;
    if (value !== null && typeof value === 'object') {
      walk(name, value);
    } else {
      lines.push(`  ${name}: ${value};`);
    }
  }
};
walk('--mctl', tokens);

writeFileSync(join(dist, 'tokens.css'), `:root {\n${lines.join('\n')}\n}\n`);

console.log(`tokens: wrote tokens.json and tokens.css (${lines.length} custom properties)`);
