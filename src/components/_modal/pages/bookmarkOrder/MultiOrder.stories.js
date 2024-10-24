import { StoryTitle, StoryDescription } from "@/storybook";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import { useModal } from "@/components/_modal";
import { useOrderFlow } from "@/components/hooks/order";
import { useMemo } from "react";
import Button from "@/components/base/button";

const exportedObject = {
  title: "order/MultiOrder",
};
export default exportedObject;

const AUTHENTICATED_USER = "AUTHENTICATED_USER";
const FFU_USER = "FFU_USER";
const UNAUTHENTICATED_USER = "UNAUTHENTICATED_USER";
const MITID_NO_AGENCIES_USER = "MITID_NO_AGENCIES_USER";

const BRANCHES = {
  BRANCH_TEMPORARILY_CLOSED: {
    agencyId: "BRANCH_TEMPORARILY_CLOSED",
    branchId: "BRANCH_TEMPORARILY_CLOSED",
    agencyName: "Agency - Temporarily closed",
    name: "Branch - Modtager ILL - but closed",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    mobileLibraryLocations: null,
    temporarilyClosed: true,
    temporarilyClosedReason: "SOME GOOD REASON",
  },
  BRANCH_ACCEPT_ILL: {
    agencyId: "BRANCH_ACCEPT_ILL",
    branchId: "BRANCH_ACCEPT_ILL",
    agencyName: "Agency - Modtager ILL",
    name: "Branch - Modtager ILL",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    mobileLibraryLocations: null,
    temporarilyClosed: false,
  },
  BRANCH_CHECKORDER_FAILS: {
    agencyId: "BRANCH_CHECKORDER_FAILS",
    branchId: "BRANCH_CHECKORDER_FAILS",
    agencyName: "Agency - Checkorder fejler",
    name: "Branch - Checkorder fejler",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    mobileLibraryLocations: null,
    temporarilyClosed: false,
  },
  BRANCH_BlOCKS_USERS: {
    agencyId: "BRANCH_BlOCKS_USERS",
    branchId: "BRANCH_BlOCKS_USERS",
    agencyName: "Agency - Blocks users",
    name: "Branch - Blocks users",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    mobileLibraryLocations: null,
    temporarilyClosed: false,
  },
  BRANCH_NO_BORROWERCHECK: {
    agencyId: "BRANCH_NO_BORROWERCHECK",
    branchId: "BRANCH_NO_BORROWERCHECK",
    agencyName: "Agency - No borrowercheck",
    name: "Branch - No borrowercheck",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: false,
    userParameters: [
      {
        description: "brugerId",
        userParameterType: "CPR",
        userParameterName: "cpr",
      },
    ],
    mobileLibraryLocations: null,
    temporarilyClosed: false,
  },
  BRANCH_REQUIRES_PINCODE: {
    agencyId: "BRANCH_REQUIRES_PINCODE",
    branchId: "BRANCH_REQUIRES_PINCODE",
    agencyName: "Agency - Requires pincode",
    name: "Branch - Requires pincode",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    culrDataSync: false,
    agencyType: "FORSKNINGSBIBLIOTEK",
    mobileLibraryLocations: null,
    temporarilyClosed: false,
  },
  BRANCH_MOBILE_LOCATIONS: {
    agencyId: "BRANCH_MOBILE_LOCATIONS",
    branchId: "BRANCH_MOBILE_LOCATIONS",
    agencyName: "Agency - has mobile library locations",
    name: "Branch - has mobile library locations",
    postalAddress: "Sjov Gade 11",
    postalCode: "2020",
    city: "Sjov by",
    borrowerCheck: true,
    mobileLibraryLocations: ["Brugsen", "På hjørnet", "Kiosken"],
    temporarilyClosed: false,
  },
};

export function AuthenticatedUser() {
  return (
    <>
      <StoryTitle>Multi Order</StoryTitle>
      <StoryDescription>Folkebib indlogget bruger</StoryDescription>
      <MultiOrderStory />
    </>
  );
}
AuthenticatedUser.story = createStoryParameters({ user: AUTHENTICATED_USER });

export function UnauthenticatedUser() {
  return (
    <>
      <StoryTitle>Multi Order</StoryTitle>
      <StoryDescription>Ikke indlogget bruger</StoryDescription>
      <MultiOrderStory />
    </>
  );
}
UnauthenticatedUser.story = createStoryParameters({
  user: UNAUTHENTICATED_USER,
});

export function FFUUser() {
  return (
    <>
      <StoryTitle>Multi Order</StoryTitle>
      <StoryDescription>FFU indlogget bruger</StoryDescription>
      <MultiOrderStory />
    </>
  );
}
FFUUser.story = createStoryParameters({
  user: FFU_USER,
});

export function MitIdNoAgencies() {
  return (
    <>
      <StoryTitle>Multi Order</StoryTitle>
      <StoryDescription>
        Logget ind med MitId, bruger har ingen agencies
      </StoryDescription>
      <MultiOrderStory />
    </>
  );
}
MitIdNoAgencies.story = createStoryParameters({
  user: MITID_NO_AGENCIES_USER,
});

