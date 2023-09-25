import { getFirstMatch } from "@/lib/utils";
import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import StatusNoHoldings from "@/public/icons/status__no_holdings.svg";
import StatusOnShelf from "@/public/icons/status__on_shelf.svg";
import StatusOnLoan from "@/public/icons/status__on_loan.svg";
import StatusNotForLoan from "@/public/icons/status__not_for_loan.svg";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import * as PropTypes from "prop-types";

/**
 * Availability light has the color of the status of the manifestation on the library (agency or branch)
 * @param availabilityAccumulated
 * @param pickupAllowed
 * @param style
 * @returns {JSX.Element}
 */
export function AvailabilityLight({
  availabilityAccumulated,
  pickupAllowed,
  style,
}) {
  const IconInstance = getFirstMatch(true, StatusNoHoldings, [
    [
      typeof pickupAllowed !== "undefined" && pickupAllowed === false,
      StatusNotForLoan,
    ],
    [availabilityAccumulated === AvailabilityEnum.NOW, StatusOnShelf],
    [availabilityAccumulated === AvailabilityEnum.LATER, StatusOnLoan],
    [availabilityAccumulated === AvailabilityEnum.NEVER, StatusNotForLoan],
    [availabilityAccumulated === AvailabilityEnum.UNKNOWN, StatusNoHoldings],
  ]);

  return (
    <div style={style}>
      <Icon
        size={{ w: "auto", h: 2 }}
        alt=""
        title={Translate({
          context: "localizations",
          label: `AvailabilityEnum_${availabilityAccumulated}`,
        })}
      >
        <IconInstance />
      </Icon>
    </div>
  );
}

AvailabilityLight.propTypes = { availabilityAccumulated: PropTypes.string };
