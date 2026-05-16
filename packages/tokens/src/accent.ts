import { color } from './color';

// Tweaks-selectable accents. Each accent is a primary/highlight pair.
export const accent = {
  cyan: { primary: color.cyan, highlight: color.cyanHighlight },
  lime: { primary: color.lime, highlight: color.limeHighlight },
  vermilion: { primary: color.vermilion, highlight: color.vermilionHighlight },
  lilac: { primary: color.lilac, highlight: color.lilacHighlight },
} as const;

export const defaultAccent = 'cyan';

export type Accent = typeof accent;
export type AccentName = keyof Accent;
