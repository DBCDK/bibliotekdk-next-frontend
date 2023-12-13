import uniq from "lodash/uniq";

export function getUniqueCreatorsDisplay(series) {
  const creators = uniq(
    series?.members?.flatMap((member) =>
      member?.work?.creators?.map((creator) => creator?.display)
    )
  );

  return { creators: creators, creatorsToShow: creators.length > 2 ? 1 : 2 };
}
