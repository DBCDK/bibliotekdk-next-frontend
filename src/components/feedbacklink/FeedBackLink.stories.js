import { StoryTitle, StoryDescription } from "@/storybook";
import Feedb from "./FeedBackLink";

const exportedObject = {
  title: "base/feedbacklink",
};

export default exportedObject;

/**
 * Returns Banner
 *
 */
export function Feedback() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>FeedDackLink</StoryTitle>
      <StoryDescription>feedbacklink to kundeservice</StoryDescription>
      <Feedb />
    </div>
  );
}
