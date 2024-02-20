import { StoryTitle, StoryDescription } from "@/storybook";
import { AdvancedFacets } from "@/components/search/advancedSearch/facets/advancedFacets";
import mockedFacets from "./mockedFacets.json";

const exportedObject = {
  title: "advancedsearch/facets",
};

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Advanced search facets</StoryTitle>
      <StoryDescription>
        Facets for filtering advanced search result
      </StoryDescription>
      <AdvancedFacets facets={mockedFacets.facets} />
    </div>
  );
}

Default.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: "/avanceret",
      query: { cql: "Harry potter" },
    },
  },
};

export function FacetsInUrl() {
  return (
    <div>
      <StoryTitle>Advanced search facets</StoryTitle>
      <StoryDescription>
        Facets for filtering advanced search result
      </StoryDescription>
      <AdvancedFacets facets={mockedFacets.facets} />
    </div>
  );
}

FacetsInUrl.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: "/avanceret",
      query: {
        fieldSearch: {
          facets: [
            {
              searchIndex: "phrase.specificmaterialtype",
              values: [
                { value: "e-bog", name: "e-bog" },
                { value: "node", name: "node" },
              ],
            },
            {
              searchIndex: "phrase.subject",
              values: [{ value: "fisk", name: "fisk" }],
            },
          ],
        },
      },
    },
  },
};
