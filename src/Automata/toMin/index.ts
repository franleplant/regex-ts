import Automata from "../Automata";
import Delta from "../Delta";
import { IState } from "../types";
import MarkLedger from "./MarkLedger";

export default function toMin(automata: Automata): Automata {
  const states = automata.delta.getStates();
  const finals: Set<IState> = new Set(automata.finals);
  const nonFinals: Set<IState> = new Set(
    states.filter((s) => !automata.finals.includes(s))
  );

  // Initial partition
  let partition: Array<Set<IState>> = [nonFinals, finals];
  let nextPartition: Array<Set<IState>> = [];

  while (true) {
    for (const stateSet of partition) {
      const ledger = new MarkLedger(stateSet);

      while (!ledger.areAllMarked()) {
        const stateSet: Set<IState> = new Set();
        const state = ledger.getFirstUnmarked();
        ledger.mark(state);
        stateSet.add(state);

        for (const otherState of ledger.getAllUnmarked()) {
          if (areEquivalent(state, otherState, partition, automata.delta)) {
            stateSet.add(otherState);
            ledger.mark(otherState);
          }
        }
        nextPartition.push(stateSet);
      }
    }

    if (isEqual(partition, nextPartition)) {
      break;
    } else {
      partition = nextPartition;
      nextPartition = [];
    }
  }

  //return nextPartition;
  return new Automata([], []);
}

// are they indistinguishable? used in the `toMin` algorithm
function areEquivalent(
  state: IState,
  otherState: IState,
  partition: Array<Set<IState>>,
  delta: Delta
): boolean {
  for (const symbol of delta.getSymbols()) {
    const nextState = delta.get(state, symbol);
    const otherNextState = delta.get(otherState, symbol);

    for (const stateSet of partition) {
      const bothIn = stateSet.has(nextState) && stateSet.has(otherNextState);
      const bothOut = !stateSet.has(nextState) && !stateSet.has(otherNextState);

      // For them to be equivalent they need to either
      // be both in the state set or be both outside of it
      if (!bothIn || !bothOut) {
        return false;
      }
    }
  }

  return true;
}

function isEqual(
  partition: Array<Set<IState>>,
  otherPartition: Array<Set<IState>>
): boolean {
  // This looks hacky but if the nextPartition has the same lenght
  // of the previous one then they should have the same elements right?
  return partition.length !== otherPartition.length;
}
