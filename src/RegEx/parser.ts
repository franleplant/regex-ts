import debugFactory from "debug";
import Token from "./Token";
import ASTree from "./ASTree";

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
  private readonly tokens: Array<Token>;
  private index: number = 0;
  private trackId: number = 1;

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

  getToken(): Token {
    return this.tokens[this.index];
  }

  eatToken(tokenKind: string): Token | undefined {
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

  parse(): ASTree | undefined {
    debug(`parse(): %o`, this.tokens);
    this.reset();
    const tree = this.S();
    if (!tree) {
      throw new Error(`Parser error`);
    }

    return new ASTree({
      kind: "ROOT",
      children: [tree],
    });
  }

  // S -> Literal A
  S1(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} S1(): S -> Literal A. %o`, this.tokens.slice(this.index));

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

    const tree = new ASTree({
      kind: "INTERSECTION",
      children: [
        new ASTree({
          kind: "LITERAL",
          lexeme: literal.lexeme,
        }),
        subTree,
      ],
    });

    debug(`${trackId} S1(): S -> Literal A. ret %o`, tree);
    return tree;
  }

  // S -> ( S ) A
  S2(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} S2(): S -> ( S ) A. %o`, this.tokens.slice(this.index));
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

    const tree = new ASTree({
      kind: "INTERSECTION",
      children: [left, right],
    });
    debug(`${trackId} S2(): S -> ( S ) A. ret %o`, tree);
    return tree;
  }

  S(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} S(). %o`, this.tokens.slice(this.index));
    let subTree;

    if ((subTree = this.S1())) {
      debug(`${trackId} S(). S1() branch`);
      return subTree;
    }

    if ((subTree = this.S2())) {
      debug(`${trackId} S(). S2() branch`);
      return subTree;
    }

    debug(`${trackId} S(). Backtrack`);
    return;
  }

  A(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} A(). %o`, this.tokens.slice(this.index));
    let subTree;

    if ((subTree = this.A1())) {
      debug(`${trackId} A(). A1() branch`);
      return subTree;
    }

    if ((subTree = this.A2())) {
      debug(`${trackId} A(). A2() branch`);
      return subTree;
    }

    if ((subTree = this.A3())) {
      debug(`${trackId} A(). A3() branch`);
      return subTree;
    }

    if ((subTree = this.A4())) {
      debug(`${trackId} A(). A4() branch`);
      return subTree;
    }

    debug(`${trackId} A(). Lambda`);
    return ASTree.Lambda;
  }

  // A -> | S A
  A1(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} A1(): A -> | S A. %o`, this.tokens.slice(this.index));

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

    const tree = new ASTree({
      kind: "UNION",
      children: [leftTree, rightTree],
    });
    debug(`${trackId} A1(): A -> | S A. ret %o`, tree);
    return tree;
  }

  // A -> * A
  A2(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} A2(): A -> * A. %o`, this.tokens.slice(this.index));

    if (!this.eatToken("STAR")) {
      return;
    }

    const tree = new ASTree({
      kind: "STAR",
      children: [this.A()],
    });
    debug(`${trackId} A2(): A -> * A. ret %o`, tree);
    return tree;
  }

  // A -> + A
  A3(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} A3(): A -> + A. %o`, this.tokens.slice(this.index));

    if (!this.eatToken("PLUS")) {
      return;
    }

    const tree = this.A();
    debug(`${trackId} A3(): A -> + A. ret %o`, tree);
    return tree;
  }

  // A -> S A
  A4(): ASTree | undefined {
    const trackId = this.getTrackId();
    debug(`${trackId} A4(): A -> S A. %o`, this.tokens.slice(this.index));

    const left = this.S();
    if (!left) {
      return;
    }

    const tree = new ASTree({
      kind: "INTERSECTION",
      children: [left, this.A()],
    });

    debug(`${trackId} A4(): A -> S A. ret %o`, tree);
    return tree;
  }
}

//function simplify(oldTree: ASTree): ASTree {
//let tree = {
//...oldTree,
//};

//tree = simplifyLambda(tree)
//return tree
//tree = simplifySingleChildren(tree);
//tree = simplifyUnion(tree);

////console.log("simplify", oldTree, tree)
//return tree;
//}

//function removeLambda(children: Array<ASTree>): Array<ASTree> {
//return children.filter((a) => a !== Lambda);
//}

//function simplifyLambda(oldTree: ASTree): ASTree {
//const tree = {
//...oldTree,
//};

//tree.children = removeLambda(tree.children as Array<ASTree>);
//return tree
//}

//function simplifySingleChildren(oldTree: ASTree): ASTree {
//const tree = {
//...oldTree,
//};

//if (tree.children?.length === 1) {
//return tree.children[0];
//}

//return tree;
//}

///*

//Got from this
//{
//"kind": "S",
//"children": [
//{
//"kind": "LITERAL",
//"lexeme": "a"
//},
//{
//"kind": "OR_first_children",
//"children": [
//{
//"kind": "S",
//"children": [
//{
//"kind": "LITERAL",
//"lexeme": "b"
//},
//{
//"kind": "LITERAL",
//"lexeme": "abc"
//}
//]
//},
//{
//"kind": "lambda"
//}
//]
//}
//]
//}

//to this:

//{
//"kind": "S",
//"children": [
//{
//"kind": "UNION",
//children: [
//{
//"kind": "LITERAL",
//"lexeme": "a"
//},
//{
//"kind": "LITERAL",
//"lexeme": "b"
//},
//]
//},
//subTree
//]
//}

//*/
////TODO move this to ASTree
//// and create a proper class with methods
//// and for god sake add constants
//function simplifyUnion(oldTree: ASTree): ASTree {
//const tree = {
//...oldTree,
//};

////TODO constants
//if (
//Array.isArray(tree.children) &&
//tree.children[1]?.kind === "OR_first_children"
//) {
//const leftUnion = tree.children[0] as ASTree;
//const rightUnion = tree.children[1]?.children?.[0] as ASTree;
//const nextSubTree = tree.children[1]?.children?.[1] as ASTree;
//const union = {
//kind: "UNION",
//children: [leftUnion, rightUnion],
//};

//return {
//kind: tree.kind,
//children: removeLambda([union, nextSubTree]),
//};
//}

////console.log("simplifyUnion", oldTree, tree)
//return tree;
//}
