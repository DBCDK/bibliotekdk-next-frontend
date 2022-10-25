import dummy_workDataApi from "../dummy.workDataApi";
import { StoryDescription, StoryTitle } from "@/storybook";
import useUser from "@/components/hooks/useUser";
import fullwork from "../dummydata/fullwork.json";
import available from "../dummydata/available.json";
import ReservationButton, {
  OrderButton,
} from "@/components/work/reservationbutton/ReservationButton";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

function ReservationButtonComponentBuilder({
  type = "Bog",
  workId = "some-id-book",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>OrderButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The OrderButton based on the type: {descriptionName}
      </StoryDescription>
      <OrderButton
        workId={workId}
        chosenMaterialType={type}
        skeleton={false}
        buttonType={"primary"}
        size={"large"}
        openOrderModal={() => {}}
      />
    </div>
  );
}

function ReservationButtonStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url:
          "https://alfa-api.stg.bibliotek.dk/190101/bibdk21/graphql" ||
          "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}ReservationButton/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

export function ReservationButtonOnlineAccessTesta() {
  return <ReservationButtonComponentBuilder workId={"some-id"} type={"Bog"} />;
}
ReservationButtonOnlineAccessTesta.story = {
  ...ReservationButtonStoryBuilder("Book", {}),
};

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function ReservationButtonOnlineAccess() {
  const workId = "some-id";
  const data = dummy_workDataApi({ workId: workId });
  return (
    <div>
      <StoryTitle>material online - user not logged in</StoryTitle>
      <StoryDescription>
        user is not logged in - material accesible online
      </StoryDescription>
      <ReservationButton
        workId={workId}
        type={"EBog"}
        buttonType={"primary"}
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
      <ReservationButton
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
      <ReservationButton
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
      <ReservationButton
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
      <ReservationButton
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
