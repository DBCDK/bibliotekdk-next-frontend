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
        filters={["nyeste"]}
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
              manifestation: {
                pid: "pid-1",
                titles: { main: ["title-1"] },
                creators: [{ display: "creator-1" }],
                materialTypes: [{ specific: "bog" }],
              },
            },
            {
              manifestation: {
                pid: "pid-2",
                titles: { main: ["title-2"] },
                creators: [{ display: "creator-2" }],
                materialTypes: [{ specific: "bog" }],
              },
            },
            {
              manifestation: {
                pid: "pid-3",
                titles: { main: ["title-3"] },
                creators: [{ display: "creator-3" }],
                materialTypes: [{ specific: "bog" }],
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
