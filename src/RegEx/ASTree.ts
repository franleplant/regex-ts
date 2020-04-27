export type NodeKind =
  | "ROOT"
  | "UNION"
  | "INTERSECTION"
  | "LAMBDA"
  | "LITERAL"
  | "PLUS"
  | "STAR";

export default class ASTree {
  static readonly Lambda: ASTree = new ASTree({
    kind: "LAMBDA",
  });

  kind: NodeKind;
  lexeme?: string;
  children?: Array<ASTree | undefined>;

  constructor({
    kind,
    lexeme,
    children,
  }: {
    kind: NodeKind;
    lexeme?: string;
    children?: Array<ASTree | undefined>;
  }) {
    this.kind = kind;
    this.lexeme = lexeme;
    this.children = children;

    this.simplifyEmpty();
    this.simplifyLambda();
    this.simplifyIntersection();
    this.simplifyUnion();
    this.simplifyStar();
    this.simplifyPlus();
  }

  isLambda(): boolean {
    return this.kind === "LAMBDA";
  }

  simplifyEmpty() {
    if (!this.children) {
      return;
    }
    this.children = this.children.filter((node) => !!node);
  }

  simplifyLambda() {
    if (!this.children) {
      return;
    }
    this.children = this.children.filter((node) => !node?.isLambda());
  }

  simplifyIntersection() {
    if (!this.children) {
      return;
    }

    if (this.kind !== "INTERSECTION") {
      return;
    }

    if (this.children.length === 1) {
      const singleChild = this.children[0];
      if (!singleChild) {
        throw new Error(`simplifyIntersection wront single child`);
      }
      this.kind = singleChild.kind;
      this.lexeme = singleChild.lexeme;
      this.children = singleChild.children;
    }
  }

  simplifyUnion() {
    if (!this.children) {
      return;
    }

    const union = this.children[1];
    if (union?.kind !== "UNION") {
      return;
    }

    const unionLeft = this.children[0];
    if (!unionLeft) {
      throw new Error(`simplifyUnion wrong left hand side`);
    }

    const unionRight = union.children;
    if (!unionRight) {
      throw new Error(`simplifyUnion wrong right hand side`);
    }

    this.kind = "UNION";
    this.children = [
      unionLeft,
      // TODO do we really want all of them?
      ...unionRight,
    ];
  }

  simplifyStar() {
    if (!this.children) {
      return;
    }

    const starredTree = this.children[0];
    if (!starredTree) {
      return;
    }

    const star = this.children[1];
    if (star?.kind !== "STAR") {
      return;
    }

    const next = star.children || [];

    const newChildren = [
      new ASTree({
        kind: "STAR",
        children: [starredTree],
      }),
      ...next,
    ];

    this.children = newChildren;
  }

  simplifyPlus() {
    if (!this.children) {
      return;
    }

    const plusTree = this.children[0];
    if (!plusTree) {
      return;
    }

    const plus = this.children[1];
    if (plus?.kind !== "PLUS") {
      return;
    }

    const next = plus.children || [];

    const newChildren = [
      new ASTree({
        kind: "PLUS",
        children: [plusTree],
      }),
      ...next,
    ];

    this.children = newChildren;
  }
}

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

// STAR
//RESULT {
//"kind": "ROOT",
//"children": [
//{
//"kind": "INTERSECTION",
//"children": [
//{
//"kind": "LITERAL",
//"lexeme": "a"
//},
//{
//"kind": "STAR",
//"children": [
//{
//"kind": "LITERAL",
//"lexeme": "b"
//}
//]
//}
//]
//}
//]
//}
