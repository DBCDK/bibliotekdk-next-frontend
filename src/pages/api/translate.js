import config from "@/config";
// Translation data obj - this one needs to be passed to backend, so it knows
// what to translate
import Translate from "@/components/base/translate/Translate.json";

/**
 * Translate handler. It needs to be in the pages/api to be handled serverside -
 * if not we get a cors error.
 *
 */
export default async function handler(req, res) {
  // status flag
  let ok = true;
  // @TODO try catch here
  const response = await fetch(
    "http://bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk/get_translations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Translate),
    }
  );

  const json = await response.json().catch((error) => {
    ok = false;
  });
  res.json({ ok, translations: json });
}
