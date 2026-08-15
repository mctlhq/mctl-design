// Elevation. Hairlines are the default; shadows are for floating surfaces.
// Light shadows are warm and quiet — do not reuse the dark overlay on paper.
export const shadow = {
  dark: {
    none: 'none',
    sm: '0 4px 12px rgba(0, 0, 0, 0.28)',
    md: '0 8px 24px rgba(0, 0, 0, 0.36)',
    overlay: '0 16px 48px rgba(0, 0, 0, 0.48)',
  },
  light: {
    none: 'none',
    sm: '0 2px 8px rgba(40, 32, 24, 0.06)',
    md: '0 8px 24px rgba(40, 32, 24, 0.08)',
    overlay: '0 16px 40px rgba(40, 32, 24, 0.12)',
  },
} as const;

export type Shadow = typeof shadow;
export type ShadowName = keyof (typeof shadow)['dark'];
