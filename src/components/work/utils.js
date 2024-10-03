import Translate from "@/components/base/translate";
import Router from "next/router";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import { useData } from "@/lib/api/api";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { extractCreatorsPrioritiseCorporation } from "@/lib/utils";
import { MaterialTypeGeneralEnum } from "@/lib/enums_MaterialTypes";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

export function openAgencyLocalizationsModal({
  modal,
  pids,
  agency,
  singleManifestation,
}) {
  modal.push("agencyLocalizations", {
    title: Translate({ context: "modal", label: "title-agencylocalizations" }),
    pids: pids,
    agency: agency,
    singleManifestation: singleManifestation,
  });
}

export function openReferencesModal(modal, pids, workId, manifestation) {
  // fake a bookmarked material for multi references page
  const material = {
    manifestations: [manifestation],
    materialId: manifestation?.pid,
    materialType: manifestation?.materialTypes?.[0]?.materialTypeSpecific?.code,
    workId: workId,
  };
  modal.push("multiReferences", {
    materials: [material],
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
 * @param {Object} work
 * @returns {string}
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
 * @param {Object} work The work
 * @returns {string}
 */
function getPageDescription(work) {
  const title = work?.titles?.main[0];
  const creator = work?.creators?.[0]?.display || "";

  const { uniqueMaterialTypes: materialTypesArray, inUniqueMaterialTypes } =
    manifestationMaterialTypeFactory(work?.manifestations?.all);

  // We check for "bog", "e-bog", "lydbog ..."-something, and combined material (= "sammensat materiale")
  let types = [];
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.BOOKS.code]) &&
    types.push("bog");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.EBOOKS.code]) &&
    types.push("e-bog");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.AUDIO_BOOKS.code]) &&
    types.push("lydbog");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.NODE.code]) &&
    types.push("node");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.COMPUTER_GAMES.code]) &&
    types.push("computerspil");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.FILMS.code]) &&
    types.push("film");
  inUniqueMaterialTypes([MaterialTypeGeneralEnum.TV_SERIES.code]) &&
    types.push("serie");
  materialTypesArray?.filter((matArray) => matArray.length > 1).length > 1 &&
    types.push("sammensat materiale");
  const typesString =
    types.length > 1
      ? "som " + types.slice(0, -1).join(", ") + " eller " + types.slice(-1)
      : types.length === 1
      ? "som " + types[0]
      : "";

  return `Lån ${title}${creator && ` af ${creator}`}${
    typesString && ` ${typesString}`
  }. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.`;
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

export function useRelevantAccessesForOrderPage(selectedPids) {
  const { loanerInfo, isLoading } = useLoanerInfo();

  const hasDigitalAccess = loanerInfo?.rights?.digitalArticleService;

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
    branchIsLoading: isLoading,
    manifestationResponse: manifestationsResponse,
    manifestations: manifestations,
    allowedAccessesByTypeName: allowedAccessesByTypeName,
    allEnrichedAccesses: allEnrichedAccesses,
    allAllowedEnrichedAccesses: allAllowedEnrichedAccesses,
    hasDigitalAccess: hasDigitalAccess,
  };
}
