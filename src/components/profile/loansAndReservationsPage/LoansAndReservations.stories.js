import LoansAndReservations from "./Page";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/Loans and reservations",
};

export const LoansAndReservationsStory = () => {
  useMockLoanerInfo("790900");
  return <LoansAndReservations />;
};

export default exportedObject;
