import {
  dummy__languages,
  dummy__materialTypesSpecific,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";
import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import { convertToDropdownInput } from "@/components/search/advancedSearch/advancedSearchHelpers/convertToDropdownInput";
import styles from "./DropdownInputs.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useReducer, useState } from "react";

const advancedSearchDropdownContext = "advanced_search_dropdown";

function DropdownUnit({
  items,
  indexName,
  placeholderLabel,
  updateDropdownSearchIndices,
  setExpandedItem,
  expandedItem,
}) {
  const indexTitle = Translate({
    context: advancedSearchDropdownContext,
    label: indexName,
  });
  const indexPlaceholder = Translate({
    context: advancedSearchDropdownContext,
    label: placeholderLabel,
  });

  return (
    <div className={styles.dropdown_with_title}>
      <Text type={"text2"}>{indexTitle}</Text>
      <AdvancedSearchDropdown
        indexName={indexName}
        indexPlaceholder={indexPlaceholder}
        menuItems={convertToDropdownInput(items)}
        updateIndex={(menuItemsState) =>
          updateDropdownSearchIndices({
            indexName: indexName,
            menuItemsState: menuItemsState,
          })
        }
        expandedItem={expandedItem}
        setExpandedItem={setExpandedItem}
      />
    </div>
  );
}

const DropdownIndicesEnum = {
  LANGUAGES: "languages",
  MATERIAL_TYPES_SPECIFIC: "materialTypesSpecific",
};

const defaultDropdownIndices = [
  { searchIndex: DropdownIndicesEnum.LANGUAGES, value: [] },
  { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC, value: [] },
];

export default function DropdownInputs({}) {
  const languages = dummy__languages();
  const materialTypesSpecific = dummy__materialTypesSpecific();

  const [dropdownSearchIndices, updateDropdownSearchIndices] = useReducer(
    (prev, current) => {
      return prev?.map((singleDropdownIndex) => {
        if (current.indexName === singleDropdownIndex.searchIndex) {
          return {
            searchIndex: current.indexName,
            value: current.menuItemsState
              .filter((item) => item.isSelected === true)
              .map((item) => item.value),
          };
        } else {
          return singleDropdownIndex;
        }
      });
    },
    defaultDropdownIndices,
    undefined
  );

  const [expandedItem, setExpandedItem] = useState("");

  return (
    <div>
      {/* TODO: Remove when we place this into the code */}
      <div>{JSON.stringify(dropdownSearchIndices)}</div>

      <div className={styles.flex_wrapper}>
        <DropdownUnit
          items={materialTypesSpecific}
          indexName={DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC}
          placeholderLabel={`all_${DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC}`}
          updateDropdownSearchIndices={updateDropdownSearchIndices}
          setExpandedItem={setExpandedItem}
          expandedItem={expandedItem}
        />
        <DropdownUnit
          items={languages}
          indexName={DropdownIndicesEnum.LANGUAGES}
          placeholderLabel={`all_${DropdownIndicesEnum.LANGUAGES}`}
          updateDropdownSearchIndices={updateDropdownSearchIndices}
          setExpandedItem={setExpandedItem}
          expandedItem={expandedItem}
        />
      </div>
    </div>
  );
}
