import { getCanonicalArticleUrl } from "@/lib/utils";

/**
 * Creates JSON-LD representation of the article
 * - https://developers.google.com/search/docs/data-types/article
 * - https://solsort.dk/dkabm-til-schema.org
 *
 *
 * Note:
 *  - It is recommended for work and manifestations to have "sameAs" field,
 *    pointing to reference web page.
 *  - "potentialAction" is not implemented
 *
 *
 * @param {object} article
 *
 * @returns {object} JSON-LD representation of work
 */
export function getJSONLD({
  nid,
  title,
  fieldRubrik,
  fieldImage,
  body,
  entityCreated,
  entityModified,
}) {
  const url = getCanonicalArticleUrl({ title, nid });
  const res = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    image: [fieldImage],
    datePublished: entityCreated,
    dateModified: entityModified,
    description: fieldRubrik,
    articleBody: body.value,
    author: {
      "@type": "Organization",
      name: "Bibliotek.dk",
    },
    publisher: {
      "@type": "Organization",
      name: "Bibliotek.dk",
      logo: {
        "@type": "ImageObject",
        url: "https://beta.bibliotek.dk/img/logo.png",
      },
    },
  };
  return res;
}
