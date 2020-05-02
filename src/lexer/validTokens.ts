import { Automata } from "../Automata";

export const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

export const NUMBERS = "0123456789".split("");
export const SYMBOLS = ".://".split("");

export const ParOpen = Automata.singleSymbol("(");
export const ParClose = Automata.singleSymbol(")");
export const Star = Automata.singleSymbol("*", "STAR");
export const Plus = Automata.singleSymbol("+", "PLUS");
export const Or = Automata.singleSymbol("|", "OR");

export const Literal = new Automata(
  [
    [0, ALPHABET, 1],
    [0, NUMBERS, 1],
    [0, SYMBOLS, 1],
  ],
  [1],
  "LITERAL"
);
