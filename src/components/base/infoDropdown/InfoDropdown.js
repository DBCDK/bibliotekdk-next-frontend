/**
 * @file - InfoDropdown.js
 * InfoDropdown component that shows a button and a text that can be toggled by button click
 */

import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Icon from "@/components/base/icon";
import styles from "./InfoDropdown.module.css";
import animations from "css/animations";
import cx from "classnames";
import PropTypes from "prop-types";

/**
 * InfoDropdown component that shows a button and a text that can be toggled by button click
 * @param {Object} props
 * @returns {React.ReactElement | null}
 */
export default function InfoDropdown(props) {
  const { children, label, buttonText } = props;
  const [expanded, setExpanded] = useState(false);

  function toggleCollapse() {
    setExpanded((current) => !current);
  }

  return (
    <>
      {/* wrap collaps in text, to give styling to collapse, because collaps doesnt work with text component */}
      <Text type="text2" tag="div">
        <Collapse in={expanded}>
          <p id={`${label}-text`}>{children}</p>
        </Collapse>
      </Text>
      <Button
        dataCy={`${label}-button`}
        ariaControls={`${label}-text`}
        ariaExpanded={expanded}
        type="secondary"
        className={cx(
          styles.expandButton,
          animations["on-hover"],
          animations["on-focus"]
        )}
        border={false}
        onClick={toggleCollapse}
      >
        <span className={styles.expandWrap}>
          <Text
            type="text2"
            className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
          >
            {buttonText}
          </Text>
          <Icon
            size={{ w: "2", h: "auto" }}
            src="arrowDown.svg"
            className={styles.chevron}
            alt=""
          />
        </span>
      </Button>
    </>
  );
}

InfoDropdown.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  buttonText: PropTypes.string,
};
