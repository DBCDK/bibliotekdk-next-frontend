import NavigationDropdown2 from "./NavigationDropdown2";
import automock_utils from "@/components/_modal/pages/automock_utils";
import { StoryDescription } from "@/storybook";
const { useMockLoanerInfo } = automock_utils();

const menuItems = ["loansAndReservations", "myLibraries"];

const exportedObject = {
  title: "base/NavigationDropdown2",
};

export default exportedObject;

export function Dropdown() {
  useMockLoanerInfo({});
  return (
    <div style={{ height: "500px" }}>
      <StoryDescription>
        Shows when canvas has width up to 992px
      </StoryDescription>
      <NavigationDropdown2 context="profile" menuItems={menuItems} />
    </div>
  );
}
