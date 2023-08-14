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
 * @returns {JSX.Element}
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
  } = props;

  // validation state
  const [valid, setValid] = useState(true);

  // Error messages for translate
  const emptyField = {
    context: "form",
    label: "empty-email-field",
  };
  const invalidEmail = {
    context: "form",
    label: "wrong-email-field",
  };

  function getLabel(value, valid) {
    const label = (value === "" && emptyField) || invalidEmail;
    return (!valid && label) || null;
  }

  // email valid / invalid status class
  const statusClass = valid ? validClass : invalidClass;

  return !props.disabled ? (
    <Input
      {...props}
      type="email"
      className={`${className} ${styles.email} ${statusClass}`}
      onBlur={(e) => {
        if (onBlur) {
          const value = e?.target?.value;
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);
          onBlur(e, {
            status: valid,
            message: getLabel(value, valid),
          });
        }
      }}
      onChange={(e) => {
        if (onChange) {
          const value = e?.target?.value;
          const allowEmpty = value === "" && !required;
          const valid = validateEmail(value) || allowEmpty;
          setValid(valid);

          onChange(e, {
            status: valid,
            message: getLabel(value, valid),
          });
        }
      }}
    />
  ) : (
    // if the input is disabled: don't allow change of emailadress
    <Input
      id={"input"}
      value={value}
      disabled={true}
      readOnly={true}
      onChange={() => {}}
      type="email"
      className={`${className} ${styles.email} ${statusClass}`}
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
