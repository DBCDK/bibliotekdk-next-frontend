import PropTypes from "prop-types";
import { useState } from "react";
import { Dropdown as BootstrapDropdown } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";
import Icon from "@/components/base/icon";

import styles from "./Dropdown.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Dropdown({
  children = "im a tag",
  className = "",
  disabled = false,
  skeleton = false,
}) {
  const key = cyKey({ name: children, prefix: "tag" });
  const disabledStyle = disabled ? styles.disabled : "";
  const [selected, setSelected] = useState("Søg i alt");

  return (
    <BootstrapDropdown
      data-cy={key}
      className={`${styles.dropdown} ${className} ${disabledStyle}`}
    >
      <BootstrapDropdown.Toggle
        className={`${styles.toggle}`}
        id="dropdown-basic"
      >
        {selected}
      </BootstrapDropdown.Toggle>

      <BootstrapDropdown.Menu className={styles.items}>
        <BootstrapDropdown.Item
          className={styles.item}
          as="span"
          onClick={() => setSelected("Søg i alt")}
        >
          Søg i Alt
        </BootstrapDropdown.Item>
        <BootstrapDropdown.Divider />
        <BootstrapDropdown.Item
          as="span"
          className={styles.item}
          onClick={() => setSelected("Bog")}
        >
          Bog
        </BootstrapDropdown.Item>
        <BootstrapDropdown.Item
          as="span"
          className={styles.item}
          onClick={() => setSelected("E-bog")}
        >
          E-bog
        </BootstrapDropdown.Item>
        <BootstrapDropdown.Item
          as="span"
          className={styles.item}
          onClick={() => setSelected("Lydbog")}
        >
          Lydbog
        </BootstrapDropdown.Item>
      </BootstrapDropdown.Menu>
    </BootstrapDropdown>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
function DropdownSkeleton(props) {
  return (
    <Dropdown
      {...props}
      skeleton={true}
      className={`${props.className} ${styles.skeleton}`}
      onClick={null}
      disabled={true}
      selected={false}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  if (props.skeleton) {
    return <DropdownSkeleton {...props} />;
  }

  return <Dropdown {...props} />;
}

// PropTypes for Button component
Wrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
