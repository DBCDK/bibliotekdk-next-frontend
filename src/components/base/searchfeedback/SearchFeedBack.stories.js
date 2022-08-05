import { StoryTitle, StoryDescription } from "@/storybook";
import SearchFeedBack from "./SearchFeedBack";

export default {
  title: "base/SearchFeedBack",
};
/**
 * Returns SearchFeedBack
 *
 */
export function FeedBack() {
  const onThumbsUpClick = () => {
    alert("thumbsup");
  };

  const onThumbsDownClick = () => {
    alert("thumbsdown");
  };
  return (
    <div>
      <StoryTitle>SearchFeedBack</StoryTitle>
      <StoryDescription>
        thumbs up OR thumbs down with description
      </StoryDescription>
      <SearchFeedBack />
    </div>
  );
}
