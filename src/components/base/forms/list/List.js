/**
 * @file
 * Implemented according to this example
 * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html
 */
import PropTypes from "prop-types";

import React, { useEffect, useRef } from "react";

import Arrow from "@/components/base/animation/arrow";
import Link from "@/components/base/link";
import styles from "./List.module.css";
import cx from "classnames";
import animations from "css/animations";

/**
 * A custom Radio Button displayed as a row
 *
 * @param disabled
 * @param {object} props
 * @param {array} props.children
 * @param {className} props.string
 * @param {string} props.label the aria label for the radio button
 * @param {function} props.onSelect
 * @param className
 * @param {boolean} props.selected
 * @param {function} props._ref
 */
function Radio({
  children,
  disabled,
  label,
  onSelect,
  selected,
  _ref,
  className,
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
    >
      <div className={styles.dot} />
      <div id="radio-label" className={styles.label}>
        {label}
      </div>
      <div
        className={[styles.content, animations["f-translate-right"]].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
Radio.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
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
 * @param {object} props
 * @param {array} props.children
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

function Group({
  children,
  enabled = true,
  label = "Select list group",
  disableGroupOutline = false, // Use for group of FormLinks
  ...props
}) {
  const childrenRef = useRef([]);

  useEffect(() => {
    // find the radio button to have tabindex=0
    // either the checked or the first button
    let index = 0;
    childrenRef.current.forEach((el, idx) => {
      if (el) {
        if (el.getAttribute("data-list-type") === "link") {
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

  return (
    <div
      data-cy={props["data-cy"]}
      role="group"
      aria-label={label}
      className={cx(styles.group, props.className, {
        [styles.disabled]: !enabled,
      })}
      onKeyDown={(e) => {
        const index = childrenRef.current.findIndex(
          (el) => el === document.activeElement
        );

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

        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          const prevIndex =
            index > 0 ? index - 1 : childrenRef.current.length - 1;
          childrenRef.current[prevIndex].focus();
          childrenRef.current[prevIndex].scrollIntoView({ block: "center" });
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          const nextIndex =
            index < childrenRef.current.length - 1 ? index + 1 : 0;
          childrenRef.current[nextIndex].focus();
          childrenRef.current[nextIndex].scrollIntoView({ block: "center" });
        } else if (e.key === "Home") {
          e.preventDefault();
          const index = 0;
          childrenRef.current[index].focus();
          childrenRef.current[index].scrollIntoView({ block: "center" });
        } else if (e.key === "End") {
          e.preventDefault();
          const index = childrenRef.current.length - 1;
          childrenRef.current[index].focus();
          childrenRef.current[index].scrollIntoView({ block: "center" });
        }
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

const ExportedList = { Group, Radio, Select, FormLink };

export default ExportedList;
