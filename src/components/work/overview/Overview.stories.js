import { useState } from "react";
import { OverviewSkeleton, Overview } from "./Overview";
import { StoryTitle, StoryDescription } from "@/storybook";

const dummyOverviewData = require("../dummy.overViewWorkapi.json");

const exportedObject = {
  title: "work/Overview",
};

export default exportedObject;

/**
 * Overview
 *
 */
export function WorkOverview() {
  const data = dummyOverviewData;

  const fbiWork = {
    data: { work: data, isLoading: false, isSlow: false },
  };
  const [type, setType] = useState("bog");
  return (
    <div>
      <StoryTitle>Overview - not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - order button logs user in
      </StoryDescription>
      <Overview
        fbiWork={fbiWork}
        workId="work-of:800010-katalog:99122063770705763"
        type={type}
        onTypeChange={(el) => setType(el.type)}
        onOnlineAccess={(el) => alert(el)}
      />
    </div>
  );
}

/**
 * skeleton
 *
 */
export function Loading() {
  return (
    <div>
      <OverviewSkeleton />
    </div>
  );
}
