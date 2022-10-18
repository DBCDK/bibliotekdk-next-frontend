import HelpPage from "./page/Page";
import { StoryTitle } from "@/storybook";

const exportedObject = {
  title: "help/page",
};

export default exportedObject;

export function HelpTextPage() {
  return (
    <div>
      <StoryTitle>Help Text Page</StoryTitle>
      <HelpPage helpTextId={"19"} />
    </div>
  );
}
HelpTextPage.story = {
  parameters: {
    graphql: {
      resolvers: {
        Node: {
          __resolveType: () => "NodeHelpText",
        },
      },
    },
  },
};
