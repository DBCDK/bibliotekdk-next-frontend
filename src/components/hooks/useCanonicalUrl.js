import { useRouter } from "next/router";
import { getAppUrl } from "@/lib/utils";

/**
 * Use this hook to generate canonical URLS, and alternate 
 * URLS for the different locales. Important for SEO.
 *
 * In some cases, we want to preserve query params
 * when generating the URL - Like on the search page.

 * @param {Object} props
 * @param {Array} props.preserveParams the query params to preserve
 * @returns {Object}
 */
export default function useCanonicalUrl({ preserveParams = [] } = {}) {
  const APP_URL = getAppUrl();
  const router = useRouter();
  const preserved = preserveParams
    .filter((param) => router.query[param])
    .map((param) => `${param}=${router.query[param]}`)
    .join("&");

  const pathname = router.asPath.replace(/\?.*/, "");

  function createUrl(locale) {
    return {
      locale,
      url: [
        APP_URL,
        locale === router.defaultLocale ? "" : `/${locale}`,
        pathname,
        preserved ? `?${preserved}` : "",
      ].join(""),
    };
  }
  const canonical = createUrl(router.locale);

  const alternate = router.locales?.map((locale) => createUrl(locale)) || [];
  return { canonical, alternate, root: APP_URL };
}
