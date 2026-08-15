import { create } from 'storybook/theming';

// MCTL manager (chrome) themes. Hex values mirror @mctlhq/tokens color.ts —
// kept literal here because the manager bundle runs outside the preview and
// cannot import the workspace CSS variables.

const brand = {
  brandTitle: 'MCTL UI',
  brandUrl: 'https://ui.mctl.ai',
  brandTarget: '_self',
};

// Mirror --font-display / --font-mono from tokens. Literal strings because
// the manager bundle cannot read the preview CSS variables.
const fontBase = '"Onest", system-ui, -apple-system, sans-serif';
const fontCode = '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace';

export const mctlDark = create({
  base: 'dark',
  ...brand,
  // New /brand/ URL so CF/browsers do not keep the 7-day-cached cyan square.
  brandImage: '/brand/sidebar-dark.svg',
  colorPrimary: '#e25a3c',
  colorSecondary: '#e25a3c',
  appBg: '#0a0b0d',
  appContentBg: '#0f1114',
  appPreviewBg: '#0a0b0d',
  appBorderColor: '#1f242b',
  appBorderRadius: 6,
  barBg: '#0f1114',
  barTextColor: '#a4a8ae',
  barSelectedColor: '#e25a3c',
  barHoverColor: '#e25a3c',
  textColor: '#e6e7e9',
  textMutedColor: '#a4a8ae',
  inputBg: '#15181d',
  inputBorder: '#2a313a',
  inputTextColor: '#e6e7e9',
  inputBorderRadius: 6,
  fontBase,
  fontCode,
});

export const mctlLight = create({
  base: 'light',
  ...brand,
  brandImage: '/brand/sidebar-light.svg',
  colorPrimary: '#b83d28',
  colorSecondary: '#b83d28',
  appBg: '#f1ede4',
  appContentBg: '#fffdf8',
  appPreviewBg: '#f1ede4',
  appBorderColor: '#d8d2c4',
  appBorderRadius: 6,
  barBg: '#f1ede4',
  barTextColor: '#3a3f47',
  barSelectedColor: '#b83d28',
  barHoverColor: '#b83d28',
  textColor: '#15181d',
  textMutedColor: '#3a3f47',
  inputBg: '#fffdf8',
  inputBorder: '#d8d2c4',
  inputTextColor: '#15181d',
  inputBorderRadius: 6,
  fontBase,
  fontCode,
});
