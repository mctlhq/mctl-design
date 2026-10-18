import { color } from './color';

// Tweaks-selectable accents. Each accent is a dark/light pair with
// primary (fill/text), highlight (hover), fg (text on fill), soft (tint) and
// text (the accent as text on a tint of itself, e.g. a filled pill).
const terracotta = {
  dark: {
    primary: color.terracotta,
    highlight: color.terracottaHighlight,
    fg: color.ink,
    soft: color.terracottaSoftDark,
    text: color.terracottaTextDark,
  },
  light: {
    primary: color.terracottaDeep,
    highlight: color.terracottaDeeper,
    fg: color.terracottaFgLight,
    soft: color.terracottaSoft,
    text: color.terracottaText,
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
      text: color.cyan,
    },
    light: {
      primary: color.cyanDeep,
      highlight: color.cyanDeeper,
      fg: color.paper,
      soft: color.cyanSoft,
      text: color.cyanText,
    },
  },
  lime: {
    dark: {
      primary: color.lime,
      highlight: color.limeHighlight,
      fg: color.ink,
      soft: color.limeSoftDark,
      text: color.lime,
    },
    light: {
      primary: color.limeDeep,
      highlight: color.limeDeeper,
      fg: color.limeFgLight,
      soft: color.limeSoft,
      text: color.limeText,
    },
  },
  lilac: {
    dark: {
      primary: color.lilac,
      highlight: color.lilacHighlight,
      fg: color.ink,
      soft: color.lilacSoftDark,
      text: color.lilac,
    },
    light: {
      primary: color.lilacDeep,
      highlight: color.lilacDeeper,
      fg: color.lilacFgLight,
      soft: color.lilacSoft,
      text: color.lilacDeep,
    },
  },
} as const;

export const defaultAccent = 'terracotta';

export type Accent = typeof accent;
export type AccentName = keyof Accent;
