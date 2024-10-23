//Given a subdomain, returns agency data. e.g. odense.gym.bib.dk -> returns odense agency data
import { signIn } from "@dbcdk/login-nextjs/client";

//TODO: should we fetch from fbi-api instead?
import gymAgencies from "@/components/utils/gymAgencies.json";

import { createContext, useContext } from "react";
export const PagePropsContext = createContext(null);

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

export function hostToAgency(host) {
  const agencyName = host?.split?.(".")?.[0];

  const validAgencyName = agencyNames.includes(agencyName)
    ? agencyName
    : "roskilde";

  const agency = gymAgencies[agencyName];

  return {
    agency,
    logoPath: logoPaths[validAgencyName],
    heroPath: heroPath[validAgencyName],
  };
}
const useAgencyFromSubdomain = () => {
  const { host } = useContext(PagePropsContext);

  return {
    ...hostToAgency(host),
    signIn: () =>
      signIn(
        "adgangsplatformen",
        {},
        { agency: agency?.agencyId, force_login: 1 }
      ),
  };
};

export default useAgencyFromSubdomain;
