import PropTypes from "prop-types";

import styles from "./Color.module.css";

import invertColor from "../../../utils/invertColor.js";

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

/**
 *
 * @param {string} hex
 * @param {string} name
 *
 * @returns {component}
 */
const Color = ({ hex = "#3333ff", name = "blue" }) => {
  return (
    <div className={styles.Color}>
      <button
        title="Copy hex"
        onClick={() => copyToClipboard(hex)}
        style={{ backgroundColor: hex, color: invertColor(hex, true) }}
      >
        {hex}
      </button>
      <span
        title="Copy variable"
        onClick={() => copyToClipboard(`var(--${name})`)}
      >
        {name}
      </span>
    </div>
  );
};

export default Color;

Color.propTypes = {
  hex: PropTypes.string,
  name: PropTypes.string,
};
