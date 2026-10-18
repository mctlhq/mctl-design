#!/usr/bin/env node
// WCAG 2 contrast gate over the built tokens.
//
// Token comments used to assert "AA on paper" by eye, and several pairs were
// below it (limeDeep on paper was 3.2:1, the syntax key colour on the light
// card 1.6:1). This walks every foreground/background pair the components and
// prose.css actually render, per theme and per accent, and fails below the
// threshold. Run after `pnpm build` (it reads packages/tokens/dist).
//
// Translucent fills (`color-mix(X p%, transparent)`) are composited over each
// surface they can sit on before measuring, and non-text UI -- focus rings,
// control borders, an icon that carries meaning -- is held to 3:1 (WCAG
// 1.4.11). The --tg-* Mini App palette is covered with the same rules.
//
// KNOWN lists pairs that fail today, with the exact ratio each measures, and
// wait on a palette decision. They are printed, not fatal. A new failure is
// fatal; so is a KNOWN pair whose ratio moves either way (update the entry)
// and one that starts passing (remove it), so the list stays a true record.
//
//   node scripts/check-contrast.mjs            # gate
//   node scripts/check-contrast.mjs --report   # print every pair
import { readFileSync } from 'node:fs';

let tokens;
let telegramPalette;
let telegramTextMix;
let telegramButtonMix;
try {
  ({ tokens, telegramPalette, telegramTextMix, telegramButtonMix } =
    await import('../packages/tokens/dist/index.js'));
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  console.error('check-contrast: packages/tokens/dist is missing -- run `pnpm build` first.');
  process.exit(1);
}

const TEXT = 4.5; // WCAG 1.4.3, normal-size text
const UI = 3; // WCAG 1.4.11, non-text contrast

const report = process.argv.includes('--report');

