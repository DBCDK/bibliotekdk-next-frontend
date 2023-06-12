import LoansAndReservations from "./Page";
import automock_utils from "@/components/_modal/pages/automock_utils";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/Loans and reservations",
};

export const LoansAndReservationsStory = () => {
  useMockLoanerInfo({});
  return (
    <>
      <Modal.Container>
        <Modal.Page id="material" component={Pages.Material} />
      </Modal.Container>
      <LoansAndReservations />
    </>
  );
};

export default exportedObject;