function MultiOrderStory() {
  const modal = useModal();

  const { start } = useOrderFlow();
  useMemo(() => {
    modal.setStack([]);
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_ILL_ACCESS"] }],
          });
        }}
      >
        Bestil single ILL
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_ILL_ACCESS_FAILS"] }],
          });
        }}
      >
        Bestil med fejl i kvittering
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_DIGITAL_ACCESS"] }],
          });
        }}
      >
        Bestil digital artikel
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [
              { pids: ["PID_PERIODICA_1"] },
              { pids: ["PID_PERIODICA_2"] },
            ],
          });
        }}
      >
        Bestil tidsskrifter
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [
              { pids: ["PID_NO_ACCESS"] },
              { pids: ["PID_DIGITAL_ACCESS"] },
            ],
          });
        }}
      >
        Bestil mange
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_EBOOK"] }],
          });
        }}
      >
        Bestil e-bog
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_EBOOK"] }, { pids: ["PID_ILL_ACCESS"] }],
          });
        }}
      >
        Bestil e-bog og fysisk
      </Button>
      <Button
        onClick={() => {
          start({
            orders: [{ pids: ["PID_ILL_ACCESS"] }],
            initialBranch: BRANCHES.BRANCH_ACCEPT_ILL,
          });
        }}
      >
        Bestil direkte til branch
      </Button>
      <Modal.Container>
        <Modal.Page id="multiorder" component={Pages.MultiOrder} />
        <Modal.Page id="multireceipt" component={Pages.MultiReceipt} />
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
        <Modal.Page id="ematerialfilter" component={Pages.EMaterialFilter} />
        <Modal.Page id="statusMessage" component={Pages.StatusMessage} />
        <Modal.Page
          id="openAdgangsplatform"
          component={Pages.OpenAdgangsplatform}
        />
        <Modal.Page
          id="loginNotSupported"
          component={Pages.LoginNotSupported}
        />
      </Modal.Container>
    </>
  );
}

