import debugFactory from "debug";

const debug = debugFactory("ASTree");

export type NodeKind =
  | "ROOT"
  | "UNION"
  | "INTERSECTION"
  | "LAMBDA"
  | "LITERAL"
  | "PLUS"
  | "STAR";

export interface IOptions {
  avoidSimplification: boolean;
}

//TODO add more tests
export default class ASTree {
  static readonly Lambda: ASTree = new ASTree({
    kind: "LAMBDA",
  });

  kind: NodeKind;
  lexeme?: string;
  children?: Array<ASTree | undefined>;

  constructor(
    {
      kind,
      lexeme,
      children,
    }: {
      kind: NodeKind;
      lexeme?: string;
      children?: Array<ASTree | undefined>;
    },
    options: Partial<IOptions> = {}
  ) {
    this.kind = kind;
    this.lexeme = lexeme;
    this.children = children;

    if (!options.avoidSimplification) {
      debug("applying simplification");
      this.simplifyEmpty();
      this.simplifyLambda();
      //this.simplifyStar();
      //this.simplifyPlus();
      this.simplifyIntersection();
      this.simplifyIntersection2();
      //this.simplifyUnion();
    }
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
    if (this.kind !== "INTERSECTION") {
      return;
    }

    if (!this.children) {
      return;
    }

    if (this.children.length === 1) {
      const singleChild = this.children[0];
      if (!singleChild) {
        throw new Error(`simplifyIntersection wrong single child`);
      }
      this.kind = singleChild.kind;
      this.lexeme = singleChild.lexeme;
      this.children = singleChild.children;
    }
  }

  simplifyIntersection2() {
    if (this.kind !== "INTERSECTION") {
      return;
    }

    if (!this.children) {
      return;
    }

    const [leftTree, rightTree] = this.children;
    if (!leftTree || !rightTree) {
      return;
    }

    if (rightTree.kind !== "INTERSECTION") {
      return;
    }

    if (!rightTree.children || rightTree.children.length < 2) {
      debug("simplifyIntersection2() found a weird rightTree %o", rightTree);
      return;
    }

    this.children = [leftTree, ...rightTree.children];

    if (this.children.length === 1) {
      const singleChild = this.children[0];
      if (!singleChild) {
        throw new Error(`simplifyIntersection wrong single child`);
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

    const unionIndex = this.children.findIndex(
      (child) => (child as ASTree).kind === "UNION"
    );
    const union = this.children[unionIndex];
    if (!union) {
      return;
    }
    debug("simplifyUnion() found union at %o %o", unionIndex, union);
    if (!union.children) {
      throw new Error(`simplifyUnion wrong right hand side`);
    }

    const leftChildren = this.children.slice(0, unionIndex);
    if (leftChildren.length === 0) {
      throw new Error(`simplifyUnion wrong left hand side`);
    }

    this.children = [
      new ASTree({
        kind: this.kind,
        children: leftChildren,
      }),
      ...union.children,
    ];
    this.kind = "UNION";
  }

  simplifyStar() {
    debug("simplifyStar()");
    if (!this.children) {
      debug("simplifyStar() empty children");
      return;
    }

    debug("simplifyStar() this.children => %O", this.children);
    const starredTree = this.children[0];
    if (!starredTree) {
      debug("simplifyStar() empty first children");
      return;
    }

    const star = this.children[1];
    if (star?.kind !== "STAR") {
      debug("simplifyStar() second children not a STAR. Skipping");
      return;
    }

    const rightTree = star.children || [];

    const newChildren = [
      new ASTree({
        kind: "STAR",
        children: [starredTree],
      }),
      ...rightTree,
    ];

    debug("simplifyStar() new children %O", newChildren);

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
