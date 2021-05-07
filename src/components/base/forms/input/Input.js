import PropTypes from "prop-types";
import styles from "./Input.module.css";

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
function Input({ className, id, value, onChange }) {
  const [val, setVal] = useState(value);

  return (
    <input
      id={id}
      className={`${styles.input} ${className}`}
      type="text"
      value={val}
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
  onChange: PropTypes.func,
};

export default Input;
