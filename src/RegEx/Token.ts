export type TokenKind = "EOF" | "(" | ")" | "STAR" | "PLUS" | "OR" | "LITERAL";

export default class Token {
  static EOF(): Token {
    return new Token("EOF", "");
  }

  kind: TokenKind;
  lexeme: string;

  constructor(kind: TokenKind, lexeme: string) {
    this.kind = kind;
    this.lexeme = lexeme;
  }

  isKind(otherKind: TokenKind): boolean {
    return this.kind === otherKind;
  }

  toString(): string {
    if (!this.lexeme) {
      return `(${this.kind})`;
    }

    return `(${this.kind}, ${this.lexeme})`;
  }
}
