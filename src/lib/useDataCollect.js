import {
  collectRecommenderClick,
  collectSuggestPresented,
  collectSuggestClick,
  collectSearch,
  collectSearchWorkClick,
  collectSearchFeedback,
} from "@/lib/api/datacollect.mutations";
import { useFetcher } from "@/lib/api/api";
import useCookieConsent from "@/components/hooks/useCookieConsent";

export default function useDataCollect() {
  const fetcher = useFetcher();
  const consent = useCookieConsent();
  const enabled = !!consent.statistics;

  console.log("use data collect is ", enabled);

  return {
    collectSearch: (obj) => enabled && fetcher(collectSearch(obj)),
    collectSearchWorkClick: (obj) =>
      enabled && fetcher(collectSearchWorkClick(obj)),
    collectSuggestPresented: (obj) =>
      enabled && fetcher(collectSuggestPresented(obj)),
    collectSuggestClick: (obj) => enabled && fetcher(collectSuggestClick(obj)),
    collectRecommenderClick: (obj) =>
      enabled && fetcher(collectRecommenderClick(obj)),
    collectSearchFeedback: (obj) =>
      enabled && fetcher(collectSearchFeedback(obj)),
  };
}
