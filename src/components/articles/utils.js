import orderBy from "lodash/orderBy";
import get from "lodash/get";
import { encodeString } from "@/lib/utils";
//TODO: remove nid and fieldAlternativeArticleUrl when fully migrated to documentId and alternativeUrl

/**
 * function to sort array of articles (desc)
 *
 * @param {Array} articles
 * See propTypes for specific props and types
 *
 * @returns {Array}
 */
export function sortArticles(articles) {
  // remove articles with alternative url (entityUrl)
  articles = articles.filter((a) => {
    return !(
      get(a, "alternativeUrl", false) ||
      get(a, "fieldAlternativeArticleUrl.uri", false)
    );
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
  let entityUrl =
    get(article, "alternativeUrl", false) ||
    get(article, "fieldAlternativeArticleUrl.uri", false);
  // check if alternative url is for linking out of the page
  let isExternal = false;
  if (entityUrl) {
    isExternal = /^https?:\/\//.test(entityUrl);
    // drupal marks an internal url - remove the mark
    if (entityUrl.indexOf("internal:") === 0) {
      entityUrl = entityUrl.replace("internal:", "");
    }
  }

  const target = isExternal ? "_blank" : "_self";
  // which pathname to use
  const pathname = entityUrl ? entityUrl : "/artikel/[title]/[articleId]";
  // Update query if no alternative url is found
  let query = {};
  if (!entityUrl) {
    query = {
      title: encodeString(article.title),
      articleId: article.documentId || article.nid,
    };
  }

  return { target, pathname, query };
}
