import { useState } from "react";
import dummy_workDataApi from "../dummy.workDataApi";
import { OverviewSkeleton, Overview } from "./Overview";
import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { OrderButton } from "./Overview";
import useUser from "@/components/hooks/useUser";

export default {
  title: "work/Overview",
};

/**
 * Overview
 *
 */
export function WorkOverview() {
  const data = dummy_workDataApi({ workId: "some-id" });
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

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonOnlineAccess() {
  const data = dummy_workDataApi({ workId: "some-id" });
  return (
    <div>
      <StoryTitle>material not online - user not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - order button logs user in
      </StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[2]}
        user={useUser}
        onlineAccess={() => {
          alert("online access");
        }}
        login={() => {
          alert("login");
        }}
        openOrderModal={() => {}}
      />
    </div>
  );
}

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonInactive() {
  const data = dummy_workDataApi({ workId: "some-id" });
  return (
    <div>
      <StoryTitle>material not online - user not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - order button logs user in
      </StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[0]}
        user={useUser}
        onlineAccess={() => {}}
        login={() => {
          alert("login");
        }}
        openOrderModal={() => {}}
      />
    </div>
  );
}

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonActive() {
  const data = dummy_workDataApi({ workId: "some-id" });
  return (
    <div>
      <StoryTitle>user logged in - material reservable</StoryTitle>
      <StoryDescription>user is logged in - order is possible</StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[0]}
        user={{ isAuthenticated: true }}
        onlineAccess={() => {}}
        login={() => {}}
        openOrderModal={() => {
          alert("order");
        }}
      />
    </div>
  );
}
