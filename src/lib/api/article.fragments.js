/**
 * @file Contains GraphQL queries for fetching articles
 *
 */

/**
 * Articles that are promoted to the frontpage
 */
export function promotedArticles() {
  return {
    // delay: 1000, // for debugging
    query: `query {
      nodeQuery (filter: {conditions: {field: "promote", value: "1", operator: EQUAL}}) {
        entities {
          ... on NodeArticle {
            nid
            title
            fieldRubrik
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
