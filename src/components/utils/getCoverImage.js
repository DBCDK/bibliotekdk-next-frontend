export function getCoverImage(manifestations) {
  const manifestationWithCover =
    manifestations?.find(
      (manifestation) => manifestation?.cover?.origin === "moreinfo"
    ) || manifestations?.find((manifestation) => manifestation?.cover?.detail);

  return manifestationWithCover
    ? {
        detail: manifestationWithCover?.cover?.detail,
        origin: manifestationWithCover?.cover?.origin,
        thumbnail: manifestationWithCover?.cover?.thumbnail,
      }
    : { detail: null };
}
