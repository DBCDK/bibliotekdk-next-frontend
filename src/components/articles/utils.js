import orderBy from "lodash/orderBy";
import get from "lodash/get";

/**
 * function to sort array of articles (desc)
 *
 * @param {array} articles
 * See propTypes for specific props and types
 *
 * @returns {array}
 */
export function sortArticles(articles) {
  // remove articles with alternative url (entityUrl)
  articles = articles.filter((a) => {
    return get(a, "entityUrl.path", false) === `/node/${a.nid}`;
  });
  // latest articles first
  return orderBy(articles, ["entityCreated"], ["desc"]);
}
