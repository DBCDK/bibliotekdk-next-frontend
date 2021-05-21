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
    onChange,
    onBlur,
    required = false,
    value,
    onMount,
  } = props;
  const [valid, setValid] = useState(null);

  // Error messages
  const emptyFieldMessage = Translate({
    context: "form",
    label: "empty-email-field",
  });
  const invalidEmailMessage = Translate({
    context: "form",
    label: "wrong-email-field",
  });

  // Validation onMount

  useEffect(
    () => {
      const allowEmpty = value === "" && !required;
      const valid = validateEmail(value) || allowEmpty;
      setValid(valid);

      onMount &&
        onMount(value, {
          status: valid,
          message: getMessage(value, valid),
        });

      console.log("value", value);
    }, // Updates if value changes (initial value)
    [value]
  );

  function getMessage(value, valid) {
    const message = (value === "" && emptyFieldMessage) || invalidEmailMessage;
    return (!valid && message) || null;
  }

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
          onBlur(value, {
            status: valid,
            message: getMessage(value, valid),
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
            message: getMessage(value, valid),
          });
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
  onMount: PropTypes.func,

  // Input component props
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default Email;
