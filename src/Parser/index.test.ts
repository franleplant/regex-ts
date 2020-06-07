import test from "ava";
import Parser from "./index";
import Token from "../lexer/Token";
import ASTree, { ISimpleNode } from "../ASTree";

// Yarn break this big test into smaller files to make it more managable
test("Parser basic case01 a", (t) => {
  const parser = new Parser([new Token("LITERAL", "a"), Token.EOF()]);

  const tree = parser.parse();

  const expected = {
    ROOT: [{ S: ["a", { A: ["LAMBDA"] }] }],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});

test("Parser basic case02 ((abc))", (t) => {
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

  const expected = {
    ROOT: [
      {
        S: [
          "(",
          {
            S: [
              "(",
              {
                S: [
                  "a",
                  {
                    A: [
                      {
                        S: [
                          "b",
                          {
                            A: [
                              { S: ["c", { A: ["LAMBDA"] }] },
                              { A: ["LAMBDA"] },
                            ],
                          },
                        ],
                      },
                      { A: ["LAMBDA"] },
                    ],
                  },
                ],
              },
              ")",
              { A: ["LAMBDA"] },
            ],
          },
          ")",
          { A: ["LAMBDA"] },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});

test("Parser Union: a|b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = {
    ROOT: [
      {
        S: [
          "a",
          {
            A: [
              "OR",
              {
                S: ["b", { A: ["LAMBDA"] }],
              },
              { A: ["LAMBDA"] },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
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
  const expected = {
    ROOT: [
      {
        S: [
          "a",
          {
            A: [
              "OR",
              {
                S: [
                  "b",
                  {
                    A: [
                      {
                        S: [
                          "(",
                          {
                            S: [
                              "a",
                              {
                                A: [
                                  {
                                    S: [
                                      "b",
                                      {
                                        A: [
                                          {
                                            S: ["c", { A: ["LAMBDA"] }],
                                          },
                                          { A: ["LAMBDA"] },
                                        ],
                                      },
                                    ],
                                  },
                                  { A: ["LAMBDA"] },
                                ],
                              },
                            ],
                          },
                          ")",
                          { A: ["LAMBDA"] },
                        ],
                      },
                      { A: ["LAMBDA"] },
                    ],
                  },
                ],
              },
              { A: ["LAMBDA"] },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
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
  const expected = {
    ROOT: [
      {
        S: [
          "(",
          {
            S: [
              "a",
              {
                A: [
                  "OR",
                  {
                    S: [
                      "b",
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                  {
                    A: ["LAMBDA"],
                  },
                ],
              },
            ],
          },
          ")",
          {
            A: [
              {
                S: [
                  "a",
                  {
                    A: [
                      {
                        S: [
                          "b",
                          {
                            A: [
                              {
                                S: [
                                  "c",
                                  {
                                    A: ["LAMBDA"],
                                  },
                                ],
                              },
                              {
                                A: ["LAMBDA"],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                ],
              },
              {
                A: ["LAMBDA"],
              },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});

test("Parser Star case1 a*b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("STAR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = {
    ROOT: [
      {
        S: [
          "a",
          {
            A: [
              "STAR",
              {
                A: [
                  {
                    S: [
                      "b",
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                  {
                    A: ["LAMBDA"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});

test("Parser Star2: ab*", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("STAR", ""),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = {
    ROOT: [
      {
        S: [
          "a",
          {
            A: [
              {
                S: [
                  "b",
                  {
                    A: [
                      "STAR",
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                ],
              },
              {
                A: ["LAMBDA"],
              },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});

test("Parser Plus: a+b", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("PLUS", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  const tree = parser.parse();
  const expected = {
    ROOT: [
      {
        S: [
          "a",
          {
            A: [
              "PLUS",
              {
                A: [
                  {
                    S: [
                      "b",
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                  {
                    A: ["LAMBDA"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
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
  //console.log("Tree json", JSON.stringify(tree.toJSON(), null, 2));
  const expected = {
    ROOT: [
      {
        S: [
          "(",
          {
            S: [
              "a",
              {
                A: [
                  "OR",
                  {
                    S: [
                      "b",
                      {
                        A: ["LAMBDA"],
                      },
                    ],
                  },
                  {
                    A: ["LAMBDA"],
                  },
                ],
              },
            ],
          },
          ")",
          {
            A: [
              "STAR",
              {
                A: ["LAMBDA"],
              },
            ],
          },
        ],
      },
    ],
  } as ISimpleNode;

  t.deepEqual(tree.toJSON(), expected);
});
