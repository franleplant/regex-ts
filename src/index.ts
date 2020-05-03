import debugFactory from "debug";
import { Automata } from "./Automata";
import lexer from "./lexer";
import Parser from "./Parser";
import toAST from "./toAST";
import evalTree from "./eval";

const debug = debugFactory("RegExp");

export default class RegExp {
  private automata: Automata;

  constructor(regex: string) {
    debug("compiling %o", regex);

    const tokens = lexer(regex);
    debug("lex result %O", tokens);

    const parseTree = new Parser(tokens).parse();
    debug("parser result %O", parseTree);

    const ast = toAST(parseTree);
    debug("toAST result %O", ast);

    this.automata = evalTree(ast);
    debug("eval result %O", this.automata);
  }

  test(input: string): boolean {
    return this.automata.eval(input);
  }
}
