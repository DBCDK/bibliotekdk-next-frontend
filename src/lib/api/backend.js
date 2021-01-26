import config from "@/config";

export default async function fetchTranslations() {
  try {
    // this one has its own 'page' to get translations - @see src/pages/api/translate.js
    const res = await fetch("http://localhost:3000/api/translate", {
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
