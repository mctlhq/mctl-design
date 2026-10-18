// Story a11y parameters (see parameters.a11y in preview.ts).
//
// contrastDebt switches off axe's color-contrast rule, and only that rule, for
// a story file whose contrast failures are recorded palette debt that waits on
// a palette decision. Every other axe rule still fails those stories. The
// debt itself is ratcheted at exact ratios by scripts/check-contrast.mjs
// (KNOWN), which covers the MPill / status tints and the --tg-* palette.
// Pairs the browser finds that check-contrast does not model yet:
//   - white button text on the --tg-* accent (3.09 dark, 3.90 light)
//   - --tg-faint text (2.14 on the dark surface, 2.71 on white)
//   - MAlert's danger text on a card (4.45 dark) and in a stack (4.43 light)
//   - the status-coloured links in Foundations/Public Sites (3.92, 4.07)
// Remove a file's contrastDebt once its palette passes; the story tests then
// hold it there.
export const contrastDebt = {
  config: { rules: [{ id: 'color-contrast', enabled: false }] },
};
