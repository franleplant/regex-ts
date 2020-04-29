import { IDelta, IState, ISymbol } from "./types";

export default class Delta {
  private delta: IDelta;
  private map: Map<string, Array<IState>> = new Map();

  constructor(delta: IDelta) {
    this.delta = delta;

    // Perf optimization, we create a map
    // to make faster lookups for the next state
    this.delta.forEach(([state, symbol, nextState]) => {
      // Transform it into an array, this is
      // just an ergonomic enhancement
      const symbols = Array.isArray(symbol) ? symbol : [symbol];

      symbols.forEach((symbol) => {
        // we need to use string to make this comparable
        const key = JSON.stringify({ state, symbol });
        // We want to store a list of next states to make this
        // more generic to fit Non Deterministic Automata (NDA)
        const nextStateList = this.map.get(key) || [];
        nextStateList.push(nextState);
        this.map.set(key, nextStateList);
      });
    });
  }

  // Get the first state in the next state list
  get(state: IState, symbol: ISymbol): IState {
    const nextStateList = this.map.get(JSON.stringify({ state, symbol })) || [];

    if (nextStateList.length === 0) {
      return -1;
    }

    return nextStateList[0];
  }

  // Get all the possible transitions from this state and symbol,
  // this method should only be used in NDA
  getNDA(state: IState, symbol: ISymbol): Array<IState> {
    const nextStateList = this.map.get(JSON.stringify({ state, symbol }));
    return nextStateList || [];
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
