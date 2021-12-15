import Dropdown from "react-bootstrap/Dropdown";

import useFilters from "@/components/hooks/useFilters";

import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Tag from "@/components/base/forms/tag";
import Translate from "@/components/base/translate";

import { cyKey } from "@/utils/trim";

import styles from "./Select.module.css";

export function Desktop({ options = [], onSelect, selected }) {
  return (
    <Dropdown className={styles.dropdownwrap}>
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
 * @param onOptionClicked
 * @param selectedMaterial
 * @return {JSX.Element}
 * @constructor
 */
export function Mobile({
  options = [],
  onSelect,
  selected,
  count,
  onFilterClick,
}) {
  // Number of selected filters (in query)
  count = count.toString();

  return (
    <div className={styles.materials}>
      <Link
        className={styles.link}
        onClick={() => onFilterClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onFiltersClick();
          }
        }}
        border={false}
      >
        <Icon src="settings.svg" size={2} />
        <Link
          onClick={(e) => e.preventDefault()}
          border={{ bottom: { keepVisible: true } }}
        >
          <Text type="text3">
            {Translate({
              context: "search",
              label: count === "0" ? "filters" : "filtersCount",
              vars: count === "0" ? null : [count],
            })}
          </Text>
        </Link>
      </Link>
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
 * @param options
 * @param onOptionClicked
 * @param selectedMaterial
 * @return {JSX.Element}
 * @constructor
 */
function Wrap({ children }) {
  const { setQuery, getQuery, workTypes, getCount } = useFilters();

  const { workType } = getQuery();

  const selected = workType[0] || "all";

  return React.cloneElement(children, {
    options: ["all", ...workTypes],
    onSelect: (elem) => {
      const param = elem === "all" ? {} : { workType: [elem] };
      setQuery({ include: param });
    },
    selected,
    count: getCount(["workType"]),
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
