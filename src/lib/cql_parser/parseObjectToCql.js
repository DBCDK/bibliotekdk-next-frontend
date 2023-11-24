"use strict";
const ast_1 = require("./ast");
module.exports = function parseObjectToCql(obj) {
  switch (obj.type) {
    case ast_1.TypeEnum.Term:
      return `${obj.value}`;
    case ast_1.TypeEnum.SearchClause:
      if ("left" in obj && "right" in obj) {
        const leftParens = obj.left.type === ast_1.TypeEnum.ParenthesisLeft;
        const rightParens = obj.right.type === ast_1.TypeEnum.ParenthesisRight;
        if (!leftParens || !rightParens) {
          throw new Error(
            `Search Clause expected parentheses, but left was type ${obj.left.type} and right was type ${obj.right.type}`
          );
        }
        return `${obj.left.value}${parseObjectToCql(obj.value)}${
          obj.right.value
        }`;
      } else if ("index" in obj && "compOp" in obj && "term" in obj) {
        return `${obj.index.value}${obj.compOp.value}${obj.term.value}`;
      } else {
        throw new Error(
          `search clause did not catch case, and term did not either, error: ${obj}`
        );
      }
    case ast_1.TypeEnum.ScopedClause:
      const leftExpectedType = [
        ast_1.TypeEnum.SearchClause,
        ast_1.TypeEnum.ScopedClause,
      ].includes(obj.left.type);
      const boolOpExpectedType = obj.value.type === ast_1.TypeEnum.BoolOpClause;
      const rightExpectedType = obj.right.type === ast_1.TypeEnum.SearchClause;
      if (!leftExpectedType || !boolOpExpectedType || !rightExpectedType) {
        throw new Error(`Scoped clause all to be right:
              - expected left to be SearchClause but was ${obj.left.type}
              - expected boolOp to be BoolOpClause but was ${obj.value.type}
              - expected right to be ScopedClause or SearchClause but was ${obj.right.type}
          `);
      }
      return `${parseObjectToCql(obj.left)} ${
        obj.value.value
      } ${parseObjectToCql(obj.right)}`;
  }
};
//# sourceMappingURL=parseObjectToCql.js.map
