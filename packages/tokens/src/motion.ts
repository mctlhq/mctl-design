// Motion tokens — durations and easing curves.
export const motion = {
  duration: {
    instant: '0ms',
    fast: '120ms',
    base: '200ms',
    slow: '320ms',
    emphasis: '480ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    entrance: 'cubic-bezier(0, 0, 0, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

export type Motion = typeof motion;
