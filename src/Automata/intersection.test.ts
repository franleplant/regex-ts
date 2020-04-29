import test from "ava";
import Automata, { LAMBDA } from "./Automata";
import { IDelta } from "./types";
import intersection from "./intersection";

test("intersection case1", (t) => {
  const a1 = Automata.singleSymbol("a");
  const a2 = Automata.singleSymbol("b");
  const result = intersection(a1, a2);

  const expectedDelta = [
    [0, "a", 1],
    [1, LAMBDA, 2],
    [2, "b", 3],
  ] as IDelta;
  const expectedFinals = [3];

  //console.log('result delta', result.delta.getArray())
  //console.log('result finals', result.finals)

  t.deepEqual(result.delta.getArray(), expectedDelta);
  t.deepEqual(result.finals, expectedFinals);
});
