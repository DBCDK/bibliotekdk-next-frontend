import Translate from "@/components/base/translate/Translate";
import Layout from "../Layout";

/**
 * LoanAndReservations React component
 *
 * @returns {JSX.Element}
 */
export default function LoanAndReservations() {
  return (
    <Layout
      title={Translate({ context: "profile", label: "loanAndReservations" })}
    >
      <h1>hej med dig</h1>
    </Layout>
  );
}
