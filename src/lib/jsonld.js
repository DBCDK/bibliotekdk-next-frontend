import { getCanonicalWorkUrl } from "./utils";

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

  if (materialType.includes("ebog")) {
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
 * Part real data and part mocked data
 * We still need some more data to be available through the API
 * - https://developers.google.com/search/docs/data-types/book
 * - https://solsort.dk/dkabm-til-schema.org
 *
 *
 * Still needs a lot of work, we need more data to be available via API
 *
 * @param {object} work
 *
 * @returns {object} json ld representation of work
 */
export function getJSONLD({
  id,
  title,
  creators = [],
  path,
  materialTypes = [],
}) {
  const res = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    breadcrumb: path.join(" > "),
    mainEntity: {
      "@id": id,
      "@type": "Book",
      author: creators.map((creator) => ({
        "@type": "Person",
        name: creator.name,
      })),
      name: title,

      url: getCanonicalWorkUrl({ title, creators, id }),
      workExample: materialTypes.map((entry) => {
        // edition/manifestation
        const manifestation = {
          "@id": entry.pid,
          "@type": "Book",
          author: creators.map((creator) => ({
            "@type": "Person",
            name: creator.name,
          })),
          //   bookEdition: '' // TODO
          datePublished: "2015-05-01", // TODO
          //   identifier // TODO
          // name: '' // only if its different, TODO
          //   sameAs: '' // TODO
          inLanguage: "Dansk", // TODO
          isbn: "00000000", // TODO
          publisher: { "@type": "Organization", name: "Some publisher" }, // TODO
          //   url // TODO
          //   potentialAction: {} // TODO
        };
        if (entry.cover) {
          manifestation.image = entry.cover.detail;
        }
        const bookFormat = getSchemaOrgBookFormat(entry.materialType);
        if (bookFormat) {
          manifestation.bookFormat = bookFormat;
        }
        return manifestation;
      }),
      //   sameAs: '' // recommended
    },
  };
  return res;
}
