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
  groups.ReviewInfomedia?.sort(function (a, b) {
    return a.rating ? 1 : -1;
  });

  // sort external reviews with a url
  groups.ReviewExternalMedia?.sort(function (a, b) {
    return a.url ? -1 : 1;
  });

  // spread the groups - matvurd first, litteratursiden (direct link) second
  // newspapers (infomedia) last
  const reviews = [
    ...(groups.ReviewInfomedia || []),
    ...(groups.ReviewExternalMedia || []),
  ];

  // sort reviews with no url last
  reviews?.sort(function (a, b) {
    return a.url || a.reference ? -1 : 1;
  });

  return [...(groups.ReviewMatVurd || []), ...reviews];
}
