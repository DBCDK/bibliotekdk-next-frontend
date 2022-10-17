import dummy_workDataApi from "../dummy.workDataApi";
import { StoryTitle, StoryDescription } from "@/storybook";
import useUser from "@/components/hooks/useUser";
import fullwork from "../dummydata/fullwork.json";
import available from "../dummydata/available.json";
import { OrderButton } from "@/components/work/reservationbutton/ReservationButton";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonOnlineAccess() {
  const data = dummy_workDataApi({ workId: "some-id" });
  return (
    <div>
      <StoryTitle>material online - user not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - material accesible online
      </StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[2]}
        user={useUser}
        onlineAccess={() => {
          alert("online access");
        }}
        login={() => {}}
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
      <StoryTitle>material can not be ordered (requestbutton:false)</StoryTitle>
      <StoryDescription>material can not be ordered</StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[0]}
        user={useUser}
        onlineAccess={() => {}}
        login={() => {}}
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
  const availability = available;
  const data = fullwork.data;
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
        availability={availability}
      />
    </div>
  );
}

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonNotLoggedIn() {
  const data = fullwork.data;
  return (
    <div>
      <StoryTitle>user not logged in - material reservable</StoryTitle>
      <StoryDescription>
        user is not logged in - order is possible
      </StoryDescription>
      <OrderButton
        selectedMaterial={data.work.materialTypes[0]}
        user={useUser}
        onlineAccess={() => {}}
        login={() => {
          alert("login");
        }}
        openOrderModal={() => {}}
        availability={{ available: true, availabiblityLoading: false }}
      />
    </div>
  );
}

export function ReservationButtonSkeleton() {
  return (
    <div>
      <StoryTitle>Skeleton</StoryTitle>
      <StoryDescription>reservation button not ready</StoryDescription>
      <OrderButton
        selectedMaterial={{}}
        user={{ isAuthenticated: false }}
        onlineAccess={() => {}}
        login={() => {}}
        openOrderModal={() => {}}
        availability={{ available: false, availabiblityLoading: false }}
      />
    </div>
  );
}
