import { color } from './color';

// Syntax-highlight colors for YAML / code blocks. Independent of --accent
// so Tweaks do not recolor code. A dark/light pair like surface and status:
// the dark set is pale on ink and would be unreadable on the paper card.
export const syntax = {
  dark: {
    key: color.syntaxKey,
    string: color.syntaxString,
    number: color.syntaxNumber,
    keyword: color.syntaxKeyword,
    punctuation: color.syntaxPunctuation,
    comment: color.fg3,
  },
  light: {
    key: color.syntaxKeyDeep,
    string: color.syntaxStringDeep,
    number: color.syntaxNumberDeep,
    keyword: color.syntaxKeywordDeep,
    punctuation: color.syntaxPunctuationDeep,
    comment: color.syntaxCommentDeep,
  },
} as const;

export type Syntax = typeof syntax;
