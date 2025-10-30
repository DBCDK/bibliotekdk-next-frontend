"use client";

import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import useFilters from "@/components/hooks/useFilters";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Tag from "@/components/base/forms/tag";
import Translate from "@/components/base/translate";
import { cyKey } from "@/utils/trim";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import FilterButton from "../../filterButton";

import styles from "./Select.module.css";
import { SuggestTypeEnum } from "@/lib/enums";

/** Fælles label-helper */
function labelFor(value) {
  const isAll = value === "all";
  return Translate({
    context: isAll ? "general" : "facets",
    label: isAll ? "all" : `label-${value}`,
  });
}

/** Desktop */
export const Desktop = memo(function Desktop({
  options = [],
  onSelect,
  selected,
  className = "",
}) {
  return (
    <Dropdown className={`${styles.dropdownwrap} ${className}`}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
          {labelFor(selected)}
          <Icon
            size={{ w: 1, h: 1 }}
            src="arrowrightblue.svg"
            className={styles.dropdownicon}
            alt=""
          />
        </Text>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownmenu}>
        {options.map((elem) => {
          const isSelected = selected === elem;
          return (
            <Dropdown.Item
              tabIndex="-1"
              data-cy={`item-${elem}`}
              key={`materialdropdown-${elem}`}
              className={`${styles.dropdownitem} ${
                isSelected ? styles.selectedItem : ""
              }`}
              onClick={() => onSelect(elem)}
            >
              <Text tag="span" type="text3">
                {labelFor(elem)}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
});

/** Mobile */
export const Mobile = memo(function Mobile({
  options = [],
  onSelect,
  selected,
  className = "",
}) {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "md";

  return (
    <div className={`${styles.materials} ${className}`}>
      <div>
        {options.map((elem) => (
          <Tag
            key={elem}
            selected={selected === elem}
            onClick={() => onSelect(elem)}
          >
            {labelFor(elem)}
          </Tag>
        ))}
      </div>
      {isTablet && <FilterButton className={styles.filterButton} />}
    </div>
  );
});

/**
 * Wrap
 * - Brug URL-værdien KUN til at initialisere lokalt state (ingen skriv til filters ved mount)
 * - Hold lokalt `selected` i sync med filters.workTypes
 * - Ved brugerinteraktion: opdatér lokalt + bevar øvrige filtre via `{ ...filters, ...next }`
 */
function Wrap({ children }) {
  const { filters, setFilters, getQuery, workTypes, getCount } = useFilters();
  const { workTypes: urlWorkTypes } = getQuery();

  // 1) Initial selected kun fra URL/filters ved mount
  const initialSelected =
    urlWorkTypes?.[0] ?? filters?.workTypes?.[0] ?? SuggestTypeEnum.ALL;

  const [selected, setSelected] = useState(initialSelected);

  // 2) Sync lokalt state når hooken (SWR) har initieret/ændret filters
  useEffect(() => {
    const fromFilters = filters?.workTypes?.[0] ?? SuggestTypeEnum.ALL;
    if (fromFilters !== selected) {
      setSelected(fromFilters);
    }
  }, [filters?.workTypes, selected]);

  // 3) Håndter brugerens valg — bevar alle eksisterende filtre
  const handleSelect = useCallback(
    (elem) => {
      if (elem !== selected) setSelected(elem);

      const next = elem === "all" ? { workTypes: [] } : { workTypes: [elem] };

      // Kritisk: bevar andre filterfelter
      setFilters({ ...filters, ...next });
    },
    [selected, filters, setFilters]
  );

  const options = useMemo(() => ["all", ...(workTypes || [])], [workTypes]);

  return React.cloneElement(children, {
    options,
    onSelect: handleSelect,
    selected,
    count: getCount(["workTypes"]),
  });
}

export function MobileMaterialSelect(props) {
  return (
    <Wrap>
      <Mobile {...props} />
    </Wrap>
  );
}

export function DesktopMaterialSelect(props) {
  return (
    <Wrap>
      <Desktop {...props} />
    </Wrap>
  );
}
