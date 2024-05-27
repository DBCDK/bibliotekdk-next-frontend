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
  if (!window?._paq) {
    window._paq = [];
  }
  window?._paq?.push(["trackEvent", ...event]);
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
      matomoPushEvent(["Huskeliste", "Tilføj", `${title} (${materialType})`]);
    },
    collectDelBookmark: async ({ title, materialType }) => {
      matomoPushEvent(["Huskeliste", "Fjern", `${title} (${materialType})`]);
    },
    collectDelMultipleBookmarks: async ({ count }) => {
      matomoPushEvent(["Huskeliste", "Fjern Multi", `Antal: ${count}`]);
    },
    collectStartOrderFlow: async ({ count }) => {
      matomoPushEvent(["Bestil", "Start bestil flow", `Antal: ${count}`]);
    },
    collectSubmitOrder: async (materials) => {
      if (materials?.length > 1) {
        matomoPushEvent([
          "Bestil",
          "Godkend Multi",
          `Antal: ${materials?.length}`,
        ]);
      } else {
        matomoPushEvent([
          "Bestil",
          "Godkend",
          `${materials?.[0]?.title} (${materials?.[0]?.materialTypes})`,
        ]);
      }
    },
  };
}
