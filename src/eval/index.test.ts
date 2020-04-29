import test from "ava";
import evalTree from "./index";
import ASTree from "../ASTree";

test("eval `a`", (t) => {
  const input = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "LITERAL",
        lexeme: "a",
      }),
    ],
  });

  const automata = evalTree(input);

  t.assert(automata.eval("a"));
  t.assert(!automata.eval("b"));
});

test.skip("eval `hello`", (t) => {
  const input = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "LITERAL",
        lexeme: "hello",
      }),
    ],
  });

  const automata = evalTree(input);

  t.assert(automata.eval("hello"));
  t.assert(!automata.eval("b"));
});

test.skip("eval `hello*`", (t) => {
  const input = new ASTree({
    kind: "ROOT",
    children: [
      new ASTree({
        kind: "STAR",
        children: [
          new ASTree({
            kind: "LITERAL",
            lexeme: "hello",
          }),
        ],
      }),
    ],
  });

  const automata = evalTree(input);

  t.assert(automata.eval(""));
  t.assert(automata.eval("hello"));
  t.assert(automata.eval("hellohello"));
  t.assert(automata.eval("hellohellohello"));
});

test.skip("eval `a|b`", (t) => {
  const input = new ASTree({
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

  const automata = evalTree(input);

  t.assert(automata.eval("a"));
  t.assert(automata.eval("b"));
  t.assert(!automata.eval("c"));
});
