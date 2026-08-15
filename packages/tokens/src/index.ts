export { color } from './color';
export { hue } from './hue';
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
  text,
} from './typography';
export { space, layout } from './space';
export { radius } from './radius';
export { shadow } from './shadow';
export { zIndex } from './zIndex';
export { motion } from './motion';
export { border } from './border';
export { breakpoint } from './breakpoint';
export { icon } from './icon';
export { opacity } from './opacity';
export { focus } from './focus';
export { control } from './control';
export { telegramPalette, telegramThemeParamsMap } from './telegram';

export type { Color } from './color';
export type { Hue, HueName } from './hue';
export type { Surface, SurfaceName } from './surface';
export type { Accent, AccentName } from './accent';
export type { Status, StatusName } from './status';
export type { Syntax } from './syntax';
export type { Typography, TextStyle } from './typography';
export type { Space, Layout } from './space';
export type { Radius } from './radius';
export type { Shadow, ShadowName } from './shadow';
export type { ZIndex } from './zIndex';
export type { Motion } from './motion';
export type { Border } from './border';
export type { Breakpoint } from './breakpoint';
export type { Icon } from './icon';
export type { Opacity } from './opacity';
export type { Focus } from './focus';
export type { Control } from './control';
export type { TelegramPalette, TelegramThemeParamsMap } from './telegram';

import { color } from './color';
import { hue } from './hue';
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
import { border } from './border';
import { breakpoint } from './breakpoint';
import { icon } from './icon';
import { opacity } from './opacity';
import { focus } from './focus';
import { control } from './control';

// Single aggregate object — the machine-readable token contract.
// `gen-assets.mjs` flattens this into tokens.json and tokens.css.
export const tokens = {
  color,
  hue,
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
  border,
  breakpoint,
  icon,
  opacity,
  focus,
  control,
} as const;

export type Tokens = typeof tokens;
