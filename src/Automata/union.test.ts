import test from "ava";
import Automata, { LAMBDA } from "./Automata";
import { IDelta } from "./types";
import union from "./union";

test("union case1", (t) => {
  const a1 = Automata.singleSymbol("a");
  const a2 = Automata.singleSymbol("b");
  const result = union(a1, a2);

  const expectedDelta = [
    // initials
    [0, LAMBDA, 2],
    [0, LAMBDA, 4],

    // a1
    [2, "a", 3],
    // a2
    [4, "b", 5],

    // finals
    [3, LAMBDA, 1],
    [5, LAMBDA, 1],
  ] as IDelta;

  const expectedFinals = [1];

  //console.log('result delta', result.delta.getArray())
  //console.log('result finals', result.finals)

  t.deepEqual(result.delta.getArray().sort(), expectedDelta.sort());
  t.deepEqual(result.finals, expectedFinals);
});
