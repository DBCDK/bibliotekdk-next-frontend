import Text from "@/components/base/text";
import {
  AvailabilityEnum,
  dateIsLater,
} from "@/components/hooks/useHandleAgencyAccessData";
import Translate from "@/components/base/translate";
import { dateToShortDate } from "@/utils/datetimeConverter";

function messageWhenPickupNotAllowed() {
  return (
    <Text>{Translate({ context: "localizations", label: "no_pickup" })}</Text>
  );
}
function messageWhenMaterialsAvailableNow(library) {
  return library?.availability[AvailabilityEnum.NOW] === 0 ? (
    <Text>{Translate({ context: "localizations", label: "on_shelf" })}</Text>
  ) : (
    <Text>
      {library?.availability[AvailabilityEnum.NOW]}{" "}
      {Translate({ context: "localizations", label: "on_shelf" }).toLowerCase()}
    </Text>
  );
}

function messageWhenMaterialsAvailableLater(library) {
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

function messageWhenMaterialsAvailableNever() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "not_for_loan" })}
    </Text>
  );
}

function messageWhenMaterialsAvailableUnknown() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "status_is_unknown" })}
    </Text>
  );
}

function getBranchStatusMessage(library) {
  if (
    typeof library?.pickupAllowed !== "undefined" &&
    library?.pickupAllowed === false
  ) {
    return messageWhenPickupNotAllowed();
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOW) {
    return messageWhenMaterialsAvailableNow(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.LATER) {
    return messageWhenMaterialsAvailableLater(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NEVER) {
    return messageWhenMaterialsAvailableNever();
  } else if (library?.availabilityAccumulated === AvailabilityEnum.UNKNOWN) {
    return messageWhenMaterialsAvailableUnknown();
  } else {
    return messageWhenMaterialsAvailableUnknown();
  }
}

export default function BranchLocalizationItemStatus({ library }) {
  return (
    <>
      <div>{getBranchStatusMessage(library)}</div>
    </>
  );
}
