import groupBy from "lodash/groupBy";
import { getFirstMatch, getLibraryType, LibraryTypeEnum } from "@/lib/utils";
import uniqWith from "lodash/uniqWith";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useData } from "@/lib/api/api";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";

/**
 * @typedef AvailabilityEnum
 * @type {Readonly<{LATER: string, NOW: string, NEVER: string, UNKNOWN: string}>}
 */
export const AvailabilityEnum = Object.freeze({
  NOW: "AVAILABLE_NOW",
  LATER: "AVAILABLE_LATER",
  NEVER: "AVAILABLE_NEVER",
  UNKNOWN: "AVAILABILITY_UNKNOWN",
});

/**
 * @typedef HoldingStatusEnum
 * @type {Readonly<{ON_LOAN: string, ON_SHELF: string, NOT_FOR_LOAN: string}>}
 */
export const HoldingStatusEnum = Object.freeze({
  ON_SHELF: "OnShelf",
  ON_LOAN: "OnLoan",
  NOT_FOR_LOAN: "NotForLoan",
});

/**
 * @typedef {string} DateString
 */

/**
 * {@link dateIsToday} takes a date (string formatted YYYY-MM-DD) and returns true if date is today
 * @param {DateString} date should be formatted YYYY-MM-DD
 * @returns {boolean}
 */
export function dateIsToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

/**
 * {@link checkAvailableNow} checks if the item is available now, checking expectedDelivery and status
 * @param {Object} item
 * @returns {boolean}
 */
export function checkAvailableNow(item) {
  const expectedDelivery = item?.expectedDelivery;
  const status = item?.status;
  const isDanishPublicLibrary =
    getLibraryType(item?.agencyId) === LibraryTypeEnum.DANISH_PUBLIC_LIBRARY;

  return (
    dateIsToday(expectedDelivery) &&
    (!isDanishPublicLibrary || status === HoldingStatusEnum.ON_SHELF)
  );
}

/**
 * {@link dateIsLater} takes a date (string formatted YYYY-MM-DD) and returns true if date is after today
 * @param {DateString} date should be formatted YYYY-MM-DD
 * @returns {boolean}
 */
export function dateIsLater(date) {
  return (
    date &&
    typeof date === "string" &&
    !isNaN(Date.parse(date)) &&
    !dateIsToday(date)
  );
}

/**
 * {@link checkAvailableLater} checks if the item's availability is available later,
 *   checking expectedDelivery and status.
 *   Expected usage is, that item is checked by {@link checkAvailableNow} before {@link checkAvailableLater}
 * @param {Object} item
 * @returns {boolean}
 */
export function checkAvailableLater(item) {
  const expectedDelivery = item?.expectedDelivery;
  const status = item?.status;
  const isDanishPublicLibrary =
    getLibraryType(item?.agencyId) === LibraryTypeEnum.DANISH_PUBLIC_LIBRARY;

  return (
    (dateIsLater(expectedDelivery) || dateIsToday(expectedDelivery)) &&
    (!isDanishPublicLibrary ||
      ![HoldingStatusEnum.NOT_FOR_LOAN].includes(status) ||
      [HoldingStatusEnum.ON_LOAN, HoldingStatusEnum.ON_SHELF].includes(status))
  );
}

/**
 * {@link dateIsNever} takes a date (string formatted YYYY-MM-DD) and returns true if date is literally "never"
 * @param {DateString} date should be formatted YYYY-MM-DD
 * @returns {boolean}
 */
export function dateIsNever(date) {
  return (
    date &&
    typeof date === "string" &&
    isNaN(Date.parse(date)) &&
    date === "never"
  );
}

/**
 * {@link checkAvailableNever} checks if the item's availability is never available,
 *   checking expectedDelivery and status.
 *   Expected usage is, that item is checked by {@link checkAvailableNow}, {@link checkAvailableLater}
 *   before {@link checkAvailableNever}
 * @param {Object} item
 * @returns {boolean}
 */
export function checkAvailableNever(item) {
  const expectedDelivery = item?.expectedDelivery;
  const status = item?.status;

  return (
    dateIsNever(expectedDelivery) || status === HoldingStatusEnum.NOT_FOR_LOAN
  );
}

/**
 * {@link dateIsUnknown} takes a date (string formatted YYYY-MM-DD) and returns true if date is unknown
 * @param {DateString} date should be formatted YYYY-MM-DD
 * @returns {boolean}
 */
