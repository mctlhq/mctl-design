#!/usr/bin/env node
// WCAG 2 contrast gate over the built tokens.
//
// Token comments used to assert "AA on paper" by eye, and several pairs were
// below it (limeDeep on paper was 3.2:1, the syntax key colour on the light
// card 1.6:1). This walks every foreground/background pair the components and
// prose.css actually render, per theme and per accent, and fails below the
// threshold. Run after `pnpm build` (it reads packages/tokens/dist).
//
//   node scripts/check-contrast.mjs            # gate
//   node scripts/check-contrast.mjs --report   # print every pair
let tokens;
try {
  ({ tokens } = await import('../packages/tokens/dist/index.js'));
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  console.error('check-contrast: packages/tokens/dist is missing -- run `pnpm build` first.');
  process.exit(1);
}

const TEXT = 4.5; // WCAG 1.4.3, normal-size text

const report = process.argv.includes('--report');

function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
}

let failed = 0;
for (const p of pairs) {
  const r = ratio(p.fg, p.bg);
  const ok = r >= p.min;
  if (!ok) failed++;
  if (report || !ok) {
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${p.min})  ${p.label}  ${p.fg} on ${p.bg}`,
    );
  }
}

if (failed) {
  console.error(`\ncheck-contrast: ${failed} of ${pairs.length} pairs below WCAG AA.`);
  process.exit(1);
}
console.log(`check-contrast: all ${pairs.length} pairs meet WCAG AA.`);
