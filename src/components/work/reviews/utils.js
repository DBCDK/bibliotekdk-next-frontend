/**
 * Sort reviews by
 * 1. ReviewMatVurd
 * 2. review with an url - direct access
 * 3. reviews with stars (judgment)
 * 4. others
 */
export function sortReviews(a, b) {
  return (
    Number(!!b.review?.reviewByLibrarians?.length) -
      Number(!!a.review?.reviewByLibrarians?.length) ||
    Number(!!b.access?.find((a) => a.url)) -
      Number(!!a.access?.find((a) => a.url)) ||
    Number(!!b.access?.find((a) => a.id)) -
      Number(!!a.access?.find((a) => a.id)) ||
    Number(!!b.review?.rating) - Number(!!a.review?.rating) ||
    0
  );
}
