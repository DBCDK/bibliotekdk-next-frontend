import DropdownComponent from "./DropdownComponent";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const menuItems = ["loansAndReservations", "myLibraries"];

const exportedObject = {
  title: "base/DropdownComponent",
};

export default exportedObject;

export function Dropdown() {
  useMockLoanerInfo({});
  return <DropdownComponent context="profile" menuItems={menuItems} />;
}
