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
// import Link from "@/components/base/link";
// import { SliderDialogForPublicationYear } from "@/components/base/dropdown/advancedSearchDropdown/templatesForAdvancedSearch/TemplatesAdvancedSearch";

export const FormTypeEnum = Object.freeze({
  CHECKBOX: "CHECKBOX",
  RADIO_BUTTON: "RADIO_BUTTON",
  MORE_OPTIONS: "MORE_OPTIONS",
});

function CheckboxItem({ item }) {
  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Checkbox
        id={item?.itemName}
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

function initializeMenuItem(menuItem) {
  return {
    ...menuItem,
    ...(menuItem?.formType === FormTypeEnum.CHECKBOX && {
      isChecked: false,
    }),
  };
}

function toggleMenuItem(menuItem) {
  return {
    ...menuItem,
    ...(menuItem?.formType === FormTypeEnum.CHECKBOX && {
      isChecked: !menuItem?.isChecked,
    }),
  };
}

export default function AdvancedSearchDropdown({ indexName, menuItems = [] }) {
  menuItems = menuItems.map(initializeMenuItem);

  const [expandMenu, setExpandMenu] = useState(false);
  const [menuItemsState, toggleMenuItemsState] = useReducer(
    (currentMenuItems, itemUpdate) => {
      const nextItem = toggleMenuItem(itemUpdate);

      const nextMenuItems = currentMenuItems?.map((currentItem) => {
        return currentItem.itemName === nextItem.itemName
          ? nextItem
          : currentItem.formType === FormTypeEnum.RADIO_BUTTON
          ? initializeMenuItem(currentItem)
          : currentItem;
      });

      menuItems = nextMenuItems;

      return nextMenuItems;
    },
    menuItems,
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
          {menuItemsState.map((item) => {
            if (item?.formType === FormTypeEnum.CHECKBOX) {
              return (
                <List.Select
                  key={item.itemName}
                  onSelect={() => toggleMenuItemsState(item)}
                  label={item.itemName}
                >
                  <CheckboxItem item={item} />
                </List.Select>
              );
            }
            // else if (item?.formType === FormTypeEnum.RADIO_BUTTON) {
            //   return (
            //     <List.Radio
            //       key={item.itemName}
            //       selected={item?.isSelected}
            //       moveItemRightOnFocus={true}
            //       onSelect={() => toggleMenuItemsState(item)}
            //       label={item.itemName}
            //     >
            //       <RadioButtonItem item={item} />
            //     </List.Radio>
            //   );
            // } else if (item?.formType === FormTypeEnum.RADIO_LINK) {
            //   return (
            //     <List.Radio
            //       key={item.itemName}
            //       selected={item?.isSelected}
            //       // moveItemRightOnFocus={true}
            //       onSelect={() => toggleMenuItemsState(item)}
            //       label={item.itemName}
            //     >
            //       <RadioLinkItem item={item} />
            //     </List.Radio>
            //   );
            // } else if (item?.formType === FormTypeEnum.DIVIDER) {
            //   return <hr key={Math.random()} />;
            // }
          })}
        </List.Group>
      </div>
    </>
  );
}
