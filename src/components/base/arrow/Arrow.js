import styles from "@/components/base/arrow/Arrow.module.css";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";

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
  style = null,
}) {
  const orientation = isLeft ? "left" : "right";

  return (
    <span
      className={`${styles.button} ${styles[orientation]} ${
        leftAdjust && styles[`${orientation}-adjust`]
      } ${disabled && styles.disabled}`}
      data-cy={`arrow-${orientation}`}
      onClick={onClick}
      style={style}
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
  style: PropTypes.object,
};
