import { color } from './color';

// Syntax-highlight colors for YAML / code blocks.
export const syntax = {
  key: color.cyanHighlight,
  string: color.lime,
  comment: color.fg3,
} as const;

export type Syntax = typeof syntax;
