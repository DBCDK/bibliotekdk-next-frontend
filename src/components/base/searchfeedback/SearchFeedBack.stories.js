import { StoryTitle, StoryDescription } from "@/storybook";
import { SearchFeedBackWrapper } from "./SearchFeedBack";

const exportedObject = {
  title: "base/SearchFeedBack",
};

export default exportedObject;

/**
 * Returns SearchFeedBack
 *
 */
export function FeedBack() {
  const onDataCollect = (input) => {
    alert(JSON.stringify(input));
  };
  return (
    <div>
      <StoryTitle>SearchFeedBack</StoryTitle>
      <StoryDescription>
        thumbs up OR thumbs down with description
      </StoryDescription>
      <SearchFeedBackWrapper
        datacollect={onDataCollect}
        router={null}
        ForceshowMe={true}
      />
    </div>
  );
}
