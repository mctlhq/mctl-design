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
// KNOWN lists pairs that fail today, with the ratio each measures, and wait
// on a palette decision. They are printed, not fatal. A new failure is
// fatal, so is a KNOWN pair that drops below its recorded ratio, and so is
// one that starts passing, so the list can only shrink or improve.
//
//   node scripts/check-contrast.mjs            # gate
//   node scripts/check-contrast.mjs --report   # print every pair
let tokens;
let telegramPalette;
try {
  ({ tokens, telegramPalette } = await import('../packages/tokens/dist/index.js'));
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

// Tag each pair: ok, FAIL, known (fails and is listed at this ratio or
// better), WORSE (listed, but below its recorded ratio), FIXED (passes but
// is still listed); and name the KNOWN entries that match no pair.
export function classify(pairs, known) {
  const labels = new Set(pairs.map((p) => p.label));
  const rows = pairs.map((p) => {
    const r = ratio(p.fg, p.bg);
    const pass = r >= p.min;
    const listed = known.has(p.label);
    // Compared at the two decimals the baseline is written with.
    const worse = listed && Number(r.toFixed(2)) < known.get(p.label);
    const tag = pass ? (listed ? 'FIXED' : 'ok') : !listed ? 'FAIL' : worse ? 'WORSE' : 'known';
    return { ...p, r, tag };
  });
  return { rows, stale: [...known.keys()].filter((l) => !labels.has(l)) };
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
  eq('ratio(#000000, #ffffff)', ratio('#000000', '#ffffff').toFixed(2), '21.00');
  // The ratchet: one pair per outcome, plus an entry that names nothing.
  const fixture = [
    { label: 'pass', fg: '#000000', bg: '#ffffff', min: 4.5 },
    { label: 'fail', fg: '#777777', bg: '#888888', min: 4.5 },
    { label: 'known', fg: '#777777', bg: '#888888', min: 4.5 },
    { label: 'fixed', fg: '#000000', bg: '#ffffff', min: 4.5 },
  ];
  fixture.push({ label: 'worse', fg: '#777777', bg: '#888888', min: 4.5 });
  const listed = new Map([
    ['known', 1.2],
    ['fixed', 1.2],
    ['worse', 3],
    ['gone', 1],
  ]);
  const { rows, stale } = classify(fixture, listed);
  eq('tags', rows.map((r) => r.tag).join(' '), 'ok FAIL known FIXED WORSE');
  eq('stale', stale.join(' '), 'gone');
  if (problems.length) {
    console.error(`check-contrast selftest failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('check-contrast: selftest ok (blend, ratio and the KNOWN ratchet).');
  process.exit(0);
}

const { surface, accent, status, syntax } = tokens;
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
    // MPill filled: the colour as text on a 15% tint of itself.
    for (const [name, value] of Object.entries(status[theme])) {
      add(`${theme} MPill ${name} on its 15% tint over ${bgName}`, value, over(value, 0.15, bg));
    }
    for (const [name, a] of Object.entries(accent)) {
      if (name === 'vermilion') continue;
      const c = a[theme].primary;
      add(`${theme} MPill accent.${name} on its 15% tint over ${bgName}`, c, over(c, 0.15, bg));
      // MAlert info: body text on a 6% accent tint.
      add(`${theme} MAlert fg on accent.${name} 6% over ${bgName}`, s.fg, over(c, 0.06, bg));
      // The focus ring is the accent, drawn against the surface.
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
    add(`${theme} MAlert fg on line 30% over ${bgName} (no tone)`, s.fg, over(s.line, 0.3, bg));
    // A field's border is its only edge: --control-bg is the page surface.
    add(`${theme} control border (line-strong) vs ${bgName}`, s.lineStrong, bg, UI);
  }
}

// The --tg-* Mini App palette (telegram.css and the MTg* components). These
// are the fallbacks: in a live Mini App applyTheme() overwrites most of them
// from Telegram's themeParams, which no build-time check can see.
for (const theme of ['light', 'dark']) {
  const p = telegramPalette[theme];
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    for (const fg of ['ink', 'muted', 'accent', 'success', 'danger', 'warn']) {
      add(`tg ${theme} ${fg} on ${bgName}`, p[fg], p[bgName]);
    }
  }
  add(`tg ${theme} accent on accentSoft (status badge)`, p.accent, p.accentSoft);
  // Status badges, delta tags and order directions tint whatever they sit on.
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    for (const [fg, pct] of [
      ['success', 0.12],
      ['danger', 0.1],
      ['muted', 0.1],
    ]) {
      add(
        `tg ${theme} ${fg} on its ${pct * 100}% tint over ${bgName}`,
        p[fg],
        over(p[fg], pct, p[bgName]),
      );
    }
  }
  add(`tg ${theme} focus ring accent vs surface`, p.accent, p.surface, UI);
  // MTgOrderCard's arrow is aria-hidden and decorative (the card carries the
  // affordance), so WCAG 1.4.11 does not apply to --tg-faint there.
}

// label -> the ratio it measures today. A known pair may not get worse.
const KNOWN = new Map([
  // Light status colours clear 4.5:1 on paper by a hair, so any tint of
  // themselves drops them under it; dark terracotta misses on raised
  // surfaces. Needs a deeper text colour for tinted badges.
  ['dark MPill accent.terracotta on its 15% tint over card', 4.12],
  ['dark MPill accent.terracotta on its 15% tint over elevated', 4.43],
  ['light MPill accent.cyan on its 15% tint over bg', 3.78],
  ['light MPill accent.cyan on its 15% tint over card', 4.31],
  ['light MPill accent.cyan on its 15% tint over elevated', 4.0],
  ['light MPill accent.lime on its 15% tint over bg', 3.85],
  ['light MPill accent.lime on its 15% tint over card', 4.36],
  ['light MPill accent.lime on its 15% tint over elevated', 4.08],
  ['light MPill accent.terracotta on its 15% tint over bg', 3.9],
  ['light MPill accent.terracotta on its 15% tint over card', 4.42],
  ['light MPill accent.terracotta on its 15% tint over elevated', 4.14],
  ['light MPill bad on its 15% tint over bg', 3.66],
  ['light MPill bad on its 15% tint over card', 4.17],
  ['light MPill bad on its 15% tint over elevated', 3.87],
  ['light MPill ok on its 15% tint over bg', 3.81],
  ['light MPill ok on its 15% tint over card', 4.35],
  ['light MPill ok on its 15% tint over elevated', 4.04],
  ['light MPill warn on its 15% tint over bg', 3.78],
  ['light MPill warn on its 15% tint over card', 4.3],
  ['light MPill warn on its 15% tint over elevated', 4.0],
  // Field borders are hairlines; meeting 3:1 is a visible change.
  ['dark control border (line-strong) vs bg', 1.5],
  ['dark control border (line-strong) vs card', 1.35],
  ['dark control border (line-strong) vs elevated', 1.44],
  ['light control border (line-strong) vs bg', 1.61],
  ['light control border (line-strong) vs card', 1.85],
  ['light control border (line-strong) vs elevated', 1.71],
  // The light --tg-* accent and status colours are Telegram-bright and miss
  // 4.5:1 as text, worse on their own tints.
  ['tg light accent on accentSoft (status badge)', 3.44],
  ['tg light accent on bg', 3.74],
  ['tg light accent on surface', 3.91],
  ['tg light accent on surfaceSub', 3.48],
  ['tg light danger on bg', 4.19],
  ['tg light danger on its 10% tint over bg', 3.67],
  ['tg light danger on its 10% tint over surface', 3.82],
  ['tg light danger on its 10% tint over surfaceSub', 3.44],
  ['tg light danger on surface', 4.38],
  ['tg light danger on surfaceSub', 3.9],
  ['tg light muted on its 10% tint over bg', 4.32],
  ['tg light muted on its 10% tint over surfaceSub', 4.05],
  ['tg light success on bg', 3.34],
  ['tg light success on its 12% tint over bg', 2.93],
  ['tg light success on its 12% tint over surface', 3.04],
  ['tg light success on its 12% tint over surfaceSub', 2.75],
  ['tg light success on surface', 3.49],
  ['tg light success on surfaceSub', 3.11],
  ['tg light warn on bg', 3.05],
  ['tg light warn on surface', 3.19],
  ['tg light warn on surfaceSub', 2.84],
  // Dark --tg-* danger, accent and muted miss on the raised surfaces and
  // on their own tints.
  ['tg dark accent on accentSoft (status badge)', 4.42],
  ['tg dark accent on surface', 4.43],
  ['tg dark danger on bg', 4.34],
  ['tg dark danger on its 10% tint over bg', 3.94],
  ['tg dark danger on its 10% tint over surface', 3.32],
  ['tg dark danger on its 10% tint over surfaceSub', 3.77],
  ['tg dark danger on surface', 3.67],
  ['tg dark danger on surfaceSub', 4.17],
  ['tg dark muted on its 10% tint over bg', 4.36],
  ['tg dark muted on its 10% tint over surface', 3.67],
  ['tg dark muted on its 10% tint over surfaceSub', 4.17],
  ['tg dark muted on surface', 4.24],
  ['tg dark success on its 12% tint over surface', 4.41],
]);

const { rows, stale } = classify(pairs, KNOWN);
const count = (tag) => rows.filter((r) => r.tag === tag).length;
const failed = count('FAIL') + count('FIXED') + count('WORSE');
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
    `\ncheck-contrast: ${failed} of ${pairs.length} pairs below WCAG AA, worse than their KNOWN ratio, or fixed but still listed` +
      (stale.length ? `, ${stale.length} stale KNOWN entries` : '') +
      '.',
  );
  process.exit(1);
}
console.log(
  `check-contrast: ${pairs.length - known} of ${pairs.length} pairs meet WCAG AA; ${known} known failures wait on a palette decision.`,
);
