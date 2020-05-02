import test from "ava";
import ASTree from "./index";

import * as rawIntersection from "./rawIntersection.fixture";
import * as rawStar from "./rawStar.fixture";
import * as rawUnion from "./rawUnion.fixture";

test("ASTree simplifyIntersection case1", (t) => {
  const tree = rawIntersection.case1();
  tree.simplifyIntersection2();

  const expected = new ASTree(
    {
      kind: "INTERSECTION",
      children: [
        new ASTree(
          { kind: "LITERAL", lexeme: "a" },
          { avoidSimplification: true }
        ),
        new ASTree(
          { kind: "LITERAL", lexeme: "b" },
          { avoidSimplification: true }
        ),
        new ASTree(
          {
            kind: "UNION",
            children: [
              new ASTree(
                { kind: "LITERAL", lexeme: "c" },
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

  t.deepEqual(tree, expected);
});

test("ASTree simplifyIntersection case2", (t) => {
  // When we run new ASTree the simplifcations
  // are run automatically across the entire tree
  const tree = rawIntersection.case2();

  const expected = new ASTree(
    {
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
    },
    { avoidSimplification: true }
  );

  t.deepEqual(tree, expected);
});

test("ASTree simplifyUnion case1", (t) => {
  const tree = rawUnion.case1();
  tree.simplifyUnion();

  const expected = new ASTree(
    {
      kind: "UNION",
      children: [
        new ASTree({ kind: "LITERAL", lexeme: "a" }),
        new ASTree({ kind: "LITERAL", lexeme: "b" }),
      ],
    },
    { avoidSimplification: true }
  );

  t.deepEqual(tree, expected);
});

test("ASTree simplifyUnion case2", (t) => {
  const tree = rawUnion.case2();
  tree.simplifyUnion();

  const expected = new ASTree(
    {
      kind: "UNION",
      children: [
        new ASTree(
          {
            kind: "INTERSECTION",
            children: [
              new ASTree({ kind: "LITERAL", lexeme: "h" }),
              new ASTree({ kind: "LITERAL", lexeme: "e" }),
              new ASTree({ kind: "LITERAL", lexeme: "l" }),
              new ASTree({ kind: "LITERAL", lexeme: "l" }),
              new ASTree({ kind: "LITERAL", lexeme: "o" }),
            ],
          },
          { avoidSimplification: true }
        ),

        new ASTree(
          {
            kind: "INTERSECTION",
            children: [
              new ASTree({ kind: "LITERAL", lexeme: "b" }),
              new ASTree({ kind: "LITERAL", lexeme: "y" }),
              new ASTree({ kind: "LITERAL", lexeme: "e" }),
            ],
          },
          { avoidSimplification: true }
        ),
      ],
    },
    { avoidSimplification: true }
  );

  console.log("tree", JSON.stringify(tree, null, 2));

  t.deepEqual(tree, expected);
});

test("ASTree simplifyStar1", (t) => {
  const tree = rawStar.rawStar1();
  tree.simplifyStar();

  const expected = new ASTree(
    {
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
    },
    { avoidSimplification: true }
  );

  t.deepEqual(tree, expected);
});

test("ASTree simplifyStar2", (t) => {
  const tree = rawStar.rawStar2();
  tree.simplifyStar();

  console.log("tree", JSON.stringify(tree, null, 2));

  const expected = new ASTree(
    {
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
    },
    { avoidSimplification: true }
  );
  console.log("expcets", JSON.stringify(expected, null, 2));

  t.deepEqual(tree, expected);
});
