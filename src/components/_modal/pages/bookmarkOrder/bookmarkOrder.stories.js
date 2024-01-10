import { StoryTitle, StoryDescription } from "@/storybook";
import EMaterialFilter from "@/components/_modal/pages/bookmarkOrder/EMaterialFilter";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";

const exportedObject = {
  title: "modal/Materials",
};

const {
  WORK_8,
  WORK_7,
  WORK_4,
  USER_3,
  BRANCH_3,
  WORK_11,
  WORK_12,
  DEFAULT_STORY_PARAMETERS,
  useMockLoanerInfo,
} = automock_utils();

export default exportedObject;

export function MaterialsToOrderDouble() {
  const Bookmarks = [
    {
      key: "work-of:some-pid-8BOOK",
      materialId: "work-of:some-pid-8",
      workId: "work-of:some-pid-8",
      materialType: "BOOK",
      title: "fisk",
      createdAt: "2024-01-05T14:03:05.432Z",
    },
  ];

  const onlineBookmark = [
    {
      key: "work-of:some-pid-7EBOOK",
      materialId: "work-of:some-pid-7",
      workId: "work-of:some-pid-7",
      materialType: "EBOOK",
      title: "fisk",
      createdAt: "2024-01-05T14:03:05.432Z",
    },
  ];
  useMockLoanerInfo({ pickUpBranch: "1235" });

  const handleOrderFinished = () => null;
  const context = {
    sortType: "title",
    bookmarksToOrder: Bookmarks,
    handleOrderFinished,
    bookmarksOnlineAvailable: onlineBookmark,
  };
  return (
    <div>
      <StoryTitle>Bookmark order - two materials</StoryTitle>
      <StoryDescription>Order two materials - one is EBOOK</StoryDescription>

      <EMaterialFilter context={context} active={true} />
      <Modal.Container>
        <Modal.Page id="multiorder" component={Pages.MultiOrder} />
        <Modal.Page id="multireceipt" component={Pages.MultiReceipt} />
      </Modal.Container>
    </div>
  );
}
MaterialsToOrderDouble.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          user: () => {
            return USER_3;
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
        Mutation: {
          submitMultipleOrders: () => ({}),
        },
        SubmitMultipleOrders: {
          failedAtCreation: () => [],
          successfullyCreated: () => ["work-of:some-pid-8BOOK"],
          ok: () => true,
        },
      },
    },
  },
});

export function MaterialsToOrderSingleMaterial() {
  const bookmarksToOrder = [
    {
      key: "work-of:some-pid-8BOOK",
      materialId: "work-of:some-pid-8",
      workId: "work-of:some-pid-8",
      materialType: "BOOK",
      title: "fisk",
      createdAt: "2024-01-05T14:03:05.432Z",
    },
  ];
  useMockLoanerInfo({ pickUpBranch: "1235" });
  const handleOrderFinished = () => null;
  const context = {
    sortType: "title",
    bookmarksToOrder,
    handleOrderFinished,
    bookmarksOnlineAvailable: [],
  };
  return (
    <div>
      <StoryTitle>Materials to order - one material only</StoryTitle>
      <StoryDescription>
        A list of bookmarked materials to order
      </StoryDescription>

      <EMaterialFilter context={context} active={true} />
      <Modal.Container>
        <Modal.Page id="multiorder" component={Pages.MultiOrder} />
        <Modal.Page id="multireceipt" component={Pages.MultiReceipt} />
      </Modal.Container>
    </div>
  );
}
MaterialsToOrderSingleMaterial.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_3,
          works: () => [WORK_11, WORK_12],
          checkorderpolicy: () => ({ orderPossible: true }),
        },
        Mutation: {
          submitMultipleOrders: () => ({}),
        },
        SubmitMultipleOrders: {
          failedAtCreation: () => [],
          successfullyCreated: () => ["work-of:some-pid-8BOOK"],
          ok: () => true,
        },
      },
    },
  },
});
