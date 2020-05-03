import ASTree from "./index";

export function case1() {
  return new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a", children: undefined }),
      new ASTree({
        kind: "UNION",
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

export function case2() {
  return new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "h" }),
      new ASTree({ kind: "LITERAL", lexeme: "e" }),
      new ASTree({ kind: "LITERAL", lexeme: "l" }),
      new ASTree({ kind: "LITERAL", lexeme: "l" }),
      new ASTree({ kind: "LITERAL", lexeme: "o" }),
      new ASTree({
        kind: "UNION",
        children: [
          new ASTree({
            kind: "INTERSECTION",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "b",
              }),
              new ASTree({
                kind: "LITERAL",
                lexeme: "y",
              }),
              new ASTree({
                kind: "LITERAL",
                lexeme: "e",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
