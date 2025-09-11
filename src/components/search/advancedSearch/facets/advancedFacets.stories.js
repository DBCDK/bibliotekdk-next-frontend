import { StoryTitle, StoryDescription } from "@/storybook";
import { AdvancedFacets } from "@/components/search/advancedSearch/facets/advancedFacets";
import mockedFacets from "./mockedFacets.json";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

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
  const { selectedFacets, addFacet, removeFacet } = useFacets();

  const replace = false;
  const onItemClick = ({ checked, value, facetName }) => {
    const name = value?.key;

    if (checked) {
      // selected -> add to list
      addFacet(name, facetName, replace, value?.traceId);
    } else {
      // deselected - remove from list
      removeFacet(name, facetName, replace);
    }
  };
  return (
    <div>
      <StoryTitle>Advanced search facets</StoryTitle>
      <StoryDescription>Set facets from url</StoryDescription>
      <AdvancedFacets
        facets={mockedFacets.facets}
        selectedFacets={selectedFacets}
        onItemClick={onItemClick}
      />
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
