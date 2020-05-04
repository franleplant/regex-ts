import assert from "assert";
import debugFactory from "debug";
import ASTree from "../ASTree";
import { Automata, union, intersection, star, plus } from "../Automata";

const debug = debugFactory("evalTree");

// This is a simple evalTreeuator function
// that crawls the tree in a pre-order fashion
// and computes a resulting automata
export default function evalTree(tree: ASTree): Automata {
  const { kind, lexeme, children } = tree;
  if (children?.length === 0) {
    return Automata.empty();
  }

  if (kind === "LITERAL") {
    assert(!!lexeme, "LITERAL require lexeme");
    return Automata.word(lexeme as string);
  }

  if (tree.isLambda()) {
    return Automata.empty();
  }

  if (!children) {
    throw new Error(
      `Invalid ASTree: No children ${JSON.stringify(tree, null, 2)}`
    );
  }

  if (kind === "ROOT") {
    assert(
      children.length === 1,
      "ROOT node should not have more than one children"
    );
    return evalTree(children[0] as ASTree);
  }

  if (kind === "INTERSECTION") {
    const result = children.reduce(
      (acu, child) => intersection(acu, evalTree(child as ASTree)),
      Automata.empty()
    );
    return result.toDFA().toMin();
  }

  if (kind === "UNION") {
    assert(!!children[0], "union: left hand side is missing");
    assert(!!children[1], "union: right hand side is missing");

    const leftAutomata = evalTree(children[0] as ASTree);
    const rightAutomata = evalTree(children[1] as ASTree);
    debug("union left %o", leftAutomata);
    debug("union right %o", rightAutomata);

    return union(leftAutomata, rightAutomata).toDFA().toMin();
  }

  if (kind === "STAR") {
    assert(
      children.length === 1,
      "STAR should not have more than one children"
    );
    return star(evalTree(children[0] as ASTree))
      .toDFA()
      .toMin();
  }

  if (kind === "PLUS") {
    assert(
      children.length === 1,
      "PLUS should not have more than one children"
    );
    return plus(evalTree(children[0] as ASTree))
      .toDFA()
      .toMin();
  }

  throw new Error(`invalid ASTree ${JSON.stringify(tree, null, 2)}`);
}
