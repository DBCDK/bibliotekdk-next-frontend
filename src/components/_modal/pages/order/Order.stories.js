import { StoryTitle, StoryDescription } from "@/storybook";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import ReservationButtonWrapper from "@/components/work/reservationbutton/ReservationButton";
import merge from "lodash/merge";
import automock_utils from "@/lib/automock_utils.fixture";

const exportedObject = {
  title: "modal/Order",
};

export default exportedObject;

const {
  USER_1,
  USER_2,
  USER_3,
  USER_4,
  BRANCH_1,
  BRANCH_2,
  BRANCH_3,
  BRANCH_4,
  DEFAULT_STORY_PARAMETERS,
  useMockLoanerInfo,
} = automock_utils();

function OrderPageComponentBuilder({
  title,
  description,
  workId,
  selectedPids,
}) {
  return (
    <>
      <StoryTitle>{title}</StoryTitle>
      <StoryDescription>
        {description}
        <br />
        <br />
        <span>workId: {workId}</span>
        <br />
        <span>selectedPids: {selectedPids.join(", ")}</span>
      </StoryDescription>
      <ReservationButtonWrapper workId={workId} selectedPids={selectedPids} />
      <Modal.Container>
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
    </>
  );
}

// -------------------- Stories come here -----------------------
export function OrderViaILL() {
  return (
    <OrderPageComponentBuilder
      title="Order via ILL"
      description="some-pid-3 should not be ordered, since loanIsPossible is false"
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1", "some-pid-2", "some-pid-3"]}
    />
  );
}

OrderViaILL.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function PickupNotAllowed() {
  return (
    <OrderPageComponentBuilder
      title="Pickup not allowed"
      description="When checkorder fails for material on a branch, error is displayed"
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1", "some-pid-2", "some-pid-3"]}
    />
  );
}

PickupNotAllowed.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: { graphql: { resolvers: { Query: { user: () => USER_2 } } } },
});

export function OrderIndexedPeriodicaArticle() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="Order Indexed Periodica Article"
      description={`An article from a periodica has been indexed (we have a work for that article).
        And it can be ordered via digital article service.`}
      workId={"some-work-id-2"}
      selectedPids={["some-pid-4"]}
    />
  );
}

OrderIndexedPeriodicaArticle.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_3,
          branches: () => {
            return {
              result: [BRANCH_3],
            };
          },
        },
      },
    },
  },
});

export function OrderIndexedPeriodicaArticleILL() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="Order Indexed Periodica Article - ILL"
      description={`An article from a periodica has been indexed (we have a work for that article).
        And it can be ordered via ILL, not digital article service.`}
      workId={"some-work-id-2"}
      selectedPids={["some-pid-4"]}
    />
  );
}

OrderIndexedPeriodicaArticleILL.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_1,
          branches: () => {
            return {
              result: [BRANCH_1],
            };
          },
        },
      },
    },
  },
});

export function OrderPeriodicaVolume() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="Order Periodica Volume"
      description={`Order periodica volume through ILL, 
        or a specific periodica article through preferrably article service and then ILL.`}
      workId={"some-work-id-3"}
      selectedPids={["some-pid-5"]}
    />
  );
}

OrderPeriodicaVolume.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_3,
          branches: () => {
            return {
              result: [BRANCH_3],
            };
          },
        },
      },
    },
  },
});

export function OrderPeriodicaVolumeOnlyILL() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="Order Periodica Volume"
      description={`Order periodica volume through ILL, 
        or a specific periodica article through ILL. Selected branch does not subscribe 
        to digital article service.`}
      workId={"some-work-id-3"}
      selectedPids={["some-pid-5"]}
    />
  );
}

OrderPeriodicaVolumeOnlyILL.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_1,
          branches: () => {
            return {
              result: [BRANCH_1, BRANCH_2],
            };
          },
        },
      },
    },
  },
});

export function NotBlockedUser() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="User is NOT blocked from loaning"
      description={`User is NOT blocked from loaning, 
        the red user is blocked information box should NOT be present 
        and OrderConfirmationButton should NOT be disabled.`}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

NotBlockedUser.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_1,
          branches: () => {
            return {
              result: [BRANCH_1, BRANCH_2],
            };
          },
        },
      },
    },
  },
});

export function BlockedUser() {
  useMockLoanerInfo({});
  return (
    <OrderPageComponentBuilder
      title="User is blocked from loaning"
      description={`User is blocked from loaning, 
        the red user is blocked information box should be present 
        and OrderConfirmationButton should be disabled.`}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

BlockedUser.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_4,
          branches: () => {
            return {
              result: [BRANCH_4],
            };
          },
        },
      },
    },
  },
});

// TODO: Overvej om tidligere stories er interessante
//  Måske vi hellere vil have nogle forskellige cases,
//  til når man trykker på OrderConfirmationButton-knappen...?
// export function ToggleOrder() {}
// export function Default() {}
// export function Loading() {}
// export function NoEmail() {}
// export function ManyPickupPoints() {}
// export function Ordering() {}
// export function Ordered() {}
// export function OrderPolicyFail() {}

// TODO: Implementer knap-cases:
// onArticleSubmit,
// onSubmit,
// fejlende udgaver,
// etc.

// TODO: Implementer visning af Order.page.
//  Dette bør gøres i del-komponenterne, men noter her:
// TODO: Edition
//  Done...?
// TODO: LocalizationsInformation.js cases:
// availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
// (isLoadingBranches || pickupBranch)
// !isLoadingBranches && pickupBranch && !availableAsPhysicalCopy && !availableAsDigitalCopy
// TODO: OrdererInformation.js cases:
// (isLoadingBranches || name)
// (isLoadingBranches || (mail && lockedMessage && pickupBranch?.borrowerCheck))
// message
// (isLoadingBranches || (mail && lockedMessage && pickupBranch?.borrowerCheck)
// TODO: OrderConfirmation.js cases:
// actionMessage
// availableAsDigitalCopy
// !availableAsDigitalCopy && !availableAsPhysicalCopy
// isWorkLoading || isPickupBranchLoading
