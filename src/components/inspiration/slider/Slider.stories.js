import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedSlider from "./Slider";

const exportedObject = {
  title: "inspiration/Slider",
};

export default exportedObject;

export function Connected() {
  return (
    <div>
      <StoryTitle>Connected Inspiration slider</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <WrappedSlider
        title="Nyeste skønlitteratur"
        category="fiction"
        filters={[{ category: "fiction", subCategories: ["nyeste"] }]}
      />
    </div>
  );
}

Connected.story = {
  parameters: {
    graphql: {
      resolvers: {
        Categories: {
          category: () => "fiction",
          subCategories: () => ["nyeste"],
        },
        Category: {
          title: () => "nyeste",
          result: () => [
            {
              work: {
                workId: "workId-1",
                titles: { main: ["title-1"] },
                creators: [{ display: "creator-1" }],
              },
              manifestation: {
                materialTypes: [
                  {
                    materialTypeSpecific: { display: "bog", code: "BOOK" },
                    materialTypeGeneral: { display: "bøger", code: "BOOKS" },
                  },
                ],
              },
            },
            {
              work: {
                workId: "workId-2",
                titles: { main: ["title-2"] },
                creators: [{ display: "creator-2" }],
              },
              manifestation: {
                materialTypes: [
                  {
                    materialTypeSpecific: { display: "bog", code: "BOOK" },
                    materialTypeGeneral: { display: "bøger", code: "BOOKS" },
                  },
                ],
              },
            },
            {
              work: {
                workId: "workId-3",
                titles: { main: ["title-3"] },
                creators: [{ display: "creator-3" }],
              },
              manifestation: {
                materialTypes: [
                  {
                    materialTypeSpecific: { display: "bog", code: "BOOK" },
                    materialTypeGeneral: { display: "bøger", code: "BOOKS" },
                  },
                ],
              },
            },
          ],
        },
        Cover: {
          detail: ({ path }) => `https://picsum.photos/seed/${path}/200/300`,
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  },
};
