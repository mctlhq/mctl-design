// Elevation. The design uses hairlines, not shadows — `none` is the default;
// `overlay` exists only for floating surfaces like the Tweaks panel.
export const shadow = {
  none: 'none',
  overlay: '0 16px 48px rgba(0, 0, 0, 0.48)',
} as const;

export type Shadow = typeof shadow;
