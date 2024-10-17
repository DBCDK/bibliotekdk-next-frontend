//Given a subdomain, returns agency data. e.g. odense.gym.bib.dk -> returns odense agency data
import { useEffect, useState } from "react";
//TODO: should we fetch from fbi-api instead?
import gymAgencies from "@/components/utils/gymAgencies.json";
//TODO: get exact subdomain names from current urls https://odense.gym.bib.dk/
const agencyNames = [
  "roskilde",
  "soro",
  "odense",
  "greve",
  "slagelse",
  "stenhus",
];
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
      }
    }
  }, []);

  return gymAgencies[agencyName];
};

export default useAgencyFromSubdomain;
