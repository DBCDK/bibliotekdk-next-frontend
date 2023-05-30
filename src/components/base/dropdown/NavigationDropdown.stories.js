import NavigationDropdown from "./NavigationDropdown";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const menuItems = ["loansAndReservations", "myLibraries"];

const exportedObject = {
  title: "base/NavigationDropdown",
};

export default exportedObject;

export function Dropdown() {
  useMockLoanerInfo({});
  return (
    <div style={{ height: "500px" }}>
      <NavigationDropdown context="profile" menuItems={menuItems} />
    </div>
  );
}
