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
    new Token("LITERAL", "abc"),
    new Token(")", ""),
    new Token(")", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "LITERAL",
        lexeme: "abc",
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

  t.deepEqual(tree, expected);
});

test("Parser Union: a|b(abc)", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token("(", ""),
    new Token("LITERAL", "abc"),
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
                kind: "LITERAL",
                lexeme: "abc",
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
    new Token("LITERAL", "abc"),
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
            kind: "LITERAL",
            lexeme: "abc",
          }),
        ],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

test("Parser Star: a*b", (t) => {
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
