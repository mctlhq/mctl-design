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

// Custom-property rules of a sheet, in source order.
function parseRules(text) {
  const css = text.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // Top-level rules only: theme.css has no at-rules, and a nested one would
  // be silently skipped here, so refuse it.
  if (/@(media|supports|layer|scope|container)/.test(css)) {
    throw new Error('check-themes: the sheet has an at-rule; teach this check about it first.');
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
    for (const selector of selectorText.split(',').map((t) => t.trim())) {
      rules.push({ selector: parseSelector(selector), decls, order: rules.length });
    }
  }
  return rules;
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
function declared(rules, el) {
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
function computeChain(rules, chain) {
  let inherited = new Map();
  for (const el of chain) {
    const own = declared(rules, el);
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
// Every accent the tokens define; vermilion is an alias of terracotta.
const ACCENTS = Object.keys(accent).filter((name) => name !== 'vermilion');
const THEMES = ['dark', 'light'];
const scope = (attrs = {}) => ({ root: false, attrs });
const html = { root: true, attrs: {} };

// [description, chain below <html>, expected theme, expected accent]
const cases = [
  ['the root default', [], 'dark', 'terracotta'],
  [
    'a plain element inherits the nearest scopes',
    [scope({ 'data-theme': 'light' }), scope({ 'data-accent': 'lilac' }), scope()],
    'light',
    'lilac',
  ],
  [
    'data-theme="dark" inside a light, lime scope',
    [scope({ 'data-theme': 'light', 'data-accent': 'lime' }), scope({ 'data-theme': 'dark' })],
    'dark',
    'lime',
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
// Every theme and accent pair, three ways: on one element, accent inside
// theme, theme inside accent. Derived from the tokens, so an accent added
// there but not wired into theme.css fails here.
for (const theme of THEMES) {
  for (const name of ACCENTS) {
    cases.push(
      [
        `${theme} + ${name} on one element`,
        [scope({ 'data-theme': theme, 'data-accent': name })],
        theme,
        name,
      ],
      [
        `${name} inside ${theme}`,
        [scope({ 'data-theme': theme }), scope({ 'data-accent': name })],
        theme,
        name,
      ],
      [
        `${theme} inside ${name}`,
        [scope({ 'data-accent': name }), scope({ 'data-theme': theme })],
        theme,
        name,
      ],
    );
  }
}

const ROLES = {
  '--accent': 'primary',
  '--accent-highlight': 'highlight',
  '--accent-fg': 'fg',
  '--accent-soft': 'soft',
};

// Wrong values the sheet produces across all cases.
function run(rules) {
  const failures = [];
  for (const [label, chain, theme, name] of cases) {
    const got = computeChain(rules, [html, ...chain]);
    const expect = {
      '--surface-bg': surface[theme].bg,
      '--focus-ring': accent[name][theme].primary,
      ...Object.fromEntries(Object.entries(ROLES).map(([v, r]) => [v, accent[name][theme][r]])),
    };
    for (const [prop, want] of Object.entries(expect)) {
      const have = got.get(prop);
      if (have?.toLowerCase() !== want.toLowerCase()) {
        failures.push(
          `${label}: ${prop} is ${have ?? '(invalid)'}, expected ${want} (${theme} ${name})`,
        );
      }
    }
  }
  return failures;
}

// Self-test: the resolver passes a sheet wired the 0.9.0 way and fails one
// with the 0.8.0 same-element pairing, both built from the tokens here.
if (process.argv.includes('--selftest')) {
  const raw = [':root {'];
  for (const theme of THEMES) {
    raw.push(`--mctl-surface-${theme}-bg: ${surface[theme].bg};`);
    for (const name of ACCENTS) {
      for (const role of Object.values(ROLES)) {
        raw.push(`--mctl-accent-${name}-${theme}-${role}: ${accent[name][theme][role]};`);
      }
    }
  }
  raw.push('}');
  const themeBlock = (theme, selector, accentDecls) =>
    `${selector} { --surface-bg: var(--mctl-surface-${theme}-bg); ${accentDecls(theme)} }`;
  const aliases = (name) =>
    name === 'terracotta'
      ? `[data-accent='terracotta'], [data-accent='vermilion']`
      : `[data-accent='${name}']`;
  const roleDecls = (prefix, name, theme) =>
    Object.entries(ROLES)
      .map(([v, r]) => `${prefix(v)}: var(--mctl-accent-${name}-${theme}-${r});`)
      .join(' ');

  const palettes = (theme) =>
    ACCENTS.map((name) => roleDecls((v) => `--_accent-${name}-${ROLES[v]}`, name, theme)).join(' ');
  const wired = [
    ...raw,
    themeBlock('dark', `:root, [data-theme='dark']`, palettes),
    themeBlock('light', `[data-theme='light']`, palettes),
    ...ACCENTS.map(
      (picked) =>
        `${picked === 'terracotta' ? ':root, ' : ''}${aliases(picked)} { ${ACCENTS.map(
          (n) => `--_pick-${n}: ${n === picked ? 'initial' : '/*!*/ /*!*/'};`,
        ).join(' ')} }`,
    ),
    `:root, [data-theme], [data-accent] { ${Object.entries(ROLES)
      .map(
        ([v, r]) =>
          `${v}: ${ACCENTS.map((n) => `var(--_pick-${n}, var(--_accent-${n}-${r}))`).join(' ')};`,
      )
      .join(' ')} --focus-ring: var(--accent); }`,
  ].join('\n');

  const paired = [
    ...raw,
    themeBlock('dark', `:root, [data-theme='dark']`, (t) => roleDecls((v) => v, 'terracotta', t)),
    themeBlock('light', `[data-theme='light']`, (t) => roleDecls((v) => v, 'terracotta', t)),
    ...ACCENTS.flatMap((name) => [
      `${aliases(name)} { ${roleDecls((v) => v, name, 'dark')} }`,
      `${aliases(name)
        .split(', ')
        .map((sel) => `[data-theme='light']${sel}`)
        .join(', ')} { ${roleDecls((v) => v, name, 'light')} }`,
    ]),
    `:root, [data-theme], [data-accent] { --focus-ring: var(--accent); }`,
  ].join('\n');

  const wiredFailures = run(parseRules(wired));
  const pairedFailures = run(parseRules(paired));
  if (wiredFailures.length || !pairedFailures.length) {
    console.error('check-themes selftest failed:');
    if (wiredFailures.length)
      console.error(
        `  wired sheet: ${wiredFailures.length} wrong\n    ${wiredFailures.join('\n    ')}`,
      );
    if (!pairedFailures.length)
      console.error('  the 0.8.0 pairing passed; the resolver no longer sees the bug');
    process.exit(1);
  }
  console.log(
    `check-themes: selftest ok (wired sheet passes ${cases.length} cases; the 0.8.0 pairing fails ${pairedFailures.length} values).`,
  );
  process.exit(0);
}

const failures = run(parseRules(readFileSync('packages/css/dist/theme.css', 'utf8')));
if (failures.length) {
  console.log(failures.map((f) => `FAIL ${f}`).join('\n'));
  console.error(
    `\ncheck-themes: ${failures.length} wrong values across ${cases.length} nesting cases.`,
  );
  process.exit(1);
}
console.log(`check-themes: all ${cases.length} nesting cases resolve to the right palette.`);
