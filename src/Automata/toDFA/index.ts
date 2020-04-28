import Automata, { INITIAL_STATE } from "../Automata";
import { IDelta, IState, ISymbol } from "../types";
import StateLedger from "./StateLedger";

// NFA to DFA algorithm
// ref: Compilers Principles, Tecniques and Tools (The Dragon Book). 2nd Edition. Page 153
// this is a graph algoritm called?????? (breath first search?) TODO
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
      // TODO at the end make sure delta doesn't have repeated elements
      // Or do we care? since it will be tranlsated into a map
      // which wont care about duplicates
      delta.push([stateId, symbol, nextStateId]);
    }
  }

  const finals = stateLedger.calcFinals(automata.finals);
  return new Automata(delta, finals, "toDFA");
}

function lambdaClosure(automata: Automata, states: Set<IState>): Set<IState> {}

function move(
  automata: Automata,
  state: Set<IState>,
  symbol: ISymbol
): Set<IState> {}
