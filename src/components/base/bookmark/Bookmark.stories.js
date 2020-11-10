import { useState } from "react";
import { StoryTitle, StoryDescription } from "@/storybook";

import Bookmark from "./Bookmark";
import Cover from "@/components/base/cover";

export default {
  title: "Bookmark",
};

/**
 * Returns Bookmark button
 *
 */
export function Button() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div>
      <StoryTitle>Bookmark Button</StoryTitle>
      <StoryDescription>
        The bookmark button is simply an icon component with an extra layer of
        functionality
      </StoryDescription>
      <Bookmark
        selected={isBookmarked}
        onClick={() => setIsBookmarked(!isBookmarked)}
      />
    </div>
  );
}

/**
 * Returns Loading version of the Bookmark button
 *
 */
export function Loading() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div>
      <StoryTitle>Loading Bookmark Button</StoryTitle>
      <StoryDescription>
        Loading state of the the bookmark button
      </StoryDescription>
      <Bookmark skeleton={true} />
    </div>
  );
}

/**
 * Returns Bookmark button inside a Cover component
 *
 */
export function ButtonInCover() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const doppler =
    "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4";

  return (
    <div>
      <StoryTitle>Bookmark button inside Cover</StoryTitle>
      <StoryDescription>
        The bookmark button can easily be passed as a child to the Cover
        component.
      </StoryDescription>
      <Cover src={doppler}>
        <Bookmark
          selected={isBookmarked}
          onClick={() => setIsBookmarked(!isBookmarked)}
        />
      </Cover>
    </div>
  );
}
