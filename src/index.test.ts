import test from "ava";
import RegExp from "./index";

test("RegExp basic case1 ab|cd", (t) => {
  const re = new RegExp("ab|cd");
  t.assert(re.test("ab"));
  t.assert(re.test("cd"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case2 abx|cd", (t) => {
  const re = new RegExp("abx|cd");
  t.assert(re.test("abx"));
  t.assert(re.test("cd"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case3 b*", (t) => {
  const re = new RegExp("b*");
  t.assert(re.test(""));
  t.assert(re.test("b"));
  t.assert(re.test("bb"));
  t.assert(re.test("bbbbbbbb"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case4 ab*c", (t) => {
  const re = new RegExp("ab*c");
  t.assert(re.test("ac"));
  t.assert(re.test("abc"));
  t.assert(re.test("abbc"));
  t.assert(re.test("abbbbbbbbc"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case5 ab*", (t) => {
  const re = new RegExp("ab*");
  t.assert(re.test("a"));
  t.assert(re.test("ab"));
  t.assert(re.test("abb"));
  t.assert(re.test("abbbbbbbb"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case6 b*c", (t) => {
  const re = new RegExp("b*c");
  t.assert(re.test("c"));
  t.assert(re.test("bc"));
  t.assert(re.test("bbc"));
  t.assert(re.test("bbbbbbbbc"));
  t.assert(!re.test("hola"));
});

test("RegExp case1 hello|bye", (t) => {
  const re = new RegExp("hello|bye");
  t.assert(re.test("hello"));
  t.assert(re.test("bye"));
  t.assert(!re.test("hola"));
});

test("RegExp case3 ab*", (t) => {
  const re = new RegExp("ab*");
  t.assert(re.test("a"));
  t.assert(re.test("ab"));
  t.assert(re.test("abbbb"));
  t.assert(!re.test("hola"));
});

test("RegExp case-not", (t) => {
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
