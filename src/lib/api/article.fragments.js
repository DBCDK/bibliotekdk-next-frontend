/**
 * @file Contains GraphQL queries for fetching articles
 *
 */

import { ApiEnums } from "@/lib/api/api";
import { getLocale } from "@/components/base/translate/Translate";
import { getSite } from "@/components/hooks/useSiteConfig";

const ARTICLE_FIELDS = `
  documentId
  title
  subheadline
  body
  promoted
  categories {
    documentId
    name
  }
  image {
    alternativeText
    caption
    url
    width
    height
  }
  createdAt
  updatedAt
  publishedAt
`;

function normalizeImage(article) {
  if (article?.fieldImage || !article?.image) {
    return article?.fieldImage;
  }

  // Use the medium format if available, otherwise fallback to the original image
  const image = article.image.formats?.medium || article.image;

  return {
    alt: article.image.alternativeText || "",
    title: article.image.caption || "",
    url: image.url,
    width: image.width,
    height: image.height,
  };
}

function normalizeCategoryNames(article) {
  if (Array.isArray(article?.category)) {
    return article.category;
  }

  if (Array.isArray(article?.categories)) {
    return article.categories.map((category) => category?.name).filter(Boolean);
  }

  return [];
}

export function normalizeArticle(article) {
  if (!article) {
    return article;
  }

  const category = normalizeCategoryNames(article);
  const alternativeUrl = article?.fieldAlternativeArticleUrl?.uri || null;

  return {
    ...article,
    documentId: article.documentId || article.nid,
    nid: article.nid || article.documentId,
    entityCreated: article.entityCreated || article.createdAt,
    entityChanged: article.entityChanged || article.updatedAt,
    entityPublished: article.entityPublished || article.publishedAt,
    fieldRubrik: article.fieldRubrik || article.subheadline,
    fieldImage: normalizeImage(article),
    category,
    body:
      typeof article?.body === "string"
        ? { value: article.body }
        : article?.body,
    alternativeUrl,
    fieldAlternativeArticleUrl:
      article?.fieldAlternativeArticleUrl ||
      (alternativeUrl
        ? {
            uri: alternativeUrl,
          }
        : null),
  };
}

export function getArticle(data) {
  return normalizeArticle(
    data?.bibliotekdkCms?.article ||
      data?.bibliotekdkCms?.articles?.[0] ||
      data?.article
  );
}

export function getArticles(data) {
  if (data?.bibliotekdkCms?.articles) {
    return data.bibliotekdkCms.articles.map(normalizeArticle);
  }

  return [];
}

/**
 *
 * Fetch a specific article by document id
 *
 * @param {Object} params
 * @param {string} params.articleId the id of the article
 * @param {"da"|"en"} params.locale Strapi locale
 */
export function article({ articleId, locale = getLocale() }) {
  const site = getSite();
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query ($articleId: ID! $locale: BibliotekdkCmsI18NLocaleCode, $site: String!) {
      bibliotekdkCms {
        articles(
          status: PUBLISHED
          locale: $locale
          filters: {
            documentId: { eq: $articleId }
            sites: { name: { eq: $site } }
          }
          pagination: { limit: 1 }
        ) {
          ${ARTICLE_FIELDS}
        }
      }
    }`,
    variables: { articleId, locale, site },
    slowThreshold: 3000,
  };
}

/**
 * All published Articles
 */
export function allArticles({ locale = getLocale() } = {}) {
  const site = getSite();
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query($locale: BibliotekdkCmsI18NLocaleCode, $site: String!) {
      bibliotekdkCms {
        articles(
          status: PUBLISHED
          locale: $locale
          filters: { sites: { name: { eq: $site } } }
          pagination: { limit: 125 }
          sort: ["createdAt:desc"]
        ) {
          ${ARTICLE_FIELDS}
        }
      }
    }`,
    variables: { locale, site },
    slowThreshold: 3000,
  };
}
