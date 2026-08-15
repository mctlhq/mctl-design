// Border radius. The MCTL surface is hairline-driven and mostly square;
// xl/2xl exist for product cards that need a little more softness.
export const radius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  pill: '999px',
} as const;

export type Radius = typeof radius;
