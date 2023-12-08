import isEmpty from "lodash/isEmpty";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { formattersAndComparitors } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";

function getInputFieldsQueryToCql(inputFields) {
  return inputFields
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
}

function getDropdownQuery(dropdownSearchIndices) {
  const OR = LogicalOperatorsEnum.OR;
  const AND = LogicalOperatorsEnum.AND;

  return (
    dropdownSearchIndices
      ?.filter((searchIndex) => !isEmpty(searchIndex.value))
      .map((searchIndex) => {
        const { getComparator, getFormatValue } = formattersAndComparitors(
          searchIndex.searchIndex
        );

        // Each dropdownSearchIndex needs to be joined together.
        //  For now we use AND with a variable
        return searchIndex.value
          .map((singleValue) => {
            return `${searchIndex.searchIndex}${getComparator?.(
              singleValue?.value
            )}"${getFormatValue?.(singleValue?.value)}"`;
          })
          .join(` ${OR} `);
      })
      // Items are wrapped inside parenthesis to ensure precedence
      .map((item) => `(${item})`)
      .join(` ${AND} `)
  );
}

export function convertStateToCql({ inputFields, dropdownSearchIndices } = {}) {
  if (!Array.isArray(inputFields) || inputFields.length === 0) {
    return "";
  }

  const inputFieldsQuery = getInputFieldsQueryToCql(inputFields);
  const dropdownQuery = getDropdownQuery(dropdownSearchIndices);

  const AND = LogicalOperatorsEnum.AND;

  const result = [
    ...(!isEmpty(inputFieldsQuery) ? [inputFieldsQuery.join(" ")] : []),
    ...(!isEmpty(dropdownQuery) ? [dropdownQuery] : []),
  ].join(`) ${AND} (`);

  return !isEmpty(result) ? "(" + result + ")" : "";
}

function typeToFieldindex(type) {
  switch (type) {
    case "creator":
      return "term.creatorcontributor";
    case "subject":
      return "term.subject";
    default:
      return "term.function";
  }
}

export function getAdvancedUrl({ type, value }) {
  const inputField = {
    value: value,
    prefixLogicalOperator: null,
    searchIndex: typeToFieldindex(type),
  };

  const urlObject = {
    inputFields: [inputField],
    dropdownSearchIndices: [
      { searchIndex: "phrase.mainlanguage", value: [] },
      { searchIndex: "phrase.generalmaterialtype", value: [] },
    ],
  };

  return encodeURI(`/avanceret?fieldSearch=${JSON.stringify(urlObject)}`);
}
