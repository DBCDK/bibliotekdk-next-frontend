import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import Input from "@/components/base/forms/input";
import Translate from "@/components/base/translate";

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
  const {
    className,
    invalidClass = styles.invalid,
    validClass = styles.valid,
    onChange,
    onBlur,
    required = false,
    value,
    onMount,
  } = props;

  // validation state
  const [valid, setValid] = useState(null);

  // Error messages for translate
  const emptyField = {
    context: "form",
    label: "empty-email-field",
  };
  const invalidEmail = {
    context: "form",
    label: "wrong-email-field",
  };

  // Validation onMount
  useEffect(
    () => {
      const allowEmpty = value === "" && !required;
      const valid = validateEmail(value) || allowEmpty;
      setValid(valid);

      onMount &&
        onMount(value, {
          status: valid,
          message: getLabel(value, valid),
        });
    }, // Updates if value changes (initial value)
    [value]
  );

  function getLabel(value, valid) {
    const label = (value === "" && emptyField) || invalidEmail;
    return (!valid && label) || null;
  }

  // email valid / invalid status class
  const statusClass = valid ? validClass : invalidClass;

  return (
    <Input
      {...props}
      type="email"
      className={`${className} ${styles.email} ${statusClass}`}
      onBlur={(value) => {
        if (onBlur) {
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);
          onBlur(value, {
            status: valid,
            message: getLabel(value, valid),
          });
        }
      }}
      onChange={(value) => {
        if (onChange) {
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);

          onChange(value, {
            status: valid,
            message: getLabel(value, valid),
          });
        }
      }}
    />
  );
}

// PropTypes for component
Email.propTypes = {
  className: PropTypes.string,
  invalidClass: PropTypes.string,
  validClass: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onMount: PropTypes.func,

  // Input component props
  placeholder: PropTypes.string,
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  skeleton: PropTypes.bool,
};

export default Email;
