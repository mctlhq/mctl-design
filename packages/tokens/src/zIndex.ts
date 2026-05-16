// Stacking order.
export const zIndex = {
  base: 0,
  sticky: 100,
  nav: 200,
  overlay: 800,
  modal: 900,
  toast: 1000,
} as const;

export type ZIndex = typeof zIndex;
