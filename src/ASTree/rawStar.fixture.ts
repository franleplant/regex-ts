import ASTree from "./index";

export function rawStar1() {
  return new ASTree(
    {
      kind: "INTERSECTION",
      lexeme: undefined,
      children: [
        new ASTree(
          { kind: "LITERAL", lexeme: "a", children: undefined },
          { avoidSimplification: true }
        ),
        new ASTree(
          {
            kind: "STAR",
            lexeme: undefined,
            children: [
              new ASTree(
                {
                  kind: "LITERAL",
                  lexeme: "b",
                  children: undefined,
                },
                { avoidSimplification: true }
              ),
            ],
          },
          { avoidSimplification: true }
        ),
      ],
    },
    { avoidSimplification: true }
  );
}

export function rawStar2() {
  return new ASTree(
    {
      kind: "INTERSECTION",
      lexeme: undefined,
      children: [
        new ASTree(
          {
            kind: "LITERAL",
            lexeme: "b",
            children: undefined,
          },
          { avoidSimplification: true }
        ),
        new ASTree(
          { kind: "STAR", lexeme: undefined, children: [] },
          { avoidSimplification: true }
        ),
      ],
    },
    { avoidSimplification: true }
  );
}
