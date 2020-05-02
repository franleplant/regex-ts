import test from "ava";
import Automata from "../Automata";
import { IDelta } from "../types";
import toMin from "./index";

test("toMin case1", (t) => {
  const delta = [
    [0, "a", 1],
    [0, "b", 2],
  ] as IDelta;
  const finals = [1, 2];

  const automata = toMin(new Automata(delta, finals));

  const expectedDelta = [
    [0, "a", 1],
    [0, "b", 1],
  ] as IDelta;
  const expectedFinals = [1];

  console.log(automata.delta.getArray());
  console.log(automata.finals);

  t.deepEqual(automata.delta.getArray(), expectedDelta);
  t.deepEqual(automata.finals, expectedFinals);
});

test("toMin case2", (t) => {
  const delta = [
    [0, "a", 1],
    [1, "a", 1],
  ] as IDelta;
  const finals = [0, 1];

  const automata = toMin(new Automata(delta, finals));

  const expectedDelta = [[0, "a", 0]] as IDelta;
  const expectedFinals = [0];

  console.log(automata.delta.getArray());
  console.log(automata.finals);

  t.deepEqual(automata.delta.getArray(), expectedDelta);
  t.deepEqual(automata.finals, expectedFinals);
});
