import Automata, { INITIAL_STATE } from "./Automata";
import { IDelta, IState, ISymbol } from "./types";

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

  const finals: Array<IState> = [];
  stateLedger.states.forEach((state, stateId) => {
    const isFinal = automata.finals.some((final) => state.has(final));
    if (isFinal) {
      finals.push(stateId);
    }
  });

  return new Automata(delta, finals, "toDFA");
}

function lambdaClosure(automata: Automata, states: Set<IState>): Set<IState> {}

function move(
  automata: Automata,
  state: Set<IState>,
  symbol: ISymbol
): Set<IState> {}

// Quick and dirty set equality comparison
// The only reason I am using sets here is that the
// set.has(el) function _should_ be pretty fast at
// checking if el is inside set contrary to
// arrays which will require a linear search
function isEqual(left: Set<IState>, right: Set<IState>): boolean {
  if (left.size !== right.size) {
    return false;
  }

  for (const element of left) {
    if (!right.has(element)) {
      return false;
    }
  }

  return true;
}

// Non Deterministic Automata State
type NState = Set<IState>;

interface IMarkLedger {
  [stateId: number]: boolean;
}

export class StateLedger {
  markLedger: IMarkLedger = {};
  readonly states: Array<NState> = [];

  constructor(states: Array<NState>) {
    this.states = states;
  }

  allMarked(): boolean {
    return Object.values(this.markLedger).every((el) => el);
  }

  getFirstUnmarked(): [IState, NState] {
    const entry = Object.entries(this.markLedger).find(
      ([, isMarked]) => !isMarked
    );
    if (!entry) {
      throw new Error(`StateLedger.getFirstUnmarked error while getting it`);
    }

    const [stateId] = (entry as unknown) as [IState, boolean];
    return [stateId, this.states[stateId]];
  }

  getStateId(state: NState): IState {
    const stateId = this.states.findIndex((s) => isEqual(s, state));
    if (!stateId) {
      return this.states.length;
    }

    return stateId;
  }

  mark(stateId: IState) {
    this.markLedger[stateId] = true;
  }

  addState(state: NState): IState {
    const stateId = this.getStateId(state);
    if (!this.states[stateId]) {
      this.states.push(state);
      this.markLedger[stateId] = false;
    }

    return stateId;
  }

  getStateIds(): Array<IState> {
    return this.states.map((_val, stateId) => stateId);
  }
}
