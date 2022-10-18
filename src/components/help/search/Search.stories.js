import { Page } from "@/components/help/search/page";

const exportedObject = {
  title: "help/search",
};

export default exportedObject;

export function EmptyInput() {
  return <Page result={[]} isLoading={false} query={""} />;
}

export function NoResults() {
  return <Page result={[]} isLoading={false} query={"hest"} />;
}
NoResults.story = {
  parameters: {
    graphql: {
      resolvers: {
        EntityQueryResult: {
          entities: () => [...new Array(10).fill({})],
        },
        Entity: { __resolveType: () => "NodeFaq" },
      },
    },
  },
};

export function ShowResults() {
  return (
    <Page
      result={[
        {
          nid: 1,
          orgTitle: "Sådan søger du i bibliotek.dk",
          title: "Sådan <mark>søger</mark> du i bibliotek.dk",
          body: "... tilpasset materialetyperne, så vælger du Bøger, får du <mark>søgevalg</mark>, der passer til bøger, vælger du Film, får du <mark>søgevalg</mark>, der passer til film og så videre. Klik på <mark>Søg</mark> eller tryk på retur-knappen på tastaturet. Når ...",
          group: "some-group",
        },
        {
          nid: 2,
          orgTitle: "Om Login",
          title: "Om Login",
          body: "... til at læse artikler hos Infomedia. Bestille kopier via linket Bestil kopi. Adgang til at gemme poster og <mark>søgninger</mark> i huskeliste. Du kan logge ind på fire forskellige måder. Klik på Log ind, så får du ...",
          group: "some-group",
        },
      ]}
      isLoading={false}
      query={"søger"}
    />
  );
}

export function Loading() {
  return <Page result={[]} isLoading={true} query={"hest"} />;
}
