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
ProfileMenuStoryWithDebt.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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

export function ProfileMenuStoryWithoutDebt() {
  useMockLoanerInfo({ debt: [] });
  return <ProfileMenu />;
}
ProfileMenuStoryWithoutDebt.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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
