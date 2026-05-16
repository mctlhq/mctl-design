// Primitive color palette. Raw hex values from the MCTL design spec (§11).
// Semantic groups (surface, accent, status, syntax) reference these.
export const color = {
  // Dark surface ("Engineering")
  ink: '#0a0b0d',
  ink2: '#0f1114',
  ink3: '#15181d',
  line: '#1f242b',
  line2: '#2a313a',
  fg: '#e6e7e9',
  fg2: '#a4a8ae',
  fg3: '#6b7079',

  // Light surface ("Editorial" — paper)
  paper: '#f1ede4',
  paperInk: '#15181d',
  paperFg: '#3a3f47',
  paperLine: '#d8d2c4',

  // Accents
  cyan: '#00e5ff',
  cyanHighlight: '#7df2ff',
  lime: '#bdf24a',
  limeHighlight: '#dcff8c',
  vermilion: '#ff5a36',
  vermilionHighlight: '#ff8a6a',
  lilac: '#b07aff',
  lilacHighlight: '#d6b3ff',

  // Status
  ok: '#7cf2a4',
  warn: '#f5a524',
  bad: '#ff6b6b',
} as const;

export type Color = typeof color;
