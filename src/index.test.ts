import test from "ava";
import RegExp from "./index";

test("RegExp", (t) => {
  const re = new RegExp("hello|bye");
  t.assert(re.test("hello"));
  t.assert(re.test("bye"));
  t.assert(!re.test("hola"));
});
