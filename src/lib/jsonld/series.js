/**
 * Creates JSON-LD representation of the article
 * - https://developers.google.com/search/docs/data-types/article
 *
 *
 * @param {Object} series
 *
 * @returns {Object} JSON-LD representation of series
 */
export function getJSONLD({ series }) {
  if (!series) {
    return null;
  }
  const url = `https://bibliotek.dk/serie/${series.seriesId}`;
  const res = {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    name: series.title,
    description: series.description,
    url: url,
    genre: series.seriesWorkTypes,
    inLanguage: series.mainLanguages?.join(", "),
    hasPart: series.members.map((member) => ({
      "@type": "CreativeWork",
      name: member.work.titles.main[0],
      url: `https://bibliotek.dk/work/${member.work.workId}`,
      description: member.work.abstract?.[0],
      genre: member.work.workTypes?.join(", "),
      creator: member.work.creators.map((creator) => ({
        "@type": "Person",
        name: creator.name,
      })),
      image: {
        "@type": "ImageObject",
        url: member.work.manifestations.mostRelevant[0]?.cover?.detail,
        thumbnail: member.work.manifestations.mostRelevant[0]?.cover?.thumbnail,
      },
    })),
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
  // find an image to represent the serie
  const serieImage = res?.hasPart?.find((part) => part?.image?.url);
  res.image = serieImage && serieImage?.image?.url;

  return res;
}
