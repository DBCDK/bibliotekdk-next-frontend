import { getCanonicalWorkUrl } from "@/lib/utils";

/**
 * Maps materialType to schema.org BookFormatType
 *
 * @param {string} materialType
 *
 * @returns {string} schema.org BookFormatType
 */
function getSchemaOrgBookFormat(materialType) {
  /** https://schema.org/BookFormatType
   * AudiobookFormat
   * EBook
   * GraphicNovel
   * Hardcover
   * Paperback
   */

  materialType = materialType.toLowerCase();

  if (materialType.includes("e-bog")) {
    return "http://schema.org/EBook";
  } else if (materialType.includes("lydbog")) {
    return "http://schema.org/AudiobookFormat";
  } else if (materialType.includes("graphic")) {
    return "http://schema.org/GraphicNovel";
  } else if (materialType.includes("bog")) {
    // Hardcover or paperback?
    return "http://schema.org/Paperback";
  }
  return null;
}

/**
 * Creates JSON-LD representation ofthe work
 * - https://developers.google.com/search/docs/data-types/book
 * - https://solsort.dk/dkabm-til-schema.org
 *
 *
 * Note:
 *  - It is recommended for work and manifestations to have "sameAs" field,
 *    pointing to reference web page.
 *  - "potentialAction" is not implemented
 *  -
 *
 * @param {object} work
 *
 * @returns {object} JSON-LD representation of work
 */
export function getJSONLD({
  id,
  title,
  description,
  creators = [],
  path,
  manifestations = [],
}) {
  const url = getCanonicalWorkUrl({ title, creators, id });
  const res = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    breadcrumb: path.join(" > "),
    mainEntity: {
      "@id": id,
      "@type": "Book",
      abstract: description,
      author: creators.map((creator) => ({
        "@type": "Person",
        name: creator.name,
      })),
      name: title,
      url,
      workExample: manifestations.map((entry) => {
        const manifestation = {
          "@id": entry.pid,
          "@type": "Book",
          author: entry.creators.map((creator) => ({
            "@type": "Person",
            name: creator.name,
          })),
          datePublished: entry.datePublished,
          identifier: entry.pid,
          url,
          inLanguage: entry.inLanguage,
        };
        if (entry.title && title !== entry.title) {
          // only add name to manifestation if it differs from work
          manifestation.name = entry.title;
        }
        if (entry.isbn) {
          manifestation.isbn = entry.isbn;
        }
        if (entry.cover) {
          manifestation.image = entry.cover.detail;
        }
        if (entry.edition) {
          manifestation.bookEdition = entry.edition;
        }
        if (entry.publisher) {
          manifestation.publisher = {
            "@type": "Organization",
            name: entry.publisher,
          };
        }
        const bookFormat = getSchemaOrgBookFormat(entry.materialType);
        if (bookFormat) {
          manifestation.bookFormat = bookFormat;
        }
        return manifestation;
      }),
    },
  };
  return res;
}
