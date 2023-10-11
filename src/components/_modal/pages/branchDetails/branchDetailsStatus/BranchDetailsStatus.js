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
import { LinkForBranch } from "@/components/_modal/pages/base/localizationsBase/linkForBranch/LinkForBranch";

/**
 * {@link MessageWhenPickupNotAllowed} shows a possible message in {@link BranchStatusMessage}
 * @returns {React.ReactElement | null}
 */
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

/**
 * {@link MessageWhenMaterialsAvailableNow} shows a possible message in {@link BranchStatusMessage}
 * @param {Object} props
 * @param {Object<string, any>} props.library
 * @param {Array.<Object.<string, any>>} props.manifestations
 * @returns {React.ReactElement | null}
 */
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

/**
 * {@link MessageWhenMaterialsAvailableLater} shows a possible message in {@link BranchStatusMessage}
 * @param {Object} library
 * @returns {React.ReactElement | null}
 */
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

/**
 * {@link MessageWhenMaterialsAvailableNever} shows a possible message in {@link BranchStatusMessage}
 * @returns {React.ReactElement | null}
 */
function MessageWhenMaterialsAvailableNever() {
  return (
    <Text type="text2">
      {Translate({ context: "localizations", label: "not_for_loan" })}
    </Text>
  );
}

/**
 * {@link MessageWhenLibraryDoesNotOwnMaterial} shows a possible message in {@link BranchStatusMessage}
 * @returns {React.ReactElement | null}
 */
function MessageWhenLibraryDoesNotOwnMaterial() {
  return (
    <Text type="text2">
      {Translate({ context: "localizations", label: "does_not_own_material" })}
    </Text>
  );
}

/**
 * {@link MessageWhenMaterialsAvailableUnknown} shows a possible message in {@link BranchStatusMessage}
 * @returns {React.ReactElement | null}
 */
function MessageWhenMaterialsAvailableUnknown() {
  return (
    <Text type="text2">
      {Translate({ context: "localizations", label: "status_is_unknown" })}
    </Text>
  );
}

/**
 * {@link BranchStatusMessage} presents messages for branches possible status:
 *   {@link MessageWhenPickupNotAllowed}, {@link MessageWhenMaterialsAvailableNow},
 *   {@link MessageWhenMaterialsAvailableLater}, {@link MessageWhenMaterialsAvailableNever},
 *   {@link MessageWhenMaterialsAvailableUnknown}
 * @param {Object} props
 * @param {Object<string, any>} props.library
 * @param {Array.<Object.<string, any>>} props.manifestations
 * @returns {React.ReactElement | null}
 */
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
  } else if (library?.availabilityAccumulated === AvailabilityEnum.NOT_OWNED) {
    return <MessageWhenLibraryDoesNotOwnMaterial />;
  } else if (library?.availabilityAccumulated === AvailabilityEnum.UNKNOWN) {
    return <MessageWhenMaterialsAvailableUnknown />;
  } else {
    return <MessageWhenMaterialsAvailableUnknown />;
  }
}

/**
 * {@link BranchDetailsStatus} presents that Branch-wide status in {@link BranchDetails}
 *   using {@link AvailabilityLight}, {@link BranchStatusMessage}, {@link LinkForBranch}
 *
 * @param {Object} props
 * @param {Object.<string, any>} props.library
 * @param {Array.<Object.<string, any>>} props.manifestations
 * @param {Array.<string>} props.pids
 * @param {Array.<AvailabilityEnum>} props.possibleAvailabilities
 * @returns {React.ReactElement | null}
 */
export default function BranchDetailsStatus({
  library,
  manifestations,
  pids,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.NEVER,
    AvailabilityEnum.NOT_OWNED,
    AvailabilityEnum.UNKNOWN,
  ],
}) {
  const availabilityAccumulated = library?.availabilityAccumulated;

  return (
    <div className={cx(styles.row_wrapper)}>
      {possibleAvailabilities.includes(availabilityAccumulated) && (
        <AvailabilityLight availabilityAccumulated={availabilityAccumulated} />
      )}
      <div className={styles.result}>
        <BranchStatusMessage
          library={library}
          manifestations={manifestations}
        />
        {availabilityAccumulated !== AvailabilityEnum.NOT_OWNED && (
          <div className={styles.link_for_branch}>
            <LinkForBranch library={library} pids={pids} />
          </div>
        )}
      </div>
    </div>
  );
}
