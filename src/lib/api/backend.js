/**
 * @file
 * get translations from cms backend
 */

import config from "@/config";
import getConfig from "next/config";
const nextJsConfig = getConfig();

import Translate from "@/components/base/translate/Translate.json";

/**
 * get translations from backend
 */
export default async function fetchTranslations() {
  if (nextJsConfig?.serverRuntimeConfig?.disableDrupalTranslate) {
    return;
  }

  // status flag
  let ok = true;
  // @TODO errorhandling
  try {
    const response = await fetch(config.backend.url + "/get_translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Translate),
    });

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
