import debugFactory from "debug";
import ASTree from "../ASTree";

const debug = debugFactory("toAST");

export type Heuristic = (tree: ASTree) => ASTree | undefined;

// An heuristic approach to turn the parse tree into
// an AST that can be easily evaluated via a pre-order
// tree traversal
export default function toAST(tree: ASTree): ASTree {
  debug("input %s", tree.toString());
  if (!tree.children || tree.children.length === 0) {
    return tree;
  }

  const heuristics: Array<Heuristic> = [
    litStar,
    parenStar,
    parenOr,
    implicitIntersection,
    lambda,
  ];

  // try the heuristic and if it does return a new tree
  // then we return that, otherwise let's keep trying other heuristics
  for (const heuristic of heuristics) {
    const newTree = heuristic(tree);
    if (newTree) {
      return toAST(newTree);
    }
  }

  debug("default. iterating over children %O", tree.children);
  tree.children = tree.children.map((child) => toAST(child as ASTree));
  return tree;
}

//A -> lambda
export const lambda: Heuristic = (tree) => {
  if (!tree.childrenMatch("LAMBDA")) {
    return;
  }

  return ASTree.Lambda;
};

//TODO PLUS
//S -> ( S ) A
//A -> * A
export const parenStar: Heuristic = (tree) => {
  if (!tree.childrenMatch("(", "S", ")", "A")) {
    return;
  }

  const [_parOpen, starred, _parClose, a] = tree!.children as Array<ASTree>;
  if (!a?.childrenMatch("STAR", "A")) {
    return;
  }
  const [_star, right] = a!.children as Array<ASTree>;

  return new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({
        kind: "STAR",
        children: [starred],
      }),
      right as ASTree,
    ],
  });
};

//S -> Lit A
//A -> * A
export const litStar: Heuristic = (tree) => {
  debug("litStar");
  if (!tree.childrenMatch("LITERAL", "A")) {
    debug("skipping");
    return;
  }

  const [starred, a] = tree!.children as Array<ASTree>;
  if (!a?.childrenMatch("STAR", "A")) {
    debug("skipping");
    return;
  }
  const [_star, right] = a!.children as Array<ASTree>;

  return new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({
        kind: "STAR",
        children: [starred],
      }),
      right as ASTree,
    ],
  });
};

//S -> ( S ) A
//A -> or S A
export const parenOr: Heuristic = (tree) => {
  if (!tree.childrenMatch("(", "S", ")", "A")) {
    return;
  }

  const [_parOpen, left, _parClose, a] = tree!.children as Array<ASTree>;

  if (!a?.childrenMatch("OR", "S", "A")) {
    return;
  }

  const [_or, right, next] = tree!.children as Array<ASTree>;

  return new ASTree({
    kind: "INTERSECTION",
    children: [
      new ASTree({
        kind: "UNION",
        children: [left as ASTree, right as ASTree],
      }),
      next as ASTree,
    ],
  });
};

//S -> Lit A
//A -> S A
//A -> or S A
//A -> Lambda
export const implicitIntersection: Heuristic = (tree) => {
  debug("implicitIntersection");
  let current = tree;

  const literals: Array<ASTree> = [];
  const nexts: Array<ASTree> = [];
  while (true) {
    if (!current.childrenMatch("LITERAL", "A")) {
      debug("skipping1");
      break;
    }

    const [literal, a] = current!.children as Array<ASTree>;
    literals.push(literal as ASTree);

    if (a?.childrenMatch("S", "A")) {
      console.log("S A");
      const [nextCurrent, next] = a!.children as Array<ASTree>;
      current = nextCurrent;
      nexts.unshift(next);
      continue;
    }

    // the left hand side of a union
    if (a?.childrenMatch("OR", "S", "A")) {
      console.log("OR S A");
      const [_or, right, next] = a!.children as Array<ASTree>;
      nexts.unshift(next);

      const left = new ASTree({
        kind: "INTERSECTION",
        children: literals,
      });

      return new ASTree({
        kind: "INTERSECTION",
        children: [
          new ASTree({
            kind: "UNION",
            children: [left, right as ASTree],
          }),
          ...nexts.filter((node) => !node?.isLambda()),
        ],
      });
    }

    // a regular implicit intersection
    // (might be the right hand side of an union)
    if (a?.childrenMatch("LAMBDA")) {
      const left = new ASTree({
        kind: "INTERSECTION",
        children: literals,
      });

      return new ASTree({
        kind: "INTERSECTION",
        children: [left, ...nexts.filter((node) => !node?.isLambda())],
      });
    }

    // by default we intersect with things to the right
    // S -> Lit A
    const left = new ASTree({
      kind: "INTERSECTION",
      children: literals,
    });

    return new ASTree({
      kind: "INTERSECTION",
      children: [left, ...nexts.filter((node) => !node?.isLambda())],
    });
  }
  debug("skipping 2");
  return;
};

