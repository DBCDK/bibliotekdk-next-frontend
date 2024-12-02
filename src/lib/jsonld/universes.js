/**
 * Creates JSON-LD representation of the article
 * - https://developers.google.com/search/docs/data-types/article
 *
 *
 * @param {Object} universe
 *
 * @returns {Object} JSON-LD representation of article
 */
export function getJSONLD({ universe }) {
  const url = `https://bibliotek.dk/univers/${universe.universeId}`;
  const res = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    name: universe.title,
    description: universe.description,
    url: url,
    genre: universe.workTypes,
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
