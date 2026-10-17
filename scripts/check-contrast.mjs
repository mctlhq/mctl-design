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
// KNOWN lists pairs that fail today and wait on a palette decision. They are
// printed, not fatal; a new failure is fatal, and so is a KNOWN pair that
// starts passing, so the list can only shrink.
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
    // A field's border is its only edge: --control-bg is the page surface.
    add(`${theme} control border (line-strong) vs ${bgName}`, s.lineStrong, bg, UI);
  }
}

// The --tg-* Mini App palette (telegram.css and the MTg* components).
for (const theme of ['light', 'dark']) {
  const p = telegramPalette[theme];
  for (const bgName of ['bg', 'surface', 'surfaceSub']) {
    for (const fg of ['ink', 'muted', 'accent', 'success', 'danger', 'warn']) {
      add(`tg ${theme} ${fg} on ${bgName}`, p[fg], p[bgName]);
    }
  }
  add(`tg ${theme} accent on accentSoft (status badge)`, p.accent, p.accentSoft);
  // Status badges, delta tags and order directions tint the surface.
  for (const [fg, pct] of [
    ['success', 0.12],
    ['danger', 0.1],
    ['muted', 0.1],
  ]) {
    add(
      `tg ${theme} ${fg} on its ${pct * 100}% tint over surface`,
      p[fg],
      over(p[fg], pct, p.surface),
    );
  }
  add(`tg ${theme} focus ring accent vs surface`, p.accent, p.surface, UI);
  // MTgOrderCard's arrow is the card's only "opens" cue.
  add(`tg ${theme} faint arrow icon vs surface`, p.faint, p.surface, UI);
}

const KNOWN = new Set([
  // Light status colours clear 4.5:1 on paper by a hair, so any tint of
  // themselves drops them under it. Needs a deeper text colour for tints.
  ...['bg', 'card', 'elevated'].flatMap((bg) => [
    ...['ok', 'warn', 'bad'].map((n) => `light MPill ${n} on its 15% tint over ${bg}`),
    ...['terracotta', 'cyan', 'lime'].map(
      (n) => `light MPill accent.${n} on its 15% tint over ${bg}`,
    ),
  ]),
  'dark MPill accent.terracotta on its 15% tint over card',
  'dark MPill accent.terracotta on its 15% tint over elevated',
  // Field borders are hairlines at ~1.5:1; meeting 3:1 is a visible change.
  ...['dark', 'light'].flatMap((t) =>
    ['bg', 'card', 'elevated'].map((bg) => `${t} control border (line-strong) vs ${bg}`),
  ),
  // The light --tg-* accent and status colours are Telegram-bright and miss
  // 4.5:1 as text; dark misses on the raised surface.
  ...['bg', 'surface', 'surfaceSub'].flatMap((bg) =>
    ['accent', 'success', 'danger', 'warn'].map((fg) => `tg light ${fg} on ${bg}`),
  ),
  'tg light accent on accentSoft (status badge)',
  'tg light success on its 12% tint over surface',
  'tg light danger on its 10% tint over surface',
  'tg light faint arrow icon vs surface',
  'tg dark danger on bg',
  'tg dark muted on surface',
  'tg dark accent on surface',
  'tg dark danger on surface',
  'tg dark danger on surfaceSub',
  'tg dark accent on accentSoft (status badge)',
  'tg dark success on its 12% tint over surface',
  'tg dark danger on its 10% tint over surface',
  'tg dark muted on its 10% tint over surface',
  'tg dark faint arrow icon vs surface',
]);

let failed = 0;
let known = 0;
const labels = new Set(pairs.map((p) => p.label));
for (const p of pairs) {
  const r = ratio(p.fg, p.bg);
  const ok = r >= p.min;
  const isKnown = KNOWN.has(p.label);
  // A KNOWN pair that now passes fails too, so the entry gets removed.
  const tag = ok ? (isKnown ? 'FIXED' : 'ok  ') : isKnown ? 'known' : 'FAIL';
  if (tag === 'FAIL' || tag === 'FIXED') failed++;
  if (tag === 'known') known++;
  if (report || tag !== 'ok  ') {
    console.log(
      `${tag.padEnd(5)} ${r.toFixed(2).padStart(5)}:1 (min ${p.min})  ${p.label}  ${p.fg} on ${p.bg}`,
    );
  }
}
const stale = [...KNOWN].filter((l) => !labels.has(l));
for (const l of stale) console.log(`STALE KNOWN entry names no pair: ${l}`);

if (failed || stale.length) {
  console.error(
    `\ncheck-contrast: ${failed} of ${pairs.length} pairs below WCAG AA or fixed but still listed in KNOWN` +
      (stale.length ? `, ${stale.length} stale KNOWN entries` : '') +
      '.',
  );
  process.exit(1);
}
console.log(
  `check-contrast: ${pairs.length - known} of ${pairs.length} pairs meet WCAG AA; ${known} known failures wait on a palette decision.`,
);
