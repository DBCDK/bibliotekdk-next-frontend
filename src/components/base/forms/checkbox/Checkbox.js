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
  checked = false,
  disabled = false,
  onChange,
  dataCy = "checkbox",
  ariaLabelledBy,
  ariaLabel = "",
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

  return (
    <label
      htmlFor={id}
      className={`${styles.wrap} ${disabledClass} ${readOnlyClass} ${className}`}
    >
      <input
        id={id}
        aria-labelledby={ariaLabelledBy}
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
      <div className={styles.label}>{ariaLabel}</div>
    </label>
  );
}

// PropTypes for component
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
export function SkeletonCheckbox() {
  return (
    <div className={`${styles.input}`}>
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
