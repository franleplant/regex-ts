import test from "ava";
import Automata, { LAMBDA } from "./Automata";
import { IDelta } from "./types";
import star from "./star";

test("star case1", (t) => {
  const a1 = Automata.singleSymbol("a");
  const result = star(a1);

  const expectedDelta = [
    // initials
    [0, LAMBDA, 1],
    [0, LAMBDA, 3],

    // a1
    [1, "a", 2],

    // loop
    [2, LAMBDA, 1],

    // finals
    [2, LAMBDA, 3],
  ] as IDelta;

  const expectedFinals = [3];

  //console.log('result delta', result.delta.getArray())
  //console.log('result finals', result.finals)

  t.deepEqual(result.delta.getArray().sort(), expectedDelta.sort());
  t.deepEqual(result.finals, expectedFinals);
});
