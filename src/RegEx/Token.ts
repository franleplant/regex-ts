export default class Token {
  kind: string;
  lexeme: string;

  constructor(kind: string, lexeme: string) {
    this.kind = kind;
    this.lexeme = lexeme;
  }
}
