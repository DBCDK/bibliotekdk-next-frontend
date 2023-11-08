import cx from "classnames";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import animations from "css/animations";
import { DialogForPublicationYear } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogForPublicationYear/DialogForPublicationYear";
import StatefulDialog from "@/components/base/statefulDialog/StatefulDialog";
import { useEffect, useState } from "react";
import Icon from "@/components/base/icon";
import styles from "./HelperComponents.module.css";
import Dropdown from "react-bootstrap/Dropdown";

/** @typedef {("CHECKBOX"|"RADIO_BUTTON"|"RADIO_LINK"|"DIVIDER")} FormType */
export const FormTypeEnum = Object.freeze({
  CHECKBOX: "CHECKBOX",
  RADIO_BUTTON: "RADIO_BUTTON",
  RADIO_LINK: "RADIO_LINK",
  MORE_OPTIONS: "MORE_OPTIONS",
  DIVIDER: "DIVIDER",
});

export function RadioLinkItem({
  item,
  toggleMenuItemsState,
  DialogBox = DialogForPublicationYear,
  titleFormatter = () =>
    `${item?.value?.lower ? "fra " + item?.value.lower + " " : ""}${
      item?.value?.upper ? "til " + item?.value.upper : ""
    }` || item?.name,
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(titleFormatter);
  }, [item?.value?.lower, item?.value?.upper]);

  return (
    <StatefulDialog title={title}>
      <DialogBox items={[item]} toggleMenuItemsState={toggleMenuItemsState} />
    </StatefulDialog>
  );
}

export function RadioButtonItem({ item }) {
  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Text
        type="text3"
        className={cx(
          animations["h-border-bottom"],
          animations["h-color-blue"]
        )}
        tabIndex="-1"
      >
        {item?.name}
      </Text>
    </div>
  );
}

export function CheckboxItem({ item, onChange = null }) {
  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Checkbox
        id={item?.name}
        checked={item?.isSelected}
        ariaLabel={Translate({
          context: "facets",
          label: "checkbox-aria-label",
          vars: [item?.name],
        })}
        readOnly
        {...(onChange && { onChange: onChange })}
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
        {item?.name}
      </Text>
    </div>
  );
}

export function Toggler({
  setExpandMenu,
  expandMenu,
  indexName,
  indexPlaceholder,
  iconSrc = "arrowUp.svg",
  iconSimpleAnimations = iconSrc === "chevron_right.svg" &&
    cx(animations["h-elastic"], animations["f-elastic"]),
}) {
  return (
    iconSrc && (
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
          {indexPlaceholder || indexName}
        </Text>
        <span className={styles.icon_area}>
          <Icon
            size={{ w: 2, h: 2 }}
            src={iconSrc}
            className={cx(styles.icon, iconSimpleAnimations, {
              [iconSrc === "arrowUp.svg" && styles.icon_open]: expandMenu,
            })}
            alt=""
          />
        </span>
      </Dropdown.Toggle>
    )
  );
}
