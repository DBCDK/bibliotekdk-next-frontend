import { getCanonicalArticleUrl } from "@/lib/utils";

/**
 * Creates JSON-LD representation of the article
 * - https://developers.google.com/search/docs/data-types/article
 *
 *
 * @param {Object} article
 *
 * @returns {Object} JSON-LD representation of article
 */
export function getJSONLD({
  nid, //todo: remove nid when fully migrated to documentId
  documentId,
  title,
  fieldRubrik, //todo: remove fieldRubrik when fully migrated to subheadline
  fieldImage, //todo: remove fieldImage when fully migrated to image
  body,
  entityCreated,
  entityModified,
  entityChanged,
}) {
  const url = getCanonicalArticleUrl({ title, nid, documentId });
  const res = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    image: fieldImage?.url ? [fieldImage.url] : [],
    datePublished: entityCreated,
    dateModified: entityModified || entityChanged,
    description: fieldRubrik,
    articleBody: body && body.value,
    author: {
      "@type": "Organization",
      name: "Bibliotek.dk",
    },
    publisher: {
      "@type": "Organization",
      name: "Bibliotek.dk",
      logo: {
        "@type": "ImageObject",
        url: "https://bibliotek.dk/img/logo.png",
      },
    },
  };
  return res;
}
