import LoansAndReservations from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { StoryTitle, StoryDescription } from "@/storybook";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/Loans and reservations",
};

export const LoansAndReservationsStory = () => {
  useMockLoanerInfo({});
  return (
    <>
      <StoryTitle>Lån og reservationer</StoryTitle>
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

export const LoansAndReservationsStoryActions = () => {
  useMockLoanerInfo({});
  return (
    <>
      <StoryTitle>Lån og reservationer</StoryTitle>
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

export default exportedObject;
