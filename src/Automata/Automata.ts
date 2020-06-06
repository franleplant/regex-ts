import { IDelta, IState, ISymbol } from "./types";
import Delta from "./Delta";
import toDFA from "./toDFA";
import toMin from "./toMin";

export const INITIAL_STATE = 0;
export const TRAP_STATE = -1;
export const LAMBDA = "LAMBDA";

export default class Automata {
  static empty(): Automata {
    return new Automata([], [INITIAL_STATE]);
  }

  static singleSymbol(symbol: ISymbol, label?: string): Automata {
    return new Automata([[INITIAL_STATE, symbol, 1]], [1], label || symbol);
  }

  // An automata for a single word
  static word(word: string): Automata {
    const symbols = word.split("");
    const delta: IDelta = symbols.map((char, index) => [
      index,
      char,
      index + 1,
    ]);
    const finals = [symbols.length];
    return new Automata(delta, finals);
  }

  private state: IState = INITIAL_STATE;
  public label: string;
  public readonly delta: Delta;
  public readonly finals: Array<IState>;

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
    this.state = INITIAL_STATE;
  }

  isAccepted() {
    return this.finals.includes(this.state);
  }

  isTrapped() {
    return this.state === TRAP_STATE;
  }

  isNotAccepted() {
    return !this.isAccepted() && !this.isTrapped();
  }

  toDFA(): Automata {
    return toDFA(this);
  }

  toMin(): Automata {
    return toMin(this);
  }
}
