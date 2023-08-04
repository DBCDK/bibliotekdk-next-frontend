import { useState } from "react";
import {
  libraryAccess_mock,
  libraryAccess_mock2,
} from "@/components/hooks/libraryAccess_mock.fixture";
import groupBy from "lodash/groupBy";
import sum from "lodash/sum";
import isEqual from "lodash/isEqual";
import { getFirstMatch } from "@/lib/utils";
import uniqWith from "lodash/uniqWith";

const DATE_COMPARER = "2023-07-20";

export const AvailabilityEnum = Object.freeze({
  NOW: "AVAILABLE_NOW",
  LATER: "AVAILABLE_LATER",
  UNKNOWN: "UNKNOWN_AVAILABILITY",
});

function checkAvailableLater(expectedDelivery) {
  return (
    expectedDelivery &&
    typeof expectedDelivery === "string" &&
    !isNaN(Date.parse(expectedDelivery)) &&
    expectedDelivery !== DATE_COMPARER
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
      items?.map((e) => (e.expectedDelivery === DATE_COMPARER ? 1 : 0))
    ),
    [AvailabilityEnum.LATER]: sum(
      items?.map((e) => (checkAvailableLater(e?.expectedDelivery) ? 1 : 0))
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

function getAvailabilityAccumulated(expectedDelivery) {
  return expectedDelivery &&
    isEqual(new Date(expectedDelivery), new Date(DATE_COMPARER))
    ? AvailabilityEnum.NOW
    : checkAvailableLater(expectedDelivery)
    ? AvailabilityEnum.LATER
    : AvailabilityEnum.UNKNOWN;
}

function getTesta(expectedDelivery) {
  return {
    expectedDelivery: expectedDelivery,
    date_comparer: DATE_COMPARER,
    compared: expectedDelivery === DATE_COMPARER,
    functa: getAvailabilityAccumulated(expectedDelivery),
  };
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
  getFirstMatch(true, 0, [
    [!a && !b, 0],
    [a && !b, -1],
    [b && !a, 1],
    [a > b, 1],
    [a <= b, -1],
  ]);
}

export default function useAgencyAccessFactory({ pids }) {
  const [query, setQuery] = useState("");

  const agenciesGrouped = groupBy(
    libraryAccess_mock2?.data?.branches?.result.map((res) => {
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

    return {
      branches: entry,
      branchesNames: entry.map((e) => e.name),
      agencyId: entry?.map((e) => e.agencyId)?.[0],
      agencyName: entry?.map((e) => e.agencyName)?.[0],
      expectedDelivery: expectedDelivery,
      holdingStatus: entry
        .flatMap((branch) => {
          return {
            ...branch,
            agencyName: branch.agencyName,
            branchName: branch.name,
            availability: getAvailability(branch?.holdingsItems),
            availabilityById: getAvailabilityById(branch?.holdingsItems),
            availabilityAccumulated: getAvailabilityAccumulated(
              branch?.expectedDelivery
            ),
          };
        })
        .sort(sortByAvailability),
      holdingsItems: entry.flatMap((e) => e.holdingsItems.map((item) => item)),
      availability: getAvailability(entry),
      availabilityAccumulated: getAvailabilityAccumulated(expectedDelivery),
    };
  });

  const agenciesFlatSorted =
    Object.values(agenciesFlat).sort(sortByAvailability);

  const agenciesFlatSortedFilterByQueryPrimitively = agenciesFlatSorted.filter(
    (agency) =>
      agency.agencyName.toLowerCase().includes(query.toLowerCase()) ||
      agency.branchesNames.find((branchName) =>
        branchName.toLowerCase().includes(query.toLowerCase())
      )
  );

  console.log(
    "agenciesFlatSortedFilterByQueryPrimitively: ",
    agenciesFlatSortedFilterByQueryPrimitively
  );

  return {
    agenciesFlatSorted: agenciesFlatSortedFilterByQueryPrimitively,
    setQuery: setQuery,
    query: query,
  };
}
