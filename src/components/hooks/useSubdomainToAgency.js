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
  greve: "/schools/logo/greve.jpg",
  odense: "/schools/logo/odense.svg",
  roskilde: "/schools/logo/roskilde.jpg",
  slagelse: "/schools/logo/slagelse.png",
  stenhus: "/schools/logo/stenhus.png",
  soroeakademi: "/schools/logo/soroeakademi.jpeg",
};

const heroPath = {
  roskilde: "/schools/hero/roskilde.jpg",
  greve: "/schools/hero/greve.jpg",
  slagelse: "/schools/hero/slagelse.jpg",
  stenhus: "/schools/hero/stenhus.jpg",
  odense: "/schools/hero/odense.jpg",
  soroeakademi: "/schools/hero/soroeakademi.jpg",
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
        setAgencyName("roskilde");

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
