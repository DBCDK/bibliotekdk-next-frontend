import PropTypes from "prop-types";
import Input from "@/components/base/forms/input";
import styles from "./Email.module.css";

/**
 * The Component function
 *
 * @param {Object} props
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
    required = true,
    value,
    valid = true,
  } = props;

  const showError = !valid && required;

  // email valid / invalid status styling on email field
  const statusClass = showError ? invalidClass : validClass;

  return !props.disabled ? (
    <Input
      {...props}
      type="email"
      className={`${className} ${styles.email} ${statusClass}`}
      onChange={(e) => {
        if (onChange) {
          const value = e?.target?.value;
          onChange(e, {
            message: getLabel(value),
          });
        }
      }}
      onBlur={(e) => {
        if (onBlur) {
          const value = e?.target?.value;
          onBlur(e, {
            message: getLabel(value),
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

// Error messages for translate
const emptyField = {
  context: "form",
  label: "empty-email-field",
};
const invalidEmail = {
  context: "form",
  label: "wrong-email-field",
};
export function getLabel(value, valid) {
  const label = (value === "" && emptyField) || invalidEmail;
  return (!valid && label) || null;
}
