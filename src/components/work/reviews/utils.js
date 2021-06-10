import groupBy from "lodash/groupBy";

export function sortReviews(data) {
  /* sort order
  1. ReviewMatVurd
  2. review with an url - direct access
  3. reviews with stars (judgment)
  4. others
*/

  // Group data by reviewType
  const groups = groupBy(data, "__typename");

  // sort the infomedia group by rating/no rating
  const sortedInfomedia =
    groups.ReviewInfomedia &&
    groups.ReviewInfomedia.sort(function (a, b) {
      return a.rating ? -1 : 1;
    });

  // spread the groups - matvurd first, litteratursiden (direct link) second
  // newspapers (infomedia) last
  const reviews = [
    ...(groups.ReviewMatVurd || []),
    ...(groups.ReviewLitteratursiden || []),
    ...(sortedInfomedia || []),
  ];

  return reviews;
}
