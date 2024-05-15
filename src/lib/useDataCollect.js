import { useFetcher } from "@/lib/api/api";

import {
  collectRecommenderClick,
  collectSuggestPresented,
  collectSuggestClick,
  collectSearch,
  collectSearchWorkClick,
  collectSearchFeedback,
} from "@/lib/api/datacollect.mutations";

export default function useDataCollect() {
  const fetcher = useFetcher();

  return {
    collectSearch: (obj) => fetcher(collectSearch(obj)),
    collectSearchWorkClick: (obj) => fetcher(collectSearchWorkClick(obj)),
    collectSuggestPresented: (obj) => fetcher(collectSuggestPresented(obj)),
    collectSuggestClick: (obj) => enabled && fetcher(collectSuggestClick(obj)),
    collectRecommenderClick: (obj) => fetcher(collectRecommenderClick(obj)),
    collectSearchFeedback: (obj) => fetcher(collectSearchFeedback(obj)),
  };
}
