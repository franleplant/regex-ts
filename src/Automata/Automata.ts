import { IDelta, IState, ISymbol } from "./types";
import Delta from "./Delta";

export default class Automata {
  static singleSymbol(symbol: ISymbol, label?: string): Automata {
    return new Automata([[0, symbol, 1]], [1], label || symbol);
  }

  state: IState = 0;
  public readonly label: string;
  private readonly delta: Delta;
  private readonly finals: Array<IState>;

  constructor(delta: IDelta, finals: Array<IState>, label?: string) {
    this.delta = new Delta(delta);
    this.finals = finals;
    this.label = label || "unlabeled";
  }

  eval(input: string): boolean {
    this.reset();

    for (const char of input) {
      this.ingestChar(char);
      if (this.isTrapped()) {
        break;
      }
    }

    // If the las state is a final then it
    // the input is accepted, otherwise
    // it is not
    const result = this.isAccepted();
    // since this is a complete run of the automata
    // we reset it after
    this.reset();

    return result;
  }

  ingestChar(char: string) {
    this.state = this.delta.get(this.state, char);
  }

  reset() {
    this.state = 0;
  }

  isAccepted() {
    return this.finals.includes(this.state);
  }

  isTrapped() {
    return this.state === -1;
  }

  isNotAccepted() {
    return !this.isAccepted() && !this.isTrapped();
  }
}
