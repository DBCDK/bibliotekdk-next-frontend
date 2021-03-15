import Search from "@/components/help/search";
import { useState } from "react";

export default {
  title: "help/search",
};

export function EmptyInput() {
  const [query, setQuery] = useState();
  return (
    <Search result={[]} query={query} onQueryChange={(q) => setQuery(q)} />
  );
}

export function NoResults() {
  return <Search result={[]} query={"hej"} onQueryChange={() => {}} />;
}

export function ShowResults() {
  const [query, setQuery] = useState("søg");
  const res = {
    data: {
      help: {
        result: [
          {
            nid: 1,
            orgTitle: "Sådan søger du i bibliotek.dk",
            title: "Sådan <mark>søger</mark> du i bibliotek.dk",
            body:
              "... tilpasset materialetyperne, så vælger du Bøger, får du <mark>søgevalg</mark>, der passer til bøger, vælger du Film, får du <mark>søgevalg</mark>, der passer til film og så videre. Klik på <mark>Søg</mark> eller tryk på retur-knappen på tastaturet. Når ...",
            group: "some-group",
          },
          {
            nid: 2,
            orgTitle: "Om Login",
            title: "Om Login",
            body:
              "... til at læse artikler hos Infomedia. Bestille kopier via linket Bestil kopi. Adgang til at gemme poster og <mark>søgninger</mark> i huskeliste. Du kan logge ind på fire forskellige måder. Klik på Log ind, så får du ...",
            group: "some-group",
          },
        ],
      },
    },
  };

  return (
    <Search
      result={res.data.help.result}
      query={query}
      onQueryChange={(q) => setQuery(q)}
    />
  );
}

export function Loading() {
  return <Search query="hej" isLoading={true} />;
}
