import ProfileMenu from "./ProfileMenu";
import automock_utils from "@/components/_modal/pages/automock_utils";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/ProfileMenu",
};

export default exportedObject;

export function ProfileMenuStoryWithDebt() {
  useMockLoanerInfo();
  return <ProfileMenu />;
}

export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo(undefined, undefined, undefined, []);
  return <ProfileMenu />;
}
