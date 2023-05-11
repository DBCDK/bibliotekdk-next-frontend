import Translate from "@/components/base/translate/Translate";
import Layout from "../layout";

/**
 * LoansAndReservations React component
 *
 * @returns {JSX.Element}
 */
export default function LoansAndReservationsPage() {
  return (
    <Layout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <h1>hej med dig</h1>
    </Layout>
  );
}
