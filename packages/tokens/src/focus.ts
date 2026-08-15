// Ring color is theme-aware (--accent) and lives in theme.css, not here.
export const focus = {
  ringWidth: '2px',
  ringOffset: '2px',
} as const;

export type Focus = typeof focus;
