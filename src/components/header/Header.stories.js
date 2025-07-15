import { StoryTitle, StoryDescription } from "@/storybook";
import { Header } from "./Header";
import Searchbar from "@/components/search/searchbar";

const urlParams =
  typeof window === "undefined"
    ? new URLSearchParams("")
    : new URLSearchParams(document.location.search);

const exportedObject = {
  title: "layout/Header",
};

export default exportedObject;

/**
 * Returns Header
 *
 */
export function HeaderNotSignedIn() {
  const user = {
    hasCulrUniqueId: false,
    isAuthenticated: false,
    isLoading: false,
  };

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header | Not signed in</StoryTitle>
      <StoryDescription>{`Basic header | Not signed in`}</StoryDescription>
      <Header user={user} />
      <Searchbar />
    </div>
  );
}

HeaderNotSignedIn.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: urlParams.get("nextRouter.pathname") || "/",
      query: {},
    },
  },
};

/**
 * Returns Header
 *
 */
export function HeaderNoUniqueId() {
  const user = {
    hasCulrUniqueId: false,
    isAuthenticated: true,
    isLoading: false,
  };

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header | No UniqueID</StoryTitle>
      <StoryDescription>{`Header | User is signedIn but does not have a CULR uniqueId`}</StoryDescription>
      <Header user={user} />
      <Searchbar />
    </div>
  );
}

HeaderNoUniqueId.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: urlParams.get("nextRouter.pathname") || "/",
      query: {},
    },
  },
};

/**
 * Returns Header
 *
 */
export function HeaderSignedIn() {
  const user = {
    hasCulrUniqueId: true,
    isAuthenticated: true,
    isLoading: false,
  };

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header | SignedIn</StoryTitle>
      <StoryDescription>{`Header | User is signedIn`}</StoryDescription>
      <Header user={user} />
      <Searchbar />
    </div>
  );
}

HeaderSignedIn.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: urlParams.get("nextRouter.pathname") || "/",
      query: {},
    },
  },
};
