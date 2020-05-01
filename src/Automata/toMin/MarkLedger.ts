import { IState } from "../types";

interface IMarkMap {
  [state: number]: boolean;
}

export default class MarkLedger {
  private markMap: IMarkMap = {};

  constructor(keys: Set<IState>) {
    keys.forEach((state) => (this.markMap[state] = false));
  }

  areAllMarked(): boolean {
    return Object.values(this.markMap).every((isMarked) => isMarked);
  }

  getFirstUnmarked(): IState {
    for (const state in this.markMap) {
      const isMarked = this.markMap[state];
      if (!isMarked) {
        return Number(state);
      }
    }

    throw new Error(`MarkLedger.getFirstUnmarked when all have been marked`);
  }

  mark(state: IState) {
    this.markMap[state] = true;
  }

  getAllUnmarked(): Array<IState> {
    return Object.keys(this.markMap)
      .filter((state) => !this.markMap[Number(state)])
      .map((s) => Number(s));
  }
}
