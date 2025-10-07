/**
 * Parse works to ensure data consistency and add missing fields
 * Sorts by year (newest first)
 */
export function parseWorks(works) {
  console.log({ works });
  if (!works || !Array.isArray(works)) {
    return [];
  }

  const parsedWorks = works.map((work) => {
    let originalWorkYear; // = work?.workYear?.year;

    // Try mostRelevant first, fallback to all
    const manifestations =
      work?.manifestations?.mostRelevant || work?.manifestations?.all;
    manifestations?.forEach((manifestation) => {
      if (manifestation?.edition?.publicationYear?.year) {
        originalWorkYear = Math.min(
          originalWorkYear || Infinity,
          manifestation?.edition?.publicationYear?.year || Infinity
        );
      }
    });

    return {
      ...work,
      originalWorkYear,
    };
  });

  return parsedWorks.sort((a, b) => {
    return b?.originalWorkYear - a?.originalWorkYear;
  });
}

export function createCqlString({
  creatorId,
  generalMaterialType,
  creatorFunction,
  subjects,
  language,
  publicationYears,
}) {
  let cql = `phrase.creator="${creatorId}"`; // CQL format for creator search using allowed index
  if (generalMaterialType) {
    cql += ` AND phrase.generalmaterialtype="${generalMaterialType}"`;
  }
  if (creatorFunction) {
    cql += ` AND phrase.creatorfunction="${creatorFunction}"`;
  }
  if (subjects && subjects.length > 0) {
    cql += ` AND (${subjects
      .map((subject) => `phrase.subject="${subject}"`)
      .join(" AND ")})`;
  }
  if (language) {
    cql += ` AND phrase.mainlanguage="${language}"`;
  }
  if (publicationYears && publicationYears.length > 0) {
    cql += ` AND publicationyear=(${publicationYears
      ?.map((year) => '"' + year + '"')
      ?.join(" OR ")})`;
  }
  return cql;
}
