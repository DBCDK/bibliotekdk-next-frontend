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
ProfileLayoutNoUniqueId.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    session: {
      accessToken: "dummy-token",
      user: { uniqueId: null, userId: "mocked-uniqueId" },
    },
    nextRouter: { pathname: "/profil/laan-og-reserveringer" },
  },
});

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
ProfileLayoutWithUniqueId.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    session: {
      accessToken: "dummy-token",
      user: { uniqueId: "mocked-uniqueId", userId: "mocked-uniqueId" },
    },
    nextRouter: { pathname: "/profil/laan-og-reserveringer" },
  },
});

export default exportedObject;
