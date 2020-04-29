//import debugFactory from "debug";
import Automata, { INITIAL_STATE, LAMBDA } from "./Automata";
import { IDelta } from "./types";
import { getRenameMap, renameDelta } from "./tools";

//const debug = debugFactory("Automata union");

// McNaughton Yamada Thompson algorithm
// ref: Compilers Principles, Tecniques and Tools (The Dragon Book). 2nd Edition. Page 159
export default function intersection(
  left: Automata,
  right: Automata
): Automata {
  // no rename nececessary, we just want to calc the last state
  const leftStates = left.delta.getStates();
  const [, lastLeftState] = getRenameMap(leftStates, 0);

  const rightStates = right.delta.getStates();
  // We offset the names of the right automata because there will be a new
  // state in the middle
  const [rightRenameMap] = getRenameMap(rightStates, lastLeftState + 1);

  const delta = [
    // the intersection is simply an automata
    // that starts with the left automata as is
    ...left.delta.getArray(),
    // has a lambda transition from finals of left to
    // initial state of right
    ...left.finals.map((final) => [
      final,
      LAMBDA,
      rightRenameMap[INITIAL_STATE],
    ]),
    // and then the entire right automata with states renamed
    ...renameDelta(right.delta.getArray(), rightRenameMap),
  ] as IDelta;

  // the finals are simply the finals of right but
  // with the state number renamed
  const finals = right.finals.map((final) => rightRenameMap[final]);

  return new Automata(delta, finals, "intersection");
}
