import { StoryTitle, StoryDescription } from "@/storybook";
import AdvancedFacets from "@/components/search/advancedSearch/facets/advancedFacets";

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
      <AdvancedFacets />
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
