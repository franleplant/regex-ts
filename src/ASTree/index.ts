//import debugFactory from "debug";

//const debug = debugFactory("ASTree");

export enum EKind {
  LAMBDA = "LAMBDA",
  UNION = "UNION",
  INTERSECTION = "INTERSECTION",
  STAR = "STAR",
  PLUS = "PLUS",
  LITERAL = "LITERAL",
}

export type NodeKind = string;
//export type NodeKind =
//| "ROOT"
//| "UNION"
//| "INTERSECTION"
//| "LAMBDA"
//| "LITERAL"
//| "PLUS"
//| "STAR";

export interface IAttributes {
  done?: boolean;
  intersectionOfUnion?: boolean;
}

export type Predicate = (child: ASTree) => boolean;

let globalId = 1;

export default class ASTree {
  static readonly Lambda: ASTree = new ASTree({
    kind: EKind.LAMBDA,
  });

  static Union(children: Array<ASTree>): ASTree {
    return new ASTree({
      kind: EKind.UNION,
      children,
    });
  }

  static Intersection(children: Array<ASTree>): ASTree {
    return new ASTree({
      kind: EKind.INTERSECTION,
      children,
    });
  }

  static IntersectionOfUnion(children: Array<ASTree>): ASTree {
    return new ASTree({
      kind: EKind.INTERSECTION,
      attributes: { intersectionOfUnion: true },
      children,
    });
  }

  id: number;
  kind: NodeKind;
  lexeme?: string;
  children: Array<ASTree>;
  attributes: IAttributes;

  constructor({
    kind,
    lexeme,
    children = [],
    attributes = {},
    id = globalId++,
  }: {
    kind: NodeKind;
    lexeme?: string;
    children?: Array<ASTree>;
    attributes?: IAttributes;
    id?: number;
  }) {
    this.id = id;
    this.kind = kind;
    this.attributes = attributes;
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
    return this.kind === EKind.LAMBDA;
  }

  isIntersection(): boolean {
    return this.kind === EKind.INTERSECTION;
  }

  isUnion(): boolean {
    return this.kind === EKind.UNION;
  }

  isStar(): boolean {
    return this.kind === EKind.STAR;
  }

  isTerminal(): boolean {
    // soon there might be more types that are terminals
    return this.kind === EKind.LITERAL;
  }

  isIntersectionOfUnion(): boolean {
    return this.isIntersection() && !!this.attributes.intersectionOfUnion;
  }

  isAToLambda(): boolean {
    return this.kind === "A" && this.childrenMatch(EKind.LAMBDA);
  }

  getAttr<K extends keyof IAttributes>(key: K): IAttributes[K] {
    return this.attributes[key];
  }

  /*
    test if the children match a list of kinds,
    useful to detec certain parse subtrees
  */
  childrenMatch(...expectedChildren: Array<string>): boolean {
    if (!this.children) {
      return false;
    }

    if (this.children.length !== expectedChildren.length) {
      return false;
    }

    return this.children.every((child, index) => {
      const expectedKind = expectedChildren[index];
      return child?.kind === expectedKind;
    });
  }

  popChild(): ASTree | undefined {
    if (!this.children || this.children.length === 0) {
      return;
    }

    return this.children.pop();
  }

  popChildIf(shouldPop: Predicate): ASTree | undefined {
    if (!this.children || this.children.length === 0) {
      return;
    }

    const lastChild = this.children[this.children.length - 1];
    if (!lastChild) {
      return;
    }

    if (shouldPop(lastChild)) {
      return this.children.pop();
    }
    return;
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

  allChildrenAreTerminals(): boolean {
    if (!this.children || this.children.length === 0) {
      return false;
    }

    return this.children?.every((child) => child?.isTerminal());
  }

  toString(): string {
    return JSON.stringify(
      this,
      function (this: ASTree, key: string, value: any) {
        if (value?.isLambda?.()) {
          return "LAMBDA";
        }

        if (value?.kind === "LITERAL") {
          return value?.lexeme;
        }

        if (key === "attributes" && Object.keys(value).length === 0) {
          return undefined;
        }

        if (key === "children" && value?.length === 0) {
          return undefined;
        }

        return value;
      },
      2
    );
  }
}