function dateIsUnknown(date) {
  return (
    ((!date || isNaN(Date.parse(date))) && date !== "never") ||
    typeof date !== "string"
  );
}

/**
 * {@link checkUnknownAvailability} checks if the item's availability is unknown, checking expectedDelivery
 *   Expected usage is, that item is checked by {@link checkAvailableNow}, {@link checkAvailableLater}, {@link checkAvailableNever}
 *   before {@link checkUnknownAvailability}
 * @param {Object} item
 * @returns {boolean}
 */
export function checkUnknownAvailability(item) {
  const expectedDelivery = item?.expectedDelivery;
  return dateIsUnknown(expectedDelivery);
}

/**
 * {@link getAvailabilityById} checks availability by pid
 * @param {Array.<Object>} items
 * @returns {Object}
 */
function getAvailabilityById(items) {
  const uniqueIdPairs = uniqWith(
    items.map((item) => {
      return {
        localHoldingsId: item?.localHoldingsId,
        pid: item?.pid,
      };
    }),
    (a, b) => a.pid === b.pid && a.localHoldingsId === b.localHoldingsId
  );

  return uniqueIdPairs.map((idPair) => {
    return {
      localHoldingsId: idPair?.localHoldingsId,
      pid: idPair?.pid,
      ...getAvailability(
        items?.filter(
          (item) => item?.localHoldingsId === idPair?.localHoldingsId
        )
      ),
    };
  });
}

/**
 * {@link getAvailabilityAccumulated} accumulated the availability of holdings items for the library, and returns
 *   the best availability in order:
 *   {@link AvailabilityEnum.NOW}, {@link AvailabilityEnum.LATER},
 *   {@link AvailabilityEnum.NEVER}, {@link AvailabilityEnum.UNKNOWN}
 * @param {Object} availability
 * @returns {string}
 */
export function getAvailabilityAccumulated(availability) {
  return availability[AvailabilityEnum.NOW] > 0
    ? AvailabilityEnum.NOW
    : availability[AvailabilityEnum.LATER] > 0
    ? AvailabilityEnum.LATER
    : availability[AvailabilityEnum.NEVER] > 0
    ? AvailabilityEnum.NEVER
    : availability[AvailabilityEnum.UNKNOWN] > 0
    ? AvailabilityEnum.UNKNOWN
    : AvailabilityEnum.UNKNOWN;
}

/**
 * {@link getAvailability} gets the availability of all holdings items given
 * @param {Array.<Object>} items
 * @returns {Object}
 */
export function getAvailability(items) {
  const availabilityObject = {
    [AvailabilityEnum.NOW]: 0,
    [AvailabilityEnum.LATER]: 0,
    [AvailabilityEnum.NEVER]: 0,
    [AvailabilityEnum.UNKNOWN]: 0,
  };

  for (const item of items) {
    const key = getFirstMatch(true, AvailabilityEnum.UNKNOWN, [
      [checkAvailableNow(item), AvailabilityEnum.NOW],
      [checkAvailableLater(item), AvailabilityEnum.LATER],
      [checkAvailableNever(item), AvailabilityEnum.NEVER],
      [checkUnknownAvailability(item), AvailabilityEnum.UNKNOWN],
    ]);

    availabilityObject[key] += 1;
  }

  return availabilityObject;
}

/**
 * {@link getExpectedDeliveryAccumulatedFromHoldings} gets the best expectedDelivery from all given holdings
 * @param {Array.<Object>} holdingItems
 * @returns {*}
 */
export function getExpectedDeliveryAccumulatedFromHoldings(holdingItems) {
  return holdingItems
    .map((item) => item.expectedDelivery)
    .sort(compareDate)?.[0];
}

/**
 * {@link getHoldingsWithInfoOnPickupAllowed} enriches branch's holdings items with pickupAllowed and agencyId
 * @param {Object} branch
 * @returns {Object}
 */
export function getHoldingsWithInfoOnPickupAllowed(branch) {
  return branch?.holdingItems?.map((item) => {
    return {
      ...item,
      pickupAllowed: branch?.pickupAllowed,
      agencyId: branch?.agencyId,
    };
  });
}

