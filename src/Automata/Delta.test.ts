import test from "ava";
import Delta from "./Delta";
import { IDelta } from "./types";

test("Delta case1", (t) => {
  // Basic delta that accepts a*b
  const delta = [
    [0, "a", 0],
    [0, "b", 1],
  ] as IDelta;

  const d = new Delta(delta);

  t.is(d.get(0, "a"), 0);
  t.is(d.get(0, "b"), 1);
});

test("Delta case2", (t) => {
  // Basic delta that accepts one number
  const delta = [[0, "0123456789".split(""), 1]] as IDelta;

  const d = new Delta(delta);

  t.is(d.get(0, "0"), 1);
  t.is(d.get(0, "1"), 1);
  t.is(d.get(0, "4"), 1);
  t.is(d.get(0, "9"), 1);
});
