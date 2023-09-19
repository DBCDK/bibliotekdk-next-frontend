import groupBy from "lodash/groupBy";
import { getFirstMatch } from "@/lib/utils";
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

function checkAvailableNow(expectedDelivery, status) {
  return dateIsToday(expectedDelivery) && status === HoldingStatusEnum.ON_SHELF;
}

export function dateIsLater(date) {
  return (
    date &&
    typeof date === "string" &&
    !isNaN(Date.parse(date)) &&
    !dateIsToday(date)
  );
}

function checkAvailableLater(expectedDelivery, status) {
  return (
    (dateIsLater(expectedDelivery) || dateIsToday(expectedDelivery)) &&
    [HoldingStatusEnum.ON_SHELF, HoldingStatusEnum.ON_LOAN].includes(status)
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

function checkAvailableNever(expectedDelivery, status) {
  return (
    dateIsNever(expectedDelivery) || status === HoldingStatusEnum.NOT_FOR_LOAN
  );
}

function dateIsUnknown(date) {
  return !date || typeof date !== "string" || isNaN(Date.parse(date));
}

function checkUnknownAvailability(expectedDelivery) {
  return dateIsUnknown(expectedDelivery);
}

function getAvailability(items) {
  const availabilityAccumulated = {
    [AvailabilityEnum.NOW]: 0,
    [AvailabilityEnum.LATER]: 0,
    [AvailabilityEnum.NEVER]: 0,
    [AvailabilityEnum.UNKNOWN]: 0,
  };

  for (const item of items) {
    console.log("item.branchName: ", item.branch);
    const key = getFirstMatch(true, AvailabilityEnum.UNKNOWN, [
      [
        checkAvailableNow(item?.expectedDelivery, item?.status),
        AvailabilityEnum.NOW,
      ],
      [
        checkAvailableLater(item?.expectedDelivery, item?.status),
        AvailabilityEnum.LATER,
      ],
      [
        checkAvailableNever(item?.expectedDelivery, item?.status),
        AvailabilityEnum.NEVER,
      ],
      [
        checkUnknownAvailability(item?.expectedDelivery),
        AvailabilityEnum.UNKNOWN,
      ],
    ]);

    availabilityAccumulated[key] += 1;
  }

  return availabilityAccumulated;
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

function getAvailabilityAccumulated(holdingItems) {
  const availability = getAvailability(holdingItems);

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
    [a?.availabilityAccumulated === "AVAILABLE_NOW", -1],
    [b?.availabilityAccumulated === "AVAILABLE_NOW", 1],
    [a?.availabilityAccumulated === "AVAILABLE_LATER", -1],
    [b?.availabilityAccumulated === "AVAILABLE_LATER", 1],
    [a?.availabilityAccumulated === "AVAILABLE_NEVER", -1],
    [b?.availabilityAccumulated === "AVAILABLE_NEVER", 1],
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

export function useAgencyHoldingStatus({ agencyId, pids }) {
  const { data: agencyHoldingStatusData } = useData(
    agencyId &&
      branchesFragments.agencyHoldingStatus({ agencyId: agencyId, pids: pids })
  );

  const holdingStatuses = agencyHoldingStatusData?.branches?.result
    .filter((branch) => branch.agencyId === agencyId)
    .map((branch) => branch.holdingStatus);

  const accumulatedAvailability = getAvailabilityAccumulated(holdingStatuses);

  return {
    accumulatedAvailability: accumulatedAvailability,
  };
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

function getExpectedDeliveryAccumulatedFromHoldings(holdingItems) {
  return holdingItems
    .map((item) => item.expectedDelivery)
    .sort(compareDate)?.[0];
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

    const branches = entry
      ?.flatMap((branch) => {
        return {
          ...branch,
          agencyName: branch.agencyName,
          branchName: branch.name,
          availability: getAvailability(branch?.holdingItems),
          availabilityById: getAvailabilityById(branch?.holdingItems),
          availabilityAccumulated: getAvailabilityAccumulated(
            !isEmpty(branch?.holdingItems)
              ? branch?.holdingItems
              : [{ expectedDelivery: branch?.holdingStatus?.expectedDelivery }]
          ),
          expectedDelivery: branch?.holdingStatus?.expectedDelivery,
          expectedDeliveryAccumulatedFromHoldings:
            getExpectedDeliveryAccumulatedFromHoldings(branch?.holdingItems),
        };
      })
      .sort(sortByAvailability);

    const allHoldingsAcrossBranchesInAgency = branches.flatMap(
      (branch) => branch.holdingItems
    );

    const expectedDeliveryOnHoldingsOrAgency = !isEmpty(holdingItems)
      ? allHoldingsAcrossBranchesInAgency
      : entry?.map((e) => {
          return {
            expectedDelivery: e.expectedDelivery,
            pickupAllowed: e.pickupAllowed,
          };
        });

    return {
      agencyId: entry?.map((e) => e.agencyId)?.[0],
      agencyName: entry?.map((e) => e.agencyName)?.[0],
      availability: getAvailability(expectedDeliveryOnHoldingsOrAgency),
      availabilityAccumulated: getAvailabilityAccumulated(
        expectedDeliveryOnHoldingsOrAgency
      ),
      branches: branches,
      branchesNames: entry.map((e) => e.name),
      expectedDelivery: expectedDelivery,
      expectedDeliveryAccumulatedFromHoldings: allHoldingsAcrossBranchesInAgency
        .map((item) => item.expectedDelivery)
        .sort(compareDate)?.[0],
      holdingItems: allHoldingsAcrossBranchesInAgency,
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
