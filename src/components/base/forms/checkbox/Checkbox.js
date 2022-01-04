import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import Skeleton from "@/components/base/skeleton";

import styles from "./Checkbox.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * Get you value like <Input onChange={(value) => console.log(value)} ... />
 *
 * @returns {component}
 */
export function Checkbox({
  className,
  tabIndex = "0",
  id,
  invalid,
  checked = false,
  disabled = false,
  onChange,
  dataCy = "checkbox",
  ariaLabel = false,
  readOnly = false,
  required,
}) {
  const [status, setStatus] = useState(checked);

  useEffect(() => {
    onChange && onChange(status);
  }, [status]);

  // Update value if undefined/null at first render
  useEffect(() => {
    setStatus(checked);
  }, [checked]);

  const disabledClass = disabled ? styles.disabled : "";
  const readOnlyClass = readOnly ? styles.readOnly : "";
  const invalidClass = !disabledClass && invalid ? styles.error : "";

  // escape id
  // labelledby throws on spaced names/ids
  id = id.split(" ").join("-");

  return (
    <label
      id={`label-${id}`}
      htmlFor={id}
      className={`${styles.wrap} ${disabledClass} ${readOnlyClass} ${invalidClass} ${className}`}
    >
      <input
        id={id}
        className={styles.input}
        checked={status}
        type="checkbox"
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        data-cy={dataCy}
        tabIndex={disabled ? "-1" : tabIndex}
        onChange={(e) => !readOnly && setStatus(e.target.checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            !readOnly && setStatus(!status);
          }
        }}
      />
      <div className={styles.border}>
        <div className={styles.bg} />
      </div>
      <div aria-labelledby={`label-${id}`} className={styles.label}>
        {ariaLabel}
      </div>
    </label>
  );
}

// PropTypes for component
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  tabIndex: PropTypes.string,
  className: PropTypes.string,
  checked: PropTypes.bool,
  invalid: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  skeleton: PropTypes.bool,
  dataCy: PropTypes.string,
};

/**
 * Return loading version of component
 *
 */
export function SkeletonCheckbox(props) {
  return (
    <div className={`${styles.input} ${styles.skeleton}`}>
      <Skeleton />
    </div>
  );
}

/**
 * Return default wrap
 *
 */
export default function Wrap(props) {
  if (props.skeleton) {
    return <SkeletonCheckbox />;
  }

  return <Checkbox {...props} />;
}
