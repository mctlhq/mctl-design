export { color } from './color';
export { surface } from './surface';
export { accent, defaultAccent } from './accent';
export { status } from './status';
export { syntax } from './syntax';
export {
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} from './typography';
export { space, layout } from './space';
export { radius } from './radius';
export { shadow } from './shadow';
export { zIndex } from './zIndex';
export { motion } from './motion';

export type { Color } from './color';
export type { Surface, SurfaceName } from './surface';
export type { Accent, AccentName } from './accent';
export type { Status, StatusName } from './status';
export type { Syntax } from './syntax';
export type { Typography } from './typography';
export type { Space, Layout } from './space';
export type { Radius } from './radius';
export type { Shadow } from './shadow';
export type { ZIndex } from './zIndex';
export type { Motion } from './motion';

import { color } from './color';
import { surface } from './surface';
import { accent } from './accent';
import { status } from './status';
import { syntax } from './syntax';
import { typography } from './typography';
import { space, layout } from './space';
import { radius } from './radius';
import { shadow } from './shadow';
import { zIndex } from './zIndex';
import { motion } from './motion';

// Single aggregate object — the machine-readable token contract.
// `gen-assets.mjs` flattens this into tokens.json and tokens.css.
export const tokens = {
  color,
  surface,
  accent,
  status,
  syntax,
  typography,
  space,
  layout,
  radius,
  shadow,
  zIndex,
  motion,
} as const;

export type Tokens = typeof tokens;
