import { useFetcher } from "@/lib/api/api";
import useCookieConsent from "@/components/hooks/useCookieConsent";

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
  const consent = useCookieConsent();
  const enabled = !!(
    _dangerouslyForceConsent?.statistics || consent.statistics
  );

  return {
    collectSearch: (obj) => enabled && fetcher(collectSearch(obj)),
    collectSearchWorkClick: (obj) =>
      enabled && fetcher(collectSearchWorkClick(obj)),
    collectSuggestPresented: (obj) =>
      enabled && fetcher(collectSuggestPresented(obj)),
    collectSuggestClick: (obj) => enabled && fetcher(collectSuggestClick(obj)),
    collectRecommenderClick: (obj) =>
      enabled && fetcher(collectRecommenderClick(obj)),

    // statistics consent is not required, as this is an explicit user action
    collectSearchFeedback: (obj) => fetcher(collectSearchFeedback(obj)),
  };
}
