import ASTree from "./index";

export function rawStar1() {
  return new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a", children: undefined }),
      new ASTree({
        kind: "STAR",
        lexeme: undefined,
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "b",
            children: undefined,
          }),
        ],
      }),
    ],
  });
}

export function rawStar2() {
  return new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
      new ASTree({
        kind: "LITERAL",
        lexeme: "b",
        children: undefined,
      }),
      new ASTree({ kind: "STAR", lexeme: undefined, children: [] }),
    ],
  });
}
