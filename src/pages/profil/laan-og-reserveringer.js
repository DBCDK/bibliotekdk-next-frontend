import Header from "@/components/header/Header";
import Page from "@/components/profile/LoanPage";
import { useRouter } from "next/router";

export default function LoanAndReservations() {
  const router = useRouter();
  return (
    <>
      <Header router={router} />
      <Page />
    </>
  );
}
