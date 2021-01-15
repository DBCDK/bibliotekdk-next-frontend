/**
 * @file Contains GraphQL queries for articles
 *
 */

/**
 * Basic work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.articleId the id of the article
 */
export function article({ articleId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($articleId: String!) {
        article: nodeById(id: $articleId) {
          ... on NodeArticle {
            nid
            title
            fieldRubrik
            body {
              value
            }
            fieldImage {
              alt
              title
              url
              width
              height
            }
          }
        }
        monitor(name: "article_lookup")
      }`,
    variables: { articleId },
    slowThreshold: 3000,
  };
}
