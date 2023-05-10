import Header from "@/components/header/Header";
import Layout from "@/components/profile/Layout/Layout";
import Page from "@/components/profile/Loan/LoanAndReservations";
import { useRouter } from "next/router";

/**
 * Renders the WorkPage component
 */
export default function HelpPage() {
  const router = useRouter();

  return (
    <>
      <Header router={router} />
      <Page />
    </>
  );
}
