import { useData } from "@/lib/api/api";
import { holdingsForAgency } from "@/lib/api/branches.fragments";
import { dateToShortDate } from "@/utils/datetimeConverter";
import uniq from "lodash/uniq";
import { useMemo } from "react";
import Translate from "@/components/base/translate";

export const HoldingStatusEnum = Object.freeze({
  ON_SHELF: "ON_SHELF",
  ON_SHELF_NOT_FOR_LOAN: "ON_SHELF_NOT_FOR_LOAN",
  NOT_ON_SHELF: "NOT_ON_SHELF",
  NOT_OWNED: "NOT_OWNED",
  UNKNOWN_MATERIAL: "UNKNOWN_MATERIAL",
  UNKNOWN_STATUS: "UNKNOWN_STATUS",
});

const LAMP_SRC = {
  [HoldingStatusEnum.ON_SHELF]: "status__green.svg",
  [HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN]: "status__green.svg",
  [HoldingStatusEnum.NOT_ON_SHELF]: "status__yellow.svg",
  [HoldingStatusEnum.NOT_OWNED]: "status__red.svg",
  [HoldingStatusEnum.UNKNOWN_MATERIAL]: "status__grey.svg",
  [HoldingStatusEnum.UNKNOWN_STATUS]: "status__grey.svg",
};

const AVAILABILITY_SORT_SCORE = {
  [HoldingStatusEnum.ON_SHELF]: 1,
  [HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN]: 2,
  [HoldingStatusEnum.NOT_ON_SHELF]: 3,
  [HoldingStatusEnum.NOT_OWNED]: 4,
  [HoldingStatusEnum.UNKNOWN_MATERIAL]: 5,
  [HoldingStatusEnum.UNKNOWN_STATUS]: 5,
};

function getBranchHoldingsMessage(branch) {
  const numItems =
    [
      HoldingStatusEnum.ON_SHELF,
      HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN,
    ].includes(branch?.holdings?.status) && branch?.holdings?.items?.length;

  let holdingsMessage = Translate({
    context: "holdings",
    label: `message_${branch?.holdings?.status}${
      branch?.holdings?.status === HoldingStatusEnum.NOT_ON_SHELF &&
      branch?.holdings?.expectedBranchReturnDate
        ? "_HAS_RETURN_DATE"
        : ""
    }`,
    vars: branch?.holdings?.expectedBranchReturnDate && [
      dateToShortDate(branch?.holdings?.expectedBranchReturnDate),
    ],
  });

  return numItems > 0
    ? `${numItems} ${holdingsMessage?.toLowerCase()}`
    : holdingsMessage;
}

function getLocations(branch) {
  if (!branch?.holdings?.items?.length) {
    return;
  }

  const shelfmark = getShelfmark(branch);

  return uniq(
    branch.holdings.items.map((item) =>
      [item?.department, item?.location, item?.subLocation, shelfmark.code]
        .filter(Boolean)
        .join(" > ")
    )
  );
}

function getShelfmark(branch) {
  return (
    branch?.holdings?.items?.flatMap(
      (item) =>
        item?.manifestation?.classifications
          ?.filter((c) => c?.entryType === "MAIN_ENTRY" && c?.code)
          .map((c) => c) || []
    )[0] || null
  );
}

/**
 *
 */
export function useHoldingsForAgency({ agencyId, pids }) {
  const { data, isLoading } = useData(
    agencyId && pids?.length > 0 && holdingsForAgency({ agencyId, pids })
  );

  // Parse branches, and augment with holdings message and lamp color
  const branches = useMemo(() => {
    return data?.branches?.result
      ?.filter((branch) => branch.branchType !== "servicepunkt")
      ?.map((branch) => ({
        ...branch,
        holdingsMessage: getBranchHoldingsMessage(branch),
        holdingsLamp: {
          src: LAMP_SRC[branch?.holdings?.status] || "status__grey.svg",
          alt: Translate({
            context: "holdings",
            label: `lamp_alt_${branch?.holdings?.status}`,
          }),
        },
        locations: getLocations(branch),
        shelfmark: getShelfmark(branch),
        sortScore: AVAILABILITY_SORT_SCORE[branch?.holdings?.status],
      }));
  }, [data?.branches?.result]);

  // Sort by availability
  const branchesByAvailability = useMemo(() => {
    const sorted = [...(branches || [])];
    sorted.sort((a, b) => a.sortScore - b.sortScore);
    return sorted;
  }, [branches]);

  const agencyHoldingsLamp = branchesByAvailability?.[0]?.holdingsLamp;

  const branchesKnownStatus = useMemo(() => {
    return branches?.filter(
      (branch) => branch?.holdings?.status !== HoldingStatusEnum.UNKNOWN_STATUS
    );
  }, [branches]);

  const branchesUnknownStatus = useMemo(() => {
    return branches?.filter(
      (branch) => branch?.holdings?.status === HoldingStatusEnum.UNKNOWN_STATUS
    );
  }, [branches]);

  const reservablePids = useMemo(() => {
    return (
      branches?.flatMap(
        (branch) =>
          branch.holdings?.items
            ?.filter(({ reservable }) => reservable)
            .map(({ manifestation }) => manifestation) || []
      ) || []
    );
  }, [branches]);

  const expectedAgencyReturnDate =
    branchesByAvailability?.[0]?.holdings?.expectedAgencyReturnDate &&
    branchesByAvailability?.[0]?.holdings?.expectedAgencyReturnDate !==
      "never" &&
    Translate({
      context: "holdings",
      label: "message_expectedAgencyReturnDate",
      vars: [
        dateToShortDate(
          branchesByAvailability?.[0]?.holdings?.expectedAgencyReturnDate
        ),
      ],
      renderAsHtml: true,
    });

  const ownedByAgency =
    branchesByAvailability?.[0]?.holdings?.ownedByAgency || 0;

  // When the agency does not own the material
  // We fall back to the material being reservable
  // Then it may be reserved via digital article service or ILL
  const isReservable = !ownedByAgency || !!reservablePids?.length;

  return {
    isReservable,
    reservableManifestations: reservablePids,
    agencyHoldingsLamp,
    branches,
    branchesKnownStatus,
    branchesUnknownStatus,
    branchesByAvailability,
    expectedAgencyReturnDate,
    isLoading,
    ownedByAgency,
  };
}
