import { StoryTitle, StoryDescription } from "@/storybook";
import { SimpleFacets } from "@/components/search/facets/simpleFacets";

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
