"use client";

import React, { useMemo, memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Tag from "@/components/base/forms/tag";
import Translate from "@/components/base/translate";
import { cyKey } from "@/utils/trim";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import FilterButton from "../../filterButton";

import styles from "./Select.module.css";

import { workTypes as allowedWorkTypes } from "@/components/hooks/useFilters";

/** Shared label helper */
function labelFor(value) {
  const isAll = value === "all";
  return Translate({
    context: isAll ? "general" : "facets",
    label: isAll ? "all" : `label-${value}`,
  });
}

/** Desktop – pure presentation component */
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
              onClick={() => onSelect?.(elem)}
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

/** Mobile – pure presentation component */
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
            onClick={() => onSelect?.(elem)}
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
 * MobileMaterialSelect – “thin” wrapper that only sets the options list
 * (no useFilters, no global state)
 */
export function MobileMaterialSelect({ className = "", selected, onSelect }) {
  const options = useMemo(() => ["all", ...(allowedWorkTypes || [])], []);

  return (
    <Mobile
      className={className}
      options={options}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

/** DesktopMaterialSelect – same principle */
export function DesktopMaterialSelect({ className = "", selected, onSelect }) {
  const options = useMemo(() => ["all", ...(allowedWorkTypes || [])], []);

  return (
    <Desktop
      className={className}
      options={options}
      selected={selected}
      onSelect={onSelect}
    />
  );
}
