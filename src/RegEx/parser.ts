import Token from "./Token";
import ASTree from "./ASTree";

const Lambda: ASTree = {
  kind: "lambda",
};

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

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  getToken(): Token {
    return this.tokens[this.index];
  }

  eatToken(tokenKind: string): Token | undefined {
    const currentToken = this.getToken();
    if (currentToken.isKind(tokenKind)) {
      this.index += 1;
      return currentToken;
    }

    return;
  }

  reset() {
    this.index = 0;
  }

  parse(): ASTree | undefined {
    this.reset();
    const tree = this.S();
    if (!tree) {
      throw new Error(`Parser error`);
    }

    return {
      kind: "Root",
      children: [tree],
    };
  }

  // S -> Literal A
  S1(): ASTree | undefined {
    console.log("S1", this.getToken());

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

    return simplify({
      kind: "S",
      children: [
        {
          kind: literal.kind,
          lexeme: literal.lexeme,
        },
        subTree,
      ],
    });
  }

  // S -> ( S ) A
  S2(): ASTree | undefined {
    console.log("S2", this.getToken());
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

    return simplify({
      kind: "S",
      children: [left, right],
    });
  }

  S(): ASTree | undefined {
    console.log("S", this.getToken());
    let subTree;

    if ((subTree = this.S1())) {
      return subTree;
    }

    if ((subTree = this.S2())) {
      return subTree;
    }

    return;
  }

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

    return Lambda;
  }

  // A -> | S A
  A1(): ASTree | undefined {
    console.log("A1", this.getToken());
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

    return {
      //TODO constants
      kind: "OR_first_children",
      children: [leftTree, rightTree],
    };
  }

  // A -> * A
  A2(): ASTree | undefined {
    console.log("A2", this.getToken());
    if (!this.eatToken("STAR")) {
      return;
    }

    return this.A();
  }

  // A -> + A
  A3(): ASTree | undefined {
    console.log("A3", this.getToken());
    if (!this.eatToken("PLUS")) {
      return;
    }

    return this.A();
  }

  // A -> S A
  A4(): ASTree | undefined {
    console.log("A4", this.getToken());
    const left = this.S();
    if (!left) {
      return;
    }

    return this.A();
  }
}

function simplify(oldTree: ASTree): ASTree {
  let tree = {
    ...oldTree,
  };

  tree = simplifySingleChildren(tree);
  tree = simplifyUnion(tree);
  return tree;
}

function removeLambda(children: Array<ASTree>): Array<ASTree> {
  return children.filter((a) => a !== Lambda);
}

function simplifySingleChildren(oldTree: ASTree): ASTree {
  const tree = {
    ...oldTree,
  };

  tree.children = removeLambda(tree.children as Array<ASTree>);
  if (tree.children.length === 1) {
    return tree.children[0];
  }

  return tree;
}

/*

Got from this
{
  "kind": "S",
  "children": [
    {
      "kind": "LITERAL",
      "lexeme": "a"
    },
    {
      "kind": "OR_first_children",
      "children": [
        {
          "kind": "LITERAL",
          "lexeme": "b"
        },
        subTree
      ]
    }
  ]
}

to this:

{
  "kind": "S",
  "children": [
    {
      "kind": "OR",
      children: [
        {
          "kind": "LITERAL",
          "lexeme": "a"
        },
        {
          "kind": "LITERAL",
          "lexeme": "b"
        },
      ]
    },
    subTree
  ]
}


 */
//TODO move this to ASTree
// and create a proper class with methods
// and for god sake add constants
function simplifyUnion(oldTree: ASTree): ASTree {
  const tree = {
    ...oldTree,
  };

  //TODO constants
  if (
    Array.isArray(tree.children) &&
    tree.children[1]?.kind === "OR_first_children"
  ) {
    const leftUnion = tree.children[0] as ASTree;
    const rightUnion = tree.children[1]?.children?.[0] as ASTree;
    const nextSubTree = tree.children[1]?.children?.[1] as ASTree;
    const union = {
      kind: "UNION",
      children: [leftUnion, rightUnion],
    };

    return {
      kind: tree.kind,
      children: removeLambda([union, nextSubTree]),
    };
  }

  return tree;
}
