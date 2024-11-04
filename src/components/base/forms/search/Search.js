import PropTypes from "prop-types";
import { useEffect } from "react";

import Input from "@/components/base/forms/input";
import Icon from "@/components/base/icon";

import styles from "./Search.module.css";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * Get you value like <Search onChange={(value) => console.log(value)} ... />
 *
 * @returns {React.JSX.Element}
 */
function Search(props) {
  const {
    className,
    onChange,
    onBlur,
    value = "",
    onMount,
    clearMe = false,
  } = props;

  // Validation onMount
  useEffect(
    () => {
      onMount && onMount(value);
    }, // Updates if value changes (initial value)
    [value]
  );

  const clearInput = () => {
    onChange("");
    document.getElementById("login_library_search").value = "";
  };

  return (
    <div className={`${styles.search} ${className}`}>
      <Input
        {...props}
        type="input"
        onBlur={(e) => onBlur && onBlur(e?.target?.value)}
        onChange={(e) => onChange && onChange(e.target.value)}
        aria-label={props.placeholder}
        value={value}
        id="login_library_search"
      />
      <Icon
        className={styles.icon}
        size={{ w: 2, h: 2 }}
        src={clearMe ? "close.svg" : "search.svg"}
        onClick={() => {
          clearMe && clearInput();
        }}
      />
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
  dataCy: PropTypes.string,
};

export default Search;
