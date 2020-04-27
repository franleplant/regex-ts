import test from "ava";
import Parser from "./Parser";
import Token from "./Token";

test.skip("Parser S -> Literal", (t) => {
  const parser = new Parser([new Token("LITERAL", ""), Token.EOF()]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});

test.skip("Parser S -> (S)", (t) => {
  const parser = new Parser([
    new Token("(", ""),
    new Token("(", ""),
    new Token("LITERAL", "abc"),
    new Token(")", ""),
    new Token(")", ""),
    Token.EOF(),
  ]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});

test.skip("Parser Union1", (t) => {
  const parser = new Parser([
    // TODO constants
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});

test.skip("Parser Union2", (t) => {
  const parser = new Parser([
    // TODO constants
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token("(", ""),
    new Token("LITERAL", "abc"),
    new Token(")", ""),
    Token.EOF(),
  ]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});

test.skip("Parser Union3", (t) => {
  const parser = new Parser([
    // TODO constants
    new Token("(", ""),
    new Token("LITERAL", "a"),
    new Token("OR", ""),
    new Token("LITERAL", "b"),
    new Token(")", ""),
    new Token("LITERAL", "abc"),
    Token.EOF(),
  ]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});

test("Parser Star", (t) => {
  const parser = new Parser([
    new Token("LITERAL", "a"),
    new Token("STAR", ""),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ]);

  console.log("RESULT", JSON.stringify(parser.parse(), null, 2));
  t.is(true, false);
});
