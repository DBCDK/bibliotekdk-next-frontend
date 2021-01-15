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
export function getJSONLD({ nid, title, fieldRubrik, fieldImage }) {
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
    datePublished: "2015-02-05T08:00:00+08:00",
    dateModified: "2015-02-05T09:20:00+08:00",
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
