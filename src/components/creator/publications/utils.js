/**
 * Parse works to ensure data consistency and add missing fields
 * Sorts by year (newest first)
 */
export function parseWorks(works, creatorId, debutYear) {
  if (!works || !Array.isArray(works)) {
    return [];
  }

  const parsedWorks = works.map((work) => {
    let originalWorkYear; // = work?.workYear?.year;
    let latestPublicationYear;
    let creatorFunctions;

    // Try mostRelevant first, fallback to all
    const manifestations =
      work?.manifestations?.mostRelevant || work?.manifestations?.all;
    manifestations?.forEach((manifestation) => {
      if (
        manifestation?.edition?.publicationYear?.year &&
        manifestation?.edition?.publicationYear?.year >= debutYear
      ) {
        const year = manifestation?.edition?.publicationYear?.year;
        originalWorkYear = Math.min(
          originalWorkYear || Infinity,
          year || Infinity
        );
        latestPublicationYear = Math.max(
          latestPublicationYear || -Infinity,
          year || -Infinity
        );
      }
    });

    // Find creator functions for the specific creatorId from manifestations
    if (creatorId) {
      const allFunctions = new Set();
      work?.creators
        ?.find((creator) => {
          if (creator.display === creatorId) {
            return creator;
          }
        })
        ?.roles?.forEach((role) => {
          if (role.function?.singular) {
            allFunctions.add(role.function.singular);
          }
        });

      manifestations?.forEach((manifestation) => {
        const contributor = manifestation?.contributors?.find(
          (c) => c.display === creatorId
        );
        contributor?.roles?.forEach((role) => {
          if (role.function?.singular) {
            allFunctions.add(role.function.singular);
          }
        });
      });

      const functions = Array.from(allFunctions);
      if (functions.length > 0) {
        creatorFunctions = `${creatorId} (${functions.join(", ")})`;
      } else {
        creatorFunctions = creatorId;
      }
    }

    return {
      ...work,
      originalWorkYear,
      latestPublicationYear,
      creatorFunctions,
    };
  });

  return parsedWorks.sort((a, b) => {
    return b?.originalWorkYear - a?.originalWorkYear;
  });
}
