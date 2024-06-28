import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import { cyKey } from "@/utils/trim";
import styles from "./SimpleDropdown.module.css";
import React from "react";
import cx from "classnames";

export default function SimpleDropdown({
  placeholder = "...",
  options = ["item 1", "item 2"],
  onSelect,
  selected,
  className,
}) {
  return (
    <Dropdown className={cx(styles.dropdownwrap, className)}>
      <Dropdown.Toggle
        data-cy={cyKey({ name: "material-selector", prefix: "header" })}
        variant="success"
        id="dropdown-basic"
        className={styles.dropdowntoggle}
      >
        <Text tag="span" type="text2">
          {selected || placeholder}
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
              key={`item-${elem}`}
              className={cx(styles.dropdownitem, {
                [styles.selectedItem]: selected === elem,
              })}
              onClick={() => {
                onSelect?.(elem);
              }}
            >
              <Text tag="span" type="text2">
                {elem}
              </Text>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
