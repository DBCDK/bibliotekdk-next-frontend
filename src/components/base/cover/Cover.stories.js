import { useState } from "react";
import Cover from "./Cover";
import Bookmark from "../bookmark";

export default {
  title: "Cover",
};

/**
 * Returns Cover component
 *
 */
export function SimpleCover() {
  const doppler =
    "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4";

  return (
    <div>
      <div className="story-heading">Cover</div>
      <Cover src={doppler} />
    </div>
  );
}

/**
 * Returns Cover component with a background color
 *
 */
export function BackgroundCover() {
  const doppler =
    "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4";

  return (
    <div>
      <div className="story-heading">Cover with background [Border effect]</div>
      <div className="story-description">Usefull for carousel/slider use</div>
      <Cover bgColor="var(--concrete)" src={doppler} />
    </div>
  );
}

/**
 * Returns Cover component with a Bookmark button
 *
 */
export function BookmarkInCover() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const doppler =
    "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4";

  return (
    <div>
      <div className="story-heading">Bookmark button inside Cover</div>
      <div className="story-description">
        Icons and Bookmarks can easily be added to the Cover
      </div>
      <Cover bgColor="var(--concrete)" src={doppler}>
        <Bookmark
          selected={isBookmarked}
          onClick={() => setIsBookmarked(!isBookmarked)}
        />
      </Cover>
    </div>
  );
}

/**
 * Returns Loading version of Cover component
 *
 */
export function Loading() {
  const size = ["200px", "300px"];

  return (
    <div>
      <div className="story-heading">Loading Cover</div>
      <Cover size={size} skeleton={true} />
    </div>
  );
}
