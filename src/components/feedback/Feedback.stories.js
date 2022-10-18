import { StoryTitle, StoryDescription } from "@/storybook";
import Feedb from "./Feedback";

const exportedObject = {
  title: "base/feedback",
};

export default exportedObject;

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
