/**
 * @file Contains GraphQL queries for fetching articles
 *
 */

/**
 *
 * Fetch a specific article by id (nid)
 *
 * @param {object} params
 * @param {string} params.articleId the id of the article
 */
export function article({ articleId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($articleId: String!) {
        article: nodeById(id: $articleId) {
          __typename
          ... on NodeArticle {
            nid
            entityCreated
            entityChanged
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

/**
 * Articles that are promoted to the frontpage
 */
export function promotedArticles() {
  return {
    // delay: 1000, // for debugging
    query: `query {
      nodeQuery (filter: {conditions: {field: "promote", value: "1", operator: EQUAL}}) {
        entities {
          __typename
          ... on NodeArticle {
            nid
            title
            fieldRubrik
            fieldArticleSection
            fieldArticlePosition
            fieldImage {
              alt
              title
              url
              width
              height
            }
            fieldTags {
              entity {
                entityLabel
              }
            }
          }
        }
      }
      monitor(name: "promoted_articles")
    }`,
    variables: {},
    slowThreshold: 3000,
  };
}
