import ASTree from "../ASTree";

export default function toAST(tree: ASTree): ASTree {
  console.log("toAST. input", JSON.stringify(tree));
  if (!tree.children || tree.children.length === 0) {
    return tree;
  }

  //if (tree.kind === "ROOT") {
  //tree.children = tree.children?.map(child => toAST(child as ASTree))
  //return tree
  //}

  if (tree.kind === "INTERSECTION") {
    // TODO break this down,
    //TODO create abstractions in ASTree to improve the api
    // of checking children length, children kinds etc etc
    if (tree.children.length >= 2) {
      console.log(
        "intersection(lit_1, ..., lit_n, intersection(any, lamda)) => intersection(lit_1, ..., lit_n, any)",
        JSON.stringify(tree)
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

      console.log("skipping");
    }

    if (tree.children.length >= 2) {
      console.log(
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
      console.log("skipping");
    }

    if (tree.children.length >= 2) {
      console.log("intersection(...children, union(any))");
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
      console.log("skipping");
    }
  }

  if (tree.kind === "UNION") {
    tree.children = tree.children.filter(
      (child) => !(child as ASTree).isLambda()
    );
  }

  tree.children = tree.children.map((child) => toAST(child as ASTree));
  return tree;
}
