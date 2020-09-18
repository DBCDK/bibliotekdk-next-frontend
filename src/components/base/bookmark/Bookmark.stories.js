import { useState } from "react";

import Bookmark from "./Bookmark";
import Cover from "../cover";

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
      <div className="story-heading">Bookmark Button</div>
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
      <div className="story-heading">Loading Bookmark Button</div>
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
      <div className="story-heading">Bookmark button inside Cover</div>
      <Cover src={doppler}>
        <Bookmark
          selected={isBookmarked}
          onClick={() => setIsBookmarked(!isBookmarked)}
        />
      </Cover>
    </div>
  );
}
