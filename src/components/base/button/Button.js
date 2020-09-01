import PropTypes from "prop-types";

import styles from "./Button.module.css";

export const Button = ({
  children,
  type = "filled",
  size = "large",
  disabled = false,
}) => {
  const disabledStyle = disabled ? styles.disabled : {};

  return (
    <button
      className={`${styles.Button} ${styles[size]} ${styles[type]} ${disabledStyle}`}
    >
      {children || "Active"}
    </button>
  );
};

export default (props) => {
  //   const { data, isLoading } = useQuery(query);

  return <Button {...props} />;
};

Button.propTypes = {
  children: PropTypes.object,
  type: PropTypes.oneOf("filled", "outlined"),
  size: PropTypes.oneOf("large", "medium", "small"),
  disabled: PropTypes.bool,
};