function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// `color-mix(in srgb, fg p, transparent)` painted over bg, as a solid colour.
export function over(fg, p, bg) {
  const ch = (h) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
  const [f, b] = [ch(fg), ch(bg)];
  return `#${f
    .map((c, i) =>
      Math.round(c * p + b[i] * (1 - p))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Tag each pair: ok, FAIL, known (fails at exactly its recorded ratio),
// WORSE / BETTER (fails, but below / above it -- update the entry), FIXED
// (passes but is still listed); and name the KNOWN entries that match no
// pair. The baseline is exact, so a partial fix cannot leave slack behind it
// and a mistyped entry cannot pass.
export function classify(pairs, known) {
  const labels = new Set(pairs.map((p) => p.label));
  const rows = pairs.map((p) => {
    const r = ratio(p.fg, p.bg);
    const pass = r >= p.min;
    const listed = known.has(p.label);
    // Compared at the two decimals the baseline is written with.
    const drift = listed ? Number(r.toFixed(2)) - known.get(p.label) : 0;
    let tag = pass ? 'ok' : 'FAIL';
    if (listed) tag = pass ? 'FIXED' : drift < 0 ? 'WORSE' : drift > 0 ? 'BETTER' : 'known';
    return { ...p, r, tag };
  });
  return { rows, stale: [...known.keys()].filter((l) => !labels.has(l)) };
}

// Rows that fail the gate: everything but ok and known.
export function gateFailures(rows) {
  return rows.filter((r) => r.tag !== 'ok' && r.tag !== 'known').length;
}

if (process.argv.includes('--selftest')) {
  const problems = [];
  const eq = (what, got, want) =>
    got !== want && problems.push(`${what}: ${got}, expected ${want}`);
  // The blend: halfway is the midpoint, the ends are the inputs.
  eq('over(#ffffff, 0.5, #000000)', over('#ffffff', 0.5, '#000000'), '#808080');
  eq('over(#c23b3b, 1, #fafaf7)', over('#c23b3b', 1, '#fafaf7'), '#c23b3b');
  eq('over(#c23b3b, 0, #fafaf7)', over('#c23b3b', 0, '#fafaf7'), '#fafaf7');
  eq('over(#ff0000, 0.25, #0000ff)', over('#ff0000', 0.25, '#0000ff'), '#4000bf');
  // Ratio: the ends, a midtone (the 2.4 gamma) and a near-black under
  // 0.03928 (the linear 12.92 branch), plus the two thresholds themselves.
  eq('ratio(#000000, #ffffff)', ratio('#000000', '#ffffff').toFixed(2), '21.00');
  eq('ratio(#777777, #888888)', ratio('#777777', '#888888').toFixed(4), '1.2633');
  eq('ratio(#050505, #000000)', ratio('#050505', '#000000').toFixed(4), '1.0304');
  eq('TEXT', TEXT, 4.5);
  eq('UI', UI, 3);
  // The ratchet: one pair per outcome, plus an entry that names nothing.
  // #777777 on #888888 is 1.26:1; #949494 on white is 3.03:1, so it passes
  // as non-text (3) and fails as text (4.5).
  const grey = { fg: '#777777', bg: '#888888', min: TEXT };
  const fixture = [
    { label: 'pass', fg: '#000000', bg: '#ffffff', min: TEXT },
    { label: 'ui pass', fg: '#949494', bg: '#ffffff', min: UI },
    { label: 'text fail', fg: '#949494', bg: '#ffffff', min: TEXT },
    { label: 'known', ...grey },
    { label: 'fixed', fg: '#000000', bg: '#ffffff', min: TEXT },
    { label: 'worse', ...grey },
    { label: 'better', ...grey },
  ];
  const listed = new Map([
    ['known', 1.26],
    ['fixed', 1.26],
    ['worse', 1.27],
    ['better', 1.25],
    ['gone', 1],
  ]);
  const { rows, stale } = classify(fixture, listed);
  eq('tags', rows.map((r) => r.tag).join(' '), 'ok ok FAIL known FIXED WORSE BETTER');
  eq('gateFailures', gateFailures(rows), 4);
  eq('stale', stale.join(' '), 'gone');
  if (problems.length) {
    console.error(`check-contrast selftest failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('check-contrast: selftest ok (blend, ratio and the KNOWN ratchet).');
  process.exit(0);
}

const { surface, accent, status, statusText, syntax } = tokens;
const pairs = [];
const add = (label, fg, bg, min = TEXT) => pairs.push({ label, fg, bg, min });

