import { StoryTitle, StoryDescription } from "@/storybook";
import SimpleFacets from "./SimpleFacets";

const exportedObject = {
  title: "search/facets",
};

export default exportedObject;

const simpleSearchFacets = [
  {
    name: "materialTypesSpecific",
    values: [
      {
        term: "bog",
        key: "bog",
        score: 1443,
      },
      {
        term: "billedbog",
        key: "billedbog",
        score: 122,
      },
      {
        term: "e-bog",
        key: "e-bog",
        score: 112,
      },
      {
        term: "lydbog (online)",
        key: "lydbog (online)",
        score: 72,
      },
      {
        term: "film (dvd)",
        key: "film (dvd)",
        score: 45,
      },
      {
        term: "lydbog (bånd)",
        key: "lydbog (bånd)",
        score: 41,
      },
    ],
  },
  {
    name: "fictionalCharacters",
    values: [
      {
        term: "Tom (Bent Faurby)",
        key: "Tom (Bent Faurby)",
        score: 103,
      },
      {
        term: "Fanny Fiske",
        key: "Fanny Fiske",
        score: 63,
      },
      {
        term: "Gereon Rath",
        key: "Gereon Rath",
        score: 23,
      },
      {
        term: "Lille Hvide Fisk",
        key: "Lille Hvide Fisk",
        score: 17,
      },
      {
        term: "Familien Fisker",
        key: "Familien Fisker",
        score: 14,
      },
      {
        term: "Nemo (Find Nemo)",
        key: "Nemo (Find Nemo)",
        score: 11,
      },
      {
        term: "Bumle (Peter Lundqvist)",
        key: "Bumle (Peter Lundqvist)",
        score: 4,
      },
      {
        term: "Lui (Marie Duedahl)",
        key: "Lui (Marie Duedahl)",
        score: 3,
      },
      {
        term: "Rødhætte",
        key: "Rødhætte",
        score: 3,
      },
      {
        term: "Max og Ejgil",
        key: "Max og Ejgil",
        score: 2,
      },
      {
        term: "Sia (Serien om Sia)",
        key: "Sia (Serien om Sia)",
        score: 2,
      },
    ],
  },
];

export function Default() {
  return (
    <div>
      <StoryTitle>Simple search facets</StoryTitle>
      <StoryDescription>
        Facets for filtering simple search result
      </StoryDescription>
      <SimpleFacets facets={simpleSearchFacets} />
    </div>
  );
}
