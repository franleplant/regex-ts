import ASTree from "../ASTree";

export function case1() {
  return new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a" }),
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({ kind: "LITERAL", lexeme: "b" }),
          new ASTree({
            kind: "UNION",
            children: [new ASTree({ kind: "LITERAL", lexeme: "c" })],
          }),
        ],
      }),
    ],
  });
}

export function case2() {
  return new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
      new ASTree({
        kind: "INTERSECTION",
        lexeme: undefined,
        children: [
          new ASTree({
            kind: "INTERSECTION",
            lexeme: undefined,
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
                children: undefined,
              }),
              new ASTree({
                kind: "INTERSECTION",
                lexeme: undefined,
                children: [
                  new ASTree({
                    kind: "INTERSECTION",
                    lexeme: undefined,
                    children: [
                      new ASTree({
                        kind: "LITERAL",
                        lexeme: "b",
                        children: undefined,
                      }),
                      new ASTree({
                        kind: "INTERSECTION",
                        lexeme: undefined,
                        children: [
                          new ASTree({
                            kind: "INTERSECTION",
                            lexeme: undefined,
                            children: [
                              new ASTree({
                                kind: "LITERAL",
                                lexeme: "c",
                                children: undefined,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
