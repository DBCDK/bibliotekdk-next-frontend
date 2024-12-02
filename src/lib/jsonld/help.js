import { getCanonicalArticleUrl } from "@/lib/utils";
import Translate from "@/components/base/translate";

/**
 * Creates JSON-LD representation of the (help) article
 * - https://developers.google.com/search/docs/data-types/article
 *
 *
 * @param {Object} article
 *
 * @returns {Object} JSON-LD representation of article
 */
export function getJSONLD({
  nid,
  title,
  fieldImage,
  body,
  entityCreated,
  entityChanged,
}) {
  const url = getCanonicalArticleUrl({ title, nid });
  const description = Translate({
    context: "metadata",
    label: "help-description",
  });
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
    dateModified: entityChanged,
    description,
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
