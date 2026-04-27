/**
 * @file
 * get translations from cms backend
 */

import config from "@/config";
import { log } from "dbc-node-logger";
import getConfig from "next/config";
const nextJsConfig = getConfig();

/**
 * get translations from backend
 */
export default async function fetchTranslations() {
  if (nextJsConfig?.serverRuntimeConfig?.disableDrupalTranslate) {
    return;
  }
  const siteName = config.site;
  const url = config.backend.url + "/api/translation/get_translations";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteName }),
      next: {
        revalidate: 600, // Next.js cache: 10 minutes
      },
    });
    const result = await response.json();

    return { ok: response.ok, result };
  } catch (e) {
    log.error("Fetch translations from backend failed", {
      error: String(e),
      stacktrace: e.stack,
      siteName,
      url,
    });
    return { ok: false };
  }
}
