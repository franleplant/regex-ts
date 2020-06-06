export type TokenKind =
  | "EOF"
  | "("
  | ")"
  | "STAR"
  | "PLUS"
  | "OR"
  | "LITERAL"
  | "LITERAL_SET";

export default class Token {
  static EOF(column: number = 0): Token {
    return new Token("EOF", "", column);
  }

  kind: TokenKind;
  lexeme: string;
  column: number;

  constructor(kind: TokenKind, lexeme: string, column: number = 0) {
    this.kind = kind;
    this.lexeme = lexeme;
    this.column = column;
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
