import { Automata } from "./Automata";
import lexer from "./lexer";
import Parser from "./Parser";
import evalTree from "./eval";

export default class RegExp {
  private automata: Automata;

  constructor(regex: string) {
    const tokens = lexer(regex);
    const ast = new Parser(tokens).parse();
    this.automata = evalTree(ast);
  }

  test(input: string): boolean {
    return this.automata.eval(input);
  }
}
