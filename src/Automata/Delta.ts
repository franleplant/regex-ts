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
}
