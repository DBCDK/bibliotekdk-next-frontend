import { getIsPeriodicaLike } from "@/lib/utils";

export function inferCheckers(
  work,
  context,
  manifestations,
  initialPickupBranch
) {
  const isArticle = work?.workTypes?.find(
    (workType) => workType.toLowerCase() === "article"
  );
  const isPeriodicaLike = getIsPeriodicaLike(
    work?.workTypes,
    work?.materialTypes
  );
  const isArticleRequest =
    !!context?.periodicaForm?.titleOfComponent ||
    !!context?.periodicaForm?.authorOfComponent ||
    !!context?.periodicaForm?.pagination;
  const isDigitalCopy = !!manifestations?.find((m) =>
    m?.access?.find((entry) => entry.issn)
  );
  const availableAsDigitalCopy =
    initialPickupBranch?.pickupBranch?.digitalCopyAccess &&
    isDigitalCopy &&
    (isPeriodicaLike ? isArticleRequest : true);

  return {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
  };
}
