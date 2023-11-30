import isEmpty from "lodash/isEmpty";
import { LogicalOperatorsEnum } from "@/components/search/enums";

export function convertStateToCql({ inputFields, dropdownSearchIndices } = {}) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return "";
  }

  const inputFieldsQuery = inputFields
    .filter((item) => !isEmpty(item.value) && !isEmpty(item.searchIndex))
    .map((item, index) => {
      //first item should not have a prefixLogicalOperator
      const prefix =
        !isEmpty(item.prefixLogicalOperator) && index !== 0
          ? [item.prefixLogicalOperator]
          : [];
      const searchIndexWithValue = `${
        item.searchIndex
      }="${item.value.replaceAll(`"`, `\\\"`)}"`;

      // We spread prefix, in case it is empty, and ensure no weird spaces
      return [...prefix, searchIndexWithValue].join(" ");
    });

  // TODO: Ensure that we want AND between dropdown items for each index
  const OR = LogicalOperatorsEnum.OR;

  const dropdownQuery = dropdownSearchIndices
    .filter((searchIndex) => !isEmpty(searchIndex.value))
    .map((searchIndex) => {
      // Each dropdownSearchIndex needs to be joined together.
      //  For now we use AND with a variable
      return searchIndex.value
        .map((singleValue) => `${searchIndex.searchIndex}="${singleValue}"`)
        .join(` ${OR} `);
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

/**
 * converts state to a string that is more human readable than cql
 */

export function convertStateToString({
  inputFields,
  dropdownSearchIndices,
} = {}) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return "";
  }

  const inputFieldsQuery = inputFields
    .filter((item) => !isEmpty(item.value) && !isEmpty(item.searchIndex))
    .map((item, index) => {
      //first item should not have a prefixLogicalOperator
      const prefix =
        !isEmpty(item.prefixLogicalOperator) && index !== 0
          ? [item.prefixLogicalOperator]
          : [];
      const searchIndexWithValue = `${
        item.searchIndex
      }="${item.value.replaceAll(`"`, `\\\"`)}"`;

      // We spread prefix, in case it is empty, and ensure no weird spaces
      return [...prefix, searchIndexWithValue].join(" ");
    });

  // TODO: Ensure that we want AND between dropdown items for each index
  const OR = LogicalOperatorsEnum.OR;

  const dropdownQuery = dropdownSearchIndices
    .filter((searchIndex) => !isEmpty(searchIndex.value))
    .map((searchIndex) => {
      // Each dropdownSearchIndex needs to be joined together.
      //  For now we use AND with a variable
      return searchIndex.value
        .map((singleValue) => `${searchIndex.searchIndex}="${singleValue}"`)
        .join(` ${OR} `);
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

export function getAdvancedUrl({ inputField }) {
  const urlObject = {
    inputFields: [inputField],
    dropdownSearchIndices: [
      { searchIndex: "phrase.mainlanguage", value: [] },
      { searchIndex: "phrase.generalmaterialtype", value: [] },
    ],
  };

  return encodeURI(`/avanceret?fieldSearch=${JSON.stringify(urlObject)}`);
}
