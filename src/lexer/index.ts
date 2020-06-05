import debugFactory from "debug";
import { Automata } from "../Automata";
import Token, { TokenKind } from "./Token";
import {
  ParOpen,
  ParClose,
  Star,
  Plus,
  Or,
  Literal,
  LiteralSet,
} from "./validTokens";

const debug = debugFactory("lexer");

// The order is important!
const automatas: Array<Automata> = [
  ParOpen,
  ParClose,
  Star,
  Plus,
  Or,
  LiteralSet,
  Literal,
];

export default function lex(rawInput: string): Array<Token> {
  debug("input", rawInput);
  // We add a space as a form of input termination
  const input = rawInput + " ";
  const tokens: Array<Token> = [];
  let index = 0;

  // cycle until we consume all the input
  while (index < input.length) {
    const char = input[index];

    // skip this cycle and go to the next
    // for now this only happes on the end of the input
    if (char === " ") {
      index += 1;
      continue;
    }

    // Let's find the longest prefix string that is
    // a valid token
    let candidates: Array<TokenKind> = [];
    let lexeme = "";
    const start = index;
    while (true) {
      debug("candidates", candidates);
      // under the asumption that no token will accept whitespaces
      // this is safe to do here without other checks
      const char = input[index];
      const next = ingestChar(automatas, char);

      if (next.allTrapped) {
        debug("allTrapped");
        break;
      }

      debug("next %o", next);
      // Prepare to the next iteration
      candidates = next.candidates;
      lexeme += char;
      index += 1;
      debug("lexeme %o", lexeme);
    }
    debug("found longest token of types %o", candidates);

    // If we got here it means that we found the longest
    // string that is a valid token or we found an error

    if (candidates.length === 0) {
      const left = input.slice(0, index);
      const right = input.slice(index);
      const errorAt = `${left}>${right}`;
      throw new Error(`Parser Error: unexpected token ${lexeme} at ${errorAt}`);
    }

    // produce the new token with the information
    // in the previous iteration
    const token = new Token(candidates[0], lexeme, start);
    tokens.push(token);
    //console.log("new token", token);

    // Cleanup
    lexeme = "";
    reset(automatas);
  }

  // add an EOF token
  tokens.push(Token.EOF(index - 1));
  debug("result", tokens);
  return tokens;
}

function ingestChar(
  automatas: Array<Automata>,
  char: string
): { candidates: Array<TokenKind>; allTrapped: boolean } {
  debug("ingestChar %o", char);
  let allTrapped = true;
  const candidates: Array<TokenKind> = [];
  automatas.forEach((automata) => {
    automata.ingestChar(char);

    if (automata.isAccepted()) {
      candidates.push(automata.label as TokenKind);
      allTrapped = false;
    }

    if (automata.isNotAccepted()) {
      allTrapped = false;
    }
  });

  return { candidates, allTrapped };
}

function reset(automatas: Array<Automata>) {
  automatas.forEach((automata) => automata.reset());
}
