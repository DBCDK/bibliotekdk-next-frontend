/**
 * @file
 * Implemented according to this example
 * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html
 */
import PropTypes from "prop-types";

import { useEffect, useRef } from "react";
import styles from "./Radio.module.css";

import animations from "@/components/base/animation/animations.module.css";

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
