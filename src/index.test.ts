import test from "ava";
import RegExp from "./index";

test("RegExp case1 hello|bye", (t) => {
  const re = new RegExp("hello|bye");
  t.assert(re.test("hello"));
  t.assert(re.test("bye"));
  t.assert(!re.test("hola"));
});

test("RegExp case2", (t) => {
  const re = new RegExp("(a|b)*");
  t.assert(re.test(""));
  t.assert(re.test("a"));
  t.assert(re.test("b"));
  t.assert(re.test("aa"));
  t.assert(re.test("bb"));
  t.assert(re.test("aaaaaa"));
  t.assert(re.test("bbbbbb"));
  t.assert(re.test("ababaaaaab"));
  t.assert(re.test("babaaaab"));
  t.assert(!re.test("hola"));
});

test("RegExp case3", (t) => {
  const re = new RegExp("(hello|bye)*");
  t.assert(re.test(""));
  t.assert(re.test("hello"));
  t.assert(re.test("bye"));
  t.assert(re.test("hellohello"));
  t.assert(re.test("byebye"));
  t.assert(re.test("hellohellohellohellohello"));
  t.assert(re.test("byebyebyebye"));
  t.assert(re.test("hellobyehellobyehello"));
  t.assert(re.test("byehellobyehellohellobyebye"));
  t.assert(!re.test("hola"));
});

test("RegExp https", (t) => {
  const re = new RegExp("http|https");
  t.assert(re.test("http"));
  t.assert(re.test("https"));
  t.assert(!re.test("hola"));
});

test("RegExp baSTAR", (t) => {
  const re = new RegExp("ba*");
  t.assert(re.test("b"));
  t.assert(re.test("ba"));
  t.assert(re.test("baaaaaa"));
  t.assert(!re.test("hola"));
  t.assert(!re.test("baba"));
});

//test("RegExp https://a+.com", (t) => {
//const re = new RegExp("(http|https)://aa*.com");
//t.assert(re.test("http://aaaaaa.com"));
//t.assert(re.test("https://aaaaa.com"));
//t.assert(!re.test("hola"));
//});
