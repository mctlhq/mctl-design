#!/usr/bin/env node
// Component styles take borders, focus rings, opacities, durations and
// stacking from tokens, not literals. 0.11.0 moved them over; this keeps a
// later edit from quietly reintroducing `1px solid`, a `0.5` disabled state
// or a `0.2s` transition that a token change and reduced motion no longer
// reach. MTg*.vue is exempt: those components keep literal fallbacks inside
// var() on purpose, for Mini Apps that load telegram.css without theme.css.
//
// Every component, MTg included, is also checked for a var() with no
// fallback whose name nothing it can rely on defines: a component may rely
// on theme.css, global.css and prose.css, an MTg component on telegram.css
// alone, and either on what the same file defines (a `--name:` declaration,
// or a `'--name'` key of a :style binding). Such a declaration is invalid
// at computed-value time and silently drops out (MModal and MTooltip had no
// shadow until 0.12.1 for exactly this). Comments are ignored on both sides,
// and `--x: var(--x)` defines nothing (tailwind.css re-exports that way).
//
// Third, the Onest stack written out as the fallback of every
// var(--tg-font, ...) and var(--font-display, ...) in telegram.css and the
// MTg components must equal tokens.typography.fontFamily.display, and at
// least FONT_SITES of them must be found, so renaming or dropping them fails
// rather than leaving nothing to check.
//
// Reads packages/css/dist and packages/tokens/dist, so run after
// `pnpm build`, and packages/css/src/telegram.css.
//
// Known limits, so nobody reads more into a pass than it says:
// - the literal rules read only <style> blocks; a literal in a template
//   `style` or `:style` binding is not seen;
// - a double-quoted or computed :style key is not seen as a definition, nor
//   is a `--name` key of a style object built in <script> (scripts are not
//   read at all);
// - definitions are matched by name, not selector: a name declared only
//   under a scoped rule (.tg-shell, .mctl-prose) would count as defined for
//   a component rendered outside it (none are today: every --tg-* is on
//   :root, and global.css and prose.css declare none);
// - the MTg exemption covers the whole file, not just its var() fallbacks;
// - easings are not checked: MTgSheet keeps a curve no token matches;
// - only box-shadow is checked for shadows: text-shadow and
//   filter: drop-shadow() are not (MLogo's glow has no matching token).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
    why: 'a literal shadow (use --control-focus-shadow* or --shadow-*)',
    test: (prop, value) => prop === 'box-shadow' && PX.test(value),
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

// <script> blocks, then CSS and HTML comments, blanked out, keeping offsets
// (and so line numbers). Scripts go first: a `/*` in a script string would
// otherwise blank everything to the next `*/` and hide real var()s.
export function stripComments(source) {
  const blank = (c) => c.replace(/[^\n]/g, ' ');
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script[^>]*>/gi, blank)
    .replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, blank);
}

// The Onest stack is written out wherever --tg-font is read or set, because
// telegram.css is copied verbatim rather than built from tokens.
export const FONT_SITES = 13;
const normalizeStack = (stack) =>
  stack
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();

// Every var(--tg-font, <stack>) / var(--font-display, <stack>) fallback, wherever
// it sits in a declaration, as { line, stack }; comments and scripts ignored.
export function fontFallbacks(source) {
  const text = stripComments(source);
  const out = [];
  for (const m of text.matchAll(/var\(\s*--(?:tg-font|font-display)\s*,/g)) {
    // Walk to the paren that closes this var(), so `var(..., x), serif`,
    // `!important` and a missing trailing semicolon all still match.
    let depth = 1;
    let k = m.index + m[0].length;
    for (; k < text.length && depth; k++) {
      if (text[k] === '(') depth++;
      else if (text[k] === ')') depth--;
    }
    out.push({
      line: text.slice(0, m.index).split('\n').length,
      stack: normalizeStack(text.slice(m.index + m[0].length, k - 1)),
    });
  }
  return out;
}

export function fontDrift(source, display) {
  return fontFallbacks(source).filter((f) => f.stack !== normalizeStack(display));
}

// Custom properties a source defines: `--name:` declarations that are not
// a bare `var(--name)` of themselves, and `'--name'` keys of a :style
// binding.
export function definedIn(source) {
  const text = stripComments(source);
  return [
    ...[...text.matchAll(/(--[\w-]+)\s*:\s*([^;{}]*)/g)]
      .filter(([, name, value]) => value.trim() !== `var(${name})`)
      .map((m) => m[1]),
    ...[...text.matchAll(/:style="([^"]*)"/g)].flatMap(([, binding]) =>
      [...binding.matchAll(/'(--[\w-]+)'/g)].map((m) => m[1]),
    ),
  ];
}

