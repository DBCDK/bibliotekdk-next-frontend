import { StoryDescription, StoryTitle } from "@/storybook";

import BookmarkPage from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "profile/Bookmarks",
};

export default exportedObject;

const { WORK_11, WORK_12, USER_2, BRANCH_3, DEFAULT_STORY_PARAMETERS } =
  automock_utils();

/**
 * Returns Bookmarks
 *
 */
export function BookmarkList() {
  return (
    <div>
      <StoryTitle>Bookmarks</StoryTitle>
      <StoryDescription>
        Bookmarks with a default material type, an explicit selection and a
        specific edition, plus an unavailable material with snapshot metadata
      </StoryDescription>
      <BookmarkPage />
    </div>
  );
}

const BookmarkListStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          user: () => {
            return USER_2;
          },
          works: () => [WORK_11, WORK_12],
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
BookmarkList.parameters = BookmarkListStory.parameters;
BookmarkList.args = BookmarkListStory.args;
BookmarkList.decorators = BookmarkListStory.decorators;
BookmarkList.storyName = BookmarkListStory.name || BookmarkListStory.storyName;
BookmarkList.decorators = [
  (Story) => {
    window.localStorage.setItem(
      "bookmarks",
      JSON.stringify([
        {
          id: "23386d82-2334-4c80-9147-0f086a541a54",
          materialId: "870970-basis:missing",
          material: { manifestation: null },
          selection: null,
          snapshot: {
            title: "Materiale der ikke længere findes",
            creator: "Gemt ophav",
            workId: WORK_11.workId,
          },
          createdAt: "2024-01-07T14:03:05.432Z",
        },
        {
          id: "23386d82-2334-4c80-9147-0f086a541a51",
          material: { manifestation: WORK_11.manifestations.mostRelevant[0] },
          materialId: WORK_11.manifestations.mostRelevant[0].pid,
          workId: WORK_11.workId,
          selection: null,
          title: WORK_11.titles.full[0],
          createdAt: "2024-01-04T14:03:05.432Z",
        },
        {
          materialId: "work-of:some-pid-8",
          workId: "work-of:some-pid-8",
          id: "23386d82-2334-4c80-9147-0f086a541a52",
          material: { work: WORK_11 },
          title: "fisk",
          selection: null,
          createdAt: "2024-01-06T14:03:05.432Z",
        },
        {
          materialId: "work-of:some-pid-8",
          workId: "work-of:some-pid-8",
          id: "23386d82-2334-4c80-9147-0f086a541a53",
          material: {
            work: WORK_11,
            manifestations: WORK_11.manifestations.mostRelevant,
          },
          selection: { materialTypes: { specific: ["BOOK"] } },
          title: "fisk",
          createdAt: "2024-01-05T14:03:05.432Z",
        },
        {
          materialId: "work-of:some-pid-7",
          workId: "work-of:some-pid-7",
          selection: { materialTypes: { specific: ["EBOOK"] } },
          title: "fisk",
          createdAt: "2024-01-05T14:03:05.432Z",
        },
      ])
    );
    return <Story />;
  },
];
