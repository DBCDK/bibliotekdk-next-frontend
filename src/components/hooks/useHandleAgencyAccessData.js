import groupBy from "lodash/groupBy";
import { getFirstMatch, getLibraryType, LibraryTypeEnum } from "@/lib/utils";
import uniqWith from "lodash/uniqWith";
import * as branchesFragments from "@/lib/api/branches.fragments";

import { useData } from "@/lib/api/api";
import isEmpty from "lodash/isEmpty";

export const AvailabilityEnum = Object.freeze({
  NOW: "AVAILABLE_NOW",
  LATER: "AVAILABLE_LATER",
  NEVER: "AVAILABLE_NEVER",
  UNKNOWN: "AVAILABILITY_UNKNOWN",
});

export const HoldingStatusEnum = Object.freeze({
  ON_SHELF: "OnShelf",
  ON_LOAN: "OnLoan",
  NOT_FOR_LOAN: "NotForLoan",
});

export function dateIsToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function checkAvailableNow(item) {
  const expectedDelivery = item?.expectedDelivery;
  const status = item?.status;
  const isDanishPublicLibrary =
    getLibraryType(item?.agencyId) === LibraryTypeEnum.DANISH_PUBLIC_LIBRARY;

  return (
    dateIsToday(expectedDelivery) &&
    (!isDanishPublicLibrary || status === HoldingStatusEnum.ON_SHELF)
  );
}

export function dateIsLater(date) {
  return (
    date &&
    typeof date === "string" &&
    !isNaN(Date.parse(date)) &&
    !dateIsToday(date)
  );
}

function checkAvailableLater(item) {
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

export function dateIsNever(date) {
  return (
    date &&
    typeof date === "string" &&
    isNaN(Date.parse(date)) &&
    date === "never"
  );
}

function checkAvailableNever(item) {
  const expectedDelivery = item?.expectedDelivery;
  const status = item?.status;

  return (
    dateIsNever(expectedDelivery) || status === HoldingStatusEnum.NOT_FOR_LOAN
  );
}

function dateIsUnknown(date) {
  return !date || typeof date !== "string" || isNaN(Date.parse(date));
}

function checkUnknownAvailability(item) {
  const expectedDelivery = item?.expectedDelivery;
  return dateIsUnknown(expectedDelivery);
}

function getAvailability(items) {
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

function getAvailabilityAccumulated(availability) {
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

function sortByAvailability(a, b) {
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

function compareDate(a, b) {
  return getFirstMatch(true, 0, [
    [!a && !b, 0],
    [a && !b, -1],
    [b && !a, 1],
    [a > b, 1],
    [a <= b, -1],
  ]);
}

function getExpectedDeliveryAccumulatedFromHoldings(holdingItems) {
  return holdingItems
    .map((item) => item.expectedDelivery)
    .sort(compareDate)?.[0];
}

function getHoldingsWithInfoOnPickupAllowed(branch) {
  return branch?.holdingItems.map((item) => {
    return {
      ...item,
      pickupAllowed: branch?.pickupAllowed,
      agencyId: branch?.agencyId,
    };
  });
}

export function useAgenciesConformingToQuery({ pids, q }) {
  const agency1 = useData(
    q &&
      q !== "" &&
      pids &&
      branchesFragments.branchesByQuery({
        q: q,
        pids: pids,
      })
  );

  return handleAgencyAccessData(agency1);
}

export function useSingleAgency({ pids, agencyId, query = "" }) {
  const agency = useData(
    agencyId &&
      pids &&
      branchesFragments.branchesActiveInAgency({
        agencyId: agencyId,
        pids: pids,
        q: query,
      })
  );

  return handleAgencyAccessData(agency);
}

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

function enrichBranches(branch) {
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
      pickupAllowed: entry?.findIndex((e) => e.pickupAllowed) > -1,
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
