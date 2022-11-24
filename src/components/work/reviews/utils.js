/**
 * Sort reviews by
 * 1. ReviewMatVurd
 * 2. review with an url - direct access
 * 3. reviews with stars (judgment)
 * 4. others
 */
export function sortReviews(a, b) {
  return (
    Number(!!b.librariansReview) - Number(!!a.librariansReview) ||
    Number(!!b.infomediaId) - Number(!!a.infomediaId) ||
    Number(!!b.urls?.length > 0) - Number(!!a.urls?.length > 0) ||
    Number(!!b.rating) - Number(!!a.rating) ||
    0
  );
}
