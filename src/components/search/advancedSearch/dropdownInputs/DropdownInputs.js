import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import styles from "./DropdownInputs.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
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
      <Text type="text3">{indexTitle}</Text>
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
        <div className={styles.dropdownTitle}>
          <Text type="text1">
            {Translate({ context: "search", label: "narrow-search-more" })}
          </Text>
          <Text type="text3" className={styles.subTitle}>
            {Translate({
              context: "search",
              label: "adjusted-after-material-type",
            })}
          </Text>
        </div>

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
    </>
  );
}
