import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import cx from "classnames";
import styles from "./BranchDetailsStatus.module.css";
import Text from "@/components/base/text";
import uniq from "lodash/uniq";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";

function messageWhenMaterialsAvailableNow(library, manifestations) {
  const locationsInBranch = uniq(
    manifestations?.map((manifestation) => manifestation?.locationInBranch)
  );

  return (
    <>
      <Text>{library?.availability[AvailabilityEnum.NOW]} på hylden</Text>
      {locationsInBranch?.map((location) => {
        return <Text key={JSON.stringify(location)}>{location}</Text>;
      })}
    </>
  );
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

function messageWhenMaterialsAvailableUnknown(library) {
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
      Kan bestilles til afhentning fra d.{" "}
      {library?.expectedDelivery ||
        library?.expectedDeliveryAccumulatedFromHoldings}
    </Text>
  );
}

function getBranchStatusMessage(library, manifestations) {
  if (library?.availability[AvailabilityEnum.NOW] > 0) {
    return messageWhenMaterialsAvailableNow(library, manifestations);
  } else if (library?.availability[AvailabilityEnum.LATER] > 0) {
    return messageWhenMaterialsAvailableLater(library);
  } else if (library?.availability[AvailabilityEnum.NEVER] > 0) {
    return messageWhenMaterialsAvailableNever(library);
  } else if (library?.availability[AvailabilityEnum.UNKNOWN] > 0) {
    return messageWhenMaterialsAvailableUnknown(library);
  }
}

export default function BranchDetailsStatus({
  library,
  manifestations,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.NEVER,
    AvailabilityEnum.UNKNOWN,
  ],
}) {
  const accumulatedAvailability = library?.availabilityAccumulated;

  return (
    <div className={cx(styles.row_wrapper)}>
      {possibleAvailabilities.includes(accumulatedAvailability) && (
        <AvailabilityLight
          accumulatedAvailability={accumulatedAvailability}
          pickupAllowed={library?.pickupAllowed}
        />
      )}
      <div className={styles.result}>
        {getBranchStatusMessage(library, manifestations)}
      </div>
    </div>
  );
}
