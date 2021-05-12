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
  onBlur,
  readOnly = false,
}) {
  const [val, setVal] = useState(value || "");
  const [valid, setValid] = useState(true);

  // Check for valid input (email), when input changes
  useEffect(() => {
    const valid = validateEmail(val);

    // Allow empty field if field is not required
    const allowEmpty = val === "" && !required;

    // Update validation
    onChange && onChange(val, valid);
  }, [val]);

  // Update value if undefined/null at first render
  useEffect(() => {
    setVal(value);
  }, [value]);

  const validClass = valid ? styles.valid : styles.error;
  const readOnlyClass = readOnly ? styles.readOnly : "";

  return (
    <input
      id={id}
      className={`${styles.input} ${validClass} ${readOnlyClass} ${className}`}
      type="text"
      value={val}
      readOnly={readOnly}
      onBlur={(e) => {
        if (onBlur) {
          const allowEmpty = val === "" && !required;
          const valid = validateEmail(val) || allowEmpty;
          setValid(valid);
          onBlur(e.target.value, valid);
        }
      }}
      onChange={(e) => setVal(e.target.value)}
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
  onBlur: PropTypes.func,
};

export default Input;
