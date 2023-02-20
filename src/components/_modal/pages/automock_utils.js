// A manifestation that may be ordered via ILL
import useUser from "@/components/hooks/useUser";
import { useId, useMemo } from "react";
import { AccessEnum } from "@/lib/enums";

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
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=21678783&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=54646db03d538703e6c1",
    origin: "moreinfo",
  },
};
// Another manifestation that may be ordered via ILL
const MANIFESTATION_2 = {
  ...MANIFESTATION_1,
  pid: "some-pid-2",
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53588697&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=06bb715d932ba34098b2",
    origin: "moreinfo",
  },
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
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777057&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4d9e99b14209aef2a5d6",
    origin: "moreinfo",
  },
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
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23637189&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=72eb2ae9d91fb0ffbb7f",
    origin: "moreinfo",
  },
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
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25504097&attachment_type=forside_stor&bibliotek=870970&source_id=150015&key=f9383e2279f840a4f31e",
    origin: "moreinfo",
  },
};

// A manifestation with edition, publisher, creator
const MANIFESTATION_6 = {
  ...MANIFESTATION_1,
  pid: "some-pid-6",
  publisher: ["Sølvbakke"],
  edition: { publicationYear: { display: 3001 }, edition: "109. udgave" },
  creators: [{ display: "Linoleum Gummigulv" }],
};

const MANIFESTATION_7 = {
  ...MANIFESTATION_1,
  pid: "some-pid-7",
  materialTypes: [
    {
      specific: "ebog",
    },
  ],
  access: [
    {
      __resolveType: AccessEnum.ACCESS_URL,
      url: "https://ereol.combo/langurl",
      origin: "https://ereol.combo",
    },
  ],
  workTypes: ["LITERATURE"],
};

const ALL_MANIFESTATIONS = [
  MANIFESTATION_1,
  MANIFESTATION_2,
  MANIFESTATION_3,
  MANIFESTATION_4,
  MANIFESTATION_5,
  MANIFESTATION_6,
  MANIFESTATION_7,
];

const ALL_WORKS = [
  // A work that has physical manifestations, two of them can be loaned via ILL
  {
    workId: "some-work-id-1",
    manifestations: {
      all: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
      mostRelevant: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
    },
  },
  // A work that is an indexed periodica article
  {
    workId: "some-work-id-2",
    manifestations: { all: [MANIFESTATION_4], mostRelevant: [MANIFESTATION_4] },
    workTypes: ["ARTICLE"],
  },
  // A work that is a periodica
  {
    workId: "some-work-id-3",
    manifestations: { all: [MANIFESTATION_5], mostRelevant: [MANIFESTATION_5] },
    workTypes: ["PERIODICA"],
  },
  // A work that is an ebog
  {
    workId: "some-work-id-4",
    manifestations: { all: [MANIFESTATION_7], mostRelevant: [MANIFESTATION_7] },
    workTypes: ["LITERATURE"],
    relations: {
      continues: [MANIFESTATION_2, MANIFESTATION_3],
      continuedIn: [MANIFESTATION_4, MANIFESTATION_5],
      hasAdaptation: [],
      isAdaptationOf: [],
      discusses: [],
      discussedIn: [],
    },
  },
];

const BRANCH_1 = {
  name: "Test Bib - only physical via ILL",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  userIsBlocked: false,
};
const BRANCH_2 = {
  name: "Test Bib - no orders here",
  orderPolicy: {
    orderPossible: false,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  userIsBlocked: false,
};
const BRANCH_3 = {
  name: "Test Bib - ILL and digital copy service",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  userIsBlocked: false,
};
const BRANCH_4 = {
  name: "Test Bib - User is blocked",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  branchWebsiteUrl: "balleripraprup.dekaa",
  agencyName: "BalleRipRapRup",
  userIsBlocked: true,
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

const USER_4 = {
  agency: {
    result: [BRANCH_4],
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
        ElbaServices: {
          placeCopyRequest: (args) => {
            // Used for cypress testing
            console.debug("elbaPlaceCopy", args?.variables?.input);
            return { status: "OK" };
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

function useMockLoanerInfo(pickupBranch = "790900") {
  const { updateLoanerInfo } = useUser();
  const id = useId();

  useMemo(() => {
    updateLoanerInfo({ pickupBranch: pickupBranch });
  }, [id]);
}

export default function automock_utils() {
  return {
    MANIFESTATION_1,
    MANIFESTATION_2,
    MANIFESTATION_3,
    MANIFESTATION_4,
    MANIFESTATION_5,
    ALL_MANIFESTATIONS,
    ALL_WORKS,
    BRANCH_1,
    BRANCH_2,
    BRANCH_3,
    BRANCH_4,
    USER_1,
    USER_2,
    USER_3,
    USER_4,
    DEFAULT_STORY_PARAMETERS,
    useMockLoanerInfo,
  };
}
