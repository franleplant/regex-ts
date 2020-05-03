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
      // popChild("INTERSECTION", child => child.childrenLength() === 2)
      // const intersection = tree.getLastChildIf(child => child.isIntersection() && child.getChildIf(1, child => child.isLambda()))
      //if (intersection) {
      //tree.popChild()
      //tree.children = [
      //...tree.children,
      //intersection.getChild(0),
      //]
      //}
      const intersectionIndex = tree.children.length - 1;
      const intersection = tree.children[intersectionIndex];
      if (
        intersection &&
        intersection.kind === "INTERSECTION" &&
        intersection.children?.length === 2 &&
        intersection.children?.[1]?.isLambda()
      ) {
        tree.children = [
          ...tree.children.slice(0, intersectionIndex),
          intersection.children[0],
        ];
        return toAST(tree);
      }
      console.log("skipping");
    }

    if (tree.children.length >= 2) {
      console.log(
        "intersection(lit_1, ..., lit_n, intersection(lit_n+1, any)) => intersection(lit_1, ..., lit_n, lit_n+1, any)"
      );
      /*
        const intersection = tree.getLastChildIf(
            child => child.isIntersection() && child.childrenLen() >= 2
        )
        if (intersection) {
          tree.children.pop()
          tree.children = [
              ...tree.children,
            ...(intersection.children as Array<ASTree>),
          ]
          return toAST(tree)
        }
       */
      // Should be last
      const intersectionIndex = tree.children.length - 1;
      const intersection = tree.children[intersectionIndex];
      if (
        intersection &&
        intersection.kind === "INTERSECTION" &&
        (intersection.children?.length || 0) >= 2
      ) {
        console.log(
          "child intersection",
          JSON.stringify(intersection, null, 2)
        );
        tree.children = [
          ...tree.children.slice(0, intersectionIndex),
          ...(intersection.children as Array<ASTree>),
        ];
        return toAST(tree);
      }
      console.log("skipping");
    }

    if (tree.children.length >= 2) {
      /*
      const union = tree.getLastChildIf(child => child.isUnion())
      if (union) {
        tree.children.pop()
        return toAST(
          new ASTree({
            kind: "UNION",
            children: [tree, union.getChild(0)],
          })
        );
      }

      */
      console.log("intersection(...children, union(any))");
      // Should be the last
      const unionIndex = tree.children.length - 1;
      if (tree.children[unionIndex]?.kind === "UNION") {
        const union = tree.children.pop() as ASTree;
        return toAST(
          new ASTree({
            kind: "UNION",
            children: [tree, union.children?.[0]],
          })
        );
      }
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
