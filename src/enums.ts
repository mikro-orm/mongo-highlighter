export enum TokenType {
  WHITESPACE,
  WORD,
  QUOTE,
  BACKTICK_QUOTE,
  BOUNDARY,
  NUMBER,
  ERROR,
  VARIABLE,
  LITERAL,
}

export enum HighlightSubject {
  BOUNDARY = 'boundary',
  WORD = 'word',
  BACKTICK_QUOTE = 'backtickQuote',
  QUOTE = 'quote',
  NUMBER = 'number',
  VARIABLE = 'variable',
  LITERAL = 'literal',
}

export const TOKEN_TYPE_TO_HIGHLIGHT = {
  [TokenType.BOUNDARY]: HighlightSubject.BOUNDARY,
  [TokenType.WORD]: HighlightSubject.WORD,
  [TokenType.BACKTICK_QUOTE]: HighlightSubject.BACKTICK_QUOTE,
  [TokenType.QUOTE]: HighlightSubject.QUOTE,
  [TokenType.NUMBER]: HighlightSubject.NUMBER,
  [TokenType.VARIABLE]: HighlightSubject.VARIABLE,
  [TokenType.LITERAL]: HighlightSubject.LITERAL,
};
