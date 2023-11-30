import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import styles from "./DropdownInputs.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { DebugStateDetails } from "@/components/search/advancedSearch/DebugStateDetails";
import { DropdownReducerEnum } from "@/components/search/advancedSearch/useDropdownSearchIndices";

const advancedSearchDropdownContext = "advanced_search_dropdown";

/**
 *
 * @param {DropdownInputArray} items
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
        indexTitle={indexTitle}
        indexName={indexName}
        indexPlaceholder={indexPlaceholder}
        menuItems={items}
        updateIndex={(menuItemsState) =>
          updateDropdownSearchIndices({
            type: DropdownReducerEnum.UPDATE,
            payload: {
              indexName: indexName,
              menuItemsState: menuItemsState,
            },
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
            console.log("unit", unit);
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
      <DebugStateDetails
        title="Dropdown object for debug"
        state={dropdownSearchIndices}
        openDefault={false}
      />
    </>
  );
}
