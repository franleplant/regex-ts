export default class Token {
  static EOF(): Token {
    return new Token("EOF", "");
  }

  kind: string;
  lexeme: string;

  constructor(kind: string, lexeme: string) {
    this.kind = kind;
    this.lexeme = lexeme;
  }

  isKind(otherKind: string): boolean {
    return this.kind === otherKind;
  }
}
