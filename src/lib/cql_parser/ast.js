"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompOpArray =
  exports.BoolOpEnum =
  exports.SwitchDoubleQuoteState =
  exports.DoubleQuoteState =
  exports.TypeEnum =
    void 0;
var TypeEnum;
(function (TypeEnum) {
  TypeEnum["CqlQuery"] = "CQL_QUERY";
  TypeEnum["ScopedClause"] = "SCOPED_CLAUSE";
  TypeEnum["BoolOpClause"] = "BOOL_OP";
  TypeEnum["SearchClause"] = "SEARCH_CLAUSE";
  TypeEnum["ParenthesisLeft"] = "PARENTHESIS_LEFT";
  TypeEnum["ParenthesisRight"] = "PARENTHESIS_RIGHT";
  TypeEnum["Index"] = "INDEX";
  TypeEnum["CompOpClause"] = "COMP_OP";
  TypeEnum["Term"] = "TERM";
  TypeEnum["Eof"] = "EOF";
})(TypeEnum || (exports.TypeEnum = TypeEnum = {}));
var DoubleQuoteState;
(function (DoubleQuoteState) {
  DoubleQuoteState[(DoubleQuoteState["CLOSED"] = 0)] = "CLOSED";
  DoubleQuoteState[(DoubleQuoteState["OPEN"] = 1)] = "OPEN";
})(DoubleQuoteState || (exports.DoubleQuoteState = DoubleQuoteState = {}));
function SwitchDoubleQuoteState(state) {
  return state === DoubleQuoteState.CLOSED
    ? DoubleQuoteState.OPEN
    : DoubleQuoteState.CLOSED;
}
exports.SwitchDoubleQuoteState = SwitchDoubleQuoteState;
// BOOL_OP
var BoolOpEnum;
(function (BoolOpEnum) {
  BoolOpEnum["AND"] = "AND";
  BoolOpEnum["OR"] = "OR";
  BoolOpEnum["NOT"] = "NOT";
})(BoolOpEnum || (exports.BoolOpEnum = BoolOpEnum = {}));
// COMP_OP
exports.CompOpArray = ["=", ">", "<", ">=", "<=", "WITHIN"];
//# sourceMappingURL=ast.js.map
