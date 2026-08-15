// 50–900 ramps for chart/badge work. Neutrals stay on surface.*; do not
// invent a second gray scale from these.
export const hue = {
  terracotta: {
    50: '#fdf1ee',
    100: '#f6e4dc',
    200: '#f5c4b4',
    300: '#f09a82',
    400: '#ff8a6a',
    500: '#e25a3c',
    600: '#b83d28',
    700: '#9a3220',
    800: '#7a2719',
    900: '#4f1810',
  },
  cyan: {
    50: '#eef9fb',
    100: '#d4f4f7',
    200: '#a8e8ee',
    300: '#5ed4e0',
    400: '#2ec4d4',
    500: '#1ab3c7',
    600: '#0e7a8a',
    700: '#0a5c68',
    800: '#084850',
    900: '#052e34',
  },
  lime: {
    50: '#f7fce8',
    100: '#f0f8d4',
    200: '#dcff8c',
    300: '#c8f86a',
    400: '#bdf24a',
    500: '#9ad42a',
    600: '#6b8f14',
    700: '#547110',
    800: '#3d520c',
    900: '#283608',
  },
  lilac: {
    50: '#f7f2ff',
    100: '#efe4ff',
    200: '#d6b3ff',
    300: '#c496ff',
    400: '#b07aff',
    500: '#8f52e8',
    600: '#6b3cc4',
    700: '#552e9e',
    800: '#3f2276',
    900: '#2a1750',
  },
} as const;

export type Hue = typeof hue;
export type HueName = keyof Hue;
