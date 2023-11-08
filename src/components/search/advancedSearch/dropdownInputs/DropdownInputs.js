import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import { convertToDropdownInput } from "@/components/search/advancedSearch/advancedSearchHelpers/convertToDropdownInput";
import styles from "./DropdownInputs.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { DetailsForDebugState } from "@/components/search/advancedSearch/DetailsForDebugState";

const advancedSearchDropdownContext = "advanced_search_dropdown";

/**
 *
 * @param {Array.<DropdownUnit>} items
 * @param {string} indexName
 * @param {UpdateDropdownSearchIndices} updateDropdownSearchIndices
 * @returns {JSX.Element}
 */
function DropdownUnit({ items, indexName, updateDropdownSearchIndices }) {
  const indexTitle = Translate({
    context: advancedSearchDropdownContext,
    label: indexName,
  });
  const indexPlaceholder = Translate({
    context: advancedSearchDropdownContext,
    label: `all_${indexName}`,
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
      />
    </div>
  );
}

export default function DropdownInputs({}) {
  const { dropdownUnits, dropdownSearchIndices, updateDropdownSearchIndices } =
    useAdvancedSearchContext();

  return (
    <>
      <div className={styles.dropdown_inputs_wrapper}>
        <div className={styles.flex_wrapper}>
          {dropdownUnits.map((unit) => {
            return (
              <DropdownUnit
                key={unit.indexName}
                items={unit.items}
                indexName={unit.indexName}
                updateDropdownSearchIndices={updateDropdownSearchIndices}
              />
            );
          })}
        </div>
      </div>

      {/* TODO: Remove when we place this into the code */}
      <DetailsForDebugState
        title="Dropdown object for debug"
        state={dropdownSearchIndices}
        openDefault={false}
      />
    </>
  );
}
