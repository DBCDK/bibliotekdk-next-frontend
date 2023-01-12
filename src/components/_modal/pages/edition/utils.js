import { accessFactory } from "@/lib/accessFactoryUtils";

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
  periodicaForm,
  initialPickupBranch,
  manifestations
) {
  const {
    allEnrichedAccesses,
    digitalCopyArray,
    physicalCopyArray,
    isPeriodicaLikeArray,
  } = accessFactory(manifestations);

  const isDigitalCopy = digitalCopyArray?.find((single) => single === true);
  const isPhysicalCopy = physicalCopyArray?.find((single) => single === true);
  const isPeriodicaLike = isPeriodicaLikeArray?.find(
    (single) => single === true
  );

  const isArticle = !!allEnrichedAccesses?.workTypes?.find(
    (workType) => workType.toLowerCase() === "article"
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
