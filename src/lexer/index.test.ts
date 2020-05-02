import test from "ava";
import lex from "./index";
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
    new Token("LITERAL", "a"),
    new Token("LITERAL", "b"),
    new Token("LITERAL", "c"),
    new Token("LITERAL", "1"),
    new Token("LITERAL", "2"),
    new Token("LITERAL", "3"),
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
    new Token("LITERAL", "h"),
    new Token("LITERAL", "e"),
    new Token("LITERAL", "l"),
    new Token("LITERAL", "l"),
    new Token("LITERAL", "o"),
    new Token("OR", "|"),
    new Token("LITERAL", "b"),
    new Token("LITERAL", "y"),
    new Token("LITERAL", "e"),
    new Token(")", ")"),
    new Token("LITERAL", "f"),
    new Token("LITERAL", "r"),
    new Token("LITERAL", "a"),
    new Token("LITERAL", "n"),
    Token.EOF(),
  ];

  t.deepEqual(tokens, expectedTokens);
});
