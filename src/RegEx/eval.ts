import assert from "assert";
import ASTree from "./ASTree";
import { Automata, union, intersection, star, plus } from "../Automata";

// This is a simple evalTreeuator function
// that crawls the tree in a pre-order fashion
// and computes a resulting automata
export function evalTree(tree: ASTree): Automata {
  const { kind, lexeme, children } = tree;
  if (children?.length === 0) {
    return Automata.empty();
  }

  if (kind === "LITERAL") {
    assert(!!lexeme, "LITERAL require lexeme");
    return Automata.word(lexeme as string);
  }

  if (!children) {
    throw new Error(`Invalid ASTree: No children`);
  }

  if (kind === "ROOT") {
    assert(
      children.length === 1,
      "ROOT node should not have more than one children"
    );
    return evalTree(children[0] as ASTree);
  }

  if (kind === "INTERSECTION") {
    assert(!!children[0], "INTERSECTION: left hand side is missing");
    assert(!!children[1], "INTERSECTION: right hand side is missing");

    const leftAutomata = evalTree(children[0] as ASTree);
    const rightAutomata = evalTree(children[0] as ASTree);

    return intersection(leftAutomata, rightAutomata);
  }

  if (kind === "UNION") {
    assert(!!children[0], "union: left hand side is missing");
    assert(!!children[1], "union: right hand side is missing");

    const leftAutomata = evalTree(children[0] as ASTree);
    const rightAutomata = evalTree(children[0] as ASTree);

    return union(leftAutomata, rightAutomata);
  }

  if (kind === "STAR") {
    assert(
      children.length === 1,
      "STAR should not have more than one children"
    );
    return star(children[0] as ASTree);
  }

  if (kind === "PLUS") {
    assert(
      children.length === 1,
      "PLUS should not have more than one children"
    );
    return plus(children[0] as ASTree);
  }

  throw new Error(`invalid ASTree`);
}
