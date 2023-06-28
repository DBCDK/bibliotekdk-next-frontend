import styles from "./Arrow.module.css";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";
import cx from "classnames";

/**
 * The left arrow React component
 *
 * @param {Object} props
 * @param {function} props.onClick OnClick handler
 * @param {boolean} props.disabled true if button is disabled
 * @param {boolean} props.leftAdjust true if there is for the button to the left
 *
 */
export function Arrow({
  onClick,
  disabled,
  isLeft = false,
  leftAdjust = false,
}) {
  const orientation = isLeft ? "left" : "right";

  return (
    <span
      className={cx(styles.button, {
        [styles.left]: orientation === "left",
        [styles.right]: orientation === "right",
        [styles["left-adjust"]]: leftAdjust && orientation === "Left",
        [styles.disabled]: disabled,
      })}
      data-cy={`arrow-${orientation}`}
      onClick={onClick}
    >
      <Icon
        src={`arrow${orientation}.svg`}
        size={{ w: 5, h: 5 }}
        bgColor={"transparent"}
        alt={Translate({
          context: "recommendations",
          label: `arrow-${orientation}`,
        })}
      />
    </span>
  );
}

Arrow.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isLeft: PropTypes.bool,
  leftAdjust: PropTypes.bool,
};
