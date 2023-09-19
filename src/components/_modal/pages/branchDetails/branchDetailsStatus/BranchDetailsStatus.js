import {
  AvailabilityEnum,
  dateIsLater,
} from "@/components/hooks/useHandleAgencyAccessData";
import cx from "classnames";
import styles from "./BranchDetailsStatus.module.css";
import Text from "@/components/base/text";
import uniq from "lodash/uniq";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import Translate from "@/components/base/translate";
import { dateToShortDate } from "@/utils/datetimeConverter";

import { IconLink } from "@/components/base/iconlink/IconLink";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "css/animations";

function escapeColons(phrase) {
  return phrase.replace(":", "%3A");
}

function LinkForTheBranch({ library, manifestations }) {
  const website = library?.branchWebsiteUrl || library?.branchCatalogueUrl;

  return website ? (
    <IconLink
      iconPlacement="right"
      iconSrc={ExternalSvg}
      iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
      textType="type2"
      href={"www.bibliotek.kk.dk"}
      target="_blank"
    >
      miav
      {/*{Translate({*/}
      {/*  context: "localizations",*/}
      {/*  label: "see_detailed_status",*/}
      {/*  vars: [library?.agencyName],*/}
      {/*  renderAsHtml: false,*/}
      {/*})}*/}
    </IconLink>
  ) : (
    <div></div>
  );
}

function messageWhenPickupNotAllowed() {
  return (
    <Text>{Translate({ context: "localizations", label: "no_pickup" })}</Text>
  );
}

function messageWhenMaterialsAvailableNow(library, manifestations) {
  const locationsInBranch = uniq(
    manifestations?.map((manifestation) => manifestation?.locationInBranch)
  );

  return (
    <>
      <Text>
        {Translate({
          context: "localizations",
          label: "branchDetails_AVAILABLE_NOW",
          vars: [library?.availability[AvailabilityEnum.NOW]],
        })}
      </Text>
      {locationsInBranch?.map((location) => {
        return <Text key={JSON.stringify(location)}>{location}</Text>;
      })}
    </>
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
function messageWhenMaterialsAvailableNever(library) {
  return (
    <>
      <Text>
        {Translate({ context: "localizations", label: "not_for_loan" })}
      </Text>
    </>
  );
}

function messageWhenMaterialsAvailableUnknown(library) {
  return (
    <>
      <Text>
        {Translate({ context: "localizations", label: "status_is_unknown" })}
      </Text>
    </>
  );
}

function BranchStatusMessage({ library, manifestations }) {
  if (
    typeof library?.pickupAllowed !== "undefined" &&
    library?.pickupAllowed === false
  ) {
    return messageWhenPickupNotAllowed();
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOW) {
    return messageWhenMaterialsAvailableNow(library, manifestations);
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
          style={{ paddingTop: "1px" }}
        />
      )}
      <div className={styles.result}>
        <BranchStatusMessage
          library={library}
          manifestations={manifestations}
        />
        <div className={styles.fit_content}>
          <LinkForTheBranch library={library} manifestations={manifestations} />
        </div>
      </div>
    </div>
  );
}
