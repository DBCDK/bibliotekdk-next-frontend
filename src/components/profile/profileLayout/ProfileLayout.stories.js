import automock_utils from "@/lib/automock_utils.fixture";
import { StoryTitle, StoryDescription } from "@/storybook";
import merge from "lodash/merge";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileLayout from "./ProfileLayout";

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

const exportedObject = {
  title: "profile/layout",
};

export const ProfileLayoutNoUniqueId = () => {
  const router = useRouter();
  return (
    <>
      <StoryTitle>ProfileLayout</StoryTitle>
      <StoryDescription>
        Uden uniqueId (culrUniqueId), så skal man sendes til forsiden
      </StoryDescription>
      <Link href="/profil/huskeliste">huskeliste</Link>
      {router.pathname.startsWith("/profil") && <ProfileLayout />}
    </>
  );
};
const ProfileLayoutNoUniqueIdStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    session: {
      accessToken: "dummy-token",
      user: { uniqueId: null, userId: "mocked-uniqueId" },
    },
    graphql: {
      resolvers: {
        Query: {
          user: (args) => ({ ...args, hasCulrUniqueId: false }),
        },
      },
    },
    nextRouter: { pathname: "/profil/laan-og-reserveringer" },
  },
});
ProfileLayoutNoUniqueId.parameters = ProfileLayoutNoUniqueIdStory.parameters;
ProfileLayoutNoUniqueId.args = ProfileLayoutNoUniqueIdStory.args;
ProfileLayoutNoUniqueId.decorators = ProfileLayoutNoUniqueIdStory.decorators;
ProfileLayoutNoUniqueId.storyName =
  ProfileLayoutNoUniqueIdStory.name || ProfileLayoutNoUniqueIdStory.storyName;
export const ProfileLayoutWithUniqueId = () => {
  const router = useRouter();
  return (
    <>
      <StoryTitle>ProfileLayout</StoryTitle>
      <StoryDescription>
        Med uniqueId (culrUniqueId), profil er tilladt
      </StoryDescription>
      {router.pathname.startsWith("/profil") && <ProfileLayout />}
    </>
  );
};
const ProfileLayoutWithUniqueIdStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    session: {
      accessToken: "dummy-token",
      user: { uniqueId: "mocked-uniqueId", userId: "mocked-uniqueId" },
    },
    nextRouter: { pathname: "/profil/laan-og-reserveringer" },
  },
});
ProfileLayoutWithUniqueId.parameters =
  ProfileLayoutWithUniqueIdStory.parameters;
ProfileLayoutWithUniqueId.args = ProfileLayoutWithUniqueIdStory.args;
ProfileLayoutWithUniqueId.decorators =
  ProfileLayoutWithUniqueIdStory.decorators;
ProfileLayoutWithUniqueId.storyName =
  ProfileLayoutWithUniqueIdStory.name ||
  ProfileLayoutWithUniqueIdStory.storyName;
export default exportedObject;
