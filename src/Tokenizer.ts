import { TokenType } from './enums';

export interface Token {
  type: number;
  readonly value: string;
}

export class Tokenizer {

  private readonly literal = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];

  /** Punctuation that can be used as a boundary between other tokens */
  private readonly boundaries = [',', ';', ':', ')', '(', '.', '=', '<', '>', '+', '-', '*', '/', '!', '^', '%', '|', '&', '#'];

  // Regular expressions for tokenizing
  private readonly regexBoundaries = '(' + this.quoteRegex(this.boundaries).join('|') + ')';
  private readonly regexLiteral = '(' + this.quoteRegex(this.literal).join('|') + ')';

  /**
   * Takes Mongo query and breaks it into tokens.
   */
  tokenize(string: string): Token[] {
    const tokens: Token[] = [];

    // Used to make sure the string keeps shrinking on each iteration
    let oldStringLen = string.length + 1;
    let token: Token | undefined;
    let currentLength = string.length;

    // Keep processing the string until it is empty
    while (currentLength) {
      // If the string stopped shrinking, there was a problem
      if (oldStringLen <= currentLength) {
        tokens.push({ type: TokenType.ERROR, value: string });
        return tokens;
      }

      oldStringLen = currentLength;

      // Get the next token and the token type
      token = this.createNextToken(string, token);
      const tokenLength = token.value.length;
      tokens.push(token);

      // Advance the string
      string = string.substr(tokenLength);
      currentLength -= tokenLength;
    }

    return tokens;
  }

  /**
   * Return the next token and token type in Mongo query.
   * Quoted strings, comments, reserved words, whitespace, and punctuation are all their own tokens.
   */
  private createNextToken(str: string, previous?: Token): Token {
    let match: RegExpMatchArray | null;

    // Whitespace
    match = str.match(/^\s+/);

    if (match) {
      return { type: TokenType.WHITESPACE, value: match[0] };
    }

    // Quoted String
    if (['"', '\'', '`', '['].includes(str[0])) {
      const type = str[0] === '`' || str[0] === '[' ? TokenType.BACKTICK_QUOTE : TokenType.QUOTE;
      return { type, value: this.getQuotedString(str) };
    }

    // Number (decimal, binary, or hex)
    match = new RegExp(`^([0-9]+(.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)($|\\s|"'\`|${this.regexBoundaries})`).exec(str);

    if (match) {
      return { type: TokenType.NUMBER, value: match[1] };
    }

    // Boundary Character (punctuation and symbols)
    match = new RegExp(`^(${this.regexBoundaries})`).exec(str);

    if (match) {
      if (previous && match[1] === ':') {
        previous.type = TokenType.VARIABLE;
      }

      return { type: TokenType.BOUNDARY, value: match[1] };
    }

    const lower = str.toLowerCase();

    // literal
    match = new RegExp(`^(${this.regexLiteral})($|\\s|${this.regexBoundaries})`).exec(lower);

    if (match) {
      return { type: TokenType.LITERAL, value: str.substr(0, match[1].length) };
    }

    // Non reserved word
    match = new RegExp(`^(.*?)($|\\s|["'\`]|${this.regexBoundaries})`).exec(str);

    return { type: TokenType.WORD, value: match![1] };
  }

  /**
   * Helper function for building regular expressions for reserved words and boundary characters
   */
  private quoteRegex(strings: string[]): string[] {
    return strings.map(str => str.replace(new RegExp(`[.\\\\+*?\\[^\\]$(){}=!<>|:\\${'/'}-]`, 'g'), '\\$&'));
  }

  private getQuotedString(string: string): string {
    const re = '^(((`[^`]*($|`))+)|'                    // backtick quoted string using `` to escape
      + '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)|'      // double quoted string using "" or \" to escape
      + '((\'[^\'\\\\]*(?:\\\\.[^\'\\\\]*)*(\'|$))+))'; // single quoted string using '' or \' to escape
    const m = new RegExp(re, 's').exec(string);

    return m?.[1] ?? '';
  }

}
