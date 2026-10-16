// Typography tokens. Display is Onest (warm grotesque); editorial stays
// Instrument Serif; mono stays JetBrains Mono.
export const fontFamily = {
  display: "'Onest', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  editorial: "'Instrument Serif', Georgia, serif",
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Marketing (fluid clamp) + product UI (fixed px) scales.
export const fontSize = {
  marker: 'clamp(11px, 0.78vw, 12px)',
  body: 'clamp(15px, 1.05vw, 16px)',
  lede: 'clamp(18px, 1.4vw, 20px)',
  stat: 'clamp(40px, 4vw, 56px)',
  sectionTitle: 'clamp(28px, 3.6vw, 56px)',
  hero: 'clamp(48px, 8.4vw, 132px)',
  xs: '12px',
  sm: '13px',
  base: '15px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

export const lineHeight = {
  hero: '0.92',
  sectionTitle: '1.05',
  lede: '1.55',
  body: '1.5',
  caption: '1.4',
  tight: '1.2',
  none: '1',
} as const;

export const letterSpacing = {
  hero: '-0.02em',
  marker: '0.12em',
  normal: '0',
} as const;

// Composite text styles — the AI-friendly layer. Pick one instead of
// combining family/size/weight/leading by hand.
export const text = {
  hero: {
    family: fontFamily.display,
    size: fontSize.hero,
    weight: fontWeight.semibold,
    lineHeight: lineHeight.hero,
    letterSpacing: letterSpacing.hero,
  },
  title: {
    family: fontFamily.display,
    size: fontSize['3xl'],
    weight: fontWeight.semibold,
    lineHeight: lineHeight.sectionTitle,
    letterSpacing: letterSpacing.hero,
  },
  section: {
    family: fontFamily.display,
    size: fontSize.sectionTitle,
    weight: fontWeight.semibold,
    lineHeight: lineHeight.sectionTitle,
    letterSpacing: letterSpacing.hero,
  },
  lede: {
    family: fontFamily.editorial,
    size: fontSize.lede,
    weight: fontWeight.regular,
    lineHeight: lineHeight.lede,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    family: fontFamily.display,
    size: fontSize.body,
    weight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  // Same type recipe as body; muted color is applied separately
  // (e.g. color: var(--surface-fg-muted)).
  bodyMuted: {
    family: fontFamily.display,
    size: fontSize.body,
    weight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    family: fontFamily.display,
    size: fontSize.sm,
    weight: fontWeight.regular,
    lineHeight: lineHeight.caption,
    letterSpacing: letterSpacing.normal,
  },
  marker: {
    family: fontFamily.mono,
    size: fontSize.marker,
    weight: fontWeight.medium,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.marker,
  },
  code: {
    family: fontFamily.mono,
    size: fontSize.sm,
    weight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.normal,
  },
  stat: {
    family: fontFamily.mono,
    size: fontSize.stat,
    weight: fontWeight.regular,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// Public websites use a restrained display scale and a separate reading scale.
// These are additive: existing product/editorial text recipes stay compatible.
export const publicText = {
  hero: { size: 'clamp(35.2px, 4.5vw, 68px)', weight: 800, leading: '1.1', tracking: '-0.02em' },
  docsHero: { size: 'clamp(32px, 4.5vw, 56px)', weight: 800, leading: '1.15', tracking: '-0.02em' },
  section: { size: 'clamp(28px, 4vw, 48px)', weight: 800, leading: '1.2', tracking: '-0.02em' },
  title: { size: '24px', weight: 700, leading: '1.3', tracking: '0' },
  subtitle: { size: 'clamp(18px, 1.7vw, 24px)', weight: 400, leading: '1.6', tracking: '0' },
  body: { size: '16px', weight: 400, leading: '1.6', tracking: '0' },
  small: { size: '14px', weight: 400, leading: '1.6', tracking: '0' },
  caption: { size: '13px', weight: 400, leading: '1.5', tracking: '0' },
  micro: { size: '12px', weight: 400, leading: '1.4', tracking: '0' },
  label: { size: '15.2px', weight: 500, leading: '1.6', tracking: '0' },
  marker: { size: '13px', weight: 500, leading: '1.4', tracking: '0.12em' },
  code: { size: '14px', weight: 400, leading: '1.6', tracking: '0' },
  prose: { size: '16px', weight: 400, leading: '1.75', tracking: '0' },
  proseTitle: { size: '32px', weight: 800, leading: '1.25', tracking: '-0.02em' },
  proseSection: { size: '24px', weight: 700, leading: '1.4', tracking: '-0.02em' },
  proseSubsection: { size: '20px', weight: 600, leading: '1.4', tracking: '0' },
} as const;

export const typography = {
  publicText,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  text,
} as const;

export type Typography = typeof typography;
export type TextStyle = keyof typeof text;
