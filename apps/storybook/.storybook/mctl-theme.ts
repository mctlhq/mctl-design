import { create } from 'storybook/theming';

// MCTL manager (chrome) themes. Hex values mirror @mctlhq/tokens color.ts —
// kept literal here because the manager bundle runs outside the preview and
// cannot import the workspace CSS variables.

const brand = {
  brandTitle: 'MCTL UI',
  brandUrl: 'https://ui.mctl.ai',
  brandTarget: '_self',
};

const fontBase = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
const fontCode = '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace';

export const mctlDark = create({
  base: 'dark',
  ...brand,
  brandImage: '/mctl-logo-light.svg',
  colorPrimary: '#00e5ff',
  colorSecondary: '#00e5ff',
  appBg: '#0a0b0d',
  appContentBg: '#0f1114',
  appPreviewBg: '#0a0b0d',
  appBorderColor: '#1f242b',
  appBorderRadius: 6,
  barBg: '#0f1114',
  barTextColor: '#a4a8ae',
  barSelectedColor: '#00e5ff',
  barHoverColor: '#00e5ff',
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
  brandImage: '/mctl-logo-dark.svg',
  colorPrimary: '#00b8cc',
  colorSecondary: '#00b8cc',
  appBg: '#f1ede4',
  appContentBg: '#ffffff',
  appPreviewBg: '#f1ede4',
  appBorderColor: '#d8d2c4',
  appBorderRadius: 6,
  barBg: '#f1ede4',
  barTextColor: '#3a3f47',
  barSelectedColor: '#00b8cc',
  barHoverColor: '#00b8cc',
  textColor: '#15181d',
  textMutedColor: '#3a3f47',
  inputBg: '#ffffff',
  inputBorder: '#d8d2c4',
  inputTextColor: '#15181d',
  inputBorderRadius: 6,
  fontBase,
  fontCode,
});
