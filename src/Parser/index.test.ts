import test from "ava";
import Parser from "./index";
import Token from "../lexer/Token";
import ASTree from "../ASTree";

test("Parser basic case01 a", (t) => {
  const parser = new Parser([new Token("LITERAL", "a"), Token.EOF()]);

  const tree = parser.parse();

  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "a",
            attributes: {},
            id: 2,
          }),
          new ASTree({ kind: "LAMBDA", attributes: {}, id: 1 }),
        ],
        attributes: {},
        id: 3,
      }),
    ],
    attributes: {},
    id: 4,
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser basic case02 ((abc))", (t) => {
  const parser = new Parser([
    new Token("(", ""),
    new Token("(", ""),
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("LITERAL", "c"),
    new Token(")", ""),
    new Token(")", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  console.log(JSON.stringify(tree, null, 2));
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        lexeme: undefined,
        children: [
          new ASTree({ kind: "LITERAL", lexeme: "a", children: undefined }),
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
                kind: "LITERAL",
                lexeme: "c",
                children: undefined,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Union: a|b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "UNION",
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "a",
          }),
          new ASTree({
            kind: "LITERAL",
            lexeme: "b",
          }),
        ],
      }),
    ],
  });

  console.log("tree", JSON.stringify(tree, null, 2));

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Union: a|b(abc)", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token("(", ""),
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("LITERAL", "c"),
    new Token(")", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "UNION",
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "a",
          }),
          new ASTree({
            kind: "INTERSECTION",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "b",
              }),
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
                        kind: "LITERAL",
                        lexeme: "b",
                        children: undefined,
                      }),
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
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Union: (a|b)abc", (t) => {
  const parser = new Parser([
    new Token("(", ""),
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token(")", ""),
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("LITERAL", "c"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "UNION",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
              }),
              new ASTree({
                kind: "LITERAL",
                lexeme: "b",
              }),
            ],
          }),
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
                    kind: "LITERAL",
                    lexeme: "b",
                    children: undefined,
                  }),
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
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Star case1 a*b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("STAR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "STAR",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
              }),
            ],
          }),
          new ASTree({
            kind: "LITERAL",
            lexeme: "b",
          }),
        ],
      }),
    ],
  });

  console.log("tree", JSON.stringify(tree, null, 2));

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Star2: ab*", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("STAR", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "STAR",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
              }),
            ],
          }),
          new ASTree({
            kind: "LITERAL",
            lexeme: "b",
          }),
        ],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Plus: a+b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("PLUS", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "PLUS",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
              }),
            ],
          }),
          new ASTree({
            kind: "LITERAL",
            lexeme: "b",
          }),
        ],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

// TODO fix this test and probably figure a simpler way to structure it
test.skip("Parser Star: (a|b)*", (t) => {
  const parser = new Parser([
    new Token("(", ""),
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token(")", ""),
    new Token("STAR", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "STAR",
        children: [
          new ASTree({
            kind: "UNION",
            children: [
              new ASTree({
                kind: "LITERAL",
                lexeme: "a",
              }),
              new ASTree({
                kind: "LITERAL",
                lexeme: "b",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});
