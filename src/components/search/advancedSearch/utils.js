import isEmpty from "lodash/isEmpty";
import { LogicalOperatorsEnum } from "@/components/search/enums";

export function convertStateToCql({ inputFields, dropdownSearchIndices } = {}) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return "";
  }

  const inputFieldsQuery = inputFields
    .filter((item) => !isEmpty(item.value) && !isEmpty(item.searchIndex))
    .map((item) => {
      const prefix = !isEmpty(item.prefixLogicalOperator)
        ? [item.prefixLogicalOperator]
        : [];
      const searchIndexWithValue = `${item.searchIndex}="${item.value}"`;

      // We spread prefix, in case it is empty, and ensure no weird spaces
      return [...prefix, searchIndexWithValue].join(" ");
    });

  // TODO: Ensure that we want AND between dropdown items for each index
  const AND = LogicalOperatorsEnum.AND;

  const dropdownQuery = dropdownSearchIndices
    .filter((searchIndex) => !isEmpty(searchIndex.value))
    .map((searchIndex) => {
      // Each dropdownSearchIndex needs to be joined together.
      //  For now we use AND with a variable
      return searchIndex.value
        .map((singleValue) => `${searchIndex.searchIndex}="${singleValue}"`)
        .join(` ${AND} `);
    })
    // Items are wrapped inside parenthesis to ensure precedence
    .map((item) => `(${item})`)
    .join(" AND ");

  return (
    "(" +
    [
      ...(!isEmpty(inputFieldsQuery) ? [inputFieldsQuery.join(" ")] : []),
      ...(!isEmpty(dropdownQuery) ? [dropdownQuery] : []),
    ].join(") AND (") +
    ")"
  );
}
