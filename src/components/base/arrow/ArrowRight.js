import PropTypes from "prop-types";
import { Arrow } from "@/components/base/arrow/Arrow";

/**
 * The right arrow React component
 *
 * @param {Object} props
 * @param {function} props.onClick OnClick handler
 * @param {boolean} props.disabled true if button is disabled
 *
 */
export function ArrowRight({ onClick, disabled }) {
  return <Arrow onClick={onClick} disabled={disabled} />;
}
ArrowRight.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
