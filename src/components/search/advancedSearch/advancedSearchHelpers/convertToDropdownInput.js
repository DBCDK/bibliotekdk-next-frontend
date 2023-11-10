/**
 * @file Turns primitive list to DropdownInputArray
 */
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

export function convertSingleToDropdownInput(item, formType, overrideValueAs) {
  const key = item?.code || item?.key;
  const name = item?.display || item?.term;

  return {
    key: key,
    name: name,
    value: !overrideValueAs || overrideValueAs === "key" ? key : name,
    formType: formType,
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
 * @param {T} prioritisedItems
 * @param prioritisedFormType
 * @param {T} unprioritisedItems
 * @param unprioritisedFormType
 * @param {("key"|"name")} overrideValueAs
 * @returns {DropdownInputArray}
 */
export function convertToDropdownInput({
  prioritisedItems,
  prioritisedFormType,
  unprioritisedItems,
  unprioritisedFormType,
  overrideValueAs,
}) {
  const convertedPrioritisedItems = uniqueDropdownInput(
    prioritisedItems.map((item) =>
      convertSingleToDropdownInput(item, prioritisedFormType, overrideValueAs)
    )
  );
  const convertedUnprioritisedItems = uniqueDropdownInput(
    unprioritisedItems.map((item) =>
      convertSingleToDropdownInput(item, unprioritisedFormType, overrideValueAs)
    )
  ).filter(
    (item) =>
      !convertedPrioritisedItems.some((priItem) => isEqual(priItem, item))
  );

  return [
    ...convertedPrioritisedItems,
    ...(convertedUnprioritisedItems.length > 0 && [
      {
        formType: FormTypeEnum.DIVIDER,
      },
    ]),
    ...convertedUnprioritisedItems,
  ];
}
