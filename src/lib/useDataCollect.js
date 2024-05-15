import { useFetcher } from "@/lib/api/api";

import {
  collectRecommenderClick,
  collectSuggestPresented,
  collectSuggestClick,
  collectSearch,
  collectSearchWorkClick,
  collectSearchFeedback,
} from "@/lib/api/datacollect.mutations";

// For storybook/cypress test purposes
let _dangerouslyForceConsent;
export function dangerouslyForceConsent(consent) {
  _dangerouslyForceConsent = process.env.STORYBOOK_ACTIVE && consent;
}

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
