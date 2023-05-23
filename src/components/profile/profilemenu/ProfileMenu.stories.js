import ProfileMenu from "./ProfileMenu";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/ProfileMenu",
};

export default exportedObject;

export function ProfileMenuStoryWithDebt() {
  useMockLoanerInfo("790900");
  return <ProfileMenu />;
}

export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo("790900", false);
  return <ProfileMenu />;
}
