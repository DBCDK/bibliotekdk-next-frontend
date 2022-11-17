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
        filter="nyeste"
      />
    </div>
  );
}

Connected.story = {
  parameters: {
    graphql: {
      resolvers: {
        Categories: {
          fiction: (args) =>
            args.variables?.filters?.[0] === "nyeste" ? [{}] : [],
        },
        Category: {
          title: () => "nyeste",
          result: () => [
            {
              work: {
                workId: "id-1",
                titles: { main: ["title-1"] },
                creators: [{ display: "creator-1" }],
              },
            },
            {
              work: {
                workId: "id-2",
                titles: { main: ["title-2"] },
                creators: [{ display: "creator-2" }],
              },
            },
            {
              work: {
                workId: "id-3",
                titles: { main: ["title-3"] },
                creators: [{ display: "creator-3" }],
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
