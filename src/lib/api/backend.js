import config from "@/config";

export default async function fetchTranslations() {
  // @TODO denher skal vi lige have kigget på - hvordan laver vi en generisk url?
  const baseURL = "http://localhost:" + config.port;
  const url = new URL(config.backend.internalurl, baseURL);
  try {
    // this one has its own 'page' to get translations - @see src/pages/api/translate.js
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json().catch((error) => {
      console.log("ERROR");
      console.log(error);
    });
  } catch (e) {
    console.log(e.toString());
  }
}
