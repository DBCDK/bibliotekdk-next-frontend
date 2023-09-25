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
import isEmpty from "lodash/isEmpty";
import { getLibraryType, LibraryTypeEnum } from "@/lib/utils";

function escapeColons(phrase) {
  return phrase.replace(":", "%3A");
}

export function LinkForTheBranch({ library, pids, textType = "text2" }) {
  const cqlPids = pids?.map((pid) => escapeColons(pid)).join(" OR ");

  const publicLibraryWithWebsiteAndSearch =
    getLibraryType(library?.agencyId) ===
      LibraryTypeEnum.DANISH_PUBLIC_LIBRARY &&
    library?.lookupUrl &&
    library?.branchWebsiteUrl &&
    !isEmpty(cqlPids) &&
    `${library?.branchWebsiteUrl}/search/ting/${cqlPids}`;

  const website = library?.branchWebsiteUrl || library?.branchCatalogueUrl;

  return publicLibraryWithWebsiteAndSearch || website ? (
    <IconLink
      className={styles.path_blue}
      iconPlacement="right"
      iconSrc={ExternalSvg}
      iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
      textType={textType}
      href={publicLibraryWithWebsiteAndSearch || website}
      target="_blank"
    >
      {Translate({
        context: "localizations",
        label: "see_detailed_status",
        vars: [library?.agencyName],
        renderAsHtml: false,
      })}
    </IconLink>
  ) : (
    <div></div>
  );
}

function MessageWhenPickupNotAllowed() {
  return (
    <Text type="text2">
      {Translate({
        context: "localizations",
        label: "no_pickup_allowed_on_branch",
      })}
    </Text>
  );
}

function MessageWhenMaterialsAvailableNow({ library, manifestations }) {
  const locationsInBranch = uniq(
    manifestations?.map((manifestation) => manifestation?.locationInBranch)
  );

  return (
    <>
      {library?.availability[AvailabilityEnum.NOW] === 0 ? (
        <Text type="text2">
          {Translate({ context: "localizations", label: "on_shelf" })}
        </Text>
      ) : (
        <Text type="text2">
          {library?.availability[AvailabilityEnum.NOW]}{" "}
          {Translate({
            context: "localizations",
            label: "on_shelf",
          }).toLowerCase()}
        </Text>
      )}
      {locationsInBranch?.map((location) => {
        return (
          <Text type="text2" key={JSON.stringify(location)}>
            {location}
          </Text>
        );
      })}
    </>
  );
}

function MessageWhenMaterialsAvailableLater({ library }) {
  const expectedDelivery =
    library?.expectedDelivery ||
    library?.expectedDeliveryAccumulatedFromHoldings;

  return (
    <Text type="text2">
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
    <>
      <Text type="text2">
        {Translate({ context: "localizations", label: "not_for_loan" })}
      </Text>
    </>
  );
}

function MessageWhenMaterialsAvailableUnknown() {
  return (
    <>
      <Text type="text2">
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
    return <MessageWhenPickupNotAllowed />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOW) {
    return (
      <MessageWhenMaterialsAvailableNow
        library={library}
        manifestations={manifestations}
      />
    );
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

export default function BranchDetailsStatus({
  library,
  manifestations,
  pids,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.NEVER,
    AvailabilityEnum.UNKNOWN,
  ],
}) {
  const availabilityAccumulated = library?.availabilityAccumulated;

  return (
    <div className={cx(styles.row_wrapper)}>
      {possibleAvailabilities.includes(availabilityAccumulated) && (
        <AvailabilityLight
          availabilityAccumulated={availabilityAccumulated}
          pickupAllowed={library?.pickupAllowed}
        />
      )}
      <div className={styles.result}>
        <BranchStatusMessage
          library={library}
          manifestations={manifestations}
        />
        <div className={styles.link_for_branch}>
          <LinkForTheBranch library={library} pids={pids} />
        </div>
      </div>
    </div>
  );
}
