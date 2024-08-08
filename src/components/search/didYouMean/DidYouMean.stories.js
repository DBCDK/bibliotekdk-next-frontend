import { StoryTitle, StoryDescription } from "@/storybook";

import { DidYouMean } from "@/components/search/didYouMean/DidYouMean";
import mocked from "./didYouMeanMock.json";

const exportedObject = {
  title: "search/DidYouMean",
};

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Did you mean</StoryTitle>
      <StoryDescription>alternatives to query</StoryDescription>
      <DidYouMean didyoumean={mocked} />
    </div>
  );
}

Default.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: { q: { all: "Harry potter" } },
    },
  },
};
