import { IDelta, IState } from "./types";

export interface IRenameMap {
  [originalStateNumber: number]: number;
}

// Helper function that calculates a rename map for
// automata states.
// When we perform a union or an intersection the internal
// states of each automata might (and probably will) use the
// same state numbers, so we need a way to break that tie.
// We do that by offsetting each state by a given offset number
// and creating a map that goes from the old state number to
// the new state number. Additionally we calculate the max
// state number so that it can be used later to offset
// another automata
export function getRenameMap(
  states: Array<IState>,
  offset: number
): [IRenameMap, number] {
  const renameMap: IRenameMap = {};
  let maxValue = -1;

  states.forEach((state) => {
    const value = state + offset;
    renameMap[state] = value;

    // store the highest new state id
    if (value > maxValue) {
      maxValue = value;
    }
  });

  return [renameMap, maxValue];
}

// Use a IRenameMap to rename all the transitions in a IDelta array.
export function renameDelta(delta: IDelta, renameMap: IRenameMap): IDelta {
  return delta.map(([state, symbol, nextState]) => [
    renameMap[state],
    symbol,
    renameMap[nextState],
  ]);
}
