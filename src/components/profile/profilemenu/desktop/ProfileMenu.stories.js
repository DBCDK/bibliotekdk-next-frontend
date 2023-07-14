import ProfileMenu from "./ProfileMenu";
import automock_utils from "@/lib/automock_utils.fixture";

const { useMockLoanerInfo } = automock_utils();

const exportedObject = {
  title: "profile/ProfileMenu",
};

export default exportedObject;

export function ProfileMenuStoryWithDebt() {
  useMockLoanerInfo({});
  return <ProfileMenu />;
}

export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo({ debt: [] });
  return <ProfileMenu />;
}
