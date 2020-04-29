import { IState } from "../types";

// Non Deterministic Automata State
export type NState = Set<IState>;

interface IMarkLedger {
  [stateId: number]: boolean;
}

export default class StateLedger {
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

  calcFinals(oldFinals: Array<IState>): Array<IState> {
    const finals: Array<IState> = [];
    this.states.forEach((state, stateId) => {
      const isFinal = oldFinals.some((final) => state.has(final));
      if (isFinal) {
        finals.push(stateId);
      }
    });

    return finals;
  }
}

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
