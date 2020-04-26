import test from "ava";
import lex from "./lexer";
import Token from "./Token";

test("Lexer par and literals", (t) => {
  const tokens = lex("(a)");
  const expectedTokens = [
    new Token("(", "("),
    new Token("LITERAL", "a"),
    new Token(")", ")"),
    Token.EOF(),
  ];

  t.deepEqual(tokens, expectedTokens);
});

test("Lexer bigger literals", (t) => {
  const tokens = lex("(abc123)");
  const expectedTokens = [
    new Token("(", "("),
    new Token("LITERAL", "abc123"),
    new Token(")", ")"),
    Token.EOF(),
  ];

  t.deepEqual(tokens, expectedTokens);
});

test("Lexer or", (t) => {
  const tokens = lex("a|b");
  const expectedTokens = [
    new Token("LITERAL", "a"),
    new Token("OR", "|"),
    new Token("LITERAL", "b"),
    Token.EOF(),
  ];

  t.deepEqual(tokens, expectedTokens);
});

test("Lexer compound", (t) => {
  const tokens = lex("(hello|bye)fran");
  const expectedTokens = [
    new Token("(", "("),
    new Token("LITERAL", "hello"),
    new Token("OR", "|"),
    new Token("LITERAL", "bye"),
    new Token(")", ")"),
    new Token("LITERAL", "fran"),
    Token.EOF(),
  ];

  t.deepEqual(tokens, expectedTokens);
});
