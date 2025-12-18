import { StoryTitle, StoryDescription } from "@/storybook";
import FacetTags from "@/components/search/facets/advanced/facetTags";

const exportedObject = {
  title: "advancedsearch/facettags",
};

export default exportedObject;

export function FacetWithTags() {
  return (
    <div>
      <StoryTitle>Advanced search facets tags</StoryTitle>
      <StoryDescription>Tags for manipulating facet filters</StoryDescription>
      <FacetTags />
    </div>
  );
}

FacetWithTags.story = {
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
