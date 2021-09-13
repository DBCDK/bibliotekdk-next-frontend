import PropTypes from "prop-types";
import { useEffect } from "react";

import Input from "@/components/base/forms/input";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import styles from "./Search.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * Get you value like <Search onChange={(value) => console.log(value)} ... />
 *
 * @returns {component}
 */
function Search(props) {
  const { className, onChange, onBlur, value = "", onMount } = props;

  // Validation onMount
  useEffect(
    () => {
      onMount && onMount(value);
    }, // Updates if value changes (initial value)
    [value]
  );

  return (
    <div className={`${styles.search} ${className}`}>
      <Input
        {...props}
        type="input"
        className={styles.input}
        onBlur={(value) => onBlur && onBlur(value)}
        onChange={(value) => onChange && onChange(value)}
      />
      <Icon className={styles.icon} size={[2]} src="search.svg" />
    </div>
  );
}

// PropTypes for component
Search.propTypes = {
  className: PropTypes.string,
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

export default Search;
