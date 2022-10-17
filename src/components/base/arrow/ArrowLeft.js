import PropTypes from "prop-types";
import { Arrow } from "@/components/base/arrow/Arrow";

/**
 * The left arrow React component
 *
 * @param {Object} props
 * @param {function} props.onClick OnClick handler
 * @param {boolean} props.disabled true if button is disabled
 * @param {boolean} props.leftAdjust true if there is for the button to the left
 *
 */
export function ArrowLeft({ onClick, disabled, leftAdjust }) {
  return (
    <Arrow
      onClick={onClick}
      disabled={disabled}
      isLeft={true}
      leftAdjust={leftAdjust}
    />
  );
}
ArrowLeft.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  leftAdjust: PropTypes.bool,
};
