import test from "ava";
import Automata, { LAMBDA } from "../Automata";
import toDFA from "./index";
import { IDelta } from "../types";

test("toDFA intersection", (t) => {
  const delta = [
    [0, "a", 1],
    [1, LAMBDA, 2],
    [2, "b", 3],
  ] as IDelta;
  const finals = [3];

  const nfa = new Automata(delta, finals);
  const dfa = toDFA(nfa);

  const expectedDelta = [
    [0, "a", 1],
    [1, "b", 2],
  ] as IDelta;
  const expectedFinals = [2];

  t.deepEqual(dfa.delta.getArray(), expectedDelta);
  t.deepEqual(dfa.finals, expectedFinals);
});

test("toDFA union", (t) => {
  const delta = [
    [0, LAMBDA, 2],
    [0, LAMBDA, 4],
    [2, "a", 3],
    [4, "b", 5],
    [3, LAMBDA, 1],
    [5, LAMBDA, 1],
  ] as IDelta;

  const finals = [1];

  const nfa = new Automata(delta, finals);
  const dfa = toDFA(nfa);

  // TODO This isn't the simplest automata,
  // we should take care of that in the minificaton algorithm
  const expectedDelta = [
    [0, "a", 1],
    [0, "b", 2],
  ] as IDelta;
  const expectedFinals = [1, 2];

  //console.log('dfa delta', dfa.delta.getArray())
  //console.log('dfa finals', dfa.finals)

  t.deepEqual(dfa.delta.getArray(), expectedDelta);
  t.deepEqual(dfa.finals, expectedFinals);
});

test("toDFA star", (t) => {
  const delta = [
    [0, LAMBDA, 1],
    [0, LAMBDA, 3],
    [1, "a", 2],
    [2, LAMBDA, 1],
    [2, LAMBDA, 3],
  ] as IDelta;

  const finals = [3];

  const nfa = new Automata(delta, finals);
  const dfa = toDFA(nfa);

  // TODO make this minimal
  const expectedDelta = [
    [0, "a", 1],
    [1, "a", 1],
  ] as IDelta;
  const expectedFinals = [0, 1];

  console.log("dfa delta", dfa.delta.getArray());
  console.log("dfa finals", dfa.finals);

  t.deepEqual(dfa.delta.getArray(), expectedDelta);
  t.deepEqual(dfa.finals, expectedFinals);
});
