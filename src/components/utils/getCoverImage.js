export function getCoverImage(manifestations) {
  const manifestationWithCover =
    manifestations?.find(
      (manifestation) =>
        manifestation.cover.detail && manifestation.cover.origin === "moreinfo"
    ) || manifestations?.find((manifestation) => manifestation.cover.detail);

  const coverImage = manifestationWithCover
    ? { detail: manifestationWithCover.cover.detail }
    : { detail: null };

  return coverImage;
}
