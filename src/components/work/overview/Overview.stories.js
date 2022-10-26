import { useState } from "react";
import dummy_workDataApi_TempUsingAlfaApi from "../dummy.workDataApi";
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
  const workId = "some-id";
  const data = dummy_workDataApi_TempUsingAlfaApi({ workId: workId });
  const [type, setType] = useState();
  return (
    <div>
      <StoryTitle>Overview - not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - order button logs user in
      </StoryDescription>
      <Overview
        work={data.work}
        type={type}
        onTypeChange={(el) => setType(el.type)}
        onOnlineAccess={(el) => alert(el)}
        workId={workId}
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