/**
 * {@link sortByAvailability} sorts libraries by availability (and pickupAllowed === false), in the following order:
 *   pickupAllowed === false, {@link AvailabilityEnum.NOW}, {@link AvailabilityEnum.LATER},
 *   {@link AvailabilityEnum.NEVER}, {@link AvailabilityEnum.UNKNOWN}
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export function sortByAvailability(a, b) {
  return getFirstMatch(true, 0, [
    [b?.pickupAllowed === false, -1],
    [a?.pickupAllowed === false, 1],
    [a?.availabilityAccumulated === AvailabilityEnum.NOW, -1],
    [b?.availabilityAccumulated === AvailabilityEnum.NOW, 1],
    [a?.availabilityAccumulated === AvailabilityEnum.LATER, -1],
    [b?.availabilityAccumulated === AvailabilityEnum.LATER, 1],
    [a?.availabilityAccumulated === AvailabilityEnum.NEVER, -1],
    [b?.availabilityAccumulated === AvailabilityEnum.NEVER, 1],
  ]);
}

/**
 * {@link enrichBranches} enriches branch with e.g. availability, expectedDelivery in different forms
 * @param {Object} branch
 * @returns {*&{expectedDeliveryAccumulatedFromHoldings: *, holdingStatus, availabilityById: {[AvailabilityEnum.UNKNOWN]: number, [AvailabilityEnum.LATER]: number, [AvailabilityEnum.NEVER]: number, [AvailabilityEnum.NOW]: number, localHoldingsId: *, pid: *}[], expectedDelivery: *, branchName, availabilityAccumulated: string, availability: {[AvailabilityEnum.UNKNOWN]: number, [AvailabilityEnum.LATER]: number, [AvailabilityEnum.NEVER]: number, [AvailabilityEnum.NOW]: number}, agencyName, holdingItems}}
 */
export function enrichBranches(branch) {
  const branchHoldingsWithInfoOnPickupAllowed =
    getHoldingsWithInfoOnPickupAllowed(branch);

  const availabilityAccumulated = getAvailabilityAccumulated(
    getAvailability(
      !isEmpty(branchHoldingsWithInfoOnPickupAllowed)
        ? branchHoldingsWithInfoOnPickupAllowed
        : [
            {
              expectedDelivery: branch?.holdingStatus?.expectedDelivery,
              agencyId: branch?.agencyId,
              pickupAllowed: branch?.pickupAllowed,
            },
          ]
    )
  );

  return {
    ...branch,
    holdingStatus: branch.holdingStatus,
    holdingItems: branchHoldingsWithInfoOnPickupAllowed,
    agencyName: branch.agencyName,
    branchName: branch.name,
    availability: getAvailability(branchHoldingsWithInfoOnPickupAllowed),
    availabilityById: getAvailabilityById(
      branchHoldingsWithInfoOnPickupAllowed
    ),
    availabilityAccumulated: availabilityAccumulated,
    expectedDelivery: branch?.holdingStatus?.expectedDelivery,
    expectedDeliveryAccumulatedFromHoldings:
      getExpectedDeliveryAccumulatedFromHoldings(branch?.holdingItems),
  };
}

/**
 * {@link compareDate} takes 2 dates and gives back the lowest actual date
 * (null goes to the back of sorting, but if a and b are strings we don't check)
 * @param {DateString} a
 * @param {DateString} b
 * @returns {number}
 */
export function compareDate(a, b) {
  return getFirstMatch(true, 0, [
    [!a && !b, 0],
    [a && !b, -1],
    [b && !a, 1],
    [a > b, 1],
    [a <= b, -1],
  ]);
}

/**
 * {@link handleAgencyAccessData} creates an object consumable by {@link AgencyLocalizations}, {@link BranchLocalizations} and {@link BranchDetails}
 * @param {Object} agencies
 * @returns {{agenciesIsLoading: boolean, count: number, agenciesFlatSorted: Array.<Object>}}
 */
