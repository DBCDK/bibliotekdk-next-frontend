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
          name: creator.display,
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
      if (entry.edition?.publicationYear) {
        manifestation.bookEdition = entry.edition.publicationYear.display;
      }
      if (entry.publisher) {
        manifestation.publisher = {
          "@type": "Organization",
          name: entry.publisher,
        };
      }
      const bookFormat = getSchemaOrgBookFormat(
        entry.materialTypes[0].specific
      );
      if (bookFormat) {
        manifestation.bookFormat = bookFormat;
      }
      return manifestation;
    }),
  };
}

/**
 * Get summary from manifestion - for articles there (sometimes) is info
 * to be parsed as publisher and publication date
 *
 * @TODO this is unstable - is there a better way to get publicationDate ??
 *
 * @param manifestation
 * @returns {{datePublished: *, organization: *}}
 */
function getArticleDate(manifestation) {
  const summary = manifestation?.hostPublication?.summary || null;
  const organization = manifestation?.hostPublication?.title || null;

  // split on ',' - last part is a date
  const parts = summary?.split(",");
  const date = parts?.[1]?.trim() || null;
  return {
    organization: organization,
    datePublished: date,
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
  const articlesummary = getArticleDate(manifestations?.[0]);
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
    datePublished: articlesummary.datePublished || null,
    publisher: articlesummary.datePublished && {
      "@type": "Organization",
      name: articlesummary.organization || null,
    },
  };
}

function getCreativeWork({
  id,
  title,
  description,
  url,
  manifestations,
  coverUrl,
}) {
  /* tricky .. for nodes look in contributors for creator ?? ..
   * well .. look in creators first - if no creators look in contributors
   * */
  let creator = manifestations?.[0]?.creators?.map((creator) => ({
    "@type": "Person",
    name: creator?.display,
  }));
  if (creator?.length === 0) {
    creator = manifestations?.[0]?.contributors?.map((contrib) => ({
      "@type": "Person",
      name: contrib?.display,
    }));
  }

  return {
    "@id": id,
    "@type": "CreativeWork",
    abstract: description,
    creator: creator,
    name: title,
    url,
    image: coverUrl,
  };
}

function getMovie({
  id,
  title,
  description,
  url,
  coverUrl,
  manifestations = [],
}) {
  const director = manifestations?.[0]?.creators
    .map((creator) => ({
      name: creator.display,
      functionCode: creator.roles[0]?.functionCode,
      functionName: creator.roles[0]?.function?.singular || null,
    }))
    .filter((dir) => dir.functionCode === "drt")
    .map((director) => ({
      "@type": "Person",
      name: director.name,
    }));

  const actor = manifestations?.[0]?.contributors
    .map((contrib) => ({
      name: contrib.display,
      functionCode: contrib.roles[0]?.functionCode,
      functionName: contrib.roles[0]?.function?.singular || null,
    }))
    .filter((dir) => dir.functionCode === "act")
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
    image: coverUrl,
  };
}

/**
 * we no longer get cover image on work level. Run through manifestations and
 * pick the first found - if any
 * @param work
 */
export function getCoverImage(work) {
  return (
    work?.manifestations?.all?.find((entry) => entry?.cover?.detail)?.cover
      .detail || null
  );
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
 * @param {Object} work
 *
 * @returns {Object} JSON-LD representation of work
 */
export function getJSONLD(work) {
  // set parameters for getCanonicalUrl method
  /* title, creators, id*/
  const urlWork = {
    title: work?.titles?.main[0],
    creators: work?.creators,
    id: work?.workId,
  };
  const url = getCanonicalWorkUrl(urlWork);
  const coverUrl = getCoverImage(work);
  // set parameters for led data
  /* id, title, description, creators, manifestations, url */
  const ldWork = {
    id: work?.workId,
    title: work?.titles?.main?.[0],
    description: work?.abstract?.[0],
    creators: work?.creators?.map((creator) => ({
      name: creator?.display,
    })),
    manifestations: work?.manifestations?.all,
    url: url,
    coverUrl: coverUrl,
  };
  let mainEntity;

  switch (work?.workTypes?.[0]?.toLowerCase()) {
    case "article":
      mainEntity = getArticle({ ...ldWork });
      break;
    case "literature":
      mainEntity = getBook({ ...ldWork });
      break;
    case "movie":
      mainEntity = getMovie({ ...ldWork });
      break;
    default:
      mainEntity = getCreativeWork({ ...ldWork });
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    mainEntity,
  };
}
