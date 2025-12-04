import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import styles from "./DropdownInputs.module.css";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { DropdownReducerEnum } from "@/components/search/advancedSearch/useDropdownSearchIndices";
import Icon from "@/components/base/icon";

import Tooltip from "@/components/base/tooltip/Tooltip";
import { useEffect, useMemo, useState } from "react";

const advancedSearchDropdownContext = "advanced_search_dropdown";

/**
 *
 * @param {DropdownInputArray} items
 * @param {string} indexName
 * @param {UpdateDropdownSearchIndices} updateDropdownSearchIndices
 * @returns {JSX.Element}
 */
function DropdownUnit({
  items,
  indexName,
  updateDropdownSearchIndices,
  showSearchBar,
  infoBarLabel,
  helpTxtLink,
}) {
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
      {infoBarLabel ? (
        <div className={styles.dropdownTitleContainer}>
          <Tooltip
            placement="right"
            labelToTranslate={infoBarLabel}
            childClassName={styles.tooltip}
            trigger={["hover", "focus"]}
          >
            <Text type="text3">{indexTitle}</Text>
            <Icon
              src="exclamationmark.svg"
              alt="info"
              data-cy="tooltip-icon"
              size="2_5"
              className={styles.tooltipCursor}
            />
          </Tooltip>
        </div>
      ) : (
        <Text type="text3">{indexTitle}</Text>
      )}

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
        showSearchBar={showSearchBar}
        helpTxtLink={helpTxtLink}
      />
    </div>
  );
}
const MAX_VISIBLE_DROPDOWNS = 3;

export default function DropdownInputs() {
  const { dropdownUnits, updateDropdownSearchIndices, workType } =
    useAdvancedSearchContext();
  //true if number of dropdownunits are bigger than MAX_VISIBLE_DROPDOWNS
  const [showAll, setShowAll] = useState(
    dropdownUnits.length <= MAX_VISIBLE_DROPDOWNS
  );
  useEffect(() => {
    setShowAll(dropdownUnits.length <= MAX_VISIBLE_DROPDOWNS);
  }, [workType]);

  //checks if any of the hidden dropdowns has a value
  const hiddenDropdownsHasValues = useMemo(
    () =>
      dropdownUnits
        .slice(MAX_VISIBLE_DROPDOWNS)
        .some((unit) => unit.items.some((item) => item.isSelected)),
    [dropdownUnits]
  );

  //show all dropdowns if any of the hidden dropdowns has a value or if showAll is true
  const showAllDropdowns = showAll || hiddenDropdownsHasValues;
  const dropdownUnitsToRender = showAllDropdowns
    ? dropdownUnits
    : dropdownUnits.slice(0, MAX_VISIBLE_DROPDOWNS);

  return (
    <>
      <div className={styles.dropdown_inputs_wrapper}>
        <div className={styles.flex_wrapper}>
          {dropdownUnitsToRender.map((unit) => {
            return (
              <DropdownUnit
                key={unit.indexName}
                items={unit.items}
                indexName={unit.indexName}
                updateDropdownSearchIndices={updateDropdownSearchIndices}
                showSearchBar={unit?.showSearchBar !== false}
                infoBarLabel={unit.infoBarLabel}
                helpTxtLink={unit.helpTxtLink}
              />
            );
          })}
          {!showAllDropdowns && (
            <div className={styles.showMoreButtonContainer}>
              <Text
                dataCy="advanced-search-dropdowns-show-more"
                type="text3"
                className={styles.showMoreButton}
                onClick={() => {
                  setShowAll(true);
                }}
              >
                <Link border={{ bottom: { keepVisible: true } }}>
                  {Translate({
                    context: advancedSearchDropdownContext,
                    label: "more_filters",
                  })}
                </Link>
                <Icon src="settings.svg" size={2} />
              </Text>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
