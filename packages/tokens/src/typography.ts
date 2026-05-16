// Typography tokens from the MCTL design spec (§12).
export const fontFamily = {
  display: "'Geist', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  editorial: "'Instrument Serif', Georgia, serif",
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Fluid type scale. Hero/section sizes clamp across the viewport.
export const fontSize = {
  marker: 'clamp(11px, 0.78vw, 12px)',
  body: 'clamp(15px, 1.05vw, 16px)',
  lede: 'clamp(18px, 1.4vw, 20px)',
  stat: 'clamp(40px, 4vw, 56px)',
  sectionTitle: 'clamp(28px, 3.6vw, 56px)',
  hero: 'clamp(48px, 8.4vw, 132px)',
} as const;

export const lineHeight = {
  hero: '0.92',
  sectionTitle: '1.05',
  lede: '1.55',
  body: '1.5',
} as const;

export const letterSpacing = {
  hero: '-0.02em',
  marker: '0.12em',
  normal: '0',
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} as const;

export type Typography = typeof typography;
