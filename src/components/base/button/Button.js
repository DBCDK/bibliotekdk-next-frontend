import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Button.module.css";

/**
 *
 * @param {object || string} children
 * @param {object || string} className
 * @param {string} type
 * @param {string} size
 * @param {bool} disabled
 * @param {bool} skeleton
 *
 * @returns {component}
 */
export const Button = ({
  children = "im a button",
  className = "",
  type = "filled",
  size = "large",
  disabled = false,
}) => {
  const disabledStyle = disabled ? styles.disabled : {};

  return (
    <button
      className={`${styles.Button} ${className} ${styles[size]} ${styles[type]} ${disabledStyle}`}
    >
      {children}
    </button>
  );
};

// Skeleton (loading) version of button
export const ButtonSkeleton = (props) => {
  return (
    <Skeleton>
      <Button {...props} onClick={null} disabled={true} />
    </Skeleton>
  );
};

export default (props) => {
  // Data loading stuff here ...
  // const { data, isLoading } = useQuery(query);

  if (props.skeleton) {
    return <ButtonSkeleton {...props} />;
  }

  return <Button {...props} />;
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["filled", "outlined"]),
  size: PropTypes.oneOf(["large", "medium", "small"]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
};
