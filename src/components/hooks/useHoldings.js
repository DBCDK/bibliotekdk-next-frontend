import { useData, useFetcherWithCache } from "@/lib/api/api";
import { holdingsForAgency } from "@/lib/api/branches.fragments";
import { dateToShortDate } from "@/utils/datetimeConverter";
import uniq from "lodash/uniq";
import { useEffect, useMemo, useState } from "react";
import Translate from "@/components/base/translate";

import * as localizationsFragments from "@/lib/api/localizations.fragments";

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
    return 3;
  }
  if (holdings?.status === HoldingStatusEnum.NOT_ON_SHELF) {
    if (holdings?.expectedBranchReturnDate || holdings?.items?.length > 0) {
      return 2;
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

function getIsLoanRestricted(holdings) {
  return (
    holdings?.items?.length > 0 &&
    holdings?.items?.every?.((item) => item.loanRestriction === "G")
  );
}

function getLampSrc(holdings) {
  const isLoanRestricted = getIsLoanRestricted(holdings);

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
    if (holdings?.expectedBranchReturnDate || holdings?.items?.length > 0) {
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
  const isLoanRestricted = getIsLoanRestricted(branch?.holdings);

  const numItemsOnShelf =
    branch?.holdings?.status === HoldingStatusEnum.ON_SHELF &&
    branch?.holdings?.items?.filter?.((item) => item.status === "ONSHELF")
      ?.length;

  const numItemsNotForLoan =
    branch?.holdings?.status === HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN &&
    branch?.holdings?.items?.filter?.((item) => item.status === "NOTFORLOAN")
      ?.length;

  const numItems = numItemsOnShelf || numItemsNotForLoan;

  let holdingsMessage = Translate({
    context: "holdings",
    label: `message_${branch?.holdings?.status}${
      (branch?.holdings?.status === HoldingStatusEnum.ON_SHELF ||
        branch?.holdings?.status === HoldingStatusEnum.ON_SHELF_NOT_FOR_LOAN) &&
      isLoanRestricted
        ? "_IS_LOAN_RESTRICTED"
        : ""
    }${
      branch?.holdings?.status === HoldingStatusEnum.NOT_ON_SHELF &&
      (branch?.holdings?.expectedBranchReturnDate ||
        branch?.holdings?.items?.length > 0)
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

// The initial state for checking inter library loan
const initialCheckInterLibraryState = {
  allowIll: false,
  allowOwnUsers: false,
  numChecked: 0,
  illConfirmed: false,
  loanRestrictedAgencies: [],
};

/**
 * Custom hook to check interlibrary loan (ILL) availability for a given set of PIDs.
 *
 * The ILL field generated by JED in `manifestation.access` is not always reliable.
 * A more accurate approach is to check localizations and holdings.
 *
 * However, this method is significantly slower, so we optimize performance
 * by stopping additional requests as soon as we determine whether ILL is supported.
 */
export function useCheckInterLibraryLoan({ pids }) {
  const fetcher = useFetcherWithCache();
  const [state, setState] = useState(initialCheckInterLibraryState);

  // Filter valid PIDs
  const filteredPids = pids?.filter((pid) => typeof pid === "string") || [];

  // Fetch agencies that own the materials
  const { data, isLoading: localizationsLoading } = useData(
    filteredPids.length > 0 &&
      localizationsFragments.localizationsAgencies({ pids: filteredPids })
  );

  // This useEffect is called, when agency data changes
  useEffect(() => {
    if (!data?.localizations?.agencies?.length) {
      return;
    }

    // Reset state when data changes
    setState(initialCheckInterLibraryState);

    let aborted = false;
    const chunkSize = 5;
    const agencies = data.localizations.agencies.map((a) => a.agencyId);

    // Will fetch holdings for all the agencies incrementally, until
    // ILL support has been verified, or there are no more agencies to fetch holdings for
    const fetchInChunks = async () => {
      let allowIll = state.allowIll;
      let allowOwnUsers = state.allowOwnUsers;
      let numChecked = state.numChecked;
      let loanRestrictedAgencies = [];

      for (let i = 0; i < agencies.length; i += chunkSize) {
        if (aborted) {
          return;
        }
        const chunk = agencies.slice(i, i + chunkSize);

        // Fetch holdings for the current batch of agencies
        const results = await Promise.all(
          chunk.map(async (agencyId) => {
            try {
              const { data } = await fetcher(
                holdingsForAgency({ agencyId, pids: filteredPids })
              );
              let chunkAllowIll = false;
              let chunkAllowOwnUsers = false;

              // Check if the agency allow for ILL, based on its holdings
              data?.branches?.result?.forEach((branch) => {
                // Only lends out to own users
                const isLoanRestricted = getIsLoanRestricted(branch?.holdings);

                if (isLoanRestricted) {
                  chunkAllowOwnUsers = true;
                } else if (
                  branch?.holdings?.status === HoldingStatusEnum.ON_SHELF ||
                  (branch?.holdings?.status ===
                    HoldingStatusEnum.NOT_ON_SHELF &&
                    branch?.holdings?.expectedAgencyReturnDate)
                ) {
                  chunkAllowIll = true;
                }
              });

              return {
                agency: data?.branches?.result?.[0],
                chunkAllowIll,
                chunkAllowOwnUsers,
              };
            } catch {
              return { chunkAllowIll: false, chunkAllowOwnUsers: false };
            }
          })
        );

        results.forEach((res) => {
          numChecked++;
          if (!res) {
            return;
          }
          allowIll = allowIll || res.chunkAllowIll;
          allowOwnUsers = allowOwnUsers || res.chunkAllowOwnUsers;
          if (!res.chunkAllowIll && res.chunkAllowOwnUsers) {
            loanRestrictedAgencies.push(res.agency);
          }
        });

        if (allowIll) {
          break;
        }
      }

      if (!aborted) {
        setState({
          allowIll,
          allowOwnUsers,
          numChecked,
          loanRestrictedAgencies,
        });
      }
    };

    fetchInChunks();

    return () => (aborted = true);
  }, [data]);

  return {
    allowIll: state.allowIll,
    allowOwnUsers: state.allowOwnUsers,
    numCheckedAgencies: state.numChecked,
    totalAgencies: data?.localizations?.agencies?.length || 0,
    loanRestrictedAgencies: state?.loanRestrictedAgencies,
    isLoading:
      localizationsLoading ||
      (!state.allowIll &&
        state.numChecked < (data?.localizations?.agencies?.length || 0)),
  };
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
          isLoanRestricted: getIsLoanRestricted(branch?.holdings),
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

  let agencyMessage;
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

  agencyMessage = expectedAgencyReturnDate;

  const unlistedWithHoldings =
    branchesByAvailability?.[0]?.holdings?.unlistedBranchItems?.filter?.(
      (item) => item.status === "ONSHELF"
    );
  if (
    branchesByAvailability?.[0]?.holdings?.status !==
      HoldingStatusEnum.ON_SHELF &&
    !expectedAgencyReturnDate &&
    unlistedWithHoldings?.length > 0
  ) {
    agencyMessage = Translate({
      context: "holdings",
      label: "message_unlistedBranchItem",
      vars: [unlistedWithHoldings?.[0]?.branchName],
      renderAsHtml: true,
    });
  }

  const ownedByAgency =
    branchesByAvailability?.[0]?.holdings?.ownedByAgency || 0;
  return {
    agencyHoldingsLamp,
    branches,
    branchesKnownStatus,
    branchesUnknownStatus,
    branchesByAvailability,
    expectedAgencyReturnDate,
    agencyMessage,
    isLoading,
    ownedByAgency,
  };
}
