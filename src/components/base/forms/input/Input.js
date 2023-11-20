import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import Skeleton from "@/components/base/skeleton";

import styles from "./Input.module.css";

/**
 * The Component function
 *
 * @param className
 * @param {string} tabIndex
 * @param {string} type
 * @param id
 * @param invalid
 * @param invalidClass
 * @param {string} value
 * @param {string|null} placeholder
 * @param {boolean} disabled
 * @param onChange
 * @param onBlur
 * @param {string} dataCy
 * @param {boolean} readOnly
 * @param required
 * @param ariaLabelledby
 * @param ariaLabel
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * Get you value like <Input onChange={(value) => console.log(value)} ... />
 *
 * @returns {React.JSX.Element}
 */
function Input({
  className,
  tabIndex = "0",
  type = "text",
  id,
  invalid,
  value = "",
  placeholder = null,
  disabled = false,
  onChange,
  onBlur,
  onKeyDown,
  overrideValueControl,
  dataCy = "input",
  readOnly = false,
  required,
  "aria-labelledby": ariaLabelledby,
  "aria-label": ariaLabel,
  ...props
}) {
  const [val, setVal] = useState(value || "");
  // Update value if undefined/null at first render
  useEffect(() => {
    if (overrideValueControl) {
      setVal(value);
    }
  }, [value]);

  const readOnlyClass = readOnly || disabled ? styles.readOnly : "";
  const invalidClass = !readOnlyClass && invalid ? styles.error : "";

  delete props.skeleton;
  delete props.invalidClass;
  delete props.onMount;

  return (
    <input
      {...props}
      {...(onKeyDown && { onKeyDown: onKeyDown })}
      id={id}
      className={`${styles.input} ${readOnlyClass} ${invalidClass} ${className}`}
      type={type}
      value={overrideValueControl ? value : val}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      data-cy={dataCy}
      tabIndex={disabled ? "-1" : tabIndex}
      onBlur={(e) => onBlur && onBlur(e)}
      onChange={(e) => {
        onChange && onChange(e);
        setVal(e.target.value);
      }}
      required={required}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      {...(disabled && { contentEditable: false })}
    />
  );
}

// PropTypes for component
Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  tabIndex: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  invalid: PropTypes.bool,
  invalidClass: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  skeleton: PropTypes.bool,
  dataCy: PropTypes.string,
  "aria-labelledby": PropTypes.string,
  "aria-label": PropTypes.string,
};

/**
 * Return loading version of component
 *
 */
function SkeletonInput() {
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
    return <SkeletonInput />;
  }

  return <Input {...props} />;
}
