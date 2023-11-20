import Text from "@/components/base/text";
import {
  AvailabilityEnum,
  dateIsLater,
} from "@/components/hooks/useHandleAgencyAccessData";
import Translate from "@/components/base/translate";
import { dateToShortDate } from "@/utils/datetimeConverter";

/**
 * {@link MessageWhenPickupNotAllowed} shows a possible message in {@link BranchLocalizationItemStatus}
 * @returns {JSX.Element}
 */
function MessageWhenPickupNotAllowed() {
  return (
    <Text>
      {Translate({
        context: "localizations",
        label: "no_pickup_allowed_on_branch",
      })}
    </Text>
  );
}

/**
 * {@link MessageWhenMaterialsAvailableNow} shows a possible message in {@link BranchLocalizationItemStatus}
 * @param {Object} library
 * @returns {JSX.Element}
 */
function MessageWhenMaterialsAvailableNow({ library }) {
  return library?.availability[AvailabilityEnum.NOW] === 0 ? (
    <Text>{Translate({ context: "localizations", label: "on_shelf" })}</Text>
  ) : (
    <Text>
      {library?.availability[AvailabilityEnum.NOW]}{" "}
      {Translate({ context: "localizations", label: "on_shelf" }).toLowerCase()}
    </Text>
  );
}

/**
 * {@link MessageWhenMaterialsAvailableLater} shows a possible message in {@link BranchLocalizationItemStatus}
 * @param {Object} library
 * @returns {JSX.Element}
 */
function MessageWhenMaterialsAvailableLater({ library }) {
  const expectedDelivery =
    library?.expectedDelivery ||
    library?.expectedDeliveryAccumulatedFromHoldings;

  return (
    <Text>
      {Translate({
        context: "localizations",
        label: dateIsLater(expectedDelivery)
          ? "order_now_pickup_at_date"
          : "order_now_pickup_at_some_point",
        ...(dateIsLater(expectedDelivery) && {
          vars: [dateToShortDate(expectedDelivery)],
        }),
      })}
    </Text>
  );
}

/**
 * {@link MessageWhenMaterialsAvailableNever} shows a possible message in {@link BranchLocalizationItemStatus}
 * @returns {JSX.Element}
 */
function MessageWhenMaterialsAvailableNever() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "not_for_loan" })}
    </Text>
  );
}

/**
 * {@link MessageWhenLibraryDoesNotOwnMaterial} shows a possible message in {@link BranchLocalizationItemStatus}
 * @returns {JSX.Element}
 */
function MessageWhenLibraryDoesNotOwnMaterial() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "does_not_own_material" })}
    </Text>
  );
}

/**
 * {@link MessageWhenMaterialsAvailableUnknown} shows a possible message in {@link BranchLocalizationItemStatus}
 * @returns {JSX.Element}
 */
function MessageWhenMaterialsAvailableUnknown() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "status_is_unknown" })}
    </Text>
  );
}

/**
 * {@link BranchLocalizationItemStatus} presents the status message for {@link BranchLocalizationItem}
 * @param {Object} library
 * @returns {JSX.Element}
 */
export default function BranchLocalizationItemStatus({ library }) {
  if (
    typeof library?.pickupAllowed !== "undefined" &&
    library?.pickupAllowed === false
  ) {
    return <MessageWhenPickupNotAllowed />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOW) {
    return <MessageWhenMaterialsAvailableNow library={library} />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.LATER) {
    return <MessageWhenMaterialsAvailableLater library={library} />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NEVER) {
    return <MessageWhenMaterialsAvailableNever />;
  } else if (
    [AvailabilityEnum.NOT_OWNED, AvailabilityEnum.NOT_OWNED_FFU].includes(
      library?.availabilityAccumulated
    )
  ) {
    return <MessageWhenLibraryDoesNotOwnMaterial />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.UNKNOWN) {
    return <MessageWhenMaterialsAvailableUnknown />;
  } else {
    return <MessageWhenMaterialsAvailableUnknown />;
  }
}
