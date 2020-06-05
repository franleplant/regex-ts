import { Automata, intersection, plus } from "../Automata";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

const NUMBERS = "0123456789".split("");
const SYMBOLS = ".://_".split("");

export const ParOpen = Automata.singleSymbol("(");
export const ParClose = Automata.singleSymbol(")");
export const Star = Automata.singleSymbol("*", "STAR");
export const Plus = Automata.singleSymbol("+", "PLUS");
export const Or = Automata.singleSymbol("|", "OR");

// TODO express this in terms of unions/intersections/star
export const Literal = new Automata(
  [
    [0, ALPHABET, 1],
    [0, NUMBERS, 1],
    [0, SYMBOLS, 1],
  ],
  [1],
  "LITERAL"
);

export const LiteralSet = intersection(
  Automata.word("["),
  intersection(plus(Literal), Automata.word("]"))
)
  .toDFA()
  .toMin();

LiteralSet.label = "LITERAL_SET";
