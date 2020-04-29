//import debugFactory from "debug";
import Automata, { LAMBDA, INITIAL_STATE } from "./Automata";
import { IDelta } from "./types";
import { getRenameMap, renameDelta } from "./tools";

//const debug = debugFactory("Automata union");

const FINAL_STATE = 1;
const OFFSET = 2;

// McNaughton Yamada Thompson algorithm
// ref: Compilers Principles, Tecniques and Tools (The Dragon Book). 2nd Edition. Page 159
export default function union(left: Automata, right: Automata): Automata {
  const leftStates = left.delta.getStates();
  const [leftRenameMap, lastLeftState] = getRenameMap(leftStates, OFFSET);

  const rightStates = right.delta.getStates();
  const [rightRenameMap] = getRenameMap(rightStates, lastLeftState + 1);

  const delta = [
    // the union is a new automata that has lambda transitions
    // the the initial states of left and right
    [INITIAL_STATE, LAMBDA, leftRenameMap[INITIAL_STATE]],
    [INITIAL_STATE, LAMBDA, rightRenameMap[INITIAL_STATE]],

    // lambda transitions from the final states in left and right
    // to the new final state
    ...left.finals.map((final) => [leftRenameMap[final], LAMBDA, FINAL_STATE]),
    ...right.finals.map((final) => [
      rightRenameMap[final],
      LAMBDA,
      FINAL_STATE,
    ]),

    // and all the left and right transitions renamed
    // to acomodate the new transitions above
    ...renameDelta(left.delta.getArray(), leftRenameMap),
    ...renameDelta(right.delta.getArray(), rightRenameMap),
  ] as IDelta;

  return new Automata(delta, [FINAL_STATE], "union");
}
