//import debugFactory from "debug";

//const debug = debugFactory("ASTree");

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
  }

  childrenLength(): number {
    if (this.children) {
      return this.children.length;
    }

    return 0;
  }

  isLambda(): boolean {
    return this.kind === "LAMBDA";
  }

  isIntersection(): boolean {
    return this.kind === "INTERSECTION";
  }

  isUnion(): boolean {
    return this.kind === "UNION";
  }

  popChildIf(predicate: Predicate): ASTree | undefined {
    if (!this.children || this.children.length === 0) {
      return;
    }

    const lastChild = this.children[this.children.length - 1];
    if (!lastChild) {
      return;
    }

    const shouldPop = predicate(lastChild);
    if (!shouldPop) {
      return;
    }

    this.children.pop();
    return lastChild;
  }

  getChild(index: number): ASTree | undefined {
    if (!this.children) {
      return;
    }

    return this.children[index];
  }

  getChildIf(index: number, isChild: Predicate): ASTree | undefined {
    if (!this.children || this.children.length === 0) {
      return;
    }

    const child = this.children[index];
    if (!child) {
      return;
    }

    if (isChild(child)) {
      return child;
    }
    return;
  }

  // TODO document
  isChildAt(index: number, isChild: Predicate): boolean {
    const child = this.getChildIf(index, isChild);
    return !!child;
  }
}

export type Predicate = (child: ASTree) => boolean;
