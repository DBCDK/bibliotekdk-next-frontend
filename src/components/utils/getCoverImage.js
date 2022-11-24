export function getCoverImage(manifestations) {
  console.log(manifestations, "ALL MANIFESTATIONS");

  const manifestationWithCover =
    manifestations?.find(
      (manifestation) =>
        manifestation.cover.detail && manifestation.cover.origin === "moreinfo"
    ) || manifestations?.find((manifestation) => manifestation.cover.detail);

  console.log(manifestationWithCover, "MANIFESTATION WITH COVER");

  const coverImage = manifestationWithCover
    ? { detail: manifestationWithCover.cover.detail }
    : { detail: null };

  return coverImage;
}
