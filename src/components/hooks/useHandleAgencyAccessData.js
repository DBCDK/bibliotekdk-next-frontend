import groupBy from "lodash/groupBy";
import sum from "lodash/sum";
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

function isToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function checkAvailableLater(expectedDelivery) {
  return (
    expectedDelivery &&
    typeof expectedDelivery === "string" &&
    !isNaN(Date.parse(expectedDelivery)) &&
    !isToday(expectedDelivery)
  );
}

function checkAvailableNever(expectedDelivery) {
  return (
    expectedDelivery &&
    typeof expectedDelivery === "string" &&
    !isNaN(Date.parse(expectedDelivery)) &&
    expectedDelivery === "never"
  );
}

function checkUnknownAvailability(expectedDelivery) {
  return (
    !expectedDelivery ||
    typeof expectedDelivery !== "string" ||
    isNaN(Date.parse(expectedDelivery))
  );
}

function getAvailability(items) {
  return {
    [AvailabilityEnum.NOW]: sum(
      items?.map((e) => (isToday(e.expectedDelivery) ? 1 : 0))
    ),
    [AvailabilityEnum.LATER]: sum(
      items?.map((e) => (checkAvailableLater(e?.expectedDelivery) ? 1 : 0))
    ),
    [AvailabilityEnum.NEVER]: sum(
      items?.map((e) => (checkAvailableNever(e?.expectedDelivery) ? 1 : 0))
    ),
    [AvailabilityEnum.UNKNOWN]: sum(
      items?.map((e) => (checkUnknownAvailability(e?.expectedDelivery) ? 1 : 0))
    ),
  };
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

function getAvailabilityAccumulated(holdingsItems) {
  const availability = getAvailability(holdingsItems);

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
    [a?.availabilityAccumulated === "AVAILABLE_NOW", -1],
    [b?.availabilityAccumulated === "AVAILABLE_NOW", 1],
    [a?.availabilityAccumulated === "AVAILABLE_LATER", -1],
    [b?.availabilityAccumulated === "AVAILABLE_LATER", 1],
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
      branchesFragments.branchHoldings({
        branchId: branchId,
        pids: pids,
      })
  );

  return handleAgencyAccessData(branch);
}

export function handleAgencyAccessData(agencies) {
  const isLoading = agencies.isLoading;

  const agenciesGrouped = groupBy(
    agencies?.data?.branches?.result.map((res) => {
      return {
        ...res,
        holdingsItems: res.holdingStatus.holdingItems,
        expectedDelivery: res.holdingStatus.expectedDelivery,
      };
    }),
    "agencyId"
  );

  const agenciesFlat = Object.values(agenciesGrouped)?.map((entry) => {
    const expectedDelivery = entry
      ?.map((e) => e.expectedDelivery)
      ?.sort(compareDate)?.[0];

    const holdingsItems = entry.flatMap((e) =>
      e.holdingsItems.map((item) => item)
    );

    const branches = entry
      ?.flatMap((branch) => {
        return {
          ...branch,
          agencyName: branch.agencyName,
          branchName: branch.name,
          availability: getAvailability(branch?.holdingsItems),
          availabilityById: getAvailabilityById(branch?.holdingsItems),
          availabilityAccumulated: getAvailabilityAccumulated(
            branch?.holdingsItems
          ),
        };
      })
      .sort(sortByAvailability);

    const allHoldingsAcrossBranchesInAgency = branches.flatMap(
      (branch) => branch.holdingsItems
    );

    const expectedDeliveryOnHoldingsOrAgency = !isEmpty(holdingsItems)
      ? allHoldingsAcrossBranchesInAgency
      : entry?.map((e) => {
          return { expectedDelivery: e.expectedDelivery };
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
      expectedDeliveryAccumulatedFromHoldings: holdingsItems
        .map((item) => item.expectedDelivery)
        .sort(compareDate)?.[0],
      holdingsItems: holdingsItems,
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
