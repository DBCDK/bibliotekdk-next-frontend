import config from "@/config";
// Translation data obj - this one needs to be passed to backend, so it knows
// what to translate
import Translate from "@/components/base/translate/Translate.json";

/**
 * get translations from backend
 */
export default async function fetchTranslations() {
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
      ok = false;
    });
    return { ok: ok, translations: result };
  } catch (e) {
    console.log(e.toString());
  }
}
