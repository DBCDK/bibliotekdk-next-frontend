import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Feedb from "./FeedBackLink";

export default {
  title: "base/feedbacklink",
};

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
