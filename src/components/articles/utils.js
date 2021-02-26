import { orderBy } from "lodash";

/**
 * The Article page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function sortArticles(articles) {
  // latest articles first
  return orderBy(articles, ["entityCreated"], ["desc"]);
}
