import { getIsPeriodicaLike } from "@/lib/utils";

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
  const manifestations =
    manifestationsBeforeCheck || work?.manifestations?.all || [];

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

  const isDigitalCopy = !!manifestations?.find((m) => {
    return !!m?.access?.find((a) => a.issn);
  });

  const availableAsDigitalCopy =
    isDigitalCopy &&
    initialPickupBranch?.digitalCopyAccess &&
    (isPeriodicaLike ? isArticleRequest : true);

  const isPhysical = !!manifestations?.find((m) => {
    return m?.accessTypes?.find(
      (accessType) => accessType?.code === "PHYSICAL"
    );
  });
  const availableAsPhysicalCopy =
    isPhysical &&
    initialPickupBranch?.pickupAllowed &&
    initialPickupBranch?.orderPolicy?.orderPossible;

  const requireDigitalAccess = isDigitalCopy && !isPhysical;

  return {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
    isPhysical,
    availableAsPhysicalCopy,
    requireDigitalAccess,
  };
}
