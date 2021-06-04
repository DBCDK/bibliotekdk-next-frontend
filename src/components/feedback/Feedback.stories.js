import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Hest from "./Feedback";

export default {
  title: "base/feedback",
};

/**
 * Returns Banner
 *
 */
export function Feedback() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Feedback</StoryTitle>
      <StoryDescription>feedback</StoryDescription>
      <Hest />
    </div>
  );
}
