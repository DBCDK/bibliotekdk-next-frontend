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

function getBook({
  id,
  title,
  description,
  creators = [],
  manifestations = [],
  url,
}) {
  return {
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
  };
}

function getArticle({
  id,
  title,
  description,
  creators = [],
  manifestations = [],
  url,
}) {
  return {
    "@id": id,
    "@type": "Article",
    abstract: description,
    author: creators.map((creator) => ({
      "@type": "Person",
      name: creator.name,
    })),
    headLine: title,
    url,
    datePublished: manifestations?.[0]?.datePublishedArticle,
    publisher: manifestations?.[0].hostPublication?.title && {
      "@type": "Organization",
      name: manifestations?.[0].hostPublication?.title,
    },
  };
}

function getCreativeWork({
  id,
  title,
  description,
  cover,
  url,
  manifestations,
}) {
  return {
    "@id": id,
    "@type": "CreativeWork",
    abstract: description,
    creator: manifestations?.[0]?.creators?.map((creator) => ({
      "@type": "Person",
      name: creator.name,
    })),
    name: title,
    url,
    image: cover?.detail,
  };
}

function getMovie({ id, title, description, url, cover, manifestations = [] }) {
  const director = manifestations?.[0]?.creators
    ?.filter((creator) => creator?.type?.includes("drt"))
    .map((director) => ({
      "@type": "Person",
      name: director.name,
    }));

  const actor = manifestations?.[0]?.creators
    ?.filter((creator) => creator?.type?.includes("act"))
    .map((director) => ({
      "@type": "Person",
      name: director.name,
    }));

  return {
    "@id": id,
    "@type": "Movie",
    abstract: description,
    director,
    actor,
    name: title,
    url,
    image: cover?.detail,
  };
}

/**
 * @TODO seo: - like this:
 * from bib-api
 * 
 const materialTypes = resolvers.Work.materialTypes(
 parent,
 args,
 context,
 info
 );

 // Return title and description
 return {
        title: `${parent.title}${
          parent.creators && parent.creators[0]
            ? ` af ${parent.creators[0].value}`
            : ""
        }`,
        description: getPageDescription({
          title: parent.title,
          creators: parent.creators,
          materialTypes,
        }),
      };
 *
 */

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
export function getJSONLD(work) {
  const url = getCanonicalWorkUrl(work);

  let mainEntity;

  switch (work?.workTypes?.[0]) {
    case "article":
      mainEntity = getArticle({ ...work, url });
      break;
    case "literature":
      mainEntity = getBook({ ...work, url });
      break;
    case "movie":
      mainEntity = getMovie({ ...work, url });
      break;
    default:
      mainEntity = getCreativeWork({ ...work, url });
  }

  const res = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    mainEntity,
  };
  return res;
}
