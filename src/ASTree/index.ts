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

  isLambda(): boolean {
    return this.kind === "LAMBDA";
  }
}