function createStoryParameters({ user, submitOrdersDelay = 500 }) {
  let currentSession = {};

  const MANIFESTATIONS = {};

  const PID_TO_WORK = {};

  const WORKS = {};

  function getManifestation(pid) {
    return MANIFESTATIONS[pid] || null;
  }
  function getWork(id) {
    return PID_TO_WORK[id] || WORKS[id] || null;
  }

  function createMockedWork({
    name,
    access,
    workTypes,
    materialTypeSpecific = {
      code: "BOOK",
      display: "bog",
    },
  }) {
    const pid = `PID_${name}`;
    const manifestation = {
      pid,
      titles: {
        main: [`${pid} - main`],
        full: [`${pid} - full`],
      },
      cover: {
        detail: `https://picsum.photos/seed/${pid}/200/300`,
      },
      creators: [{ display: `${pid} - creator` }],
      access,
      unit: {
        manifestations: [{ pid, access }],
      },
      edition: {
        publicationYear: { display: "1999" },
      },
      materialTypes: [
        {
          materialTypeSpecific,
        },
      ],
      workTypes,
      publisher: ["Gyldenbal"],
    };
    MANIFESTATIONS[pid] = manifestation;
    const workId = `WORK_${name}`;
    const work = {
      workId,
      titles: {
        main: [`${workId} - main`],
        full: [`${workId} - full`],
      },
      creators: [{ display: `${workId} - creator` }],
      manifestations: {
        bestRepresentation: manifestation,
        mostRelevant: [manifestation],
      },
      materialTypes: [
        {
          materialTypeSpecific,
        },
      ],
      workTypes,
    };
    WORKS[workId] = work;
    PID_TO_WORK[pid] = work;
  }

  createMockedWork({
    name: "ILL_ACCESS",
    access: [
      {
        __typename: "InterLibraryLoan",
        loanIsPossible: true,
      },
    ],
    materialTypeSpecific: {
      code: "BOOK",
      display: "bog",
    },
  });
  createMockedWork({
    name: "ILL_ACCESS_FAILS",
    access: [
      {
        __typename: "InterLibraryLoan",
        loanIsPossible: true,
      },
    ],
  });
  createMockedWork({
    name: "ILL_CHECKORDER_FAILS",
    access: [
      {
        __typename: "InterLibraryLoan",
        loanIsPossible: true,
      },
    ],
  });
  createMockedWork({ name: "NO_ACCESS", access: [] });
  createMockedWork({
    name: "DIGITAL_ACCESS",
    access: [{ __typename: "DigitalArticleService", issn: "PERIODICA_ISSN" }],
  });
  createMockedWork({
    name: "PERIODICA_1",
    workTypes: ["PERIODICA"],
    access: [
      {
        __typename: "InterLibraryLoan",
        loanIsPossible: true,
      },
      ,
      { __typename: "DigitalArticleService", issn: "PERIODICA_ISSN_1" },
    ],
  });
  createMockedWork({
    name: "PERIODICA_2",
    workTypes: ["PERIODICA"],
    access: [
      {
        __typename: "InterLibraryLoan",
        loanIsPossible: true,
      },
    ],
  });
  createMockedWork({
    name: "EBOOK",
    workTypes: ["PERIODICA"],
    access: [
      {
        __typename: "Ereol",
        origin: "eReolen",
        url: "https://ereolen.dk/ting/object/...",
      },
    ],
  });

  const USERS = {
    AUTHENTICATED_USER: {
      name: "Indlogget bruger - navn",
      agencies: [
        {
          id: "BRANCH_ACCEPT_ILL",
          branches: [BRANCHES.BRANCH_ACCEPT_ILL],
          result: [BRANCHES.BRANCH_ACCEPT_ILL],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_CHECKORDER_FAILS",
          branches: [BRANCHES.BRANCH_CHECKORDER_FAILS],
          result: [BRANCHES.BRANCH_CHECKORDER_FAILS],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_BlOCKS_USERS",
          branches: [BRANCHES.BRANCH_BlOCKS_USERS],
          result: [BRANCHES.BRANCH_BlOCKS_USERS],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_REQUIRES_PINCODE",
          branches: [BRANCHES.BRANCH_REQUIRES_PINCODE],
          result: [BRANCHES.BRANCH_REQUIRES_PINCODE],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_MOBILE_LOCATIONS",
          branches: [BRANCHES.BRANCH_MOBILE_LOCATIONS],
          result: [BRANCHES.BRANCH_MOBILE_LOCATIONS],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_NO_BORCHK",
          branches: [BRANCHES.BRANCH_NO_BORROWERCHECK],
          result: [BRANCHES.BRANCH_NO_BORROWERCHECK],
          user: {
            mail: "test@test.dk",
          },
        },
        {
          id: "BRANCH_TEMPORARILY_CLOSED",
          branches: [BRANCHES.BRANCH_TEMPORARILY_CLOSED],
          result: [BRANCHES.BRANCH_TEMPORARILY_CLOSED],
          user: {
            mail: "test@test.dk",
          },
        },
      ],
      lastUsedPickUpBranch: null,
      favoritePickUpBranch: null,
    },
    MITID_NO_AGENCIES_USER: {
      name: "Indlogget bruger - navn",
      agencies: [],
      identityProviderUsed: "nemlogin",
      lastUsedPickUpBranch: null,
      favoritePickUpBranch: null,
    },
  };

  return {
    parameters: {
      graphql: {
        resolvers: {
          BorrowerStatus: {
            allowed: (args) => {
              return args?.variables?.branchId === "BRANCH_BlOCKS_USERS"
                ? false
                : true;
            },
          },
          Session: {
            pickupBranch: () => currentSession?.pickupBranch || null,
            userParameters: () => currentSession?.userParameters || null,
          },
          Manifestation: {
            ownerWork: (args) => {
              return getWork(args?.parent?.pid) || {};
            },
          },
          Branch: {
            orderPolicy: (args) => {
              return {
                orderPossible:
                  args.variables.branchId !== "BRANCH_CHECKORDER_FAILS" &&
                  args.variables.branchId !== "BRANCH_TEMPORARILY_CLOSED",
              };
            },
          },
          Query: {
            branches: (args) => {
              const branch = BRANCHES[args?.variables?.branchId] && [
                BRANCHES[args?.variables?.branchId],
              ];
              const branches = args?.variables?.q && Object.values(BRANCHES);
              return {
                result: branch || branches || [],
              };
            },
            user: () => {
              return USERS[user];
            },
            works: (args) => {
              const ids = args?.variables?.ids;

              return ids?.map((id) => getWork(id));
            },
            manifestations: (args) => {
              const pids = args?.variables?.pid || args?.variables?.pids;

              return pids?.map((pid) => getManifestation(pid));
            },
          },
          Mutation: {
            submitSession: (args) => {
              // Used for cypress testing
              console.debug("submitSession", args?.variables?.input);
              currentSession = args?.variables?.input;
              return "OK";
            },
            submitMultipleOrders: async (args) => {
              await new Promise((r) => setTimeout(r, submitOrdersDelay));
              const input = args?.variables?.input;
              // Used for cypress testing
              console.debug("submitMultipleOrders", input);

              return {
                ok: true,
                successfullyCreated: input?.materialsToOrder
                  ?.filter(
                    (entry) =>
                      !entry?.pids?.find((pid) => pid?.includes("FAILS"))
                  )
                  ?.map((entry) => entry?.key),
                failedAtCreation: input?.materialsToOrder
                  ?.filter((entry) =>
                    entry?.pids?.find((pid) => pid?.includes("FAILS"))
                  )
                  ?.map((entry) => entry?.key),
              };
            },
          },
        },
      },
      session: user === UNAUTHENTICATED_USER && {},
    },
  };
}
