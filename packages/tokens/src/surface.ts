import { color } from './color';

// Semantic surface tokens for the two themes. The dark "Engineering" surface
// is the default; the light "Editorial" paper surface is the flip.
export const surface = {
  dark: {
    bg: color.ink,
    elevated: color.ink2,
    card: color.ink3,
    line: color.line,
    lineStrong: color.line2,
    fg: color.fg,
    fgMuted: color.fg2,
    fgSubtle: color.fg3,
  },
  light: {
    bg: color.paper,
    elevated: color.paper,
    card: color.paper,
    line: color.paperLine,
    lineStrong: color.paperLine,
    fg: color.paperInk,
    fgMuted: color.paperFg,
    fgSubtle: color.fg3,
  },
} as const;

export type Surface = typeof surface;
export type SurfaceName = keyof Surface;
