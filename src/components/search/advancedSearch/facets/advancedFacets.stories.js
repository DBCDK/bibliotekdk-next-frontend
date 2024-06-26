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

export function FacetsLoading() {
  return (
    <div>
      <StoryTitle>Advanced search facets</StoryTitle>
      <StoryDescription>
        Facets for filtering advanced search result
      </StoryDescription>
      <AdvancedFacets facets={mockedFacets.facets} isLoading={true} />
    </div>
  );
}

export function FacetsInUrl() {
  return (
    <div>
      <StoryTitle>Advanced search facets</StoryTitle>
      <StoryDescription>Set facets from url</StoryDescription>
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
        facets:
          '[{"searchIndex": "specificmaterialtype", "values": [{ "value": "e-bog", "name": "e-bog" },{ "value": "node", "name": "node" } ]},{ "searchIndex": "subject", "values": [{ "value": "fisk", "name": "fisk" }]}]',
      },
    },
  },
};
