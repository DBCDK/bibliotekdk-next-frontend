import Translate from "@/components/base/translate";
import Router from "next/router";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { extractCreatorsPrioritiseCorporation } from "@/lib/utils";

export function openAgencyLocalizationsModal({ modal, pids, agency }) {
  modal.push("agencyLocalizations", {
    title: Translate({ context: "modal", label: "title-agencylocalizations" }),
    pids: pids,
    agency: agency,
  });
}

export function openOrderModal({
  modal,
  pids,
  selectedAccesses,
  workId,
  singleManifestation,
  storeLoanerInfo = false,
}) {
  modal.push("order", {
    title: Translate({ context: "modal", label: "title-order" }),
    pids: pids,
    selectedAccesses: selectedAccesses,
    workId: workId,
    ...(singleManifestation && { orderType: "singleManifestation" }),
    storeLoanerInfo: storeLoanerInfo,
  });
}

export function openReferencesModal(modal, pids, workId, work, manifestation) {
  modal.push("references", {
    title: Translate({
      context: "references",
      label: "label_references_title",
    }),
    pids: pids,
    workId: workId,
    manifestation: manifestation,
  });
}

export function goToRedirectUrl(url, target = "_blank") {
  try {
    const parsedUrl = new URL(url);
    window.open(parsedUrl.href, target);
  } catch (_) {
    Router.push(url);
  }
}

/**
 * Generates the work page title
 * @param {object} work
 * @return {string}
 */
function getPageTitle(work) {
  return `${work?.titles?.main[0]}${
    work?.creators && work?.creators[0]
      ? ` af ${extractCreatorsPrioritiseCorporation(work?.creators)
          ?.map((creator) => creator?.display)
          ?.join(", ")}`
      : ""
  }`;
}

/**
 * Generates the work page description
 * @param {object} work The work
 * @returns {string}
 */
function getPageDescription(work) {
  const title = work?.titles?.main[0];
  const creator = work?.creators?.[0]?.display || "";

  const { uniqueMaterialTypes: materialTypes, inUniqueMaterialTypes } =
    manifestationMaterialTypeFactory(work?.manifestations?.all);

  // We check for "bog", "ebog", "lydbog ..."-something, and combined material (= "sammensat materiale")
  let types = [];
  inUniqueMaterialTypes(["bog"]) && types.push("bog");
  inUniqueMaterialTypes(["ebog"]) && types.push("ebog");
  materialTypes
    ?.filter((matArray) => matArray.length === 1)
    .filter((matArray) => matArray?.[0].startsWith("lydbog")).length > 0 &&
    types.push("lydbog");
  materialTypes?.filter((matArray) => matArray.length > 1).length > 1 &&
    types.push("sammensat materiale");

  const typesString =
    types.length > 0
      ? "som " + types.slice(0, -1).join(", ") + " eller " + types.slice(-1)
      : "";

  return `Lån ${title}${
    creator && ` af ${creator} `
  }${typesString}. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.`;
}

/**
 * Get title and description for search engines.
 * @param work
 * @returns {{description: string, title: string}}
 */
export function getSeo(work) {
  // Return title and description
  return {
    title: getPageTitle(work),
    description: getPageDescription(work),
  };
}

export function useBranchUserAndHasDigitalAccess(selectedPids) {
  const { loanerInfo } = useUser();

  const {
    data: branchUserData,
    isLoading: branchIsLoading,
    isSlow: branchIsSlow,
  } = useData(
    selectedPids &&
      loanerInfo?.pickupBranch &&
      branchesFragments.branchDigitalCopyAccess({
        branchId: loanerInfo?.pickupBranch,
      })
  );

  const hasDigitalAccess = useMemo(() => {
    return (
      branchUserData?.branches?.result
        ?.map((res) => res.digitalCopyAccess === true)
        .findIndex((res) => res === true) > -1
    );
  }, [branchUserData, loanerInfo]);

  return {
    branchUserData: branchUserData,
    branchIsLoading: branchIsLoading,
    branchIsSlow: branchIsSlow,
    hasDigitalAccess: hasDigitalAccess,
  };
}

export function useRelevantAccessesForOrderPage(selectedPids) {
  const { branchIsLoading, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess(selectedPids);

  const manifestationsResponse = useData(
    selectedPids &&
      manifestationFragments.manifestationsForAccessFactory({
        pid: selectedPids,
      })
  );

  const manifestations = manifestationsResponse?.data?.manifestations;

  const {
    getAllowedAccessesByTypeName,
    getAllAllowedEnrichedAccessSorted,
    allEnrichedAccesses,
  } = useMemo(() => accessFactory(manifestations), [manifestations]);

  const allAllowedEnrichedAccesses = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [
      manifestationsResponse?.data?.manifestations,
      manifestations,
      hasDigitalAccess,
    ]
  );

  const allowedAccessesByTypeName = useMemo(
    () => getAllowedAccessesByTypeName(hasDigitalAccess) || [],
    [
      manifestationsResponse?.data?.manifestations,
      manifestations,
      hasDigitalAccess,
    ]
  );

  return {
    branchIsLoading: branchIsLoading,
    manifestationResponse: manifestationsResponse,
    manifestations: manifestations,
    allowedAccessesByTypeName: allowedAccessesByTypeName,
    allEnrichedAccesses: allEnrichedAccesses,
    allAllowedEnrichedAccesses: allAllowedEnrichedAccesses,
    hasDigitalAccess: hasDigitalAccess,
  };
}
