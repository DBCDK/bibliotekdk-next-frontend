import PropTypes from "prop-types";
import styles from "./Input.module.css";

import { validateEmail } from "@/utils/validateEmail";

import { useState, useEffect } from "react";

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.isVisible modal is currently active/visible
 * See propTypes for specific props and types
 *
 * Get yout value like <Input onChange={(value) => console.log(value)} ... />
 *
 * @returns {component}
 */
function Input({
  className,
  id,
  value,
  required = false,
  onChange,
  onValidation,
  readOnly = false,
}) {
  // Check for valid input (email), when input changes
  useEffect(() => {
    if (onValidation) {
      const valid = validateEmail(val);
      // Allow empty field if field is not required
      const isEmpty = val === "";
      const allowEmpty = isEmpty && !required;

      setValid(valid || allowEmpty);
      onValidation(valid || allowEmpty);
    }
  }, val);

  const [val, setVal] = useState(value);
  const [valid, setValid] = useState(null);

  const validClass = valid ? styles.valid : "";
  const readOnlyClass = readOnly ? styles.readOnly : "";

  return (
    <input
      id={id}
      className={`${styles.input} ${validClass} ${readOnlyClass} ${className}`}
      type="text"
      value={val}
      readOnly={readOnly}
      onChange={(e) => {
        setVal(e.target.value);
        onChange && onChange(e.target.value);
      }}
    />
  );
}

// PropTypes for component
Input.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Input;
