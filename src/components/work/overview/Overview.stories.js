import { useState } from "react";
import dummy_workDataApi from "../dummy.workDataApi";
import { OverviewSkeleton, Overview } from "./Overview";
import { StoryTitle, StoryDescription } from "@/storybook";

const exportedObject = {
  title: "work/Overview",
};

export default exportedObject;

/**
 * Overview
 *
 */
export function WorkOverview() {
  const data = dummy_workDataApi({ workId: "some-id" });
  //const data = fullwork;
  const [type, setType] = useState();
  return (
    <div>
      <StoryTitle>Overview - not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - order button logs user in
      </StoryDescription>
      <Overview
        {...data.work}
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
