/**
 * @file
 * get translations from cms backend
 */

import config from "@/config";
import getConfig from "next/config";
const nextJsConfig = getConfig();

/**
 * get translations from backend
 */
export default async function fetchTranslations() {
  const disableFlag = nextJsConfig?.serverRuntimeConfig?.disableDrupalTranslate;
  console.log(
    "[fetchTranslations] disableDrupalTranslate =",
    disableFlag,
    "=> skipping fetch:",
    !!disableFlag
  );

  if (disableFlag) {
    return;
  }

  const url = config.backend.url + "/api/translation/get_translations";
  const cacheKey = config.backend.cacheKey;
  const params = { translations: {}, cachekey: cacheKey };

  console.log("[fetchTranslations] fetching translations from:", url);

  // status flag
  let ok = true;
  // @TODO errorhandling
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    console.log(
      "[fetchTranslations] response status:",
      response.status,
      response.statusText
    );

    const result = await response.json().catch((error) => {
      // @TODO log
      console.log(error, "FETCH ERROR");
      ok = false;
    });

    return { ok, result };
  } catch (e) {
    // @TODO log
    console.log(e, "ERROR");
    ok = false;
    return { ok };
  }
}
