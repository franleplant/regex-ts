import debugFactory from "debug";
import Token, { TokenKind } from "../lexer/Token";
import ASTree from "../ASTree";
import { logVT } from "./logger";

const debug = debugFactory("parser");

/*
// Original
S -> Literal
S -> (S)
S -> S | S
S -> S*
S -> S+
S -> S S



// remove recursion
https://lab.brainonfire.net/CFG/remove-left-recursion.html

S -> Lit A
S -> ( S ) A

A -> or S A
A -> * A
A -> + A
A -> S A
A -> lambda

*/

export default class Parser {
  private trackId: number = 1;
  readonly tokens: Array<Token>;
  index: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  // Recursive grammar derivation id
  // for debuggin
  getTrackId(): number {
    const id = this.trackId;
    this.trackId += 1;
    return id;
  }

  getTokenStack(): Array<Token> {
    return this.tokens.slice(this.index);
  }

  getToken(): Token {
    return this.tokens[this.index];
  }

  eatToken(tokenKind: TokenKind): Token | undefined {
    const currentToken = this.getToken();
    if (currentToken.isKind(tokenKind)) {
      this.index += 1;
      debug(`eatToken(). %o`, currentToken);
      return currentToken;
    }

    return;
  }

  reset() {
    this.index = 0;
  }

  parse(): ASTree {
    debug(`parse(): %o`, this.tokens);
    this.reset();
    const tree = this.S();
    if (!tree) {
      throw new Error(`Parser error`);
    }

    const resultTree = new ASTree({
      kind: "ROOT",
      children: [tree],
    });

    debug(`parse(): RESULT %O`, resultTree);
    return resultTree;
  }

  @logVT("S -> any")
  S(): ASTree | undefined {
    let subTree;

    if ((subTree = this.S1())) {
      return subTree;
    }

    if ((subTree = this.S2())) {
      return subTree;
    }

    return;
  }

  @logVT("A -> any")
  A(): ASTree | undefined {
    let subTree;

    if ((subTree = this.A1())) {
      return subTree;
    }

    if ((subTree = this.A2())) {
      return subTree;
    }

    if ((subTree = this.A3())) {
      return subTree;
    }

    if ((subTree = this.A4())) {
      return subTree;
    }

    return ASTree.Lambda;
  }

  @logVT("S -> Literal A")
  S1(): ASTree | undefined {
    const literal = this.eatToken("LITERAL");
    if (!literal) {
      return;
    }

    // if there is a subtree this means that this grammar
    // path worked and we should continue with this,
    // otherwise try another
    const subTree = this.A();
    if (!subTree) {
      return;
    }

    return new ASTree({
      kind: "INTERSECTION",
      children: [
        new ASTree({
          kind: "LITERAL",
          lexeme: literal.lexeme,
        }),
        subTree,
      ],
    });
  }

  @logVT("S -> ( S ) A")
  S2(): ASTree | undefined {
    if (!this.eatToken("(")) {
      return;
    }

    const left = this.S();
    if (!left) {
      return;
    }

    if (!this.eatToken(")")) {
      return;
    }

    const right = this.A();
    if (!right) {
      return;
    }

    return new ASTree({
      kind: "INTERSECTION",
      children: [left, right],
    });
  }

  @logVT("A -> | S A")
  A1(): ASTree | undefined {
    if (!this.eatToken("OR")) {
      return;
    }

    const leftTree = this.S();
    if (!leftTree) {
      return;
    }

    const rightTree = this.A();
    if (!rightTree) {
      return;
    }

    return new ASTree({
      kind: "UNION",
      children: [leftTree, rightTree],
    });
  }

  @logVT("A -> * A")
  A2(): ASTree | undefined {
    if (!this.eatToken("STAR")) {
      return;
    }

    return new ASTree({
      kind: "STAR",
      children: [this.A()],
    });
  }

  @logVT("A -> + A")
  A3(): ASTree | undefined {
    if (!this.eatToken("PLUS")) {
      return;
    }

    return new ASTree({
      kind: "PLUS",
      children: [this.A()],
    });
  }

  @logVT("A -> S A")
  A4(): ASTree | undefined {
    const left = this.S();
    if (!left) {
      return;
    }

    return new ASTree({
      kind: "INTERSECTION",
      children: [left, this.A()],
    });
  }
}
