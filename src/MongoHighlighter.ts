import c from 'ansi-colors';
import { Token, Tokenizer } from './Tokenizer';
import { TokenType, HighlightSubject, TOKEN_TYPE_TO_HIGHLIGHT } from './enums';

export class MongoHighlighter {

  static readonly DEFAULT_THEME = {
    [HighlightSubject.QUOTE]: c.yellow,
    [HighlightSubject.BACKTICK_QUOTE]: c.yellow,
    [HighlightSubject.BOUNDARY]: c.reset,
    [HighlightSubject.NUMBER]: c.green,
    [HighlightSubject.WORD]: undefined,
    [HighlightSubject.VARIABLE]: c.cyan,
    [HighlightSubject.LITERAL]: c.green,
  };

  private readonly tokenizer = new Tokenizer();

  constructor(private readonly theme: { [K in keyof typeof HighlightSubject]?: string } = {}) {
    this.theme = { ...MongoHighlighter.DEFAULT_THEME, ...this.theme };
  }

  /**
   * Add syntax highlighting to Mongo query
   */
  highlight(query: string): string {
    const tokens = this.tokenizer.tokenize(query);
    let token: Token | undefined;
    let ret = '';
    let position = 0;

    // eslint-disable-next-line no-cond-assign
    while (token = tokens[position++]) {
      ret += this.highlightToken(token.type, token.value);
    }

    return ret;
  }

  private highlightToken(type: TokenType, value: string): string {
    if (type === TokenType.BOUNDARY && ['(', ')'].includes(value)) {
      return value;
    }

    return this.colorize(type, value);
  }

  private colorize(type: TokenType, value: string): string {
    if (!TOKEN_TYPE_TO_HIGHLIGHT[type] || !this.theme[TOKEN_TYPE_TO_HIGHLIGHT[type]]) {
      return value;
    }

    return this.theme[TOKEN_TYPE_TO_HIGHLIGHT[type]](value);
  }

}
