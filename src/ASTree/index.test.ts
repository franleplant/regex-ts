import test from "ava";
import ASTree from "./index";

import * as rawIntersection from "./rawIntersection.fixture";
import * as rawStar from "./rawStar.fixture";
import * as rawUnion from "./rawUnion.fixture";

test.skip("ASTree simplifyIntersection case1", (t) => {
  const tree = rawIntersection.case1();

  const expected = new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a" }),
      new ASTree({ kind: "LITERAL", lexeme: "b" }),
      new ASTree({
        kind: "UNION",
        children: [new ASTree({ kind: "LITERAL", lexeme: "c" })],
      }),
    ],
  });

  t.deepEqual(tree, expected);
});

test.skip("ASTree simplifyIntersection case2", (t) => {
  // When we run new ASTree the simplifcations
  // are run automatically across the entire tree
  const tree = rawIntersection.case2();

  const expected = new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a" }),
      new ASTree({ kind: "LITERAL", lexeme: "b" }),
      new ASTree({ kind: "LITERAL", lexeme: "c" }),
    ],
  });

  console.log("tree", JSON.stringify(tree, null, 2));

  t.deepEqual(tree, expected);
});

test.skip("ASTree simplifyUnion case1", (t) => {
  const tree = rawUnion.case1();

  const expected = new ASTree({
    kind: "UNION",
    children: [
      new ASTree({ kind: "LITERAL", lexeme: "a" }),
      new ASTree({ kind: "LITERAL", lexeme: "b" }),
    ],
  });

  t.deepEqual(tree, expected);
});

test.skip("ASTree simplifyUnion case2", (t) => {
  const tree = rawUnion.case2();

  const expected = new ASTree({
    kind: "UNION",
    children: [
      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({ kind: "LITERAL", lexeme: "h" }),
          new ASTree({ kind: "LITERAL", lexeme: "e" }),
          new ASTree({ kind: "LITERAL", lexeme: "l" }),
          new ASTree({ kind: "LITERAL", lexeme: "l" }),
          new ASTree({ kind: "LITERAL", lexeme: "o" }),
        ],
      }),

      new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({ kind: "LITERAL", lexeme: "b" }),
          new ASTree({ kind: "LITERAL", lexeme: "y" }),
          new ASTree({ kind: "LITERAL", lexeme: "e" }),
        ],
      }),
    ],
  });

  console.log("tree", JSON.stringify(tree, null, 2));

  t.deepEqual(tree, expected);
});

test.skip("ASTree simplifyStar1", (t) => {
  const tree = rawStar.rawStar1();

  const expected = new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
      new ASTree({
        kind: "STAR",
        lexeme: undefined,
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "a",
            children: undefined,
          }),
        ],
      }),
      new ASTree({ kind: "LITERAL", lexeme: "b", children: undefined }),
    ],
  });

  t.deepEqual(tree, expected);
});

test.skip("ASTree simplifyStar2", (t) => {
  const tree = rawStar.rawStar2();

  console.log("tree", JSON.stringify(tree, null, 2));

  const expected = new ASTree({
    kind: "INTERSECTION",
    lexeme: undefined,
    children: [
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
  console.log("expcets", JSON.stringify(expected, null, 2));

  t.deepEqual(tree, expected);
});
