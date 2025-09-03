/**
 * Parse works to ensure data consistency and add missing fields
 * Falls back to earliest publication year from manifestations if workYear is missing
 * Sorts by year (newest first)
 *
 * @param {Array} works - Array of work objects from API
 * @returns {Array} - Parsed works with enhanced data, sorted by year
 */
export function parseWorks(works) {
  if (!works || !Array.isArray(works)) {
    return [];
  }

  const parsedWorks = works.map((work) => {
    // If workYear exists, return work as-is
    if (work?.workYear?.year) {
      return work;
    }

    // Find earliest publication year from manifestations
    const earliestYear = findEarliestPublicationYear(work);

    // Return work with synthetic workYear if we found a year
    if (earliestYear) {
      return {
        ...work,
        workYear: {
          year: earliestYear,
          display: earliestYear.toString(),
          // Mark as synthetic so we know it's derived
          _synthetic: true,
        },
      };
    }

    // Return original work if no year found
    return work;
  });

  // Sort by workYear (newest first), works without year go to the end
  return parsedWorks.sort((a, b) => {
    const yearA = parseInt(a?.workYear?.year, 10);
    const yearB = parseInt(b?.workYear?.year, 10);

    // If both have years, sort by year (newest first)
    if (yearA && yearB) {
      return yearB - yearA;
    }

    // Works with years come before works without years
    if (yearA && !yearB) return -1;
    if (!yearA && yearB) return 1;

    // If neither has a year, maintain original order
    return 0;
  });
}

/**
 * Find the earliest publication year from manifestations, prioritizing mostRelevant
 *
 * @param {Object} work - Work object
 * @returns {number|null} - Earliest year or null if none found
 */
function findEarliestPublicationYear(work) {
  const manifestations = [
    ...(work?.manifestations?.mostRelevant || []),
    ...(work?.manifestations?.all || []),
    work?.manifestations?.bestRepresentation,
  ].filter(Boolean);

  const years = manifestations
    .map((m) => parseInt(m?.edition?.publicationYear?.year, 10))
    .filter(
      (year) => year && year > 1000 && year <= new Date().getFullYear() + 10
    );

  return years.length > 0 ? Math.min(...years) : null;
}
