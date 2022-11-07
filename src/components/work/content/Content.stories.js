import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import WrappedContent, { ContentSkeleton } from "./Content";

const exportedObject = {
  title: "work/Content",
};

export default exportedObject;

/**
 * Returns Content section
 *
 */
export function ContentSection() {
  const workId = "some-id";
  const type = "Bog";
  return (
    <div>
      <StoryTitle>Content section</StoryTitle>
      <StoryDescription>
        Work content component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <WrappedContent workId={workId} type={type} />
    </div>
  );
}
ContentSection.story = {
  parameters: {
    graphql: {
      resolvers: {
        Manifestation: {
          materialTypes: () => [{ specific: "bog" }],
          tableOfContents: ({ variables }) =>
            variables.workId === "some-id"
              ? {
                  heading: "Kapitler",
                  listOfContent: [
                    { content: "Kapitel 1" },
                    {
                      content: "Kapitel 2",
                    },
                    {
                      content: "Kapitel 3",
                    },
                    {
                      content: "Kapitel 4",
                    },
                  ],
                }
              : null,
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  },
};

/**
 * Returns Loading content section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Content section</StoryTitle>
      <StoryDescription>Loading content component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <ContentSkeleton />
    </div>
  );
}
