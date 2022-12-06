import { getIsPeriodicaLike } from "@/lib/utils";
import { accessUtils } from "@/lib/accessFactory";

/**
 * Get a coverimage to use from given manifestations - from moreinfo OR default cover service
 * @param manifestations
 * @returns {{detail}|{detail: null}}
 */
export function editionCover(manifestations) {
  const manifestationWithCover = manifestations?.find(
    (manifestation) => manifestation?.cover.detail
  );
  return manifestationWithCover
    ? { detail: manifestationWithCover.cover.detail }
    : { detail: null };
}

export function inferAccessTypes(
  work,
  periodicaForm,
  initialPickupBranch,
  manifestationsBeforeCheck = null
) {
  const manifestations = manifestationsBeforeCheck || work?.manifestations?.all;

  const { digitalCopy: isDigitalCopy, physicalCopy: isPhysicalCopy } =
    accessUtils(manifestations);

  const isArticle = !!work?.workTypes?.find(
    (workType) => workType.toLowerCase() === "article"
  );

  const isPeriodicaLike = getIsPeriodicaLike(
    work?.workTypes,
    work?.materialTypes
  );
  const isArticleRequest =
    !!periodicaForm?.titleOfComponent ||
    !!periodicaForm?.authorOfComponent ||
    !!periodicaForm?.pagination;

  const availableAsDigitalCopy =
    isDigitalCopy &&
    initialPickupBranch?.digitalCopyAccess &&
    (isPeriodicaLike ? isArticleRequest : true);

  const availableAsPhysicalCopy =
    isPhysicalCopy &&
    initialPickupBranch?.pickupAllowed &&
    initialPickupBranch?.orderPolicy?.orderPossible;

  const requireDigitalAccess = isDigitalCopy && !isPhysicalCopy;

  return {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
    isPhysicalCopy,
    availableAsPhysicalCopy,
    requireDigitalAccess,
  };
}
