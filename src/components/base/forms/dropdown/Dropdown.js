import PropTypes from "prop-types";
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

  return (
    <BootstrapDropdown
      data-cy={key}
      className={`${styles.wrap} ${className} ${disabledStyle}`}
    >
      <BootstrapDropdown.Toggle
        className={`${styles.toggle}`}
        id="dropdown-basic"
      >
        Dropdown Button
      </BootstrapDropdown.Toggle>

      <BootstrapDropdown.Menu>
        <BootstrapDropdown.Item href="#/action-1">
          Action
        </BootstrapDropdown.Item>
        <BootstrapDropdown.Item href="#/action-2">
          Another action
        </BootstrapDropdown.Item>
        <BootstrapDropdown.Item href="#/action-3">
          Something else
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
