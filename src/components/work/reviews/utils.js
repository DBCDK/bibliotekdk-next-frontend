/**
 * Sort reviews by
 * 1. ReviewMatVurd
 * 2. review with an url - direct access
 * 3. reviews with stars (judgment)
 * 4. others
 */
export function sortReviews(data = []) {
  // Copy reviews, do not mutate original array
  const reviews = [...data];

  reviews.sort(function (a, b) {
    // Convert every value to either 1 or 0, to perform the comparison
    return (
      Number(!!b.librariansReview) - Number(!!a.librariansReview) ||
      Number(!!b.urls?.length > 0) - Number(!!a.urls?.length > 0) ||
      Number(!!b.infomediaId) - Number(!!a.infomediaId) ||
      Number(!!b.rating) - Number(!!a.rating)
    );
  });

  return reviews;
}
