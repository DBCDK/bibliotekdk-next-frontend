import { getFirstMatch } from "@/lib/utils";
import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";
import * as PropTypes from "prop-types";

/**
 * Availability light has the color of the status of the manifestation on the library (agency or branch)
 * @param {Object} availabilityLightProps
 * @param {Object} style
 * @returns {JSX.Element}
 */
export function AvailabilityLight({
  availabilityLightProps,
  style = { paddingTop: "var(--pt05)" },
}) {
  const {
    availabilityAccumulated,
    availabilityOnAgencyAccumulated,
    pickupAllowed,
  } = availabilityLightProps;

  const iconInstance = getFirstMatch(
    true,
    {
      src: "status__no_holdings.svg",
      alt: Translate({
        context: "localizations",
        label: "status_is_unknown_alt",
      }),
    },
    [
      [
        pickupAllowed === false,
        {
          src: "status__not_for_loan.svg",
          alt: Translate({
            context: "localizations",
            label: "no_pickup_on_library_alt",
          }),
        },
      ],
      [
        availabilityAccumulated === AvailabilityEnum.NOW,
        {
          src: "status__on_shelf.svg",
          alt: Translate({
            context: "localizations",
            label: "on_shelf_in_library_alt",
          }),
        },
      ],
      [
        availabilityAccumulated === AvailabilityEnum.LATER ||
          availabilityOnAgencyAccumulated === AvailabilityEnum.LATER,
        {
          src: "status__on_loan.svg",
          alt: Translate({
            context: "localizations",
            label: "on_loan_in_library_alt",
          }),
        },
      ],
      [
        availabilityAccumulated === AvailabilityEnum.NEVER,
        {
          src: "status__not_for_loan.svg",
          alt: Translate({
            context: "localizations",
            label: "no_pickup_on_library_alt",
          }),
        },
      ],
      [
        availabilityAccumulated === AvailabilityEnum.UNKNOWN,
        {
          src: "status__no_holdings.svg",
          alt: Translate({
            context: "localizations",
            label: "status_is_unknown_alt",
          }),
        },
      ],
    ]
  );

  return (
    <Icon
      size={{ w: 2, h: 2 }}
      alt={iconInstance.alt}
      title={Translate({
        context: "localizations",
        label: `AvailabilityEnum_${availabilityAccumulated}`,
      })}
      style={style}
      src={iconInstance.src}
    />
  );
}

AvailabilityLight.propTypes = { availabilityLightProps: PropTypes.object };
