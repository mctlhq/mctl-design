#!/usr/bin/env node
// Nested theme and accent scopes resolve to the right palette.
//
// data-theme and data-accent may be set on any element, at any depth, in any
// combination. theme.css used to pair them only on the same element, so
// data-accent inside data-theme="light" got the dark palette and a nested
// data-theme reset the accent. jsdom does not resolve custom properties and
// CI has no browser, so this applies the cascade itself: the selectors
// theme.css uses (:root and attribute compounds), specificity, source order,
// inheritance, and var() with fallbacks and the guaranteed-invalid value.
// Run after `pnpm build` (it reads packages/css/dist and packages/tokens/dist).
import { readFileSync } from 'node:fs';

let tokens;
try {
  ({ tokens } = await import('../packages/tokens/dist/index.js'));
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  console.error('check-themes: packages/tokens/dist is missing -- run `pnpm build` first.');
  process.exit(1);
}

const css = readFileSync('packages/css/dist/theme.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');

// Top-level rules only: theme.css has no at-rules, and a nested one would be
// silently skipped here, so refuse it.
if (/@(media|supports|layer|scope|container)/.test(css)) {
  console.error('check-themes: theme.css has an at-rule; teach this check about it first.');
  process.exit(1);
}

const rules = [];
for (const [, selectorText, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const decls = [];
  for (const part of body.split(';')) {
    const i = part.indexOf(':');
    if (i === -1) continue;
    const name = part.slice(0, i).trim();
    if (name.startsWith('--')) decls.push([name, part.slice(i + 1)]);
  }
  for (const selector of selectorText.split(',').map((s) => s.trim())) {
    rules.push({ selector: parseSelector(selector), decls, order: rules.length });
  }
}

function parseSelector(text) {
  const parts = text.match(/:root|\[[a-z-]+(?:='[^']*')?\]/g) ?? [];
  if (parts.join('') !== text) {
    throw new Error(`check-themes: unsupported selector "${text}"; extend parseSelector`);
  }
  return parts.map((p) => {
    if (p === ':root') return { root: true };
    const [, attr, value] = p.match(/^\[([a-z-]+)(?:='([^']*)')?\]$/);
    return { attr, value };
  });
}

const matches = (selector, el) =>
  selector.every((p) =>
    p.root ? el.root : p.value === undefined ? p.attr in el.attrs : el.attrs[p.attr] === p.value,
  );

// Winning declared value per custom property: specificity, then source order.
function declared(el) {
  const won = new Map();
  for (const rule of rules) {
    if (!matches(rule.selector, el)) continue;
    const rank = [rule.selector.length, rule.order];
    for (const [name, value] of rule.decls) {
      const prev = won.get(name);
      if (
        !prev ||
        rank[0] > prev.rank[0] ||
        (rank[0] === prev.rank[0] && rank[1] >= prev.rank[1])
      ) {
        won.set(name, { value, rank });
      }
    }
  }
  return won;
}

// Computed custom properties for each element of a root-first chain.
// null is the guaranteed-invalid value.
function computeChain(chain) {
  let inherited = new Map();
  for (const el of chain) {
    const own = declared(el);
    const done = new Map();
    const resolving = new Set();
    const valueOf = (name) => {
      if (!own.has(name)) return inherited.get(name) ?? null;
      if (done.has(name)) return done.get(name);
      if (resolving.has(name)) return null; // a cycle is invalid at computed-value time
      resolving.add(name);
      const raw = own.get(name).value.trim();
      const value = raw === 'initial' ? null : substitute(raw, valueOf);
      resolving.delete(name);
      done.set(name, value);
      return value;
    };
    for (const name of own.keys()) valueOf(name);
    inherited = new Map([...inherited, ...done]);
  }
  return inherited;
}

function substitute(value, valueOf) {
  let out = '';
  let i = 0;
  while (i < value.length) {
    const at = value.indexOf('var(', i);
    if (at === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, at);
    let depth = 0;
    let end = at + 3;
    for (; end < value.length; end++) {
      if (value[end] === '(') depth++;
      else if (value[end] === ')' && --depth === 0) break;
    }
    const inner = value.slice(at + 4, end);
    const comma = inner.indexOf(',');
    const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    let resolved = valueOf(name);
    if (resolved === null && comma !== -1) resolved = substitute(inner.slice(comma + 1), valueOf);
    if (resolved === null) return null;
    out += resolved;
    i = end + 1;
  }
  return out.replace(/\s+/g, ' ').trim();
}

const { accent, surface } = tokens;
const scope = (attrs = {}) => ({ root: false, attrs });
const html = { root: true, attrs: {} };

// [description, chain below <html>, expected theme, expected accent]
const cases = [
  ['the root default', [], 'dark', 'terracotta'],
  ['data-theme="light" alone', [scope({ 'data-theme': 'light' })], 'light', 'terracotta'],
  [
    'theme and accent on one element',
    [scope({ 'data-theme': 'light', 'data-accent': 'lilac' })],
    'light',
    'lilac',
  ],
  [
    'data-accent inside data-theme="light"',
    [scope({ 'data-theme': 'light' }), scope({ 'data-accent': 'cyan' })],
    'light',
    'cyan',
  ],
  [
    'data-theme="light" inside data-accent',
    [scope({ 'data-accent': 'cyan' }), scope({ 'data-theme': 'light' })],
    'light',
    'cyan',
  ],
  [
    'data-theme="dark" inside a light, lime scope',
    [scope({ 'data-theme': 'light', 'data-accent': 'lime' }), scope({ 'data-theme': 'dark' })],
    'dark',
    'lime',
  ],
  [
    'a plain element inherits the nearest scopes',
    [scope({ 'data-theme': 'light' }), scope({ 'data-accent': 'lilac' }), scope()],
    'light',
    'lilac',
  ],
  [
    'four levels, each overriding one of the two',
    [
      scope({ 'data-theme': 'light' }),
      scope({ 'data-accent': 'lilac' }),
      scope({ 'data-theme': 'dark' }),
      scope({ 'data-accent': 'vermilion' }),
    ],
    'dark',
    'terracotta',
  ],
];

const roles = {
  '--accent': 'primary',
  '--accent-highlight': 'highlight',
  '--accent-fg': 'fg',
  '--accent-soft': 'soft',
};
let failed = 0;
for (const [label, chain, theme, accentName] of cases) {
  const got = computeChain([html, ...chain]);
  const expect = {
    '--surface-bg': surface[theme].bg,
    '--focus-ring': accent[accentName][theme].primary,
    ...Object.fromEntries(Object.entries(roles).map(([v, r]) => [v, accent[accentName][theme][r]])),
  };
  for (const [name, want] of Object.entries(expect)) {
    const have = got.get(name);
    if (have?.toLowerCase() !== want.toLowerCase()) {
      failed++;
      console.log(
        `FAIL ${label}: ${name} is ${have ?? '(invalid)'}, expected ${want} (${theme} ${accentName})`,
      );
    }
  }
}

if (failed) {
  console.error(`\ncheck-themes: ${failed} wrong values across ${cases.length} nesting cases.`);
  process.exit(1);
}
console.log(`check-themes: all ${cases.length} nesting cases resolve to the right palette.`);
