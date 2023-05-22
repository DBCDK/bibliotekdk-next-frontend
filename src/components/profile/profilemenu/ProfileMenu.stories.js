import ProfileMenu from "./ProfileMenu";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/ProfileMenu",
};

export default exportedObject;

/**
 * Profile menu main items
 */
const menuItems = ["loansAndReservations", "myLibraries"];

/**
 * Menu items with subcategories
 */
const menus = {
  loansAndReservations: [
    { title: "debt", id: 0, itemLength: 5 },
    { title: "loans", id: 1, itemLength: 2 },
    { title: "orders", id: 2, itemLength: 6 },
  ],
};

/**
 * Menu items with subcategories
 */
const menusNoDebt = {
  loansAndReservations: [
    { title: "debt", id: 0, itemLength: 0 },
    { title: "loans", id: 1, itemLength: 2 },
    { title: "orders", id: 2, itemLength: 6 },
  ],
};

export function ProfileMenuStoryWithDebt() {
  useMockLoanerInfo("790900");
  return <ProfileMenu menus={menus} menuItems={menuItems} />;
}

export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo("790900");
  return <ProfileMenu menus={menusNoDebt} menuItems={menuItems} />;
}
