import Icon from "@/components/base/icon";
import * as PropTypes from "prop-types";

/**
 * Availability light has the color of the status of the manifestation on the library (agency or branch)
 * @param {Object} availabilityLightProps
 * @param {Object} style
 * @returns {JSX.Element}
 */
export function AvailabilityLight({
  branch,
  style = { paddingTop: "var(--pt05)" },
}) {
  return (
    <Icon
      size={{ w: 2, h: 2 }}
      alt={branch?.holdingsLamp?.alt}
      style={style}
      src={branch?.holdingsLamp?.src}
    />
  );
}

AvailabilityLight.propTypes = { availabilityLightProps: PropTypes.object };
