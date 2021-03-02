import orderBy from "lodash/orderBy";

/**
 * function to sort array of articles (desc)
 *
 * @param {array} articles
 * See propTypes for specific props and types
 *
 * @returns {array}
 */
export function sortArticles(articles) {
  // latest articles first
  return orderBy(articles, ["entityCreated"], ["desc"]);
}
