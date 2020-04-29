import assert from "assert";
import debugFactory from "debug";
import { IState } from "../types";

const debug = debugFactory("toDFA: StateLedger");

// Non Deterministic Automata State
export type NState = Set<IState>;

interface IMarkLedger {
  [stateId: number]: boolean;
}

export default class StateLedger {
  markLedger: IMarkLedger = {};
  readonly states: Array<NState> = [];

  constructor(initialState: NState) {
    this.states.push(initialState);
    this.markLedger[0] = false;
    debug("constructor %o", this);
  }

  getStateId(state: NState): IState {
    const stateId = this.states.findIndex((s) => isEqual(s, state));
    if (stateId === -1) {
      return this.states.length;
    }

    return stateId;
  }

  getStateIds(): Array<IState> {
    return this.states.map((_val, stateId) => stateId);
  }

  allMarked(): boolean {
    return Object.values(this.markLedger).every((el) => el);
  }

  getFirstUnmarked(): [IState, NState] {
    let unmarkedStateId: number = -1;
    for (const stateId in this.markLedger) {
      if (!this.markLedger[stateId]) {
        unmarkedStateId = Number(stateId);
      }
    }

    if (unmarkedStateId === -1) {
      throw new Error(`StateLedger.getFirstUnmarked error while getting it`);
    }

    const unmarked = [unmarkedStateId, this.states[unmarkedStateId]] as [
      IState,
      NState
    ];
    debug("getFirstUnmarked() => %o", unmarked);
    return unmarked;
  }

  mark(stateId: IState) {
    assert(
      stateId >= 0,
      `stateLedger.mark(${stateId}) of a negative stateId. Maybe you are trying to mark TRAP_STATE?`
    );
    this.markLedger[stateId] = true;
    debug("mark(%o). Ledger: %o", stateId, this.markLedger);
  }

  addState(state: NState): IState {
    const stateId = this.getStateId(state);
    if (!this.states[stateId]) {
      this.states.push(state);
      this.markLedger[stateId] = false;
    }

    return stateId;
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
