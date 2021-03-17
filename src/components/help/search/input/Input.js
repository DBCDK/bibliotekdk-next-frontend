import PropTypes from "prop-types";

import styles from "./Input.module.css";
import Translate from "@/components/base/translate";

/**
 * Search component
 * Makes it possible to search for help texts.
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Input({
  value = "",
  onChange = () => {},
  onSubmit,
  className = "",
}) {
  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Søg i hjælp"
      ></input>
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
};
