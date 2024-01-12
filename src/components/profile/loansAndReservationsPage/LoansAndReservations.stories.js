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
LoansAndReservationsStory.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: { user: () => USER_7 },
      },
    },
  },
});

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
LoansAndReservationsWithFjernLaanStory.story = merge(
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
LoansAndReservationsStoryActions.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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
});

export default exportedObject;
