export function getCoverImage(manifestations = []) {
  // Create copy, so we don't mutate the original list,
  // which leads to all sorts of fun bugs
  manifestations = [...manifestations];
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
function sortByMaterialtype(a, b) {
  // returns true if the manifistation has materialtype BOOK or EBOOK
  const hasPriority = (item) => {
    const hasPriority = item?.materialTypes?.some(
      (mat) =>
        mat.materialTypeSpecific?.code === "BOOK" ||
        mat.materialTypeSpecific?.code === "EBOOK"
    );
    return hasPriority ? 1 : 0;
  };

  // items with priority material types (BOOK, EBOOK) are moved to the front
  return hasPriority(b) - hasPriority(a);
}
