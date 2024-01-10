import { StoryDescription, StoryTitle } from "@/storybook";

import BookmarkPage from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "profile/Bookmarks",
};

export default exportedObject;

const {
  // ALL_WORKS,
  WORK_8,
  // WORK_7,
  // WORK_3,
  WORK_4,
  // BORROWER_STATUS_FALSE,
  // BORROWER_STATUS_TRUE,
  // USER_1,
  USER_2,
  // USER_3,
  // USER_6,
  // USER_8,
  // BRANCH_1,
  // BRANCH_2,
  // BRANCH_3,
  // BRANCH_4,
  // BRANCH_8,
  DEFAULT_STORY_PARAMETERS,
  // useMockLoanerInfo,
} = automock_utils();

/**
 * Returns Notification
 *
 */
export function BookmarkList() {
  return (
    <div>
      <StoryTitle>Bookmarks</StoryTitle>
      <StoryDescription>User bookmarks</StoryDescription>
      <BookmarkPage />
    </div>
  );
}

BookmarkList.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          user: () => {
            return USER_2;
          },
          works: () => [WORK_8, WORK_4],
          checkorderpolicy: () => ({ orderPossible: true }),
          branches: () => {
            return {
              borrowerStatus: {
                allowed: true,
                statusCode: "OK",
              },
              result: [BRANCH_3],
            };
          },
        },
        // Mutation: {
        // 	submitMultipleOrders: () => ({}),
        // },
        // SubmitMultipleOrders: {
        // 	failedAtCreation: () => [],
        // 	successfullyCreated: () => ["some-work-id-8BOOK"],
        // 	ok: () => true,
        // },
      },
    },
  },
});

BookmarkList.decorators = [
  (Story) => {
    window.localStorage.setItem(
      "bookmarks",
      JSON.stringify([
        {
          key: "some-work-id-8BOOK",
          materialId: "some-work-id-8",
          workId: "some-work-id-8",
          materialType: "BOOK",
          title: "fisk",
          createdAt: "2024-01-05T14:03:05.432Z",
        },
        {
          key: "some-work-id-4EBOOK",
          materialId: "some-work-id-4",
          workId: "some-work-id-4",
          materialType: "EBOOK",
          title: "fisk",
          createdAt: "2024-01-05T14:03:05.432Z",
        },
      ])
    );
    return <Story />;
  },
];
