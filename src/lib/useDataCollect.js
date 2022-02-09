import {
  collectRecommenderClick,
  collectSuggestPresented,
  collectSuggestClick,
  collectSearch,
  collectSearchWorkClick,
} from "@/lib/api/datacollect.mutations";
import { useFetcher } from "@/lib/api/api";

let enabled = false;
export function enableDataCollect(enable) {
  enabled = enable;
}

export default function useDataCollect() {
  const fetcher = useFetcher();

  return {
    collectSearch: (obj) => enabled && fetcher(collectSearch(obj)),
    collectSearchWorkClick: (obj) =>
      enabled && fetcher(collectSearchWorkClick(obj)),
    collectSuggestPresented: (obj) =>
      enabled && fetcher(collectSuggestPresented(obj)),
    collectSuggestClick: (obj) => enabled && fetcher(collectSuggestClick(obj)),
    collectRecommenderClick: (obj) =>
      enabled && fetcher(collectRecommenderClick(obj)),
  };
}
