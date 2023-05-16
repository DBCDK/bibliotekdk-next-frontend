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
      specific: "bog",
    },
  ],
  edition: {
    edition: "101. udgave",
    publicationYear: {
      display: "2009-1",
    },
  },
  accessTypes: [{ code: "PHYSICAL", display: "fysisk" }],
  access: [
    {
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53588697&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=06bb715d932ba34098b2",
    origin: "moreinfo",
  },
  creators: [{ display: "Linoleum Gummigulv" }],
};
// Another manifestation that may be ordered via ILL
const MANIFESTATION_2 = {
  ...MANIFESTATION_1,
  pid: "some-pid-2",
  titles: {
    full: ["Hugo i Sølvskoven 2", "Rise of Rita"],
  },
  edition: {
    edition: "102. udgave",
    publicationYear: {
      display: "2009-2",
    },
  },
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=21678783&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=54646db03d538703e6c1",
    origin: "moreinfo",
  },
};
// A manifestation that may not be ordered via ILL
const MANIFESTATION_3 = {
  ...MANIFESTATION_1,
  pid: "some-pid-3",
  titles: {
    full: ["Hugo i Sølvskoven 3", "Gulvguldets hemmelighed"],
  },
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
  titles: {
    full: [
      "Hugo i Sølvskoven 4",
      "Guldet glimter, sølvet smelter, gulvet vælter",
    ],
  },
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
  titles: {
    full: ["Hugo i Sølvskoven 5", "Gulvguldmonstrene mod Grullerne"],
  },
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
  titles: {
    full: ["Hugo i Sølvskoven 6", "Gulvguldmonstrene vender tilbage"],
  },
  materialTypes: [
    {
      specific: "bog",
    },
  ],
  publisher: ["Sølvbakke"],
  edition: { publicationYear: { display: 3001 }, edition: "109. udgave" },
  creators: [{ display: "Linoleum Gummigulv" }],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777014&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=1965ebb8c60f848c3b2c",
    origin: "moreinfo",
  },
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
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=27052509&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=3ff650fe66ef8432973c",
    origin: "moreinfo",
  },
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
    workTypes: ["LITERATURE"],
    fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
    genreAndForm: ["roman"],
  },
  // A work that is an indexed periodica article
  {
    workId: "some-work-id-2",
    manifestations: { all: [MANIFESTATION_4], mostRelevant: [MANIFESTATION_4] },
    workTypes: ["ARTICLE"],
    fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
    genreAndForm: [],
  },
  // A work that is a periodica
  {
    workId: "some-work-id-3",
    manifestations: { all: [MANIFESTATION_5], mostRelevant: [MANIFESTATION_5] },
    workTypes: ["PERIODICA"],
    fictionNonfiction: null,
    genreAndForm: ["roman"],
  },
  // A work that is an ebog
  {
    workId: "some-work-id-4",
    manifestations: { all: [MANIFESTATION_7], mostRelevant: [MANIFESTATION_7] },
    workTypes: ["LITERATURE"],
    titles: {
      full: [
        "Hugo i Sølvskoven 3½",
        "Ritas mellemværende i Gulvskoven med Grullerne",
      ],
    },
    creators: [{ display: "Børge 'Linoleum' Skovgulv Gummigulv" }],
    materialTypes: [
      {
        specific: "bog",
      },
    ],
    relations: {
      continues: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
      continuedIn: [MANIFESTATION_4, MANIFESTATION_5, MANIFESTATION_6],
      hasAdaptation: [],
      isAdaptationOf: [],
      discusses: [],
      discussedIn: [],
    },
  },
  {
    workId: "some-work-id-5",
    titles: {
      full: ["Hugo i Sølvskoven"],
    },
    creators: [{ display: "Linoleum Gummigulv" }],
    manifestations: {
      all: [
        MANIFESTATION_1,
        MANIFESTATION_2,
        MANIFESTATION_3,
        MANIFESTATION_4,
        MANIFESTATION_5,
        MANIFESTATION_6,
        MANIFESTATION_7,
      ],
      mostRelevant: [
        MANIFESTATION_1,
        MANIFESTATION_2,
        MANIFESTATION_3,
        MANIFESTATION_4,
        MANIFESTATION_5,
        MANIFESTATION_6,
        MANIFESTATION_7,
      ],
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

const REVIEW_1 = {
  rating: "5/6",
  reviewByLibrarians: [
    {
      type: "ABSTRACT",
      heading: "ABSTRACT",
      contentSubstitute: "contentSubtitute",
      content: "content",
      manifestations: [],
    },
    {
      type: "AUDIENCE",
      heading: "AUDIENCE",
      contentSubstitute: "AUDIENCE contentSubtitute",
      content: "AUDIENCE content",
      manifestations: [],
    },
    {
      type: "DESCRIPTION",
      heading: "DESCRIPTION",
      contentSubstitute: `DESCRIPTION contentSubtitute. Denne er efterfølger til [${"some-pid-4"}]`,
      content: "DESCRIPTION content",
      manifestations: [MANIFESTATION_4],
    },
    {
      type: "ACQUISITION_RECOMMENDATIONS",
      heading: "ACQUISITION_RECOMMENDATIONS",
      contentSubstitute: "ACQUISITION_RECOMMENDATIONS contentSubtitute",
      content: "ACQUISITION_RECOMMENDATIONS content",
      manifestations: [],
    },
    {
      type: "CONCLUSION",
      heading: "CONCLUSION",
      contentSubstitute: "CONCLUSION contentSubtitute",
      content: "CONCLUSION content",
      manifestations: [],
    },
    {
      type: "EVALUATION",
      heading: "EVALUATION",
      contentSubstitute: "EVALUATION contentSubtitute",
      content: "EVALUATION content",
      manifestations: [],
    },
    {
      type: "SIMILAR_MATERIALS",
      heading: "SIMILAR_MATERIALS",
      contentSubstitute: `
                          SIMILAR_MATERIALS contentSubtitute
                          * Hugo 1 [${"some-pid-1"}]
                          * Hugo 2 [${"some-pid-2"}]
                          * Hugo 3 [${"some-pid-3"}]
                          * Hugo 4 [${"some-pid-4"}]
                          * Hugo 5 [${"some-pid-5"}]
                          * Hugo 6 [${"some-pid-6"}]
                        `,
      content: "SIMILAR_MATERIALS content",
      manifestations: [
        MANIFESTATION_1,
        MANIFESTATION_2,
        MANIFESTATION_3,
        MANIFESTATION_4,
        MANIFESTATION_5,
        MANIFESTATION_6,
      ],
    },
  ],
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

const USER_LOANS = [
  {
    loanId: "120200553",
    dueDate: "2023-01-31T23:00:00.000Z",
    manifestation: {
      pid: "870970-basis:51098838",
      titles: {
        main: ["One Direction"],
      },
      creators: [
        {
          display: "Sarah Delmege",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=51098838&attachment_type=forside_lille&bibliotek=870970&source_id=150020&key=f4ebcbb4b84cf26e7071",
      },
      recordCreationDate: "20140508",
    },
  },
  {
    loanId: "120200589",
    dueDate: "2023-05-06T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Efter uvejret"],
      },
      creators: [
        {
          display: "Lauren Brooke",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23424916&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72fda7f507bed4f70854",
      },
      recordCreationDate: "20010323",
    },
  },
  {
    loanId: "120200590",
    dueDate: "2023-05-04T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23518260",
      titles: {
        main: ["Vennebogen & Koglerier"],
      },
      creators: [
        {
          display: "Peer Hultberg",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://default-forsider.dbc.dk/covers-12/thumbnail/4f0789e9-b478-526d-879e-a5931d9c552e.jpg",
      },
      recordCreationDate: "20010529",
    },
  },
];

const USER_ORDERS = [
  {
    orderId: "2982910",
    status: "",
    pickupBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: "2023-05-04T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23518260",
      titles: {
        main: ["Vennebogen & Koglerier"],
      },
      creators: [
        {
          display: "Peer Hultberg",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://default-forsider.dbc.dk/covers-12/thumbnail/4f0789e9-b478-526d-879e-a5931d9c552e.jpg",
      },
      recordCreationDate: "20010529",
    },
  },
  {
    orderId: "2982910",
    status: "",
    pickupBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: "2023-05-04T22:00:00.000Z",
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Efter uvejret"],
      },
      creators: [
        {
          display: "Lauren Brooke",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23424916&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72fda7f507bed4f70854",
      },
      recordCreationDate: "20010323",
    },
  },
];

const USER_DEBT = [
  {
    title: "Den store danske møbelguide",
    amount: "224",
    creator: null,
    date: "1969-12-31T23:00:00.000Z",
    currency: "DKK",
  },
  {
    title: "Den store Gatsby",
    amount: "50",
    creator: null,
    date: "1969-12-31T23:00:00.000Z",
    currency: "DKK",
  },
];

function useMockLoanerInfo(pickupBranch = "790900") {
  const { updateLoanerInfo } = useUser();
  const id = useId();

  useMemo(() => {
    updateLoanerInfo({
      pickupBranch: pickupBranch,
      loans: USER_LOANS,
      orders: USER_ORDERS,
      debt: USER_DEBT,
    });
  }, [id]);
}

export default function automock_utils() {
  return {
    MANIFESTATION_1,
    MANIFESTATION_2,
    MANIFESTATION_3,
    MANIFESTATION_4,
    MANIFESTATION_5,
    MANIFESTATION_6,
    MANIFESTATION_7,
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
    REVIEW_1,
    DEFAULT_STORY_PARAMETERS,
    useMockLoanerInfo,
    USER_LOANS,
    USER_ORDERS,
  };
}
