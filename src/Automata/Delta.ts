import { IDelta, IState, ISymbol } from "./types";

export default class Delta {
  private delta: IDelta;
  private map: Map<string, IState> = new Map();

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
        this.map.set(JSON.stringify({ state, symbol }), nextState);
      });
    });
  }

  get(state: IState, symbol: ISymbol): IState {
    const nextState = this.map.get(JSON.stringify({ state, symbol }));

    if (nextState === undefined) {
      return -1;
    }

    return nextState;
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
