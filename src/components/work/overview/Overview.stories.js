import { useState } from "react";
import dummy_workDataApi from "../dummy.workDataApi";
import { OverviewSkeleton, Overview } from "./Overview";

export default {
  title: "work/Overview",
};

/**
 * Returns all Text types
 *
 */
export function WorkOverview() {
  const data = dummy_workDataApi({ workId: "some-id" });
  const [type, setType] = useState();
  return (
    <div>
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
 * Returns all Text types in skeleton loading mode (note the numer of lines wanted)
 *
 */
export function Loading() {
  return (
    <div>
      <OverviewSkeleton />
    </div>
  );
}
