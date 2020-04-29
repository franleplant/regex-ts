import { TRAP_STATE } from "./Automata";
import { IDelta, IState, ISymbol } from "./types";

// This is the representation of the Delta
// or transitions for an Automata.
// This delta is generic in the sense that can
// serve DFA and NFA.
// For now we only need the NFA for the `toDFA` algorithms.
// We do not have an Automata that knows how to run in NFA mode.
export default class Delta {
  private delta: IDelta;
  private map: Map<string, Array<IState>> = new Map();

  constructor(delta: IDelta) {
    this.delta = delta;

    // keep track of duplicated rules to remove them
    const duplicatedRules: { [ruleIndex: number]: boolean } = {};
    // Perf optimization, we create a map
    // to make faster lookups for the next state
    this.delta.forEach(([state, symbol, nextState], index) => {
      // Transform it into an array, this is
      // just an ergonomic enhancement
      const symbols = Array.isArray(symbol) ? symbol : [symbol];

      symbols.forEach((symbol) => {
        // we need to use string to make this comparable
        const key = JSON.stringify({ state, symbol });
        // We want to store a list of next states to make this
        // more generic to fit Non Deterministic Automata (NDA)
        const nextStateList = this.map.get(key) || [];

        // check if the rule is duplicated
        if (nextStateList.includes(nextState)) {
          // if it is, then mark it for later removal
          duplicatedRules[index] = true;
        } else {
          // otherwise save it
          nextStateList.push(nextState);
          // and mark it as not duplicated
          duplicatedRules[index] = false;
        }

        this.map.set(key, nextStateList);
      });
    });

    // Remove duplicated rules
    this.delta = this.delta.filter((_value, index) => !duplicatedRules[index]);
  }

  // Get the first state in the next state list
  get(state: IState, symbol: ISymbol): IState {
    const nextStateList = this.map.get(JSON.stringify({ state, symbol })) || [];

    if (nextStateList.length === 0) {
      return -1;
    }

    if (nextStateList.length > 1) {
      console.log(`delta.get(${state}, ${symbol}) of a NFA`, nextStateList);
    }

    return nextStateList[0];
  }

  // Get all the possible transitions from this state and symbol,
  // this method should only be used in NDA
  getNDA(state: IState, symbol: ISymbol): Array<IState> {
    const nextStateList = this.map.get(JSON.stringify({ state, symbol }));
    return (nextStateList || []).filter((state) => state !== TRAP_STATE);
  }

  getArray(): IDelta {
    // Shallow copy
    return [...this.delta];
  }

  getStates(): Array<IState> {
    const states = new Set<IState>();
    this.delta.forEach(([state, _symbol, nextState]) => {
      states.add(state);
      states.add(nextState);
    });

    return [...states];
  }

  // get input symbols
  getSymbols(): Array<ISymbol> {
    const symbols = new Set<ISymbol>();
    this.delta.forEach(([_state, symbol, _nextState]) => {
      if (Array.isArray(symbol)) {
        throw new Error(
          `Delta.getSymbols: cannot compute because of shorthand symbol array`
        );
      }
      symbols.add(symbol);
    });

    return [...symbols];
  }
}
