import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import Skeleton from "@/components/base/skeleton";

import styles from "./Input.module.css";

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
function Input({
  className,
  tabIndex = "0",
  type = "text",
  id,
  value = "",
  placeholder = null,
  disabled = false,
  onChange,
  onBlur,
  readOnly = false,
}) {
  const [val, setVal] = useState(value || "");

  useEffect(() => {
    onChange && onChange(val);
  }, [val]);

  // Update value if undefined/null at first render
  useEffect(() => {
    setVal(value);
  }, [value]);

  const readOnlyClass = readOnly || disabled ? styles.readOnly : "";

  return (
    <input
      id={id}
      className={`${styles.input} ${readOnlyClass} ${className}`}
      type={type}
      value={val}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      tabIndex={disabled ? "-1" : tabIndex}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      onChange={(e) => setVal(e.target.value)}
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
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  skeleton: PropTypes.bool,
};

/**
 * Return loading version of component
 *
 */
function SkeletonInput(props) {
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
