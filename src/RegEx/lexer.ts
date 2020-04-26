import { Automata } from "../Automata";
import Token from "./Token";
import { ParOpen, ParClose, Star, Plus, Or, Literal } from "./validTokens";

export type TokenKind = string;

// The order is important!
const automatas: Array<Automata> = [ParOpen, ParClose, Star, Plus, Or, Literal];

export default function lex(rawInput: string): Array<Token> {
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
    while (true) {
      // under the asumption that no token will accept whitespaces
      // this is safe to do here without other checks
      const char = input[index];
      const next = ingestChar(automatas, char);

      //console.log("next", next, index, char)
      if (next.allTrapped) {
        break;
      }

      // Prepare to the next iteration
      candidates = next.candidates;
      lexeme += char;
      index += 1;
    }

    // If we got here it means that we found the longest
    // string that is a valid token or we found an error

    if (candidates.length === 0) {
      throw new Error(`Parser Error: unexpected token ${lexeme}`);
    }

    // produce the new token with the information
    // in the previous iteration
    const token = new Token(candidates[0], lexeme);
    tokens.push(token);
    //console.log("new token", token);

    // Cleanup
    lexeme = "";
    reset(automatas);
  }

  // add an EOF token
  tokens.push(Token.EOF());
  return tokens;
}

function ingestChar(
  automatas: Array<Automata>,
  char: string
): { candidates: Array<TokenKind>; allTrapped: boolean } {
  let allTrapped = true;
  const candidates: Array<TokenKind> = [];
  automatas.forEach((automata) => {
    automata.ingestChar(char);

    if (automata.isAccepted()) {
      candidates.push(automata.label);
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
