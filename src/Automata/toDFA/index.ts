import Automata, { INITIAL_STATE, LAMBDA } from "../Automata";
import { IDelta, IState, ISymbol } from "../types";
import StateLedger, { NState } from "./StateLedger";

// NFA to DFA algorithm
// ref: Compilers Principles, Tecniques and Tools (The Dragon Book). 2nd Edition. Page 153
// This resembles a Topological Sort of Graph, and has elements of Breath First
// search.
// ref: Introduction to Algorithms - Cormen et al. 3rd Edition. Page 613
export default function toDFA(automata: Automata): Automata {
  const symbols = automata.delta.getSymbols();

  const stateLedger = new StateLedger([
    lambdaClosure(automata, new Set([INITIAL_STATE])),
  ]);

  const delta: IDelta = [];

  while (!stateLedger.allMarked()) {
    const [stateId, state] = stateLedger.getFirstUnmarked();
    stateLedger.mark(stateId);

    for (const symbol of symbols) {
      const nextState = lambdaClosure(automata, move(automata, state, symbol));
      const nextStateId = stateLedger.addState(nextState);
      // the Automata will take care of removing duplicated rules
      delta.push([stateId, symbol, nextStateId]);
    }
  }

  const finals = stateLedger.calcFinals(automata.finals);
  return new Automata(delta, finals, "toDFA");
}

// This also resembles a Topological sort / Breath First Search,
// the topological order is the order in which we `add` states into
// the closure set (assuming it keeps the order in which elements are added)
function lambdaClosure(automata: Automata, stateSet: NState): NState {
  const closure: NState = copy(stateSet);
  const stack: Array<IState> = [...stateSet];

  while (stack.length > 0) {
    const state = stack.pop() as IState;
    automata.delta.getNDA(state, LAMBDA).forEach((nextState) => {
      if (!closure.has(nextState)) {
        closure.add(nextState);
        stack.push(nextState);
      }
    });
  }

  return closure;
}

function move(automata: Automata, stateSet: NState, symbol: ISymbol): NState {
  const nextStateSet: NState = new Set();
  stateSet.forEach((state) => {
    automata.delta
      .getNDA(state, symbol)
      .forEach((nextState) => nextStateSet.add(nextState));
  });
  return nextStateSet;
}

function copy<T>(set: Set<T>): Set<T> {
  const newCopy = new Set<T>();
  set.forEach((el) => newCopy.add(el));
  return newCopy;
}
