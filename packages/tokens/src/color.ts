// Primitive color palette. Semantic groups (surface, accent, status, syntax)
// reference these. Editorial-warm: cool ink x warm paper, terracotta default.
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
  paperElevated: '#f7f4ec',
  paperCard: '#fffdf8',
  paperInk: '#15181d',
  paperFg: '#3a3f47',
  paperLine: '#d8d2c4',
  paperLineStrong: '#c4bcae',

  // Terracotta (default accent). Dark step is hot on ink; deep step is AA on paper.
  terracotta: '#e25a3c',
  terracottaHighlight: '#ff8a6a',
  terracottaDeep: '#b83d28',
  terracottaDeeper: '#9a3220',
  terracottaSoft: '#f6e4dc',
  terracottaSoftDark: '#241512',
  terracottaFgLight: '#fff8f3',

  // Muted cyan (optional accent) — desaturated vs the old neon #00e5ff.
  cyan: '#1ab3c7',
  cyanHighlight: '#5ed4e0',
  cyanDeep: '#0e7a8a',
  cyanDeeper: '#0a5c68',
  cyanSoft: '#d4f4f7',
  cyanSoftDark: '#0c1f23',

  // Lime (optional accent)
  lime: '#bdf24a',
  limeHighlight: '#dcff8c',
  limeDeep: '#6b8f14',
  limeDeeper: '#547110',
  limeSoft: '#f0f8d4',
  limeSoftDark: '#202714',
  limeFgLight: '#f7fce8',

  // Lilac (optional accent)
  lilac: '#b07aff',
  lilacHighlight: '#d6b3ff',
  lilacDeep: '#6b3cc4',
  lilacDeeper: '#552e9e',
  lilacSoft: '#efe4ff',
  lilacSoftDark: '#1e192a',
  lilacFgLight: '#f8f4ff',

  // Compat aliases — vermilion now tracks terracotta.
  vermilion: '#e25a3c',
  vermilionHighlight: '#ff8a6a',

  // Status — dark-tuned neon; *Deep is the light-surface pair.
  ok: '#7cf2a4',
  warn: '#f5a524',
  bad: '#ff6b6b',
  okDeep: '#2f7d4a',
  warnDeep: '#b45309',
  badDeep: '#c23b3b',

  // Syntax — independent of brand accent so code does not recolor with Tweaks.
  syntaxKey: '#7ec8c8',
  syntaxString: '#c4a35a',
  syntaxNumber: '#e08b5a',
  syntaxKeyword: '#8b7ec8',
  syntaxPunctuation: '#6b7079',
} as const;

export type Color = typeof color;
