import { Automata } from "../Automata";

export const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

export const NUMBERS = "0123456789".split("");

export const ParOpen = Automata.singleSymbol("(");
export const ParClose = Automata.singleSymbol(")");
export const Star = Automata.singleSymbol("*");
export const Plus = Automata.singleSymbol("+");
export const Or = Automata.singleSymbol("|");

export const Literal = new Automata(
  [
    [0, ALPHABET, 1],
    [1, ALPHABET, 1],
    [0, NUMBERS, 1],
    [1, NUMBERS, 1],
  ],
  [1],
  "LITERAL"
);
