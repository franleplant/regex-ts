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
    //TODO probably I do not need to check this length now that
    // im using safer wrappers
    if (tree.children.length >= 2) {
      console.log(
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

    if (tree.children.length >= 2) {
      console.log(
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
