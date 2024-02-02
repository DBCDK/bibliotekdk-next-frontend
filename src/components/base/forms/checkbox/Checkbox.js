import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import Skeleton from "@/components/base/skeleton";
import cx from "classnames";
import styles from "./Checkbox.module.css";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * Get you value like <Input onChange={(value) => console.log(value)} ... />
 *
 * @returns {React.JSX.Element}
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
  onClick,
}) {
  const [status, setStatus] = useState(checked);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange && onChange(status);
  }, [status]);

  //Update value if undefined/null at first render
  useEffect(() => {
    setStatus(checked);
  }, [checked]);

  return (
    <label
      htmlFor={id}
      className={cx(styles.wrap, className, {
        [styles.readOnly]: readOnly,
        [styles.disabled]: disabled,
      })}
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
        onChange={(e) => {
          if (readOnly) return;
          setStatus(e.target.checked);
        }}
        onKeyDown={(e) => {
          if (readOnly) return;
          if (e.key === "Enter") {
            setStatus(!status);
          }
        }}
        onClick={onClick}
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