// var(--name) with no fallback, where nothing defines --name.
export function findUndefined(source, defined) {
  const found = [];
  for (const m of stripComments(source).matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
    if (!defined.has(m[1])) {
      found.push({ line: source.slice(0, m.index).split('\n').length, name: m[1] });
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
.d { box-shadow: 0 0 0 var(--focus-ring-width) color-mix(in srgb, var(--accent) 20%, transparent); }
</style>`;
  // Caught: an undefined name without a fallback, one only "defined" as a
  // self-reference, in a comment or by a mere quoted read. Not caught: a
  // defined name, one with a fallback, one the file defines itself, and a
  // var() inside a comment.
  const vars = `<style>
.a { --local: 1px; box-shadow: var(--mctl-shadow-overlay); color: var(--surface-fg); }
.b { width: var(--local); height: var(--bound); z-index: var(--nowhere, 1); }
.c { --selfref: var(--selfref); color: var(--selfref); /* --commented: 1px; var(--gone) */ }
.d { width: var(--commented); height: var(--read); }
</style><div :style="{ '--bound': '1px' }" /><!-- var(--html-comment) -->
<script>getComputedStyle(el).getPropertyValue('--read');</script>`;
  const defined = new Set(['--surface-fg', ...definedIn(vars)]);
  const undef = findUndefined(vars, defined).map((f) => f.name);
  const badFound = findLiterals(bad).map((f) => f.why);
  const goodFound = findLiterals(good);
  const expected = RULES.map((r) => r.why);
  const problems = [];
  // A var() inside <script> is not a style use; a stray /* in a script
  // string must not hide the var() after it.
  // The closing */ after <style> is what would let an unstripped script
  // '/*' swallow the style block.
  const scripted = `<script>const s = '/*'; // var(--in-script)</script>
<SCRIPT setup>const t = 'var(--upper-script)';</SCRIPT >
<style>.a { color: var(--after-script); }</style>
<!-- */ -->`;
  const scriptUndef = findUndefined(scripted, new Set()).map((f) => f.name);
  if (scriptUndef.join(' ') !== '--after-script')
    problems.push(
      `script handling reported: ${scriptUndef.join(' ') || 'none'}, expected --after-script`,
    );
  const stack = "'Onest', system-ui, sans-serif";
  // Lines 6-8 drift in shapes a `);`-anchored match would miss; lines 2-5
  // are the right stack wrapped; line 9 is a commented-out old stack.
  const fonts = [
    `.a { font-family: var(--tg-font, ${stack}); }`,
    `.b { font-family: var(--tg-font,\n  'Onest',\n  system-ui,\n  sans-serif); }`,
    `.c { font-family: var(--tg-font, 'Old'), serif; }`,
    `.d { font-family: var(--tg-font, 'Old', serif) !important; }`,
    `.e { font-family: var(--font-display, 'Old', serif) }`,
    `/* was: font-family: var(--tg-font, 'Inter', sans-serif); */`,
  ].join('\n');
  const drift = fontDrift(fonts, stack).map((f) => f.line);
  if (drift.join(' ') !== '6 7 8')
    problems.push(`font drift reported lines ${drift.join(' ') || 'none'}, expected 6 7 8`);
  if (fontFallbacks(fonts).length !== 5)
    problems.push(`font fallbacks found ${fontFallbacks(fonts).length}, expected 5`);
  if (badFound.join('\n') !== expected.join('\n'))
    problems.push(
      `bad fixture reported\n    ${badFound.join('\n    ')}\n  expected\n    ${expected.join('\n    ')}`,
    );
  // --selfref twice: its own declaration's value is an undefined use too.
  const wantUndef = '--mctl-shadow-overlay --selfref --selfref --commented --read';
  if (undef.join(' ') !== wantUndef)
    problems.push(`undefined vars reported: ${undef.join(' ') || 'none'}, expected ${wantUndef}`);
  if (goodFound.length)
    problems.push(
      `false positives in the good fixture: ${goodFound.map((f) => f.text).join('; ')}`,
    );
  if (problems.length) {
    console.error(`check-component-tokens selftest failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log(
    `check-component-tokens: selftest ok (each of ${RULES.length} rules catches its literal once, no false positives, undefined var() caught).`,
  );
  process.exit(0);
}

const cssDist = join(root, 'packages/css/dist');
const sheet = (name) => {
  const path = join(cssDist, name);
  if (!existsSync(path)) {
    console.error(`check-component-tokens: ${path} is missing -- run \`pnpm build\` first.`);
    process.exit(1);
  }
  return definedIn(readFileSync(path, 'utf8'));
};
// What each family of component may rely on being loaded.
const themeDefined = ['theme.css', 'global.css', 'prose.css'].flatMap(sheet);
const telegramDefined = sheet('telegram.css');
// Recursive, so a component moved into a subdirectory stays covered.
const all = readdirSync(dir, { recursive: true }).filter((f) => f.endsWith('.vue'));
const sources = Object.fromEntries(all.map((f) => [f, readFileSync(join(dir, f), 'utf8')]));
const isTelegram = (f) => basename(f).startsWith('MTg');
const definedFor = (f) =>
  new Set([...(isTelegram(f) ? telegramDefined : themeDefined), ...definedIn(sources[f])]);
const files = all.filter((f) => !isTelegram(f));
const tokensDist = join(root, 'packages/tokens/dist/index.js');
if (!existsSync(tokensDist)) {
  console.error(`check-component-tokens: ${tokensDist} is missing -- run \`pnpm build\` first.`);
  process.exit(1);
}
const { tokens } = await import(pathToFileURL(tokensDist).href);
const display = tokens.typography.fontFamily.display;
const telegramSrc = 'packages/css/src/telegram.css';
if (!existsSync(join(root, telegramSrc))) {
  console.error(`check-component-tokens: ${telegramSrc} is missing -- was it moved or renamed?`);
  process.exit(1);
}
const fontSources = {
  [telegramSrc]: readFileSync(join(root, telegramSrc), 'utf8'),
  ...Object.fromEntries(all.filter(isTelegram).map((f) => [f, sources[f]])),
};
const fontSites = Object.fromEntries(
  Object.entries(fontSources).map(([f, src]) => [f, fontFallbacks(src).length]),
);
const fontTotal = Object.values(fontSites).reduce((a, b) => a + b, 0);
const failures = [
  ...(fontSites[telegramSrc] ? [] : [`${telegramSrc}  no var(--tg-font, ...) fallback found`]),
  ...(fontTotal >= FONT_SITES
    ? []
    : [
        `font fallbacks: found ${fontTotal}, expected at least ${FONT_SITES} (renamed or dropped?)`,
      ]),
  ...Object.entries(fontSources).flatMap(([f, src]) =>
    fontDrift(src, display).map(
      (x) =>
        `${f}:${x.line}  font stack ${x.stack}  -- must equal tokens.typography.fontFamily.display (${display})`,
    ),
  ),
  ...files.flatMap((f) =>
    findLiterals(sources[f]).map((x) => `${f}:${x.line}  ${x.text}  -- ${x.why}`),
  ),
  ...all.flatMap((f) =>
    findUndefined(sources[f], definedFor(f)).map(
      (x) =>
        `${f}:${x.line}  var(${x.name})  -- nothing defines ${x.name} and there is no fallback`,
    ),
  ),
];
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(
    `\ncheck-component-tokens: ${failures.length} literal, undefined or drifted value(s) in component styles.`,
  );
  process.exit(1);
}
console.log(
  `check-component-tokens: ${files.length} components take these values from tokens, and every var() in ${all.length} resolves.`,
);
