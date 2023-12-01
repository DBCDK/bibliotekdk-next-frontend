import React, { useState } from "react";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import styles from "./AdvancedSearchHistory.module.css";
import Text from "@/components/base/text";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { FormatFieldSearchIndexes } from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";

function HistoryItem({ item, index, checked, onSelect }) {
  return (
    <div className={styles.row}>
      <Checkbox
        id={`select-item-${index}`}
        // ariaLabelledBy={`material-title-${materialId}`}
        tabIndex="-1"
        onChange={(e) => {
          console.log(e, typeof e, "EEEEEEEEEEEEEEEE");
          onSelect(item, e);
        }}
        checked={checked}
        className={styles.item}
        ariaLabelledBy={`select-item-${index}`}
        ariaLabel={`select-item-${index}`}
      />
      <Text type="text3" className={styles.item}>
        {item.timestamp}
      </Text>
      <div>
        <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
      </div>
      <Text type="text3" className={styles.item}>
        {item.hitcount}
      </Text>
    </div>
  );
}

function HistoryHeaderActions({ setAllChecked, deleteSelected }) {
  return (
    <div className={styles.header}>
      <Checkbox
        ariaLabelledBy={`selectall`}
        ariaLabel={`check-select-all`}
        tabIndex="-1"
        onChange={setAllChecked}
        id="selectall"
      />
      <label htmlFor="selectall">Vælg alle</label>
      <div onClick={deleteSelected}>Fjern valgte</div>
    </div>
  );
}

function HistoryHeader() {
  return (
    <div className={styles.header}>
      <div>&nbsp;</div>
      <Text type="text3" className={styles.item}>
        {/*{@TODO translations}*/}
        Tid
      </Text>
      <Text type="text3" className={styles.item}>
        Søgning
      </Text>
      <Text type="text3" className={styles.item}>
        Resultater
      </Text>
    </div>
  );
}

export function AdvancedSearchHistory() {
  const { storedValue, deleteValue } = useAdvancedSearchHistory();
  const [checkboxList, setCheckboxList] = useState([]);
  /**
   * Set or unset ALL checkboxes in search history
   * @param e
   *  if the checkbox is selected or not
   */
  const setAllChecked = (e) => {
    if (e) {
      // full list
      setCheckboxList(storedValue.map((stored) => stored.cql));
    } else {
      // empty list
      setCheckboxList([]);
    }
  };

  /**
   * Delete selected entries in search history
   */
  const onDeleteSelected = () => {
    checkboxList.forEach((check) => {
      const historyItem = storedValue.find((stored) => stored.cql === check);
      historyItem && deleteValue(historyItem);
    });
  };

  /**
   * Add/remove item in list when selected/deselected
   * * @param item
   * @param selected
   *  The checkbox component (components/base/forms/checkbox) returns if it has been
   *  selected or not
   */
  const onSelect = (item, selected = false) => {
    // if select is FALSE it has been deselected on gui
    const newCheckList = checkboxList;
    // if item is already in checkboxlist -> remove
    const checkindex = checkboxList.findIndex((check) => check === item.cql);
    if (checkindex !== -1) {
      // item found in list - if deselected remove it
      if (!selected) {
        newCheckList.splice(checkindex, 1);
      }
    }
    // if not -> add it to list .. if selected
    else if (selected) {
      newCheckList.push(item.cql);
    }
    setCheckboxList(newCheckList);
  };

  return (
    <>
      <HistoryHeaderActions
        deleteSelected={onDeleteSelected}
        setAllChecked={setAllChecked}
      />
      <HistoryHeader />
      {storedValue?.map((item, index) => {
        return (
          <div className={styles.break} key={index}>
            <HistoryItem
              // checkboxList={checkboxList}
              item={item}
              index={index}
              checked={
                checkboxList.findIndex((check) => check === item.cql) !== -1
              }
              deleteSelected={onDeleteSelected}
              onSelect={onSelect}
            />
          </div>
        );
      })}
    </>
  );
}
