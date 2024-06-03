import { StoryTitle, StoryDescription } from "@/storybook";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";

const exportedObject = {
  title: "advancedsearch/quickfilter",
};

export default exportedObject;

export function QuickFilterDefault() {
  return (
    <div>
      <StoryTitle>A quckfilter</StoryTitle>
      <StoryDescription>Filters to quickly limit a search</StoryDescription>
      <QuickFilter />
    </div>
  );
}

QuickFilterDefault.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: "/avanceret",
      query: {
        quickfilters:
          '[{"searchIndex": "term.fictionnonfiction", "value": "nonfiction"}]',
      },
    },
  },
};
