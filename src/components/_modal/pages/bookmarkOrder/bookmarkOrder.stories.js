import { StoryTitle, StoryDescription } from "@/storybook";
import EMaterialFilter from "@/components/_modal/pages/bookmarkOrder/EMaterialFilter";
import Material from "@/components/_modal/pages/bookmarkOrder/multi-order/Material/Material";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import MultiReceipt from "@/components/_modal/pages/bookmarkOrder/receipt/MultiOrderReceipt.page";

const exportedObject = {
  title: "modal/Materials",
};

// const { BORROWER_STATUS_TRUE } = automock_utils();

const {
  // ALL_WORKS,
  WORK_8,
  WORK_7,
  // WORK_3,
  WORK_4,
  // BORROWER_STATUS_FALSE,
  // BORROWER_STATUS_TRUE,
  // USER_1,
  // USER_2,
  USER_3,
  // USER_6,
  // USER_8,
  // BRANCH_1,
  // BRANCH_2,
  BRANCH_3,
  // BRANCH_4,
  // BRANCH_8,
  DEFAULT_STORY_PARAMETERS,
  useMockLoanerInfo,
} = automock_utils();

export default exportedObject;

export function MaterialsToOrderDouble() {
  const Bookmarks = [
    {
      key: "some-work-id-8BOOK",
      materialId: "some-work-id-8",
      workId: "some-work-id-8",
      materialType: "BOOK",
      title: "fisk",
      createdAt: "2024-01-05T14:03:05.432Z",
    },
  ];

  const onlineBookmark = [
    {
      key: "some-work-id-4EBOOK",
      materialId: "some-work-id-4",
      workId: "some-work-id-4",
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
        Mutation: {
          submitMultipleOrders: () => ({}),
        },
        SubmitMultipleOrders: {
          failedAtCreation: () => [],
          successfullyCreated: () => ["some-work-id-8BOOK"],
          ok: () => true,
        },
      },
    },
  },
});

export function MaterialsToOrderSingleMaterial() {
  const bookmarksToOrder = [
    {
      key: "some-work-id-8BOOK",
      materialId: "some-work-id-8",
      workId: "some-work-id-8",
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
          works: () => [WORK_8, WORK_7],
          checkorderpolicy: () => ({ orderPossible: true }),
        },
        Mutation: {
          submitMultipleOrders: () => ({}),
        },
        SubmitMultipleOrders: {
          failedAtCreation: () => [],
          successfullyCreated: () => ["some-work-id-8BOOK"],
          ok: () => true,
        },
      },
    },
  },
});
