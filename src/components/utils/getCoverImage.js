export function getCoverImage(manifestations) {
  const manifestationWithCover =
    manifestations
      ?.sort(sortByMaterialtype)
      ?.find((manifestation) => manifestation?.cover?.origin === "moreinfo") ||
    manifestations?.find((manifestation) => manifestation?.cover?.detail);

  return manifestationWithCover
    ? {
        detail: manifestationWithCover?.cover?.detail,
        origin: manifestationWithCover?.cover?.origin,
        thumbnail: manifestationWithCover?.cover?.thumbnail,
      }
    : { detail: null };
}

/**
 * We want coverimages for BOOK or EBOOK first in list
 * @param a

 */
function sortByMaterialtype(a) {
  if (
    !!a?.materialTypes?.find(
      (mat) =>
        mat.materialTypeSpecific?.code === "BOOK" ||
        mat.materialTypeSpecific?.code === "EBOOK"
    )
  ) {
    return -1;
  }

  return 0;
}
