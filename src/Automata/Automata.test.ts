import test from "ava";
import Automata from "./Automata";
import { IDelta } from "./types";

test("Automata", (t) => {
  // Basic automata that accepts a*b
  const delta = [
    [0, "a", 0],
    [0, "b", 1],
  ] as IDelta;
  const finals = [1];
  const a = new Automata(delta, finals);

  t.assert(a.eval("b"));
  t.assert(a.eval("ab"));
  t.assert(a.eval("aab"));
  t.assert(a.eval("aaaaaab"));
  t.assert(a.eval("aaaaaab"));
});
