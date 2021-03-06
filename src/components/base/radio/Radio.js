/**
 * @file
 * Implemented according to this example
 * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html
 */
import PropTypes from "prop-types";

import { useEffect, useRef } from "react";
import styles from "./Radio.module.css";

import animations from "@/components/base/animation/animations.module.css";

/**
 * A custom Radio Button displayed as a row
 *
 * @param {object} props
 * @param {array} props.children
 * @param {className} props.string
 * @param {string} props.label the aria label for the radio button
 * @param {function} props.onSelect
 * @param {boolean} props.selected
 * @param {function} props._ref
 */
function Button({
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
      className={`${styles.row} ${animations["on-focus"]} ${
        animations["f-outline"]
      } ${selected ? styles.selected : ""} ${className || ""} ${
        disabled ? styles.disabledrow : ""
      }`}
    >
      <div
        className={[styles.content, animations["f-translate-right"]].join(" ")}
      >
        {children}
      </div>
      <div className={styles.dot} />
      <div id="radio-label" className={styles.label}>
        {label}
      </div>
    </div>
  );
}
Button.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  _ref: PropTypes.func,
};

function Group({ children, enabled = true, ...props }) {
  const childrenRef = useRef([]);

  useEffect(() => {
    // find the radio button to have tabindex=0
    // either the checked or the first button
    let index = 0;
    childrenRef.current.forEach((el, idx) => {
      el.tabIndex = "-1";
      if (
        el.getAttribute("aria-checked") === "true" ||
        el.getAttribute("aria-checked") === true
      ) {
        index = idx;
      }
    });
    if (childrenRef.current[index] && enabled) {
      childrenRef.current[index].tabIndex = "0";
    }
  }, [children, enabled]);

  return (
    <div
      data-cy={props["data-cy"]}
      role="radiogroup"
      aria-labelledby="radio-label"
      className={`${styles.group} ${
        enabled ? styles.enabled : styles.disabled
      }`}
      onKeyDown={(e) => {
        const index = childrenRef.current.findIndex(
          (el) => el === document.activeElement
        );
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          const prevIndex =
            index > 0 ? index - 1 : childrenRef.current.length - 1;
          childrenRef.current[prevIndex].focus();
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          const nextIndex =
            index < childrenRef.current.length - 1 ? index + 1 : 0;
          childrenRef.current[nextIndex].focus();
        }
      }}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          _ref: (ref) => (childrenRef.current[index] = ref),
          "data-cy": "radio-button-" + index,
          disabled: enabled === false || child.props.disabled,
        })
      )}
    </div>
  );
}

export default {
  Group,
  Button,
};