for (const theme of ['dark', 'light']) {
  const s = surface[theme];
  const backgrounds = { bg: s.bg, elevated: s.elevated, card: s.card };

  for (const [bgName, bg] of Object.entries(backgrounds)) {
    for (const fgName of ['fg', 'fgMuted', 'fgSubtle']) {
      add(`${theme} surface.${fgName} on ${bgName}`, s[fgName], bg);
    }
    // Status and accent colours are set as text: badges, pills, the active
    // tab, prose links.
    for (const [name, value] of Object.entries(status[theme])) {
      add(`${theme} status.${name} on ${bgName}`, value, bg);
    }
    for (const [name, a] of Object.entries(accent)) {
      if (name === 'vermilion') continue; // alias of terracotta
      add(`${theme} accent.${name}.primary on ${bgName}`, a[theme].primary, bg);
    }
  }

  // Button text on the accent fill, at rest and on hover.
  for (const [name, a] of Object.entries(accent)) {
    if (name === 'vermilion') continue;
    add(`${theme} accent.${name}.fg on primary`, a[theme].fg, a[theme].primary);
    add(`${theme} accent.${name}.fg on highlight`, a[theme].fg, a[theme].highlight);
    // The soft tint is a background too (bg-accent-soft badges and pills).
    add(`${theme} accent.${name}.primary on soft`, a[theme].primary, a[theme].soft);
    add(`${theme} surface.fg on accent.${name}.soft`, s.fg, a[theme].soft);
  }

  // Code renders on the card surface (MCodeBlock, MYamlBlock, prose code).
  for (const [name, value] of Object.entries(syntax[theme])) {
    add(`${theme} syntax.${name} on card`, value, s.card);
  }

  // Translucent fills, composited over every surface they can sit on.
  for (const [bgName, bg] of Object.entries(backgrounds)) {
    // MPill filled: the status text shade on a 15% tint of the status colour.
    for (const [name, value] of Object.entries(status[theme])) {
      add(
        `${theme} MPill ${name} text on its 15% tint over ${bgName}`,
        statusText[theme][name],
        over(value, 0.15, bg),
      );
    }
    for (const [name, a] of Object.entries(accent)) {
      if (name === 'vermilion') continue;
      const c = a[theme].primary;
      add(
        `${theme} MPill accent.${name} text on its 15% tint over ${bgName}`,
        a[theme].text,
        over(c, 0.15, bg),
      );
      // MAlert info: body text on a 6% accent tint.
      add(`${theme} MAlert fg on accent.${name} 6% over ${bgName}`, s.fg, over(c, 0.06, bg));
      // The focus ring is the accent drawn against the surface. --focus-ring
      // only aliases --accent today, so this mirrors the accent text pairs at
      // a lower threshold; it becomes independent the day the alias does.
      add(`${theme} focus ring accent.${name} vs ${bgName}`, c, bg, UI);
    }
    for (const [name, value] of Object.entries(status[theme])) {
      if (name === 'ok') continue; // MAlert has no ok variant
      add(`${theme} MAlert fg on ${name} 6% over ${bgName}`, s.fg, over(value, 0.06, bg));
    }
    add(
      `${theme} MPill neutral muted on subtle 20% over ${bgName}`,
      s.fgMuted,
      over(s.fgSubtle, 0.2, bg),
    );
    add(`${theme} MTable hover fg on line 40% over ${bgName}`, s.fg, over(s.line, 0.4, bg));
    // MTable's inline <code> chip: syntax.key on the same 40% line tint.
    add(
      `${theme} MTable code syntax.key on line 40% over ${bgName}`,
      syntax[theme].key,
      over(s.line, 0.4, bg),
    );
    add(`${theme} MAlert fg on line 30% over ${bgName} (no tone)`, s.fg, over(s.line, 0.3, bg));
    // A field's border is its only edge: --control-bg is the page surface.
    add(`${theme} control border vs ${bgName}`, s.controlBorder, bg, UI);
  }
}

// The --tg-* Mini App palette (telegram.css and the MTg* components). These
// are the fallbacks: in a live Mini App applyTheme() overwrites most of them
// from Telegram's themeParams, which no build-time check can see.
const TG_TEXT = ['accent', 'success', 'danger', 'warn'];
const tgText = (theme, name) =>
  over(telegramPalette[theme][name], telegramTextMix[theme][name], telegramPalette[theme].ink);
for (const theme of ['light', 'dark']) {
  const p = telegramPalette[theme];
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    for (const fg of ['ink', 'muted']) {
      add(`tg ${theme} ${fg} on ${bgName}`, p[fg], p[bgName]);
    }
    // The fills as text: --tg-*-text, mixed toward ink.
    for (const name of TG_TEXT) {
      add(`tg ${theme} ${name}-text on ${bgName}`, tgText(theme, name), p[bgName]);
    }
    // --tg-faint is for icons and dividers only.
    add(`tg ${theme} faint (icon) vs ${bgName}`, p.faint, p[bgName], UI);
  }
  add(
    `tg ${theme} accent-text on accentSoft (status badge)`,
    tgText(theme, 'accent'),
    p.accentSoft,
  );
  // Status badges, delta tags and order directions: the text shade on a tint
  // of the fill, over whatever they sit on.
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    for (const [name, pct] of [
      ['success', 0.12],
      ['danger', 0.1],
    ]) {
      add(
        `tg ${theme} ${name}-text on its ${pct * 100}% tint over ${bgName}`,
        tgText(theme, name),
        over(p[name], pct, p[bgName]),
      );
    }
    add(`tg ${theme} muted on its 10% tint over ${bgName}`, p.muted, over(p.muted, 0.1, p[bgName]));
  }
  // --tg-button with --tg-button-text (#fff).
  add(
    `tg ${theme} button text on button`,
    '#ffffff',
    over(p.accent, telegramButtonMix[theme], '#000000'),
  );
  // MTgOrderCard's ring sits 2px outside the card, so it is drawn on what
  // holds the card: the page (bg), an MTgSheet (surface) or a sub-surface.
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    add(`tg ${theme} focus ring accent vs ${bgName}`, p.accent, p[bgName], UI);
  }
}

