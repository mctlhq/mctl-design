// Spacing scale (4px base) and page-level layout rhythm (spec §13).
export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
  9: '96px',
  10: '132px',
} as const;

export const layout = {
  pagePadding: 'clamp(20px, 4vw, 56px)',
  sectionPadding: 'clamp(72px, 9vw, 132px)',
} as const;

export type Space = typeof space;
export type Layout = typeof layout;
