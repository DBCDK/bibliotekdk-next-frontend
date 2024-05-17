/**
 * @file
 * Implemented according to this example
 * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html
 */
import PropTypes from "prop-types";

import React, { useCallback, useEffect, useRef } from "react";

import Arrow from "@/components/base/animation/arrow";
import Link from "@/components/base/link";
import styles from "./List.module.css";
import cx from "classnames";
import animations from "@/components/base/animation/animations.module.css";
import { getFirstMatch } from "@/lib/utils";
import Icon from "@/components/base/icon/Icon";

/**
 * A custom Radio Button displayed as a row
 *
 * @param disabled
 * @param {Object} props
 * @param {Array} props.children
 * @param {className} props.string
 * @param {string} props.label the aria label for the radio button
 * @param {function} props.onSelect
 * @param className
 * @param {boolean} props.moveItemRightOnFocus
 * @param {boolean} props.selected
 * @param {function} props._ref
 */
function Radio({
  children,
  disabled,
  onSelect,
  selected,
  _ref,
  className,
  moveItemRightOnFocus,
  checkBoxStyle = false,
  ...props
}) {
  return (
    <div
      data-cy={props["data-cy"]}
      ref={_ref}
      role="radio"
      aria-checked={selected}
      aria-disabled={!!disabled}
      disabled={!!disabled}
      onClick={() => {
        if (!disabled) {
          onSelect();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onSelect && !disabled) {
          onSelect(e);
        }
      }}
      className={cx(styles.row, className, animations["on-focus"], {
        [styles.selected]: selected,
        [styles.disabledrow]: disabled,
      })}
      tabIndex={0}
    >
      <div
        className={cx(styles.dot, {
          [animations["f-translate-right"]]: moveItemRightOnFocus,
        })}
      />
      {/*{checkBoxStyle && <div className={styles.checkmark}>&#10003;</div>}*/}
      {checkBoxStyle && (
        // <div className={styles.checkmark}>
        <Icon className={styles.checkmark} size={2} src="checkmark.svg"></Icon>
        // </div>
      )}
      <div
        className={cx(styles.content, {
          [animations["f-translate-right"]]: moveItemRightOnFocus,
        })}
      >
        {children}
      </div>
    </div>
  );
}

Radio.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  _ref: PropTypes.func,
};

/**
 * A custom Select Button displayed as a row
 *
 * @param disabled
 * @param onDisabled
 * @param labelledBy
 * @param {Object} props
 * @param {Array} props.children
 * @param {className} props.string
 * @param {string} props.label the aria label for the radio button
 * @param {function} props.onSelect
 * @param className
 * @param {JSX} includeArrows
 * @param {boolean} props.selected
 * @param {function} props._ref
 */
function Select({
  children,
  disabled,
  onDisabled,
  label,
  labelledBy,
  onSelect,
  selected,
  _ref,
  className,
  includeArrows,
  ...props
}) {
  return (
    <div
      data-cy={props["data-cy"]}
      ref={_ref}
      role="checkbox"
      aria-labelledby={labelledBy}
      aria-checked={selected}
      aria-disabled={!!disabled}
      disabled={!!disabled}
      onClick={() => {
        if (!disabled) {
          onSelect();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onSelect && !disabled) {
          onSelect(e);
        }
      }}
      className={cx(styles.row, className, animations["on-focus"], {
        [styles.selected]: selected,
        [styles.disabledrow]: disabled,
      })}
    >
      <div
        className={[styles.content, animations["f-translate-right"]].join(" ")}
      >
        {children}
      </div>
      {!disabled ? (
        includeArrows ? (
          <Arrow
            className={`${animations["h-bounce-left"]} ${animations["f-bounce-left"]}`}
          />
        ) : null
      ) : (
        onDisabled
      )}
      <div className={styles.label}>{label}</div>
    </div>
  );
}
Select.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  _ref: PropTypes.func,
};

function FormLink({
  children,
  disabled,
  onDisabled,
  label,
  labelledBy,
  onSelect,
  _ref,
  className,
  includeArrows,
  ...props
}) {
  return (
    <Link
      data-cy={props["data-cy"]}
      linkRef={_ref}
      aria-labelledby={labelledBy}
      aria-disabled={!!disabled}
      disabled={!!disabled}
      data-list-type="link"
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          onSelect();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSelect && !disabled) {
          onSelect(e);
        }
      }}
      className={cx(styles.row, className, animations["on-focus"], {
        [styles.disabledrow]: disabled,
      })}
      border={false}
    >
      <div className={cx(styles.content, animations["f-translate-right"])}>
        {children}
      </div>
      {!disabled ? (
        includeArrows ? (
          <Arrow
            className={`${animations["h-bounce-left"]} ${animations["f-bounce-left"]}`}
          />
        ) : null
      ) : (
        onDisabled
      )}
      <div className={styles.label}>{label}</div>
    </Link>
  );
}
FormLink.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  onSelect: PropTypes.func,
  _ref: PropTypes.func,
};

