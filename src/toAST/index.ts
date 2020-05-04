import debugFactory from "debug";
import ASTree from "../ASTree";

const debug = debugFactory("toAST");

// An heuristic approach to turn the parse tree into
// an AST that can be easily evaluated via a pre-order
// tree traversal
export default function toAST(tree: ASTree): ASTree {
  debug("input %O", tree);
  if (!tree.children || tree.children.length === 0) {
    return tree;
  }

  let newTree;
  // try the heuristic and if it does return a new tree
  // then we return that, otherwise let's keep trying other heuristics
  if ((newTree = lambdaIntersectionHeuristic(tree))) {
    return newTree;
  }

  if ((newTree = trivialIntersectionHeuristic(tree))) {
    return newTree;
  }

  if (tree.isIntersection()) {
    // TODO break this down,
    //TODO probably I do not need to check this length now that
    // im using safer wrappers

    //if (tree.children.length >= 2) {
    //debug("intersection(...any, lambda) => intersection(...any)");

    //const lambda = tree.popChildIf((child) => child.isLambda());
    //if (lambda) {
    //return toAST(tree);
    //}

    //debug("skipping");
    //}

    //if (tree.childrenLength() === 1) {
    //debug("intersection(intersection(any)) => intersection(any)");
    //const intersection = tree.popChildIf((child) => child.isIntersection());
    //if (intersection) {
    //tree.children = intersection.children;
    //return toAST(tree);
    //}
    //debug("skipping");
    //}

    if (tree.children.length >= 2) {
      debug(
        "intersection(lit_1, ..., lit_n, intersection(any, lamda)) => intersection(lit_1, ..., lit_n, any)"
      );

      const intersection = tree.popChildIf(
        (child) =>
          child.isIntersection() &&
          child.isChildAt(1, (child) => child.isLambda())
      );
      if (intersection) {
        tree.children = [...tree.children, intersection.getChild(0)];
        return toAST(tree);
      }

      debug("skipping");
    }

    if (tree.children.length >= 2) {
      debug(
        "intersection(lit_1, ..., lit_n, intersection(lit_n+1, any)) => intersection(lit_1, ..., lit_n, lit_n+1, any)"
      );

      // Should be last
      const intersection = tree.popChildIf(
        (child) => child.isIntersection() && child.childrenLength() >= 2
      );
      if (intersection) {
        tree.children = [
          ...tree.children,
          ...(intersection.children as Array<ASTree>),
        ];
        return toAST(tree);
      }
      debug("skipping");
    }

    if (tree.children.length >= 2) {
      debug("intersection(...children, union(any))");
      // Should be the last
      const union = tree.popChildIf((child) => child.isUnion());
      if (union) {
        return toAST(
          new ASTree({
            kind: "UNION",
            children: [tree, union.getChild(0)],
          })
        );
      }
      debug("skipping");
    }

    if (tree.children.length >= 2) {
      debug(
        "intersection(lit_1, ..., lit_n-1, lit_n, star(next)) => intersection(lit_1, ..., lit_n-1, star(lit_n), next)"
      );
      const star = tree.popChildIf(
        (child) => child.isStar() && !child.getAttr("done")
      );
      if (star) {
        const lastChild = tree.popChild();
        if (!lastChild) {
          throw new Error(
            `star: incorrect tree ${JSON.stringify(tree, null, 2)}`
          );
        }

        tree.children = [
          ...tree.children,
          new ASTree({
            kind: "STAR",
            children: [lastChild],
            attributes: {
              done: true,
            },
          }),
          ...(star.children || []).filter((child) => !child?.isLambda()),
        ];

        return toAST(tree);
      }
      debug("skipping");
    }
  }

  if (tree.isUnion()) {
    tree.children = tree.children.filter(
      (child) => !(child as ASTree).isLambda()
    );
  }

  debug("default. iterating over children %O", tree.children);
  tree.children = tree.children.map((child) => toAST(child as ASTree));
  return tree;
}

type Heuristic = (tree: ASTree) => ASTree | undefined;

export const lambdaIntersectionHeuristic: Heuristic = (tree) => {
  debug("intersection(...any, lambda) => intersection(...any)");
  if (tree.isIntersection() && tree.childrenLength() >= 2) {
    const lambda = tree.popChildIf((child) => child.isLambda());
    if (lambda) {
      return toAST(tree);
    }
  }
  debug("skipping");
  return;
};

export const trivialIntersectionHeuristic: Heuristic = (tree) => {
  debug("intersection(intersection(any)) => intersection(any)");
  if (tree.isIntersection() && tree.childrenLength() === 1) {
    const intersection = tree.popChildIf((child) => child.isIntersection());
    if (intersection) {
      tree.children = intersection.children;
      return toAST(tree);
    }
  }
  debug("skipping");
  return;
};
