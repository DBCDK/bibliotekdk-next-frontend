import Text from "@/components/base/text";
import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import Translate from "@/components/base/translate";

function messageWhenNoPickup(library) {
  return (
    <Text>{Translate({ context: "localizations", label: "no_pickup" })}</Text>
  );
}
function messageWhenMaterialsAvailableNow(library) {
  return <Text>{library?.availability[AvailabilityEnum.NOW]} på hylden</Text>;
}

function messageWhenMaterialsAvailableLater(library) {
  return (
    <Text>
      Kan bestilles til afhentning fra d.{" "}
      {library?.expectedDelivery ||
        library?.expectedDeliveryAccumulatedFromHoldings}
    </Text>
  );
}

function messageWhenMaterialsAvailableNever(library) {
  return (
    <Text>
      NEVER.{" "}
      {library?.expectedDelivery ||
        library?.expectedDeliveryAccumulatedFromHoldings}
    </Text>
  );
}

function messageWhenMaterialsAvailableUnknown(library) {
  return (
    <Text>
      UNKNOWN.{" "}
      {library?.expectedDelivery ||
        library?.expectedDeliveryAccumulatedFromHoldings}
    </Text>
  );
}

function getBranchStatusMessage(library) {
  if (
    typeof library?.pickupAllowed !== "undefined" &&
    library?.pickupAllowed === false
  ) {
    return messageWhenNoPickup(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOW) {
    return messageWhenMaterialsAvailableNow(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.LATER) {
    return messageWhenMaterialsAvailableLater(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NEVER) {
    return messageWhenMaterialsAvailableNever(library);
  } else if (library?.availabilityAccumulated === AvailabilityEnum.UNKNOWN) {
    return messageWhenMaterialsAvailableUnknown(library);
  } else {
    return messageWhenMaterialsAvailableUnknown(library);
  }
}

export default function BranchLocalizationItemStatus({ library }) {
  return (
    <>
      <div>{getBranchStatusMessage(library)}</div>
    </>
  );
}
