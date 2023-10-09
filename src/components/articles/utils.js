import orderBy from "lodash/orderBy";
import get from "lodash/get";
import { encodeString } from "@/lib/utils";

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
    return !get(a, "fieldAlternativeArticleUrl", false);
  });
  // latest articles first
  return orderBy(articles, ["entityCreated"], ["desc"]);
}

/**
 * What kind of link should the article use ?. Check if article
 * has an alternative url and if it is external. Return info needed to generate
 * an url.
 * @param article
 * @returns {{query: {}, target: (string), pathname: (*|string)}}
 */
export function articlePathAndTarget(article) {
  // Check for alternative url
  let entityUrl = get(article, "fieldAlternativeArticleUrl.uri", false);
  // check if alternative url is for linking out of the page
  let isExternal = false;
  if (entityUrl) {
    isExternal = entityUrl.indexOf("internal") === -1;
    // drupal marks an internal url - remove the mark
    if (!isExternal) {
      entityUrl = entityUrl.replace("internal:", "");
    }
  }

  const target = isExternal ? "_blank" : "_self";
  // which pathname to use
  const pathname = entityUrl ? entityUrl : "/artikel/[title]/[articleId]";
  // Update query if no alternative url is found
  let query = {};
  if (!entityUrl) {
    query = { title: encodeString(article.title), articleId: article.nid };
  }

  return { target, pathname, query };
}
