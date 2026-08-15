import { color } from './color';

// Tweaks-selectable accents. Each accent is a dark/light pair with
// primary (fill/text), highlight (hover), fg (text on fill), and soft (tint).
const terracotta = {
  dark: {
    primary: color.terracotta,
    highlight: color.terracottaHighlight,
    fg: color.ink,
    soft: color.terracottaSoftDark,
  },
  light: {
    primary: color.terracottaDeep,
    highlight: color.terracottaDeeper,
    fg: color.terracottaFgLight,
    soft: color.terracottaSoft,
  },
} as const;

export const accent = {
  terracotta,
  // Public alias so data-accent="vermilion" keeps working.
  vermilion: terracotta,
  cyan: {
    dark: {
      primary: color.cyan,
      highlight: color.cyanHighlight,
      fg: color.ink,
      soft: color.cyanSoftDark,
    },
    light: {
      primary: color.cyanDeep,
      highlight: color.cyanDeeper,
      fg: color.paper,
      soft: color.cyanSoft,
    },
  },
  lime: {
    dark: {
      primary: color.lime,
      highlight: color.limeHighlight,
      fg: color.ink,
      soft: color.limeSoftDark,
    },
    light: {
      primary: color.limeDeep,
      highlight: color.limeDeeper,
      fg: color.limeFgLight,
      soft: color.limeSoft,
    },
  },
  lilac: {
    dark: {
      primary: color.lilac,
      highlight: color.lilacHighlight,
      fg: color.ink,
      soft: color.lilacSoftDark,
    },
    light: {
      primary: color.lilacDeep,
      highlight: color.lilacDeeper,
      fg: color.lilacFgLight,
      soft: color.lilacSoft,
    },
  },
} as const;

export const defaultAccent = 'terracotta';

export type Accent = typeof accent;
export type AccentName = keyof Accent;
