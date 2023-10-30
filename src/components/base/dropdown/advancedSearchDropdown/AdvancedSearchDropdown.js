import styles from "./AdvancedSearchDropdown.module.css";

import Icon from "@/components/base/icon";

import animations from "css/animations";
import Text from "@/components/base/text";
import cx from "classnames";
import Translate from "@/components/base/translate";
import Dropdown from "react-bootstrap/Dropdown";
import { useReducer, useState } from "react";
import List from "@/components/base/forms/list";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";

export const FormTypeEnum = Object.freeze({
  CHECKBOX: "CHECKBOX",
  RADIO_BUTTON: "RADIO_BUTTON",
  MORE_OPTIONS: "MORE_OPTIONS",
});

function ListItem({ item }) {
  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Checkbox
        checked={item?.isChecked}
        ariaLabel={Translate({
          context: "facets",
          label: "checkbox-aria-label",
          vars: [item?.itemName],
        })}
        readOnly
        tabIndex="-1"
      />
      <Text
        skeleton={false}
        type="text3"
        className={cx(
          animations["h-border-bottom"],
          animations["h-color-blue"]
        )}
        tabIndex="-1"
      >
        {item?.itemName}
      </Text>
    </div>
  );
}

function toggleMenuItem(menuItem) {
  return {
    ...menuItem,
    ...(menuItem?.formType === FormTypeEnum.CHECKBOX && {
      isChecked:
        typeof menuItem?.isChecked !== "boolean" ? false : !menuItem?.isChecked,
    }),
  };
}

export default function AdvancedSearchDropdown({ indexName, menuItems = [] }) {
  menuItems = menuItems.map(toggleMenuItem);

  const [expandMenu, setExpandMenu] = useState(false);
  const [checkboxItems, toggleCheckboxItem] = useReducer(
    (currentMenuItems, itemUpdate) => {
      const nextMenuItems = currentMenuItems?.map((item) => {
        return itemUpdate.itemName === item.itemName
          ? toggleMenuItem(item)
          : item;
      });

      menuItems = nextMenuItems;

      return nextMenuItems;
    },
    menuItems.filter((menuItem) => menuItem.formType === FormTypeEnum.CHECKBOX),
    undefined
  );

  return (
    <>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        onClick={() => setExpandMenu((prev) => !prev)}
        className={cx(
          animations["on-hover"],
          animations["on-focus"],
          styles.menuButton
        )}
        aria-expanded={expandMenu}
      >
        <Text tag="div" type="text3" dataCy="menu-title">
          {indexName}
        </Text>
        <span className={styles.chevron}>
          <Icon
            size={{ w: 2, h: 2 }}
            src={"arrowUp.svg"}
            className={cx(
              styles.icon,
              animations["h-elastic"],
              animations["f-elastic"],
              {
                [styles.icon_open]: expandMenu,
              }
            )}
            alt=""
          />
        </span>
      </Dropdown.Toggle>
      <div hidden={!expandMenu}>
        <List.Group
          label={Translate({ context: "facets", label: "terms-group-label" })}
          enabled={true}
          data-cy="list-terms"
          disableGroupOutline={false}
        >
          {checkboxItems.map((item) => {
            return (
              <List.Select
                key={item.itemName}
                // onSelect={() => setIsChecked((prev) => !prev)}
                onSelect={() => toggleCheckboxItem(item)}
                label={item.itemName}
              >
                <ListItem key={item.itemName} item={item} />
              </List.Select>
            );
          })}
        </List.Group>
      </div>
    </>
  );
}
