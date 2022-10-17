import { useState } from "react";
import { StoryTitle, StoryDescription } from "@/storybook";

import Cover from "./Cover";
import Bookmark from "@/components/base/bookmark";

export default {
  title: "base/Cover",
};

const sizes = ["thumbnail", "medium", "large"];
const urls = [
  "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4",
  "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52723698&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=0e50344833e1e96049e5",
  "https://unknown",
  null,
];

/**
 * Returns Cover component
 *
 */
export function SimpleCover() {
  return (
    <div>
      <StoryTitle>Cover</StoryTitle>

      {sizes.map((size) => {
        return (
          <div key={size} style={{ display: "flex" }}>
            {urls.map((url) => (
              <Cover key={size + url} src={url} size={size} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Returns Cover component with a Bookmark button
 *
 */
export function BookmarkInCover() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div>
      <StoryTitle>Bookmark button inside Cover</StoryTitle>
      <StoryDescription>
        Icons and Bookmarks can easily be added to the Cover
      </StoryDescription>
      {sizes.map((size) => {
        return (
          <div key={size} style={{ display: "flex" }}>
            {urls.map((url) => (
              <Cover
                key={size + url}
                src={url}
                size={size}
                // bgColor="var(--concrete)"
              >
                <Bookmark
                  selected={isBookmarked}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                />
              </Cover>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Returns Loading version of Cover component
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Loading Cover</StoryTitle>
      {sizes.map((size) => {
        return (
          <div key={size} style={{ display: "flex" }}>
            {urls.map((url) => (
              <Cover
                key={size + url}
                size={size}
                bgColor="var(--concrete)"
                skeleton={true}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
