export const control = {
  height: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
} as const;

export type Control = typeof control;
