// Spacing scale (4px base) and page-level layout rhythm.
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
  20: '20px',
  40: '40px',
  80: '80px',
} as const;

export const layout = {
  pagePadding: 'clamp(20px, 4vw, 56px)',
  sectionPadding: 'clamp(72px, 9vw, 132px)',
  gutter: '20px',
  stack: '24px',
  proseWidth: '720px',
  // Reading measures in characters, so they track the font size: a hero
  // lede and a section lede (or a long paragraph) respectively.
  measureLede: '58ch',
  measureProse: '65ch',
  // Hero rhythm, top to bottom: eyebrow, title, lede, actions, meta line.
  // The gaps grow down the stack so the title reads as one block with its
  // lede and the call to action gets air of its own.
  heroEyebrowGap: '20px',
  heroTitleGap: '24px',
  heroActionsGap: '40px',
  heroMetaGap: '32px',
  pageWidth: '1400px',
  // MPageLayout's maxWidth steps; MFooter centres on containerMd. Not
  // exposed as Tailwind container-* utilities: v4 already owns that scale
  // (--container-sm is 384px), and redefining it would move every max-w-sm.
  containerSm: '640px',
  containerMd: '960px',
  containerLg: '1280px',
  siteHeaderHeight: '80px',
  siteHeaderBlur: '12px',
  siteWordmarkSize: '24px',
  siteWordmarkWeight: '800',
  siteWordmarkTracking: '2px',
  siteWordmarkAccentGap: '2px',
  siteNavSize: '0.95rem',
  siteNavWeight: '500',
} as const;

export type Space = typeof space;
export type Layout = typeof layout;
