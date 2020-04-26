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
  let lexeme = "";

  while (true) {
    // Check end of input
    if (index >= input.length) {
      break;
    }

    const char = input[index];

    // skip this cycle and go to the next
    // for now this only happes on the end of the input
    if (char === " ") {
      index += 1;
      continue;
    }

    //console.log("char", char)

    let allTrapped = false;
    let prevCandidates: Array<TokenKind> = [];
    let candidates: Array<TokenKind> = [];
    while (!allTrapped) {
      // under the asumption that no
      // automata will accept whitespaces
      // this is safe to do here since
      // we always have a whitespace at the end
      const char = input[index];
      const result = ingestChar(automatas, char);
      //console.log("result", result, index, char)

      // Prepare to the next iteration
      allTrapped = result.allTrapped;
      prevCandidates = candidates;
      candidates = result.candidates;
      lexeme += char;
      index += 1;
    }

    // all trapped means that right before this iteration
    // was the longest string we accept

    //console.log("candidates", prevCandidates);
    if (prevCandidates.length === 0) {
      throw new Error("wrong token");
    }

    // produce the new token with the information
    // in the previous iteration
    const token = new Token(prevCandidates[0], lexeme.slice(0, -1));
    tokens.push(token);
    //console.log("new token", token);

    // Cleanup
    lexeme = "";
    index -= 1;
    reset(automatas);
  }

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
