import PropTypes from "prop-types";

import styles from "./Color.module.css";

import invertColor from "../../../utils/invertColor.js";

/**
 * Function to copy text to clipboard
 *
 * @param {string} text
 *
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return a color example
 *
 * @param {string} hex
 * @param {string} name
 *
 * @returns {component}
 */
export default function Color({ hex = "#3333ff", name = "blue" }) {
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
}

// PropTypes for Color component
Color.propTypes = {
  hex: PropTypes.string,
  name: PropTypes.string,
};
