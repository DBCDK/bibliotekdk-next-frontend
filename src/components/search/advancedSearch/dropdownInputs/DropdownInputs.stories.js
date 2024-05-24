import { StoryDescription, StoryTitle } from "@/storybook";
import DropdownInputs from "@/components/search/advancedSearch/dropdownInputs/DropdownInputs";

const exportedObject = {
  title: "AdvancedSearch/DropdownItems",
};

export default exportedObject;

export function DropdownItemsBase() {
  const storyTitle = "Dropdown Items";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <DropdownInputs />
    </div>
  );
}

DropdownItemsBase.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          complexSearch: () => ({}),
        },
        ComplexSearchResponse: {
          facets: () => [
            {
              name: "phrase.genreandform",
              values: [
                {
                  key: "anmeldelser",
                  score: 255287,
                },
                {
                  key: "roman",
                  score: 235785,
                },
                {
                  key: "bibliografier",
                  score: 157663,
                },
                {
                  key: "disputatser",
                  score: 149149,
                },
                {
                  key: "årspublikation",
                  score: 72470,
                },
                {
                  key: "eksamensopgaver under disputatsniveau",
                  score: 59499,
                },
              ],
            },
            {
              name: "phrase.mainlanguage",
              values: [
                {
                  key: "dansk",
                  score: 4693108,
                },
                {
                  key: "engelsk",
                  score: 3041258,
                },
                {
                  key: "tysk",
                  score: 1227662,
                },
                {
                  key: "fransk",
                  score: 460989,
                },
                {
                  key: "sproget kan ikke bestemmes",
                  score: 351250,
                },
                {
                  key: "svensk",
                  score: 325321,
                },
              ],
            },
          ],
        },
      },
    },
  },
};
