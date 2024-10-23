//Given a subdomain, returns agency data. e.g. odense.gym.bib.dk -> returns odense agency data
import { useEffect, useState } from "react";
//TODO: should we fetch from fbi-api instead?
import gymAgencies from "@/components/utils/gymAgencies.json";
//TODO: get exact subdomain names from current urls https://odense.gym.bib.dk/
const agencyNames = [
  "roskilde",
  "soroeakademi",
  "odense",
  "greve",
  "slagelse",
  "stenhus",
];
//path to logo images
const logoPaths = {
  greve: "/schools/logo/greve.webp",
  odense: "/schools/logo/odense.svg",
  roskilde: "/schools/logo/roskilde.webp",
  slagelse: "/schools/logo/slagelse.webp",
  stenhus: "/schools/logo/stenhus.webp",
  soroeakademi: "/schools/logo/soroeakademi.webp",
};

const heroPath = {
  roskilde: "/schools/hero/roskilde.webp",
  greve: "/schools/hero/greve.webp",
  slagelse: "/schools/hero/slagelse.webp",
  stenhus: "/schools/hero/stenhus.webp",
  odense: "/schools/hero/odense.webp",
  soroeakademi: "/schools/hero/soroeakademi.webp",
};
const useAgencyFromSubdomain = () => {
  const [agencyName, setAgencyName] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subdomains = window.location?.hostname?.split(".");
      const extractedAgencyName = subdomains[0];

      if (agencyNames.includes(extractedAgencyName)) {
        setAgencyName(extractedAgencyName);
      } else if (extractedAgencyName === "localhost") {
        //TODO: remove later. For localhost testing
        setAgencyName("soroeakademi");

        // "roskilde",
        // "soroeakademi",
        // "odense",
        // "greve",
        // "slagelse",
        // "stenhus",
      }
    }
  }, []);

  return {
    agency: gymAgencies[agencyName],
    logoPath: logoPaths[agencyName],
    heroPath: heroPath[agencyName],
  };
};

export default useAgencyFromSubdomain;