export function handleAgencyAccessData(agencies) {
  const isLoading = agencies.isLoading;

  const agenciesGrouped = groupBy(
    agencies?.data?.branches?.result.map((res) => {
      return {
        ...res,
        holdingItems: res.holdingStatus.holdingItems,
        expectedDelivery: res.holdingStatus.expectedDelivery,
      };
    }),
    "agencyId"
  );

  const agenciesFlat = Object.values(agenciesGrouped)?.map((entry) => {
    const expectedDelivery = entry
      ?.map((e) => e.expectedDelivery)
      ?.sort(compareDate)?.[0];

    const holdingItems = entry.flatMap((e) =>
      e.holdingItems.map((item) => item)
    );

    const branches = entry?.flatMap(enrichBranches).sort(sortByAvailability);

    const allHoldingsAcrossBranchesInAgency = branches.flatMap(
      getHoldingsWithInfoOnPickupAllowed
    );

    const expectedDeliveryOnHoldingsOrAgency = !isEmpty(holdingItems)
      ? allHoldingsAcrossBranchesInAgency
      : entry?.map((e) => {
          return {
            expectedDelivery: e.expectedDelivery,
            pickupAllowed: e.pickupAllowed,
            agencyName: e.agencyName,
            branchName: e.name,
          };
        });

    return {
      agencyId: entry?.map((e) => e.agencyId)?.[0],
      agencyName: entry?.map((e) => e.agencyName)?.[0],
      availability: getAvailability(expectedDeliveryOnHoldingsOrAgency, entry),
      availabilityAccumulated: getAvailabilityAccumulated(
        getAvailability(expectedDeliveryOnHoldingsOrAgency)
      ),
      branches: branches,
      branchesNames: entry.map((e) => e.name),
      expectedDelivery: expectedDelivery,
      expectedDeliveryAccumulatedFromHoldings: allHoldingsAcrossBranchesInAgency
        .map((item) => item.expectedDelivery)
        .sort(compareDate)?.[0],
      holdingItems: allHoldingsAcrossBranchesInAgency,
      pickupAllowed: branches?.findIndex((e) => e.pickupAllowed) > -1,
    };
  });

  const agenciesFlatSorted =
    Object.values(agenciesFlat).sort(sortByAvailability);

  return {
    count: agenciesFlatSorted.length,
    agenciesFlatSorted: agenciesFlatSorted,
    agenciesIsLoading: isLoading,
  };
}

/**
 * {@link useAgencyIdsConformingToQuery} finds agencyIds that conform to query
 * @param {Array.<string>=} pids
 * @param {string=} q
 * @returns {{isLoading: boolean, agencyIds: Array.<Object>}}
 */
export function useAgencyIdsConformingToQuery({ pids, q }) {
  const agencies = useData(
    q &&
      q !== "" &&
      pids &&
      branchesFragments.branchesByQuery({
        q: q,
        pids: pids,
      })
  );

  const agencyIds = uniq(
    agencies?.data?.branches?.result?.map((branch) => branch.agencyId)
  );

  return { agencyIds: agencyIds, isLoading: agencies.isLoading };
}

/**
 * {@link useSingleAgency} finds an agency by its agencyId
 * @param {Array.<string>=} pids
 * @param {string=} agencyId
 * @returns {{agenciesIsLoading: boolean, count: number, agenciesFlatSorted: Array.<Object>}}
 */
export function useSingleAgency({ pids, agencyId }) {
  const agencyNoHighlights = useData(
    agencyId &&
      pids &&
      branchesFragments.branchesActiveInAgency({
        agencyId: agencyId,
        pids: pids,
      })
  );

  return handleAgencyAccessData(agencyNoHighlights);
}

/**
 * {@link useHighlightsForSingleAgency} finds highlights for branches in a single Agency
 * @param {string=} agencyId
 * @param {string=} query
 * @returns {{branchesWithHighlightsIsLoading: boolean, branchesWithHighlights: Array.<Object>, agencyHighlight: Object}}
 */
export function useHighlightsForSingleAgency({ agencyId, query = "" }) {
  const agencyWithHighlights = useData(
    !isEmpty(agencyId) &&
      !isEmpty(query) &&
      branchesFragments.branchesHighlightsByAgency({
        agencyId: agencyId,
        q: query,
      })
  );

  const branchesWithHighlights =
    agencyWithHighlights?.data?.branches?.result.map((branch) => {
      return {
        ...branch,
        branchName: branch?.name,
      };
    });

  return {
    branchesWithHighlights: branchesWithHighlights,
    agencyHighlight: branchesWithHighlights?.[0]?.highlights?.find(
      (highlight) => highlight.key === "agencyName"
    )?.value,
    branchesWithHighlightsIsLoading: agencyWithHighlights.isLoading,
  };
}

/**
 * {@link useSingleBranch} finds a branch by its branchId
 * @param {Array.<string>=} pids
 * @param {string=} branchId
 * @returns {{agenciesIsLoading: boolean, count: number, agenciesFlatSorted: Array<Object>}}
 */
export function useSingleBranch({ pids, branchId }) {
  const branch = useData(
    branchId &&
      pids &&
      branchesFragments.branchByBranchId({
        branchId: branchId,
        pids: pids,
      })
  );

  return handleAgencyAccessData(branch);
}