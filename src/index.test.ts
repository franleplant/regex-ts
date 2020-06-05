import test from "ava";
import RegExp from "./index";

//TODO maybe break this down by category or something
test("RegExp basic case01 abc|def", (t) => {
  const re = new RegExp("abc|def");
  t.assert(re.test("abc"));
  t.assert(re.test("def"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case02 ab|c*d", (t) => {
  const re = new RegExp("ab|c*d");
  t.assert(re.test("ab"));
  t.assert(re.test("d"));
  t.assert(re.test("cd"));
  t.assert(re.test("ccccccd"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case03 b*", (t) => {
  const re = new RegExp("b*");
  t.assert(re.test(""));
  t.assert(re.test("b"));
  t.assert(re.test("bb"));
  t.assert(re.test("bbbbbbbb"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case04 ab*cd", (t) => {
  const re = new RegExp("ab*cd");
  t.assert(re.test("acd"));
  t.assert(re.test("abcd"));
  t.assert(re.test("abbcd"));
  t.assert(re.test("abbbbbbbbcd"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case05 ab*", (t) => {
  const re = new RegExp("ab*");
  t.assert(re.test("a"));
  t.assert(re.test("ab"));
  t.assert(re.test("abb"));
  t.assert(re.test("abbbbbbbb"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case06 b*c", (t) => {
  const re = new RegExp("b*c");
  t.assert(re.test("c"));
  t.assert(re.test("bc"));
  t.assert(re.test("bbc"));
  t.assert(re.test("bbbbbbbbc"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case07 (ab)c", (t) => {
  const re = new RegExp("(ab)c");
  t.assert(re.test("abc"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case08 (ab)c|(de)", (t) => {
  const re = new RegExp("(ab)c|(de)");
  t.assert(re.test("abc"));
  t.assert(re.test("de"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case09 (ab)*", (t) => {
  const re = new RegExp("(ab)*");
  t.assert(re.test(""));
  t.assert(re.test("ab"));
  t.assert(re.test("abab"));
  t.assert(re.test("abababababab"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case10 (ab)*c", (t) => {
  const re = new RegExp("(ab)*c");
  t.assert(re.test("c"));
  t.assert(re.test("abc"));
  t.assert(re.test("ababc"));
  t.assert(re.test("abababababababc"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case11 (ab)*|cd", (t) => {
  const re = new RegExp("(ab)*|cd");
  t.assert(re.test(""));
  t.assert(re.test("ab"));
  t.assert(re.test("cd"));
  t.assert(re.test("ababababab"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case12 ((ab)*|cd)*", (t) => {
  const re = new RegExp("((ab)*|cd)*");
  t.assert(re.test(""));
  t.assert(re.test("ab"));
  t.assert(re.test("cd"));
  t.assert(re.test("cdababcdababab"));
  t.assert(re.test("abcdababcdababab"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case13 (a|b)*", (t) => {
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

test("RegExp basic case14 a+", (t) => {
  const re = new RegExp("a+");
  t.assert(re.test("a"));
  t.assert(re.test("aa"));
  t.assert(re.test("aaaaaaaaa"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case15 ab+c", (t) => {
  const re = new RegExp("ab+c");
  t.assert(re.test("abc"));
  t.assert(re.test("abbc"));
  t.assert(re.test("abbbbbc"));
  t.assert(!re.test("ac"));
  t.assert(!re.test("hola"));
});

test("RegExp basic case16 ab|cd+", (t) => {
  const re = new RegExp("ab|cd+");
  t.assert(re.test("ab"));
  t.assert(re.test("cd"));
  t.assert(re.test("cdd"));
  t.assert(re.test("cddddd"));
  t.assert(!re.test("c"));
  t.assert(!re.test("hola"));
});

test("RegExp literalSet case01 [abc]", (t) => {
  const re = new RegExp("[abc]");
  t.assert(re.test("a"));
  t.assert(re.test("b"));
  t.assert(re.test("c"));
  t.assert(!re.test("hola"));
});

test("RegExp literalSet case02 [abc]*", (t) => {
  const re = new RegExp("[abc]*");
  t.assert(re.test(""));
  t.assert(re.test("a"));
  t.assert(re.test("b"));
  t.assert(re.test("c"));
  t.assert(re.test("abc"));
  t.assert(re.test("abbcccaaaacb"));
  t.assert(!re.test("hola"));
});

test("RegExp case1 hello|bye", (t) => {
  const re = new RegExp("hello|bye");
  t.assert(re.test("hello"));
  t.assert(re.test("bye"));
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

test("RegExp https://a+.com", (t) => {
  const re = new RegExp("(http|https)://a+.com");
  t.assert(re.test("http://aaaaaa.com"));
  t.assert(re.test("https://aaaaa.com"));
  t.assert(!re.test("hola"));
});
