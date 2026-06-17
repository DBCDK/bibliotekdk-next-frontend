import ProfileMenu from "./ProfileMenu";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const { useMockLoanerInfo, DEFAULT_STORY_PARAMETERS, USER_7 } =
  automock_utils();

const exportedObject = {
  title: "profile/ProfileMenu",
};

export default exportedObject;

export function ProfileMenuStoryWithDebt() {
  useMockLoanerInfo({});
  return <ProfileMenu />;
}
const ProfileMenuStoryWithDebtStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => {
            return USER_7;
          },
        },
      },
    },
  },
});
ProfileMenuStoryWithDebt.parameters = ProfileMenuStoryWithDebtStory.parameters;
ProfileMenuStoryWithDebt.args = ProfileMenuStoryWithDebtStory.args;
ProfileMenuStoryWithDebt.decorators = ProfileMenuStoryWithDebtStory.decorators;
ProfileMenuStoryWithDebt.storyName =
  ProfileMenuStoryWithDebtStory.name || ProfileMenuStoryWithDebtStory.storyName;
export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo({ debt: [] });
  return <ProfileMenu />;
}
const ProfileMenuStoryWithoutDebtStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => {
            return { ...USER_7, debt: [] };
          },
        },
      },
    },
  },
});
ProfileMenuStoryWithoutDebt.parameters =
  ProfileMenuStoryWithoutDebtStory.parameters;
ProfileMenuStoryWithoutDebt.args = ProfileMenuStoryWithoutDebtStory.args;
ProfileMenuStoryWithoutDebt.decorators =
  ProfileMenuStoryWithoutDebtStory.decorators;
ProfileMenuStoryWithoutDebt.storyName =
  ProfileMenuStoryWithoutDebtStory.name ||
  ProfileMenuStoryWithoutDebtStory.storyName;
