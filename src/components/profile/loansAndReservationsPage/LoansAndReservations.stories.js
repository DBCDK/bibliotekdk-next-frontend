import LoansAndReservations from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { StoryTitle, StoryDescription } from "@/storybook";
import merge from "lodash/merge";

const { DEFAULT_STORY_PARAMETERS, USER_7, USER_9 } = automock_utils();

const exportedObject = {
  title: "profile/Loans and reservations",
};

export const LoansAndReservationsStory = () => {
  return (
    <>
      <StoryTitle>Lån og reserveringer</StoryTitle>
      <StoryDescription>
        Kortlægning af mulige states i et lån, reservation eller mellemværende
      </StoryDescription>
      <Modal.Container>
        <Modal.Page id="material" component={Pages.Material} />
      </Modal.Container>
      <LoansAndReservations />
    </>
  );
};
const LoansAndReservationsStoryStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: { user: () => USER_7 },
      },
    },
  },
});
LoansAndReservationsStory.parameters =
  LoansAndReservationsStoryStory.parameters;
LoansAndReservationsStory.args = LoansAndReservationsStoryStory.args;
LoansAndReservationsStory.decorators =
  LoansAndReservationsStoryStory.decorators;
LoansAndReservationsStory.storyName =
  LoansAndReservationsStoryStory.name ||
  LoansAndReservationsStoryStory.storyName;
export const LoansAndReservationsWithFjernLaanStory = () => {
  return (
    <>
      <StoryTitle>Lån og reserveringer med fjernlån</StoryTitle>
      <StoryDescription>
        Fjernlån vises kun med titel og forfatter, da vi ikke har adgang til
        mere information
      </StoryDescription>
      <Modal.Container>
        <Modal.Page id="material" component={Pages.Material} />
      </Modal.Container>
      <LoansAndReservations />
    </>
  );
};
const LoansAndReservationsWithFjernLaanStoryStory = merge(
  {},
  {
    parameters: {
      graphql: {
        resolvers: {
          Query: { user: () => USER_9 },
        },
      },
    },
  }
);
LoansAndReservationsWithFjernLaanStory.parameters =
  LoansAndReservationsWithFjernLaanStoryStory.parameters;
LoansAndReservationsWithFjernLaanStory.args =
  LoansAndReservationsWithFjernLaanStoryStory.args;
LoansAndReservationsWithFjernLaanStory.decorators =
  LoansAndReservationsWithFjernLaanStoryStory.decorators;
LoansAndReservationsWithFjernLaanStory.storyName =
  LoansAndReservationsWithFjernLaanStoryStory.name ||
  LoansAndReservationsWithFjernLaanStoryStory.storyName;
export const LoansAndReservationsStoryActions = () => {
  return (
    <>
      <StoryTitle>Lån og reserveringer</StoryTitle>
      <StoryDescription>
        Kortlægning af mulige states i et lån, reservation eller mellemværende
      </StoryDescription>
      <Modal.Container>
        <Modal.Page id="material" component={Pages.Material} />
        <Modal.Page id="deleteOrder" component={Pages.DeleteOrder} />
      </Modal.Container>
      <LoansAndReservations />
    </>
  );
};
const LoansAndReservationsStoryActionsStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {
          Query: { user: () => USER_7 },
          RenewLoanResponse: {
            renewed: () => false,
            error: () => "some error",
            dueDate: () => "",
          },
          DeleteOrderResponse: {
            deleted: () => false,
            error: () => "some-error",
          },
        },
      },
    },
  }
);
LoansAndReservationsStoryActions.parameters =
  LoansAndReservationsStoryActionsStory.parameters;
LoansAndReservationsStoryActions.args =
  LoansAndReservationsStoryActionsStory.args;
LoansAndReservationsStoryActions.decorators =
  LoansAndReservationsStoryActionsStory.decorators;
LoansAndReservationsStoryActions.storyName =
  LoansAndReservationsStoryActionsStory.name ||
  LoansAndReservationsStoryActionsStory.storyName;
export default exportedObject;