// telegram.css is written by hand, so check it declares what was measured:
// every palette hex, and every text/button weight, in both themes.
{
  const css = readFileSync(new URL('../packages/css/src/telegram.css', import.meta.url), 'utf8');
  const block = (selector) => {
    const i = css.indexOf(`${selector} {`);
    return i === -1 ? '' : css.slice(i, css.indexOf('}', i));
  };
  const blocks = { light: block(':root'), dark: block("[data-theme='dark']") };
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const drift = [];
  for (const theme of ['light', 'dark']) {
    const b = blocks[theme];
    const declared = (name) => b.match(new RegExp(`--tg-${name}:\\s*([^;]+);`))?.[1].trim();
    for (const [key, hex] of Object.entries(telegramPalette[theme])) {
      const got = declared(kebab(key));
      if (got?.toLowerCase() !== hex.toLowerCase())
        drift.push(`${theme} --tg-${kebab(key)} is ${got}, tokens say ${hex}`);
    }
    for (const name of TG_TEXT) {
      const want = `color-mix(in srgb, var(--tg-${name}) ${Math.round(telegramTextMix[theme][name] * 100)}%, var(--tg-ink))`;
      const got = declared(`${name}-text`);
      if (got !== want) drift.push(`${theme} --tg-${name}-text is ${got}, expected ${want}`);
    }
    const wantButton = `color-mix(in srgb, var(--tg-accent) ${Math.round(telegramButtonMix[theme] * 100)}%, #000)`;
    if (declared('button') !== wantButton)
      drift.push(`${theme} --tg-button is ${declared('button')}, expected ${wantButton}`);
  }
  if (drift.length) {
    console.error(
      `check-contrast: telegram.css has drifted from @mctlhq/tokens:\n  ${drift.join('\n  ')}`,
    );
    process.exit(1);
  }
}

// label -> the ratio it measures today. A known pair may not get worse.
// Empty since 0.14.0: every pair meets AA. Keep the ratchet for the next
// failure that has to wait on a palette decision: list it here with the exact
// ratio it measures, and say why in a comment.
const KNOWN = new Map([]);

const { rows, stale } = classify(pairs, KNOWN);
const count = (tag) => rows.filter((r) => r.tag === tag).length;
const failed = gateFailures(rows);
const known = count('known');
for (const r of rows) {
  if (report || r.tag !== 'ok') {
    console.log(
      `${r.tag.padEnd(5)} ${r.r.toFixed(2).padStart(5)}:1 (min ${r.min})  ${r.label}  ${r.fg} on ${r.bg}`,
    );
  }
}
for (const l of stale) console.log(`STALE KNOWN entry names no pair: ${l}`);

if (failed || stale.length) {
  console.error(
    `\ncheck-contrast: ${failed} of ${pairs.length} pairs below WCAG AA, off their recorded KNOWN ratio, or fixed but still listed` +
      (stale.length ? `, ${stale.length} stale KNOWN entries` : '') +
      '.',
  );
  process.exit(1);
}
console.log(
  `check-contrast: ${pairs.length - known} of ${pairs.length} pairs meet WCAG AA; ${known} known failures wait on a palette decision.`,
);
