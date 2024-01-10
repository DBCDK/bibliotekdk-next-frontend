import { StoryDescription, StoryTitle } from "@/storybook";

import BookmarkPage from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "profile/Bookmarks",
};

export default exportedObject;

const { WORK_8, WORK_4, USER_2, DEFAULT_STORY_PARAMETERS } = automock_utils();

/**
 * Returns Bookmarks
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