function Divider({ _ref }) {
  return (
    <hr
      ref={_ref}
      tabIndex="-1"
      data-list-type="divider"
      className={styles.divider}
    />
  );
}

function tabableItems(childrenRef) {
  // tabableList is a list of true/false where false represents the List.Divider
  //  that should not be tabbed to
  const tabableList = Array(childrenRef.current.length)
    .fill(null)
    .map((_, index) => {
      return !["divider"].includes(
        childrenRef.current?.[index]?.getAttribute("data-list-type")
      );
    });

  // getNextItem finds the first next tabable index after the current index
  //  if there is no tabable index after, we make a round trip and begin from
  //  the start of the array
  function getNextItem(currentIndex) {
    const next = tabableList.findIndex(
      (item, index) => item === true && currentIndex < index
    );
    const nextStartList = tabableList.findIndex((item) => item === true);

    return next > 0 && !(next > tabableList.length - 1) ? next : nextStartList;
  }

  // getPrevItem finds the first earlier tabable index before the current index
  //  if there is no tabable index before, we make a round trip and begin from
  //  the end of the array
  function getPrevItem(currentIndex) {
    const prev = tabableList.findLastIndex(
      (item, index) => item === true && currentIndex > index
    );
    const prevEndList = tabableList.findLastIndex((item) => item === true);
    return prev > -1 ? prev : prevEndList;
  }

  return {
    getNextItem: getNextItem,
    getPrevItem: getPrevItem,
    tabableList: tabableList,
  };
}

function Group({
  children,
  enabled = true,
  label = "Select list group",
  disableGroupOutline = false, // Use for group of FormLinks
  charCodeEvents = () => [],
  ...props
}) {
  const childrenRef = useRef([]);

  useEffect(() => {
    // find the radio button to have tabindex=0
    // either the checked or the first button
    let index = 0;
    childrenRef.current.forEach((el, idx) => {
      if (el) {
        if (["link", "divider"].includes(el.getAttribute("data-list-type"))) {
          // Return if FormLink
          return;
        }

        el.tabIndex = "-1";
        if (
          el.getAttribute("aria-checked") === "true" ||
          el.getAttribute("aria-checked") === true
        ) {
          index = idx;
        }
      }
    });
    if (childrenRef.current[index] && enabled) {
      childrenRef.current[index].tabIndex = "0";
    }
  }, [children, enabled]);

  const getPrevItem = useCallback(
    (idx) => {
      if (childrenRef.current) {
        return tabableItems(childrenRef).getPrevItem(idx);
      } else {
        return {};
      }
    },
    [children]
  );

  const getNextItem = useCallback(
    (idx) => {
      if (childrenRef.current) {
        return tabableItems(childrenRef).getNextItem(idx);
      } else {
        return {};
      }
    },
    [children]
  );

  return (
    <div
      {...(props.id && { id: props.id })}
      data-cy={props["data-cy"]}
      role="group"
      aria-label={label}
      className={cx(styles.group, props.className, {
        [styles.disabled]: !enabled,
        [styles.boxOutline]: !disableGroupOutline,
      })}
      onKeyDown={(e) => {
        const index = childrenRef.current.findIndex(
          (el) => el === document.activeElement
        );

        function focusScroller(idx) {
          e.preventDefault();
          childrenRef.current?.[idx]?.focus();
          childrenRef.current?.[idx]?.scrollIntoView({ block: "center" });
        }

        if (
          !childrenRef.current[index] ||
          childrenRef.current[index].getAttribute("data-list-type") === "link"
        ) {
          /**
           * We are not in a form group, break.
           * Happens for FormLink
           */
          return;
        }

        const actionArray = [
          [
            ["ArrowUp", "ArrowLeft"].includes(e.key),
            () => focusScroller(getPrevItem(index)),
          ],
          [
            ["ArrowDown", "ArrowRight"].includes(e.key),
            () => focusScroller(getNextItem(index)),
          ],
          [["Home"].includes(e.key), () => focusScroller(0)],
          [
            ["End"].includes(e.key),
            () => focusScroller(childrenRef.current.length - 1),
          ],
          ...charCodeEvents(e),
        ];

        const action = getFirstMatch(true, () => {}, actionArray);

        action();
      }}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          _ref: (ref) => (childrenRef.current[index] = ref),
          "data-cy": "list-button-" + index,
          disabled: enabled === false || child.props.disabled,
        })
      )}
    </div>
  );
}

const ExportedList = { Group, Radio, Select, FormLink, Divider };

export default ExportedList;
