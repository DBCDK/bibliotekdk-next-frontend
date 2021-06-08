import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Feedb from "./Feedback";

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
      <Feedb cookietime={5000} sessioneTime={3000} />
    </div>
  );
}
