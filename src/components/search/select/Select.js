import Dropdown from "react-bootstrap/Dropdown";
import useFilters from "@/components/hooks/useFilters";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Tag from "@/components/base/forms/tag";
import Translate from "@/components/base/translate";
import { cyKey } from "@/utils/trim";
import styles from "./Select.module.css";
import React from "react";
import useQ from "@/components/hooks/useQ";
import { useRouter } from "next/router";

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
              className={styles.dropdownitem}
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
 *
 * @return {JSX.Element}
 * @constructor
 */
export function Mobile({ options = [], onSelect, selected, className }) {
  return (
    <div className={`${styles.materials} ${className}`}>
      {options.map((elem) => {
        const isSelected = selected === elem;

        return (
          <Tag key={elem} selected={isSelected} onClick={() => onSelect(elem)}>
            {Translate({
              context: "facets",
              label: `label-${elem}`,
            })}
          </Tag>
        );
      })}
    </div>
  );
}

/**
 * Show a 'select' list of available material filters.
 *
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
function Wrap({ children }) {
  const { getQuery, workTypes, getCount } = useFilters();
  const { workTypes: workTypes2 } = getQuery();

  const { setQuery } = useQ();

  const selected = workTypes2[0] || "all";

  const router = useRouter();

  return React.cloneElement(children, {
    options: ["all", ...workTypes],
    onSelect: (elem) => {
      const param =
        elem === "all" ? { workTypes: [null] } : { workTypes: [elem] };
      setQuery({
        pathname: router.pathname,
        query: { ...router.query, ...param },
      });
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
