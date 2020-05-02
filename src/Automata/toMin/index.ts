import debugFactory from "debug";
import Automata, { INITIAL_STATE, TRAP_STATE } from "../Automata";
import Delta from "../Delta";
import { IState, IDelta } from "../types";
import MarkLedger from "./MarkLedger";

const debug = debugFactory("toMin");

export default function toMin(automata: Automata): Automata {
  const states = automata.delta.getStates();

  let partition = calcInitialPartition(states, automata.finals);
  let nextPartition: Array<Set<IState>> = [];

  while (true) {
    debug("> partition %o", partition);
    for (const stateSet of partition) {
      debug(">> next partition %o", nextPartition);
      const ledger = new MarkLedger(stateSet);
      debug("working on stateSet %o", stateSet);

      while (!ledger.areAllMarked()) {
        const newStateSet: Set<IState> = new Set();
        const state = ledger.getFirstUnmarked();
        ledger.mark(state);
        debug("initial state ledger %o", ledger);
        newStateSet.add(state);
        debug("initial newStateSet %o", newStateSet);

        debug("iterating over unmarked states");
        for (const otherState of ledger.getAllUnmarked()) {
          debug("state %o", otherState);
          if (areEquivalent(state, otherState, partition, automata.delta)) {
            newStateSet.add(otherState);
            debug("newStateSet %o", newStateSet);
            ledger.mark(otherState);
            debug("state ledger %o", ledger);
          }
        }
        nextPartition.push(newStateSet);
        debug("push to next partition %o", newStateSet);
      }
    }

    if (isEqual(partition, nextPartition)) {
      debug("next partition is equal. Break. %o", nextPartition);
      break;
    } else {
      partition = nextPartition;
      nextPartition = [];
      debug("next partition is different, keep iterating");
    }
  }

  // we need the stateId of the stateSet (which is the index)
  // and that will be the stateId in the new automata
  const delta: IDelta = [];
  const finals: Array<IState> = [];
  const symbols = automata.delta.getSymbols();

  // ensure the initial stateSet is in the index 0
  const finalPartition = renameInitialState(nextPartition);
  debug("final partition %o", finalPartition);
  debug("calculating delta");

  finalPartition.forEach((stateSet, stateSetId) => {
    const isFinal = automata.finals.some((final) => stateSet?.has(final));
    if (isFinal) {
      finals.push(stateSetId);
    }

    // chose the first state as representative
    const state = [...(stateSet as Set<IState>)][0];
    for (const symbol of symbols) {
      const nextState = automata.delta.get(state, symbol);
      const nextStateSetId = finalPartition.findIndex((stateSet) =>
        stateSet?.has(nextState)
      );
      if (nextStateSetId === TRAP_STATE) {
        continue;
      }
      delta.push([stateSetId, symbol, nextStateSetId]);
    }
  });

  return new Automata(delta, finals);
}

// are they indistinguishable? used in the `toMin` algorithm
function areEquivalent(
  state: IState,
  otherState: IState,
  partition: Array<Set<IState>>,
  delta: Delta
): boolean {
  debug("areEquivalent. state %o, otherState %o", state, otherState);
  for (const symbol of delta.getSymbols()) {
    debug("areEquivalent. symbol %o", symbol);
    const nextState = delta.get(state, symbol);
    const otherNextState = delta.get(otherState, symbol);
    debug(
      "areEquivalent. nextState %o, otherNextState %o",
      nextState,
      otherNextState
    );

    if (nextState === TRAP_STATE && otherNextState === TRAP_STATE) {
      debug("areEquivalent. both get trapped");
      continue;
    }

    for (const stateSet of partition) {
      debug("areEquivalent. do they belong to the same stateSet? %o", stateSet);
      const bothIn = stateSet.has(nextState) && stateSet.has(otherNextState);
      const bothOut = !stateSet.has(nextState) && !stateSet.has(otherNextState);

      //debug("both in %o", bothIn)
      //debug("both out %o", bothOut)

      // For them to be equivalent they need to either
      // be both in the state set or be both outside of it
      if (!(bothIn || bothOut)) {
        debug("not equivalent");
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
  return partition.length === otherPartition.length;
}

function calcInitialPartition(
  states: Array<IState>,
  finals: Array<IState>
): Array<Set<IState>> {
  const finalStateSet: Set<IState> = new Set(finals);
  const nonFinalStateSet: Set<IState> = new Set(
    states.filter((s) => !finals.includes(s))
  );

  return [nonFinalStateSet, finalStateSet].filter(
    (stateSet) => stateSet.size > 0
  );
}

function renameInitialState(prevPartition: Array<Set<IState>>) {
  const initialStateSetId = prevPartition.findIndex((stateSet) =>
    stateSet.has(INITIAL_STATE)
  );
  const initialStateSet = prevPartition.find((stateSet) =>
    stateSet.has(INITIAL_STATE)
  );

  // rename the initialStateSet to ensure it is the 0 index which also will be
  // its name the new min automata
  const partition = [
    initialStateSet,
    ...prevPartition.filter(
      (_stateSet, stateId) => stateId !== initialStateSetId
    ),
  ];

  return partition;
}
