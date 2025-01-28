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

function getAvailabilityScore(holdings) {
  if (holdings?.status === HoldingStatusEnum.ON_SHELF) {
    return 1;
  }
  if (holdings?.status === HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN) {
    return 2;
  }
  if (holdings?.status === HoldingStatusEnum.NOT_ON_SHELF) {
    if (holdings?.expectedBranchReturnDate) {
      return 3;
    }
    return 4;
  }
  if (holdings?.status === HoldingStatusEnum.NOT_OWNED) {
    return 5;
  }
  if (holdings?.status === HoldingStatusEnum.UNKNOWN_MATERIAL) {
    return 6;
  }
  if (holdings?.status === HoldingStatusEnum.UNKNOWN_STATUS) {
    return 6;
  }
  return 6;
}

function getLampSrc(holdings) {
  const isLoanRestricted =
    holdings?.items?.length > 0 &&
    holdings?.items?.every?.((item) => item.loanRestriction === "G");

  if (holdings?.status === HoldingStatusEnum.ON_SHELF) {
    if (isLoanRestricted) {
      return "status__green_nofill.svg";
    }
    return "status__green.svg";
  }
  if (holdings?.status === HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN) {
    return "status__red.svg";
  }
  if (holdings?.status === HoldingStatusEnum.NOT_ON_SHELF) {
    if (holdings?.expectedBranchReturnDate) {
      return "status__yellow.svg";
    }
    return "status__red.svg";
  }
  if (holdings?.status === HoldingStatusEnum.NOT_OWNED) {
    return "status__red.svg";
  }
  if (holdings?.status === HoldingStatusEnum.UNKNOWN_MATERIAL) {
    return "status__grey.svg";
  }
  if (holdings?.status === HoldingStatusEnum.UNKNOWN_STATUS) {
    return "status__grey.svg";
  }
  return "status__grey.svg";
}

function getBranchHoldingsMessage(branch) {
  const isLoanRestricted =
    branch?.holdings?.items?.length > 0 &&
    branch?.holdings?.items?.every?.((item) => item.loanRestriction === "G");
  const numItems =
    [
      HoldingStatusEnum.ON_SHELF,
      HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN,
    ].includes(branch?.holdings?.status) && branch?.holdings?.items?.length;

  let holdingsMessage = Translate({
    context: "holdings",
    label: `message_${branch?.holdings?.status}${
      branch?.holdings?.status === HoldingStatusEnum.ON_SHELF &&
      isLoanRestricted
        ? "_IS_LOAN_RESTRICTED"
        : ""
    }${
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
  return uniq(
    branch?.holdings?.items?.map((item) =>
      [item?.department, item?.location, item?.subLocation]
        .filter((entry) => !!entry)
        .join(" > ")
    )
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
      ?.map((branch) => {
        return {
          ...branch,
          holdingsMessage: getBranchHoldingsMessage(branch),
          holdingsLamp: {
            src: getLampSrc(branch?.holdings),
            alt: Translate({
              context: "holdings",
              label: `lamp_alt_${branch?.holdings?.status}`,
            }),
          },
          locations: getLocations(branch),
          sortScore: getAvailabilityScore(branch?.holdings),
        };
      });
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

  return {
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
