import { useFetcher } from "@/lib/api/api";

import {
  collectRecommenderClick,
  collectSuggestPresented,
  collectSuggestClick,
  collectSearch,
  collectSearchWorkClick,
  collectSearchFeedback,
} from "@/lib/api/datacollect.mutations";

// Push event to matomo queue
function matomoPushEvent(event) {
  if (!document?._paq) {
    document._paq = [];
  }
  document?._paq?.push(event);
}

export default function useDataCollect() {
  const fetcher = useFetcher();

  return {
    collectSearch: (obj) => fetcher(collectSearch(obj)),
    collectSearchWorkClick: (obj) => fetcher(collectSearchWorkClick(obj)),
    collectSuggestPresented: (obj) => fetcher(collectSuggestPresented(obj)),
    collectSuggestClick: (obj) => fetcher(collectSuggestClick(obj)),
    collectRecommenderClick: (obj) => fetcher(collectRecommenderClick(obj)),
    collectSearchFeedback: (obj) => fetcher(collectSearchFeedback(obj)),
    collectAddBookmark: async ({ title, materialType }) => {
      matomoPushEvent([
        "trackEvent",
        "Huskeliste",
        "Tilføj",
        `${title} (${materialType})`,
      ]);
    },
    collectDelBookmark: async ({ title, materialType }) => {
      matomoPushEvent([
        "trackEvent",
        "Huskeliste",
        "Fjern",
        `${title} (${materialType})`,
      ]);
    },
    collectDelMultipleBookmarks: async ({ count }) => {
      matomoPushEvent([
        "trackEvent",
        "Huskeliste",
        "Fjern Multi",
        `Antal: ${count}`,
      ]);
    },
    collectStartOrderFlow: async ({ count }) => {
      matomoPushEvent([
        "trackEvent",
        "Bestil",
        "Start bestil flow",
        `Antal: ${count}`,
      ]);
    },
    collectSubmitOrder: async (materials) => {
      if (materials?.length > 1) {
        matomoPushEvent([
          "trackEvent",
          "Bestil",
          "Godkend Multi",
          `Antal: ${materials?.length}`,
        ]);
      } else {
        matomoPushEvent([
          "trackEvent",
          "Bestil",
          "Godkend",
          `${materials?.[0]?.title} (${materials?.[0]?.materialTypes})`,
        ]);
      }
    },
  };
}
