import { useMemo } from "react";
import { useData } from "@/lib/api/api";
import { creatorOverview } from "@/lib/api/creator.fragments";

/**
 * Creates JSON-LD representation of a creator/person.
 * Example shape:
 * - https://schema.org/WebPage with mainEntity Person
 *
 * @param {Object} params
 * @param {string} params.creatorId - Display name from route (`/ophav/[creatorId]`)
 *
 * @returns {Object|null} JSON-LD representation of a person
 */
export function usePersonJSONLD({ creatorId }) {
  const { data } = useData(creatorOverview({ display: creatorId }));

  return useMemo(() => {
    if (!data) {
      return null;
    }

    const creator = data?.creatorByDisplay;

    const creatorUrl = `https://bibliotek.dk/ophav/${encodeURIComponent(
      creatorId,
    )}`;

    const personId = creatorUrl ? `${creatorUrl}#person` : undefined;

    const res = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": creatorUrl,
      url: creatorUrl,
      name: creator?.display,
      mainEntity: {
        "@type": "Person",
        "@id": personId,
        name: creator?.display,
        url: creatorUrl,
        jobTitle: creator?.wikidata?.occupation,
        award: creator?.wikidata?.awards,
        description:
          creator?.generated?.shortSummary?.text ||
          creator?.generated?.dataSummary?.text ||
          "Se værker og udgivelser relateret til denne person.",
        knowsAbout: creator?.generated?.topSubjects?.slice(0, 10),
        sameAs: creator?.forfatterweb?.url
          ? [creator?.forfatterweb?.url]
          : undefined,
      },
    };

    Object.keys(res).forEach((k) => {
      if (res[k] === undefined || res[k] === null) {
        delete res[k];
      }
    });

    return res;
  }, [creatorId, data]);
}
