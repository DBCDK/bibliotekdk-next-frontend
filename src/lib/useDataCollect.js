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
    collectSeriesTeaserClick: async ({ seriesId, title }) => {
      matomoPushEvent([
        "Teaserbox",
        "Klik på serielink",
        `${title} (${seriesId})`,
      ]);
    },
    collectCreatorTeaserClick: async ({ name }) => {
      matomoPushEvent(["Teaserbox", "Klik på ophavslink", name]);
    },
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
    collectChooseLastUsedLibrary: async () => {
      matomoPushEvent(["Login", "Klik på sidst anvendte bibliotek"]);
    },
    collectSearchLibrary: async () => {
      matomoPushEvent(["Login", "Søg bibliotek frem"]);
    },
    collectSearchLibraryWithLastUsed: async () => {
      matomoPushEvent([
        "Login",
        "Søg bibliotek frem, når der er vist et sidst anvendte bibliotek",
      ]);
    },
    collectUseMitID: async () => {
      matomoPushEvent(["Login", "Klik på MitID knap"]);
    },
    collectCreateLibraryUser: async () => {
      matomoPushEvent(["Login", "Klik på opret dig som låner på et bibliotek"]);
    },
  };
}
