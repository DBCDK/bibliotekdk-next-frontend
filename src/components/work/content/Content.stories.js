import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import WrappedContent, { ContentSkeleton } from "./Content";
import merge from "lodash/merge";
import automock_utils from "@/lib/automock_utils.fixture";
import { tableOfContents } from "@/lib/api/work.fragments";

const exportedObject = {
  title: "work/Content",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

/**
 * Returns Content section
 *
 */
export function ContentSection() {
  const workId = "some-id";
  const type = ["bog"];
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

export function ContentWrapped_With_ListOfContent() {
  const workId = "some-work-id-6";
  const type = ["bog"];
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
ContentWrapped_With_ListOfContent.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function ContentWrapped_No_ListOfContent() {
  const workId = "some-work-id-7";
  const type = ["bog"];
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
ContentWrapped_No_ListOfContent.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

// ContentWrapped.story = {
//   parameters: {
//     graphql: {
//       resolvers: {
//         Query: {
//           work: () => {
//             return {
//               workId: "some-id-2",
//               materialTypes: [{ specific: "bog" }],
//               workTypes: ["LITERATURE"],
//               manifestations: {
//                 mostRelevant: [{ pid: "some-pid-2" }],
//               },
//             };
//           },
//           manifestations: () => {
//             return [
//               {
//                 pid: "some-pid-2",
//                 materialTypes: [{ specific: "bog" }],
//                 tableOfContents: {
//                   heading: "Kapitler",
//                   listOfContent: [
//                     { content: "Kapitel Miaw" },
//                     { content: "Kapitel Vuf" },
//                     { content: "Kapitel Mæh" },
//                     { content: "Kapitel Muh" },
//                   ],
//                 },
//               },
//             ];
//           },
//         },
//       },
//     },
//     // nextRouter: {
//     //   showInfo: true,
//     //   pathname: "/",
//     //   query: {},
//     // },
//   },
// };

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
