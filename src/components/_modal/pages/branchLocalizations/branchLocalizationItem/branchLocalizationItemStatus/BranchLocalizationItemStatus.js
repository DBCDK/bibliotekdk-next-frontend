import Text from "@/components/base/text";
import {
  AvailabilityEnum,
  dateIsLater,
} from "@/components/hooks/useHandleAgencyAccessData";
import Translate from "@/components/base/translate";
import { dateToShortDate } from "@/utils/datetimeConverter";

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

function MessageWhenMaterialsAvailableNever() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "not_for_loan" })}
    </Text>
  );
}

function MessageWhenMaterialsAvailableUnknown() {
  return (
    <Text>
      {Translate({ context: "localizations", label: "status_is_unknown" })}
    </Text>
  );
}

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
  } else if (library?.availabilityAccumulated === AvailabilityEnum.UNKNOWN) {
    return <MessageWhenMaterialsAvailableUnknown />;
  } else {
    return <MessageWhenMaterialsAvailableUnknown />;
  }
}
