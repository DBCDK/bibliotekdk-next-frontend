import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import List from "@/components/base/forms/list";
import styles from "./quickFilter.module.css";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import Text from "@/components/base/text/Text";
import React from "react";

/** Ren præsentationskomponent – ingen hooks her */
const QuickFiltersUI = React.memo(function QuickFiltersUI({
  filter,
  selectedValueCql,
  actions,
}) {
  return (
    <div className={styles.groupcontainer}>
      <div className={styles.groupcontent}>
        <List.Group
          label={filter.label}
          className={styles.group}
          disableGroupOutline={true}
        >
          {filter.values.map((value) => {
            const selected = selectedValueCql === value.cql;
            return (
              <List.Radio
                key={value.label}
                selected={selected}
                onSelect={(e) => {
                  if (e) e.preventDefault();
                  actions.addQuickFilter(filter, value, !selected);
                }}
                label={value.label}
                className={styles.radio}
                checkBoxStyle={true}
              >
                <Text type="text3" className={styles.text}>
                  {value.label}
                </Text>
              </List.Radio>
            );
          })}
        </List.Group>
      </div>
    </div>
  );
});

export default function Wrap() {
  const router = useRouter();
  const prevModeRef = useRef();

  const {
    quickFilters,
    selectedQuickFilters,
    addQuickFilter,
    resetQuickFilters,
  } = useQuickFilters();

  // Stabil metode-objekt til UI-laget
  const actions = useMemo(
    () => ({
      addQuickFilter,
      resetQuickFilters,
    }),
    [addQuickFilter, resetQuickFilters]
  );

  // Slå hurtigt op hvilket cql der er valgt pr. searchIndex
  const selectedByIndex = useMemo(() => {
    const map = new Map();
    for (const f of selectedQuickFilters) {
      map.set(f.searchIndex, f.value);
    }
    return map;
  }, [selectedQuickFilters]);

  // Reset når mode ændrer sig (men ikke ved første mount)
  useEffect(() => {
    if (!router.isReady) return;
    const mode = router.query?.mode;

    if (prevModeRef.current === undefined) {
      prevModeRef.current = mode;
      return;
    }
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      resetQuickFilters();
    }
  }, [router.isReady, router.query.mode, resetQuickFilters]);

  return (
    <div className={styles.filterContainer}>
      {quickFilters.map((filter) => (
        <QuickFiltersUI
          key={filter.searchIndex}
          filter={filter}
          selectedValueCql={selectedByIndex.get(filter.searchIndex)}
          actions={actions}
        />
      ))}
    </div>
  );
}
