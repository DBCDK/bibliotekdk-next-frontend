import Translate from "@/components/base/translate/Translate";
import ProfileLayout from "../profileLayout";

/**
 * LoansAndReservations React component
 *
 * @returns {JSX.Element}
 */
export default function LoansAndReservationsPage() {
  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "loansAndReservations" })}
    >
      <h1>hej med dig</h1>
    </ProfileLayout>
  );
}
