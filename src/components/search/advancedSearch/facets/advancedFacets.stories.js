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
  nextRouter: {
    showInfo: true,
    pathname: "/avanceret",
    query: { cql: "Harry potter" },
  },
};
