import { accessFactory } from "@/lib/accessFactoryUtils";
import { AccessEnum } from "@/lib/enums";

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
  manifestations,
  authUser
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
    (!authUser || authUser?.rights?.digitalArticleService) &&
    (isPeriodicaLike ? isArticleRequest : true) &&
    isDigitalCopy;

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

/**
 *
 * @param {Object} props
 * @param {Boolean} props.isDigitalCopy
 * @param {Boolean} props.availableAsDigitalCopy
 * @param {Object[]} props.selectedAccesses
 * @param {Boolean} props.isArticleRequest
 * @param {Object} props.periodicaForm
 * @returns {String|null}
 */
export function translateArticleType({
  isDigitalCopy,
  availableAsDigitalCopy,
  selectedAccesses,
  isArticleRequest,
  periodicaForm,
}) {
  return isDigitalCopy &&
    availableAsDigitalCopy &&
    selectedAccesses?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN
    ? {
        context: "order",
        label: "will-order-digital-copy",
      }
    : isArticleRequest
    ? {
        context: "general",
        label: "article",
      }
    : periodicaForm
    ? {
        context: "general",
        label: "volume",
      }
    : null;
}
