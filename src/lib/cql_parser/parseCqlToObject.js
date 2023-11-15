"use strict";
const ast_1 = require("./ast");
/**
 * Q is CqlQuery
 * ScC is ScopedClause
 * BO is BoolOp
 * SeC is SearchClause
 * ST is SearchTerm
 * F is Index1
 * I is Index1
 * CO is CompOp
 * T is Term1

 Grammar:
  Q = ScopedClause
  ScC = ScC BO SeC | SeC
  BO = "AND" | "OR" | "NOT"
  SeC = "(" Q ")" | I CO T | T
  CO = "=" | ">" | "<" | ">=" | "<="
  T = charString1 | charString2

 **/
// ---
function parseCqlQuery(input) {
  return parseScopedClause(input);
}
function parseScopedClause(input) {
  // If the next input item (currently [0]) is a parenthesis,
  //  we check on current parensDepth
  const parensDepth =
    input?.[0].type === ast_1.TypeEnum.ParenthesisLeft
      ? input?.[0]?.parenthesisCount - 1
      : input?.[0]?.parenthesisCount;
  // If there are BoolOps on the current relative parensDepth,
  //  this finds all of them
  const boolOps = input
    .map((singleInput, index) => {
      return {
        indexInArray: index,
        ...singleInput,
      };
    })
    ?.filter(
      (singleInput) =>
        singleInput.type === ast_1.TypeEnum.BoolOpClause &&
        singleInput.parenthesisCount === parensDepth
    )
    .map((singleInput) => singleInput.indexInArray);
  // The grammar is: ScC BO SeC
  if (boolOps.length > 0) {
    const lastBoolOpIndex = boolOps[boolOps?.length - 1];
    const lastBoolOp = input?.[lastBoolOpIndex];
    if (lastBoolOp.type !== ast_1.TypeEnum.BoolOpClause) {
      throw new Error(
        `not bool op but should be. Type is: ${JSON.stringify(
          lastBoolOp
        )} or ${JSON.stringify(boolOps)}`
      );
    }
    const scopedClause = input.slice(0, lastBoolOpIndex);
    const searchClause = input.slice(lastBoolOpIndex + 1, input.length);
    return {
      type: ast_1.TypeEnum.ScopedClause,
      line: input?.[input.length - 1].line,
      col: input?.[input.length - 1].col,
      parenthesisCount: lastBoolOp.parenthesisCount,
      left: parseScopedClause(scopedClause),
      value: lastBoolOp,
      right: parseSearchClause(searchClause),
    };
  } else if (
    [
      ast_1.TypeEnum.ParenthesisLeft,
      ast_1.TypeEnum.Index,
      ast_1.TypeEnum.Term,
    ].includes(input?.[0]?.type)
  ) {
    return parseSearchClause(input);
  } else {
    throw new Error("cant parse this");
  }
}
function parseSearchClause(input) {
  const el0 = input?.[0];
  const el1 = input?.[1];
  const el2 = input?.[2];
  const elLast = input?.[input.length - 1];
  const maybeFirstParens =
    el0?.type === ast_1.TypeEnum.ParenthesisLeft && el0?.parenthesisCount;
  const maybeLastParens =
    elLast?.type === ast_1.TypeEnum.ParenthesisRight &&
    elLast?.parenthesisCount;
  const firstClosingParens = input?.find(
    (item) =>
      item.type === ast_1.TypeEnum.ParenthesisLeft && el0?.parenthesisCount
  );
  const parensAroundAll = elLast.line === firstClosingParens?.line;
  if (
    maybeFirstParens &&
    maybeLastParens &&
    maybeFirstParens === maybeLastParens &&
    parensAroundAll
  ) {
    if (!elLast || elLast.type !== ast_1.TypeEnum.ParenthesisRight) {
      throw new Error(
        `closing parens of type ${elLast} (should be ${ast_1.TypeEnum.ParenthesisRight}) is either missing or wrong type`
      );
    }
    const nestedQuery = input.slice(1, input?.length - 1);
    return {
      type: ast_1.TypeEnum.SearchClause,
      line: elLast.line,
      col: elLast.col,
      parenthesisCount: elLast.parenthesisCount,
      left: el0,
      value: parseCqlQuery(nestedQuery),
      right: elLast,
    };
  } else if (el0.type === ast_1.TypeEnum.Index && input.length === 3) {
    if (
      !(
        el1.type === ast_1.TypeEnum.CompOpClause &&
        el2.type === ast_1.TypeEnum.Term
      )
    ) {
      throw new Error(
        `Problems here: expected Index on line:${el0.line} col:${el0.col}, to be followed by TypeEnum.CompOpClause then TypeEnum.Term, but was ${el1.type} (line:${el1.line}, col:${el1.col}) and ${el2.type} (line:${el2.line}, col:${el2.col})`
      );
    }
    return {
      type: ast_1.TypeEnum.SearchClause,
      line: el2.line,
      col: el2.col,
      parenthesisCount: el2.parenthesisCount,
      index: el0,
      compOp: el1,
      term: el2,
    };
  } else if (el0.type === ast_1.TypeEnum.Term && input.length === 1) {
    return el0;
  } else {
    throw new Error(
      `not a searchClause ${JSON.stringify(el0)}, input length: ${
        input.length
      }, input: ${input}`
    );
  }
}
module.exports = function parseCqlToObject(input) {
  if (input?.[input.length - 1].type !== ast_1.TypeEnum.Eof) {
    throw new Error("Last element not eof");
  }
  return parseCqlQuery(input.slice(0, input.length - 1));
};
//# sourceMappingURL=parseCqlToObject.js.map
