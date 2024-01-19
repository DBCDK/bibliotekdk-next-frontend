/**
 * @file Turns primitive list to DropdownInputArray
 */
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import uniqWith from "lodash/uniqWith";

function convertSingleToDropdownInput({
  item,
  formType,
  overrideValueAs,
  indexName,
}) {
  const key = item?.code || item?.key;
  const name = item?.display || item?.term;

  return {
    key: key,
    name: name,
    value: !overrideValueAs || overrideValueAs === "key" ? key : name,
    formType: formType,
    indexName: indexName,
  };
}

export function uniqueDropdownInput(items) {
  return uniqWith(items, (a, b) => a.key === b.key);
}

/** @typedef {Array.<{value?: Object.<any>, key?: string, name?: string, formType: FormType }>} DropdownInputArray */
/** @typedef {Array.<{display: string, code: string}>} DisplayCodeArray */
/** @typedef {Array.<{term: string, key: string}>} TermKeyArray */

/**
 * @template {DisplayCodeArray|TermKeyArray} T
 * @param {Array.<{ items: T, formType: FormTypeEnum }>} elements
 * @param {("key"|"name"|undefined)} overrideValueAs
 * @param indexName
 * @returns {DropdownInputArray}
 */
export function convertToDropdownInput(
  { elements, overrideValueAs },
  indexName
) {
  return uniqueDropdownInput(
    elements
      .filter((element) => element.items.length > 0)
      .flatMap((element, index, array) => {
        const formType = element.formType;
        const items = element.items;

        const res = uniqueDropdownInput(
          items.map((item) =>
            convertSingleToDropdownInput({
              item: item,
              formType: formType,
              overrideValueAs: overrideValueAs,
              indexName: indexName,
            })
          )
        );

        const divider =
          array?.length - 1 > index ? [{ formType: FormTypeEnum.DIVIDER }] : [];

        return [...res, ...divider];
      })
  );
}
