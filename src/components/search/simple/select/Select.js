import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import cx from "classnames";

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

export function Desktop({ options = [], onSelect, selected, className }) {
  return (
    <Dropdown className={`${styles.dropdownwrap} ${className}`}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
          {Translate({
            context: selected === "all" ? "general" : "facets",
            label: selected === "all" ? selected : `label-${selected}`,
          })}
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
          return (
            <Dropdown.Item
              tabIndex="-1"
              data-cy={`item-${elem}`}
              key={`materialdropdown-${elem}`}
              className={cx(styles.dropdownitem, {
                [styles.selectedItem]: selected === elem,
              })}
              onClick={() => {
                onSelect(elem);
              }}
            >
              <Text tag="span" type="text3">
                {Translate({
                  context: "facets",
                  label: `label-${elem}`,
                })}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

/**
 * Mobile version - @see SearchBar.js
 * @param options
 * @param onSelect
 * @param selected
 * @param count
 * @param className
 * @returns {React.JSX.Element}
 */
export function Mobile({ options = [], onSelect, selected, className }) {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "md";

  return (
    <div className={`${styles.materials} ${className}`}>
      <div>
        {options.map((elem) => {
          const isSelected = selected === elem;
          return (
            <Tag
              key={elem}
              selected={isSelected}
              onClick={() => onSelect(elem)}
            >
              {Translate({
                context: elem === "all" ? "general" : "facets",
                label: elem === "all" ? elem : `label-${elem}`,
              })}
            </Tag>
          );
        })}
      </div>
      {isTablet && <FilterButton className={styles.filterButton} />}{" "}
    </div>
  );
}

/**
 * Show a 'select' list of available material filters.
 *
 * @param children
 * @returns {React.JSX.Element}
 */
function Wrap({ children }) {
  const { filters, setFilters, getQuery, workTypes, getCount } = useFilters();
  const { workTypes: urlWorkTypes } = getQuery();

  const selected =
    urlWorkTypes?.[0] || filters?.workTypes?.[0] || SuggestTypeEnum.ALL;

  return React.cloneElement(children, {
    options: ["all", ...workTypes],
    onSelect: (elem) => {
      const selected =
        elem === "all" ? { workTypes: [null] } : { workTypes: [elem] };

      // Updates selected filter in useFilters
      setFilters({ ...filters, ...selected });
    },
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
