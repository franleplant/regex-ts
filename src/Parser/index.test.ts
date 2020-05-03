import test from "ava";
import Parser from "./index";
import Token from "../lexer/Token";
import ASTree from "../ASTree";

test("Parser simple literal: a", (t) => {
  const parser = new Parser([new Token("LITERAL", "a"), Token.EOF()]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "LITERAL",
        lexeme: "a",
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

test("Parser parenthesis: ((abc))", (t) => {
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

test("Parser Union: a|b", (t) => {
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

test("Parser Union: a|b(abc)", (t) => {
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

test("Parser Union: (a|b)abc", (t) => {
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

test("Parser Star case1 a*b", (t) => {
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

test("Parser Star2: ab*", (t) => {
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

test("Parser Plus: a+b", (t) => {
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

test("Parser Star: (a|b)*", (t) => {
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

//]
//2020-05-02T14:48:33.789Z RegExp parser result ASTree {
//kind: 'ROOT',
//lexeme: undefined,
//children: [
//ASTree {
//kind: 'UNION',
//lexeme: undefined,
//children: [
//ASTree { kind: 'LITERAL', lexeme: 'h', children: undefined },
//ASTree { kind: 'LITERAL', lexeme: 'e', children: undefined },
//ASTree { kind: 'LITERAL', lexeme: 'l', children: undefined },
//ASTree { kind: 'LITERAL', lexeme: 'l', children: undefined },
//ASTree { kind: 'LITERAL', lexeme: 'o', children: undefined },
//ASTree {
//kind: 'INTERSECTION',
//lexeme: undefined,
//children: [
//ASTree {
//kind: 'LITERAL',
//lexeme: 'b',
//children: undefined
//},
//ASTree {
//kind: 'INTERSECTION',
//lexeme: undefined,
//children: [
//ASTree {
//kind: 'LITERAL',
//lexeme: 'y',
//children: undefined
//},
//ASTree {
//kind: 'LITERAL',
//lexeme: 'e',
//children: undefined
//}
//]
//}
//]
//}
//]
//}
//]
