import cx from "classnames";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import animations from "@/components/base/animation/animations.module.css";
import { DialogForPublicationYear } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogForPublicationYear/DialogForPublicationYear";
import StatefulDialog from "@/components/base/statefulDialog/StatefulDialog";
import { useEffect, useState } from "react";
import Icon from "@/components/base/icon";
import Dropdown from "react-bootstrap/Dropdown";
import Input from "@/components/base/forms/input";
import { ToggleMenuItemsEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";
import styles from "./HelperComponents.module.css";
import Link from "@/components/base/link";
import { formattersAndComparitors } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";

/** @typedef {("CHECKBOX"|"RADIO_BUTTON"|"RADIO_LINK"|"DIVIDER")} FormType */
export const FormTypeEnum = Object.freeze({
  CHECKBOX: "CHECKBOX",
  RADIO_BUTTON: "RADIO_BUTTON",
  RADIO_LINK: "RADIO_LINK",
  MORE_OPTIONS: "MORE_OPTIONS",
  DIVIDER: "DIVIDER",
  ACTION_LINK: "ACTION_LINK",
  ACTION_LINK_CONTAINER: "ACTION_LINK_CONTAINER",
  DEFAULT: "DEFAULT", //will behave like default dropdown. Can only select one value at a time.
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

export function RadioButtonItem({ item, textType = "text3" }) {
  return (
    <div className={cx(styles.select_wrapper)} tabIndex="-1">
      <Text
        type={textType}
        className={cx(
          styles.upper_first,
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

export function CheckboxItem({ item, onChange = null, textType = "text3" }) {
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
        type={textType}
        className={cx(
          styles.upper_first,
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
  className = "",
  indexName,
  indexPlaceholder,
  TogglerContent = () => (
    <Text tag="div" type="text3" dataCy="menu-title">
      {indexPlaceholder || indexName || ""}
    </Text>
  ),
  iconSrc = "arrowDown.svg",
  iconSimpleAnimations = iconSrc === "chevron_right.svg" &&
    cx(animations["h-elastic"], animations["f-elastic"]),
}) {
  return (
    iconSrc && (
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className={cx(
          animations["on-hover"],
          animations["on-focus"],
          styles.menuButton,
          className
        )}
      >
        <TogglerContent />
        <span className={styles.icon_area}>
          <Icon
            size={{ w: 2, h: 2 }}
            src={iconSrc}
            className={cx(styles.icon, iconSimpleAnimations, {
              [styles.icon_open]: iconSrc === "arrowDown.svg",
            })}
            alt=""
          />
        </span>
      </Dropdown.Toggle>
    )
  );
}

export function YearRange({
  menuItemsState,
  toggleMenuItemsState,
  className,
  placeholder,
}) {
  const yearRangeItems = menuItemsState.filter(
    (item) => item.formType === FormTypeEnum.ACTION_LINK_CONTAINER
  );

  if (!(yearRangeItems.length > 0)) {
    return null;
  }

  const yearRangeItem = yearRangeItems?.[0];

  return (
    <div className={className}>
      <div>
        {Translate({
          context: "advanced_search_dropdown",
          label: "from_range",
        })}
        <Input
          type="text"
          dataCy="advanced-search-from-range"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles.single_range}
          placeholder={placeholder}
          value={yearRangeItem?.value?.lower}
          onChange={(e) =>
            toggleMenuItemsState({
              type: ToggleMenuItemsEnum.UPDATE,
              payload: {
                ...yearRangeItem,
                value: {
                  lower: e?.target?.value,
                  upper: yearRangeItem?.value?.upper,
                },
              },
            })
          }
        />
      </div>
      <div className={styles.dash}>{" \u2013 "}</div>
      <div>
        {Translate({ context: "advanced_search_dropdown", label: "to_range" })}
        <Input
          type="text"
          dataCy="advanced-search-to-range"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles.single_range}
          placeholder={placeholder}
          value={yearRangeItem?.value?.upper}
          onChange={(e) =>
            toggleMenuItemsState({
              type: ToggleMenuItemsEnum.UPDATE,
              payload: {
                ...yearRangeItem,
                value: {
                  lower: yearRangeItem?.value?.lower,
                  upper: e?.target?.value,
                },
              },
            })
          }
        />
      </div>
    </div>
  );
}

export function TogglerContent({
  menuItemsState,
  indexName,
  indexPlaceholder,
}) {
  const { getSelectedPresentation } = formattersAndComparitors(indexName);

  const selectedItems = menuItemsState.filter((item) => item.isSelected);

  const menuItemsFormType = menuItemsState.map((item) => item.formType);

  if (selectedItems.length > 0) {
    if (menuItemsFormType.includes(FormTypeEnum.ACTION_LINK_CONTAINER)) {
      // If we have ACTION_LINK_CONTAINER, we show only this
      return (
        <Text tag="span" className={styles.toggler_content}>
          <Text
            tag="span"
            type="text4"
            className={styles.label_count}
            data-cy="advanced-search-dropdown-selected-label"
          >
            {getSelectedPresentation(selectedItems?.[0]?.value)}
          </Text>
        </Text>
      );
    } else {
      // If more than 0 non-ACTION_LINK_CONTIANERs are selected, we show how many
      return (
        <Text tag="span" className={styles.toggler_content}>
          {Translate({ context: "general", label: "chosen" })}
          <Text
            tag="span"
            type="text4"
            className={styles.label_count}
            data-cy={`dropdown-selected-count-${indexName}`}
          >
            {selectedItems.length}
          </Text>
        </Text>
      );
    }
  }
  console.log("indexPlaceholder", indexPlaceholder);
  console.log("indexName", indexName);

  // When nothing is selected, we show the placeholder or indexName
  return (
    <Text
      className={cx(styles.menuButton__text)}
      tag="span"
      type="text3"
      dataCy="menu-title"
    >
      {indexPlaceholder || indexName}
    </Text>
  );
}

// The CSS can't access the backgroundImageUrl in public
//  for both the localhost and the build:next, and build:storybook
//  In other ways that injecting them through the javascript
// TODO: Fix this if we find a solution later
function searchIconInInput() {
  const backgroundImageUrl = `/icons/search_dove.svg`;
  const backgroundSize = "var(--pt2_5)";
  const leftPadding = "var(--pt1_5)";
  const rightPadding = "var(--pt1)";

  return {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: `${backgroundSize}`,
    paddingLeft: `calc(${backgroundSize} + ${leftPadding} + ${rightPadding})`,
    backgroundPosition: `${leftPadding} var(--pt1)`,
    backgroundRepeat: "no-repeat",
  };
}

export function SearchBar({
  id,
  value,
  onChange,
  onKeyDown,
  indexTitle,
  className,
}) {
  return (
    <Input
      id={id}
      dataCy={`dropdown-searchbar-${indexTitle}`}
      value={value}
      className={className}
      style={searchIconInInput()}
      placeholder={Translate({
        context: "advanced_search_dropdown",
        label: "search_dropdown",
        vars: [indexTitle.toLowerCase()],
      })}
      onChange={onChange}
      onKeyDown={onKeyDown}
      overrideValueControl={true}
    />
  );
}

export function ClearBar({ onClick, className }) {
  return (
    <Text className={className} tag="div">
      <Link
        tag="span"
        border={{ bottom: { keepVisible: true } }}
        onClick={onClick}
        dataCy="advanced-search-dropdown-clear"
      >
        {Translate({ context: "general", label: "reset" })}
      </Link>
    </Text>
  );
}
