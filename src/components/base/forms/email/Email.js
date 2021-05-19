import PropTypes from "prop-types";
import { useState } from "react";

import Input from "@/components/base/forms/input";

import { validateEmail } from "@/utils/validateEmail";

import styles from "./Email.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * Get you value like <Email onChange={(value, valid) => console.log(value, valid)} ... />
 *
 * @returns {component}
 */
function Email(props) {
  const { className, onChange, onBlur, required = false } = props;
  const [valid, setValid] = useState(true);

  const validClass = valid ? styles.valid : styles.inValid;

  return (
    <Input
      {...props}
      type="email"
      className={`${className} ${styles.email} ${validClass}`}
      onBlur={(value) => {
        if (onBlur) {
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);
          onBlur(value, valid);
        }
      }}
      onChange={(value) => {
        console.log("-_value", value);
        if (onChange) {
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);
          onChange(value, valid);
        }
      }}
    />
  );
}

// PropTypes for component
Email.propTypes = {
  className: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,

  // Input component props
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default Email;