//export const intersectionOfLambda: Heuristic = (tree) => {
//debug("intersection(...any, lambda) => intersection(...any)");
//if (tree.isIntersection() && tree.childrenLength() >= 2) {
//const lambda = tree.popChildIf((child) => child.isLambda());
//if (lambda) {
//return toAST(tree);
//}
//}
//debug("skipping");
//return;
//};

//export const intersectionOftrivialIntersection: Heuristic = (tree) => {
//debug("intersection(intersection(any)) => intersection(any)");
//if (tree.isIntersection() && tree.childrenLength() === 1) {
//const intersection = tree.popChildIf((child) => child.isIntersection());
//if (intersection) {
//tree.children = intersection.children;
//return toAST(tree);
//}
//}
//debug("skipping");
//return;
//};

//export const intersectionOfNestedLambda: Heuristic = (tree) => {
//debug(
//"intersection(lit_1, ..., lit_n, intersection(any, lamda)) => intersection(lit_1, ..., lit_n, any)"
//);
//if (tree.isIntersection() && tree.childrenLength() >= 2) {
//const intersection = tree.popChildIf(
//(child) =>
//child.isIntersection() &&
//child.isChildAt(1, (child) => child.isLambda())
//);
//if (intersection) {
//tree.children = [...(tree.children || []), intersection.getChild(0)];
//return toAST(tree);
//}
//}
//debug("skipping");
//return;
//};

//export const intersectionOfNestedTerminal: Heuristic = (tree) => {
//debug(
//"intersection(lit_1, ..., lit_n, intersection(lit_n+1, any)) => intersection(lit_1, ..., lit_n, lit_n+1, any)"
//);
//if (tree.isIntersection() && tree.childrenLength() >= 2) {
//// Should be last
//const intersection = tree.popChildIf(
//(child) => child.isIntersection() && child.childrenLength() >= 2
//);
//if (intersection) {
//tree.children = [
//...(tree.children || []),
//...(intersection.children as Array<ASTree>),
//];
//return toAST(tree);
//}
//}
//debug("skipping");
//return;
//};

//export const intersectionOfUnion: Heuristic = (tree) => {
//debug("intersection(...children, union(any))");
//if (tree.isIntersection() && tree.childrenLength() >= 2) {
//const union = tree.popChildIf((child) => child.isUnion());
//if (union) {
//return toAST(
//new ASTree({
//kind: "UNION",
//children: [tree, union.getChild(0)],
//})
//);
//}
//}
//debug("skipping");
//return;
//};

//export const intersectionOfStar: Heuristic = (tree) => {
//debug(
//"intersection(lit_1, ..., lit_n-1, lit_n, star(next)) => intersection(lit_1, ..., lit_n-1, star(lit_n), next)"
//);
//if (tree.isIntersection() && tree.childrenLength() >= 2) {
//const star = tree.popChildIf(
//(child) => child.isStar() && !child.getAttr("done")
//);
//if (star) {
//const lastChild = tree.popChild();
//if (!lastChild) {
//throw new Error(
//`star: incorrect tree ${JSON.stringify(tree, null, 2)}`
//);
//}

//tree.children = [
//...(tree.children || []),
//new ASTree({
//kind: "STAR",
//children: [lastChild],
//attributes: {
//done: true,
//},
//}),
//...(star.children || []).filter((child) => !child?.isLambda()),
//];

//return toAST(tree);
//}
//}
//debug("skipping");
//return;
//};
