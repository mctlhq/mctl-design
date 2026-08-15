import { color } from './color';

// Syntax-highlight colors for YAML / code blocks. Independent of --accent
// so Tweaks do not recolor code.
export const syntax = {
  key: color.syntaxKey,
  string: color.syntaxString,
  number: color.syntaxNumber,
  keyword: color.syntaxKeyword,
  punctuation: color.syntaxPunctuation,
  comment: color.fg3,
} as const;

export type Syntax = typeof syntax;
