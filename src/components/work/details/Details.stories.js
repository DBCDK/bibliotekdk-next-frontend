import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import WrappedDetails, { Details, DetailsSkeleton } from "./Details";

const exportedObject = {
  title: "work/Details",
};

export default exportedObject;

/**
 * Returns details section
 *
 */

export function WrappedDetailsSection() {
  const workId = "some-id";
  const type = "Bog";

  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedDetails workId="fisk" type="bog" />
    </div>
  );
}

WrappedDetailsSection.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Work: {
          genreAndForm: () => ["actionfilm", "thriller", "science fiction"],
        },
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: {},
  },
};

/**
 * Returns loading details section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>Loading details component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <DetailsSkeleton />
    </div>
  );
}
