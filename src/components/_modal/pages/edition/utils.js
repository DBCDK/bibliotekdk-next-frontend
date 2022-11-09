import { getIsPeriodicaLike } from "@/lib/utils";

export function inferAccessTypes(
  work,
  periodicaForm,
  initialPickupBranch,
  manifestationsBeforeCheck = {}
) {
  const manifestations =
    Object.keys(manifestationsBeforeCheck)?.length > 0
      ? manifestationsBeforeCheck
      : work?.manifestations?.all;

  const isArticle = work?.workTypes?.find(
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
    return m?.accessTypes?.find(
      (accessType) => accessType?.display === "online"
    );
  });
  const availableAsDigitalCopy =
    isDigitalCopy &&
    initialPickupBranch?.digitalCopyAccess &&
    (isPeriodicaLike ? isArticleRequest : true);

  const isPhysical = !!manifestations?.find((m) => {
    return m?.accessTypes?.find(
      (accessType) => accessType?.display === "fysisk"
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
