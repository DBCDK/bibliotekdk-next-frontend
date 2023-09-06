import PropTypes from "prop-types";

import Icon from "@/components/base/icon";
import ClearSvg from "@/public/icons/close.svg";

import styles from "./Input.module.css";
import Translate from "@/components/base/translate";

/**
 * Function to focus suggester input field
 *
 */
export function focusInput() {
  document.getElementById("help-suggester-input").focus();
}

/**
 * Search component
 * Makes it possible to search for help texts.
 *
 * @param  {Object} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Input({
  value = "",
  onChange = () => {},
  onClear = () => {},
  onSubmit,
  className = "",
}) {
  const placeholder = Translate({
    context: "help",
    label: "help-search-placeholder",
  });
  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.input_wrap}>
        <input
          id="help-suggester-input"
          className={styles.input}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={Translate({
            context: "help",
            label: "help-search-placeholder",
          })}
          aria-label={placeholder}
        ></input>
        <span
          className={`${styles.clear} ${value ? styles.visible : ""}`}
          onClick={() => {
            onClear();
            focusInput();
          }}
        >
          <Icon size={{ w: "auto", h: 2 }}>
            <ClearSvg />
          </Icon>
        </span>
      </div>

      <button className={styles.button} type="submit">
        <span>{Translate({ context: "general", label: "searchButton" })}</span>
        <div className={styles.fill} />
      </button>
    </form>
  );
}
Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
};
