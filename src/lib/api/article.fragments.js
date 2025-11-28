/**
 * @file Contains GraphQL queries for fetching articles
 *
 */

import { ApiEnums } from "@/lib/api/api";
import { getLangcode } from "@/components/base/translate/Translate";

/**
 *
 * Fetch a specific article by id (nid)
 *
 * @param {Object} params
 * @param {string} params.articleId the id of the article
 */
export function article({ articleId, language }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($articleId: String! $language: LanguageId! ) {
        article: nodeById(id: $articleId language:$language ) {
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
            entityOwner {
              name
            }
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
          monitor(name: "article_lookup")
        }`,
    variables: { articleId, language },
    slowThreshold: 3000,
  };
}

/**
 * Articles that are promoted to the frontpage
 */
export function promotedArticles({ language = "EN_GB" }) {
  const langcode = getLangcode(language);
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ( $language: LanguageId! $langcode: [String] ) {
      nodeQuery (limit:75 filter: {conditions: [
        {field: "type", value: ["article"]}, 
        {field: "promote", value: "1"},
        {field: "status", value: "1"},
        {field: "langcode", value: $langcode}
      ] }) {
        entities (language:$language) {
          __typename
          ... on NodeArticle {
            nid
            title
            fieldRubrik
            fieldArticleSection
            fieldArticlePosition
            entityPublished
            body {
              value
            }
            fieldAlternativeArticleUrl{
              uri
              title
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
      }
      monitor(name: "promoted_articles")
    }`,
    variables: { language, langcode },
    slowThreshold: 3000,
  };
}

/**
 * All published Articles
 */
export function allArticles({ language = "EN_GB" }) {
  const langcode = getLangcode(language);
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query( $language: LanguageId! $langcode: [String] ) {
      nodeQuery (limit:125 filter: {conditions: [
        {field: "type", value: ["article"]},
        {field: "status", value: "1"},
        {field: "langcode", value: $langcode}
      ] }) {
        entities(language:$language) {
          __typename
          ... on NodeArticle {
            nid
            title
            fieldRubrik
            entityCreated
            fieldAlternativeArticleUrl{
              uri
              title
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
      }
      monitor(name: "all_articles")
    }`,
    variables: { language, langcode },
    slowThreshold: 3000,
  };
}
