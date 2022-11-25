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

// A manifestation with edition, publisher, creator
const MANIFESTATION_6 = {
  ...MANIFESTATION_1,
  pid: "some-pid-6",
  publisher: ["Sølvbakke"],
  edition: { publicationYear: { display: 3001 }, edition: "109. udgave" },
  creators: [{ display: "Linoleum Gummigulv" }],
};

const ALL_MANIFESTATIONS = [
  MANIFESTATION_1,
  MANIFESTATION_2,
  MANIFESTATION_3,
  MANIFESTATION_4,
  MANIFESTATION_5,
  MANIFESTATION_6,
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
    USER_1,
    USER_2,
    USER_3,
    DEFAULT_STORY_PARAMETERS,
  };
}
