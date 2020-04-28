//import debugFactory from "debug";
import Automata, { LAMBDA, INITIAL_STATE } from "./Automata";
import { IDelta } from "./types";
import { getRenameMap, renameDelta } from "./tools";

//const debug = debugFactory("Automata union");

const OFFSET = 1;

// McNaughton Yamada Thompson algorithm
// ref: Compilers Principles, Tecniques and Tools (The Dragon Book). 2nd Edition. Page 159
// This operates in a*
export default function star(automata: Automata): Automata {
  const states = automata.delta.getStates();
  const [rename, lastState] = getRenameMap(states, OFFSET);

  const finalState = lastState + 1;

  const delta = [
    // to star (or closure) an automata has
    // a new lambda transition from a new initial state
    // to the initial state of of the original automata
    [INITIAL_STATE, LAMBDA, rename[INITIAL_STATE]],

    // a lambda transition from the new initial state
    // to the new final state
    [INITIAL_STATE, LAMBDA, finalState],

    // All the original transitions but renamed
    ...renameDelta(automata.delta.getArray(), rename),

    // a lambda transition from the old finals states to
    // the old initial state
    ...automata.finals.map((final) => [
      rename[final],
      LAMBDA,
      rename[INITIAL_STATE],
    ]),

    // and finally a lambda transition of the old finals
    // to the new final
    ...automata.finals.map((final) => [rename[final], LAMBDA, finalState]),
  ] as IDelta;

  return new Automata(delta, [finalState], "intersection");
}
