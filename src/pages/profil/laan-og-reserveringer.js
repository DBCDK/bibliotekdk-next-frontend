import Header from "@/components/header/Header";
import Page from "@/components/profile/loansAndReservationsPage";
import { useRouter } from "next/router";

export default function LoansAndReservations() {
  const router = useRouter();
  return (
    <>
      <Header router={router} />
      <Page />
    </>
  );
}
