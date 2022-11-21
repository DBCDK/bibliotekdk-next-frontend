import { StoryTitle, StoryDescription } from "@/storybook";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";
import merge from "lodash/merge";

const exportedObject = {
  title: "modal/Order",
};

export default exportedObject;

// A manifestation that may be ordered via ILL
const MANIFESTATION_1 = {
  titles: {
    full: ["Hugo i Sølvskoven"],
  },
  pid: "some-pid-1",
  materialTypes: [
    {
      specific: "Bog",
    },
  ],
  accessTypes: [{ code: "PHYSICAL", display: "fysisk" }],
  access: [
    {
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
};
// Another manifestation that may be ordered via ILL
const MANIFESTATION_2 = {
  ...MANIFESTATION_1,
  pid: "some-pid-2",
};
// A manifestation that may not be ordered via ILL
const MANIFESTATION_3 = {
  ...MANIFESTATION_1,
  pid: "some-pid-3",
  access: [
    {
      __typename: "InterLibraryLoan",
      loanIsPossible: false,
    },
  ],
};
// Indexed article, that may be ordered via digital article copy
const MANIFESTATION_4 = {
  ...MANIFESTATION_1,
  pid: "some-pid-4",
  materialTypes: [
    {
      specific: "tidsskriftsartikel",
    },
  ],
  access: [
    {
      __typename: "DigitalArticleService",
      issn: "some-issn",
    },
    {
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  workTypes: ["ARTICLE"],
};
// A periodica
const MANIFESTATION_5 = {
  ...MANIFESTATION_1,
  pid: "some-pid-5",
  materialTypes: [
    {
      specific: "tidsskrift",
    },
  ],
  access: [
    {
      __typename: "DigitalArticleService",
      issn: "some-issn",
    },
    {
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  workTypes: ["PERIODICA"],
};
const ALL_MANIFESTATIONS = [
  MANIFESTATION_1,
  MANIFESTATION_2,
  MANIFESTATION_3,
  MANIFESTATION_4,
  MANIFESTATION_5,
];

const ALL_WORKS = [
  // A work that has physical manifestations, two of them can be loaned via ILL
  {
    workId: "some-work-id-1",
    manifestations: {
      all: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
    },
  },
  // A work that is an indexed periodica article
  {
    workId: "some-work-id-2",
    manifestations: { all: [MANIFESTATION_4] },
    workTypes: ["ARTICLE"],
  },
  // A work that is a periodica
  {
    workId: "some-work-id-3",
    manifestations: { all: [MANIFESTATION_5] },
    workTypes: ["PERIODICA"],
  },
];

const BRANCH_1 = {
  name: "Test Bib - only physical via ILL",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
};
const BRANCH_2 = {
  name: "Test Bib - no orders here",
  orderPolicy: {
    orderPossible: false,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
};
const BRANCH_3 = {
  name: "Test Bib - ILL and digital copy service",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
};

// A user with some agencies
const USER_1 = {
  agency: {
    result: [BRANCH_1, BRANCH_2],
  },
};

const USER_2 = {
  agency: {
    result: [BRANCH_2],
  },
};

const USER_3 = {
  agency: {
    result: [BRANCH_3],
  },
};

const DEFAULT_STORY_PARAMETERS = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Access: {
          __resolveType: ({ parent }) => {
            return parent?.__typename;
          },
        },
        Query: {
          user: () => {
            return USER_1;
          },
          manifestations: (args) => {
            return args?.variables?.pid?.map((pid) =>
              ALL_MANIFESTATIONS.find((m) => m.pid === pid)
            );
          },
          work: ({ variables }) => {
            return ALL_WORKS.find((w) => w.workId === variables?.workId);
          },
          branches: () => {
            return { result: [BRANCH_1, BRANCH_2, BRANCH_3] };
          },
        },
        Mutation: {
          submitOrder: (args) => {
            // Used for cypress testing
            console.debug("submitOrder", args?.variables?.input);
            return { orderId: "some-order-id" };
          },
          submitPeriodicaArticleOrder: (args) => {
            // Used for cypress testing
            console.debug(
              "submitPeriodicaArticleOrder",
              args?.variables?.input
            );
            return { status: "OK" };
          },
        },
      },
      url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
    },
    nextRouter: {
      showInfo: true,
      pathname: `/i-dont-care`,
      query: {},
    },
  },
};

function OrderPageComponentBuilder({
  title,
  description,
  workId,
  selectedPids,
}) {
  return (
    <div>
      <StoryTitle>{title}</StoryTitle>
      <StoryDescription>
        {description}
        <br />
        <br />
        <div>workId: {workId}</div>
        <div>selectedPids: {selectedPids.join(", ")}</div>
      </StoryDescription>
      <ReservationButton workId={workId} selectedPids={selectedPids} />
      <Modal.Container>
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
    </div>
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
        Query: { user: () => USER_3 },
      },
    },
  },
});

export function OrderIndexedPeriodicaArticleILL() {
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
        Query: { user: () => USER_1 },
      },
    },
  },
});

export function OrderPeriodicaVolume() {
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
        Query: { user: () => USER_3 },
      },
    },
  },
});

export function OrderPeriodicaVolumeOnlyILL() {
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
        Query: { user: () => USER_1 },
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
