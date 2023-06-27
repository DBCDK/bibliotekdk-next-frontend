import NavigationDropdown from "./NavigationDropdown";
import automock_utils from "@/lib/automock_utils.fixture";
import { StoryDescription } from "@/storybook";
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
      <StoryDescription>
        Shows when canvas has width up to 992px
      </StoryDescription>
      <NavigationDropdown context="profile" menuItems={menuItems} />
    </div>
  );
}
