// Border radius. The MCTL surface is hairline-driven and mostly square;
// the scale stays deliberately tight.
export const radius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  pill: '999px',
} as const;

export type Radius = typeof radius;
