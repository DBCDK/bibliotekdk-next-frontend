// A manifestation that may be ordered via ILL
import useUser from "@/components/hooks/useUser";
import { useId, useMemo } from "react";
import { AccessEnum } from "@/lib/enums";
import { dateObjectToDateOnlyString } from "@/utils/datetimeConverter";
import { HoldingStatusEnum } from "@/components/hooks/useHandleAgencyAccessData";

const TODAY = dateObjectToDateOnlyString(new Date());
const TOMORROW = dateObjectToDateOnlyString(
  new Date(Date.now() + 24 * 60 * 60 * 1000)
);
const NEVER = "never";

const MANIFESTATION_BASE = {
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

const MANIFESTATION_1 = {
  ...MANIFESTATION_BASE,
  titles: {
    full: ["Hugo i Sølvskoven", "Begyndelsen"],
  },
};
// Another manifestation that may be ordered via ILL
const MANIFESTATION_2 = {
  ...MANIFESTATION_BASE,
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
  ...MANIFESTATION_BASE,
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
  ...MANIFESTATION_BASE,
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
  ...MANIFESTATION_BASE,
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
  ...MANIFESTATION_BASE,
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
  ...MANIFESTATION_BASE,
  pid: "some-pid-7",
  titles: { full: ["Lær at læse med Hugo og Rita 1"] },
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

const MANIFESTATION_8 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-8",
  titles: { full: ["Lær at læse med Hugo og Rita 2"] },
  materialTypes: [
    {
      specific: "bog",
    },
  ],
  workTypes: ["LITERATURE"],
  tableOfContents: {
    heading: "Kapitler",
    listOfContent: [
      { content: "Kapitel Alfabetet" },
      { content: "Kapitel Andre mennesker" },
      { content: "Kapitel Ting og sager" },
      { content: "Kapitel Dyr og skov" },
    ],
  },
};

const MANIFESTATION_9 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-9",
  titles: { full: ["Lær at læse med Hugo og Rita 3"] },
  materialTypes: [
    {
      specific: "bog",
    },
  ],
  workTypes: ["LITERATURE"],
  tableOfContents: {
    heading: null,
    listOfContent: null,
    content: `Kapitler ( 
      Kapitel Alfabetet ; 
      Kapitel Andre mennesker ;
      Kapitel Ting og sager ; 
      Kapitel Dyr og skov ;
    ) ;`,
  },
};

const MANIFESTATION_10 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-10",
  materialTypes: [
    {
      specific: "bog",
    },
  ],
  ownerWork: {
    workId: "some-work-id-8",
  },
  titles: [{ full: "Lær at læse med Hugo og Rita" }],
  workTypes: ["LITERATURE"],
  tableOfContents: {
    heading: null,
    listOfContent: null,
    content: `Kapitler ( 
      Kapitel Alfabetet ; 
      Kapitel Andre mennesker ;
      Kapitel Ting og sager ; 
      Kapitel Dyr og skov ;
    ) ;`,
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
  MANIFESTATION_8,
  MANIFESTATION_9,
  MANIFESTATION_10,
];

const WORK_1 = {
  workId: "some-work-id-1",
  manifestations: {
    all: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
    mostRelevant: [MANIFESTATION_1, MANIFESTATION_2, MANIFESTATION_3],
  },
  workTypes: ["LITERATURE"],
  titles: {
    full: ["Hugo i Sølvskoven", "Begyndelsen"],
  },
  creators: [{ display: "Børge 'Linoleum' Skovgulv Gummigulv" }],
  materialTypes: [{ specific: "bog" }],
  fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
  genreAndForm: ["roman"],
};

const WORK_2 = {
  workId: "some-work-id-2",
  manifestations: { all: [MANIFESTATION_4], mostRelevant: [MANIFESTATION_4] },
  workTypes: ["ARTICLE"],
  materialTypes: [{ specific: "avisartikel" }],
  fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
  genreAndForm: [],
};

const WORK_3 = {
  workId: "some-work-id-3",
  manifestations: { all: [MANIFESTATION_5], mostRelevant: [MANIFESTATION_5] },
  workTypes: ["PERIODICA"],
  fictionNonfiction: null,
  genreAndForm: ["roman"],
};

const WORK_4 = {
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
};

const WORK_5 = {
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
};

const WORK_6 = {
  workId: "some-work-id-6",
  titles: { full: ["Lær at læse med Hugo og Rita"] },
  creators: [{ display: "Linoleum Gummigulv" }],
  manifestations: {
    mostRelevant: [MANIFESTATION_9, MANIFESTATION_8],
    all: [MANIFESTATION_9, MANIFESTATION_8],
  },
};

const WORK_7 = {
  workId: "some-work-id-7",
  titles: { full: ["Lær at læse med Hugo og Rita 2"] },
  creators: [{ display: "Linoleum Gummigulv" }],
  manifestations: {
    mostRelevant: [MANIFESTATION_9],
    all: [MANIFESTATION_9],
  },
  materialTypes: [{ specific: "bog" }],
};

const WORK_8 = {
  workId: "some-work-id-8",
  titles: { full: ["Lær at læse med Hugo og Rita 3"] },
  creators: [{ display: "Linoleum Gummigulv" }],
  manifestations: {
    mostRelevant: [MANIFESTATION_10],
    all: [MANIFESTATION_10],
  },
};

const ALL_WORKS = [
  // A work that has physical manifestations, two of them can be loaned via ILL
  WORK_1,
  // A work that is an indexed periodica article
  WORK_2,
  // A work that is a periodica
  WORK_3,
  // A work that is an ebog
  WORK_4,
  WORK_5,
  WORK_6,
  WORK_7,
  WORK_8,
];

const BORROWER_STATUS_TRUE = {
  allowed: true,
  statusCode: "OK",
};

const BORROWER_STATUS_FALSE = {
  allowed: false,
  statusCode: "BORCHK_USER_BLOCKED_BY_AGENCY",
};

const BRANCH_1 = {
  agencyName: "Agency 1",
  agencyId: "1",
  branchId: "1237",
  name: "Test Bib - only physical via ILL",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  borrowerCheck: true,
  digitalCopyAccess: false,
};
const BRANCH_2 = {
  agencyName: "Agency 1",
  branchId: "123",
  name: "Test Bib - no orders here",
  orderPolicy: {
    orderPossible: false,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
};
const BRANCH_3 = {
  agencyName: "Agency 2",
  name: "Test Bib - ILL and digital copy service",
  branchId: "1235",
  orderPolicy: {
    orderPossible: true,
  },
  borrowerCheck: true,
  pickupAllowed: true,
  digitalCopyAccess: true,
};

const BRANCH_4 = {
  name: "Test Bib - User is blocked",
  agencyId: "2",
  branchId: "1234",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  borrowerCheck: true,
  branchWebsiteUrl: "balleripraprup.dekaa",
  agencyName: "BalleRipRapRup",
};
const BRANCH_5 = {
  name: "Ripper Bib - Branch with 2 holdings on shelf",
  branchId: "789123",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "789123",
    expectedDelivery: TODAY,
    holdingItems: [
      {
        expectedDelivery: TODAY,
        status: HoldingStatusEnum.ON_SHELF,
      },
      {
        expectedDelivery: TODAY,
        status: HoldingStatusEnum.ON_SHELF,
      },
    ],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "balleripraprup.dekaa",
};

const BRANCH_5_1 = {
  name: "Rapper Bib - Branch with holdings on loan",
  branchId: "789124",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "789124",
    expectedDelivery: TODAY,
    holdingItems: [
      {
        expectedDelivery: TODAY,
        status: HoldingStatusEnum.ON_LOAN,
      },
    ],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "balleripraprup.dekaa",
};
const BRANCH_5_2 = {
  name: "Rupper Bib - Branch with no holdings but is public library",
  branchId: "789125",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "789125",
    expectedDelivery: TODAY,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "balleripraprup.dekaa",
};

const BRANCH_6 = {
  name: "Grull Ly - Branch with no holdings, is public library but agency says holdings",
  branchId: "765432",
  agencyName: "Grullinger",
  agencyId: "765430",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "765432",
    expectedDelivery: TODAY,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "grullinger.dekaa",
};

const BRANCH_7 = {
  name: "Herlige Lev FFU - Branch with FFU holdings",
  branchId: "891234",
  agencyId: "891230",
  agencyName: "United FFUs",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891234",
    expectedDelivery: TODAY,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "herligelev.dekaa",
};

const BRANCH_7_1 = {
  name: "Senge Loese FFU - Branch with FFU holdings",
  branchId: "891235",
  agencyName: "United FFUs",
  agencyId: "891230",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891235",
    expectedDelivery: TOMORROW,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "Sengeloese.dekaa",
};

const BRANCH_7_2 = {
  name: "Hede Huse FFU - Branch with FFU holdings",
  branchId: "891236",
  agencyName: "United FFUs",
  agencyId: "891230",
  orderPolicy: {
    orderPossible: false,
  },
  holdingStatus: {
    branchId: "891236",
    expectedDelivery: NEVER,
    holdingItems: [],
  },
  pickupAllowed: false,
  digitalCopyAccess: true,
  branchWebsiteUrl: "hedehuse.dekaa",
};
const BRANCH_7_3 = {
  name: "Ulvs Hale FFU - Branch with FFU holdings",
  branchId: "891237",
  agencyName: "United FFUs",
  agencyId: "891230",
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891237",
    expectedDelivery: null,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "hedehuse.dekaa",
};

const BRANCH_8 = {
  name: "No borrowerCheck",
  branchId: "1236",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  borrowerCheck: false,
  branchWebsiteUrl: "nocheck.dekaa",
  agencyName: "NoCheckBib",
  agencyId: "3",
};

// A user with some agencies
const USER_1 = {
  agencies: [
    {
      borrowerStatus: BORROWER_STATUS_TRUE,
      result: [BRANCH_1, BRANCH_2],
    },
  ],
};

const USER_2 = {
  agencies: [{ borrowerStatus: BORROWER_STATUS_TRUE, result: [BRANCH_2] }],
};

const USER_3 = {
  agencies: [{ borrowerStatus: BORROWER_STATUS_TRUE, result: [BRANCH_3] }],
};

const USER_4 = {
  agencies: [{ borrowerStatus: BORROWER_STATUS_TRUE, result: [BRANCH_4] }],
};

const USER_5 = {
  agencies: {
    borrowerStatus: BORROWER_STATUS_TRUE,
    result: [BRANCH_5, BRANCH_6],
  },
};

const USER_6 = {
  agencies: [
    {
      borrowerStatus: BORROWER_STATUS_FALSE,
      result: [BRANCH_4, BRANCH_3],
    },
    {
      borrowerStatus: BORROWER_STATUS_TRUE,
      result: [BRANCH_1, BRANCH_2],
    },
  ],
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
            return {
              borrowerStatus: BORROWER_STATUS_TRUE,
              result: [BRANCH_1, BRANCH_2, BRANCH_3],
            };
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
            return {
              orderId: "some-order-id",
              status: "OWNED_ACCEPTED",
              ok: true,
            };
          },
          submitPeriodicaArticleOrder: (args) => {
            // Used for cypress testing
            console.debug(
              "submitPeriodicaArticleOrder",
              args?.variables?.input
            );
            return { status: "OK" };
          },
          deleteOrder: (args) => {
            console.debug("deleteOrder", args?.variables?.input);
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

const createDateXDaysFromNow = (daysFromNow) => {
  const today = new Date();
  today.setDate(today.getDate() + daysFromNow);
  today.setHours(today.getHours() + 2); // Add 2 hours to prevent that date is exactly 2 days from now
  return today.toISOString();
};
const USER_LOANS = [
  {
    loanId: "120200590",
    dueDate: createDateXDaysFromNow(14),
    manifestation: {
      pid: "870970-basis:23518260",
      titles: {
        main: ["Tiger"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:23518260",
      },
      creators: [
        {
          display: "Jan Jutte",
        },
      ],
      materialTypes: [
        {
          specific: "billedbog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=47468736&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f516a8895f6a4af424c3",
      },
      recordCreationDate: "20200529",
    },
  },
  {
    loanId: "120200589",
    dueDate: createDateXDaysFromNow(0),
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Krigen med salamandrene"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:23424916",
      },
      creators: [
        {
          display: "Karel Čapek",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46068912&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=ccebcb7dc87e39614aa1",
      },
      recordCreationDate: "20010323",
    },
  },
  {
    loanId: "120204379",
    dueDate: createDateXDaysFromNow(2),
    manifestation: {
      pid: "3A870970-basis:3A50752224",
      titles: {
        main: ["Dig og mig ved daggry"],
      },
      ownerWork: {
        workId: "work-of:3A870970-basis:3A50752224",
      },
      creators: [
        {
          display: "Sanne Munk Jensen",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52102782&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=08dd127a70a7b84c5d5f",
      },
      recordCreationDate: "20150323",
    },
  },

  {
    loanId: "120200553",
    dueDate: createDateXDaysFromNow(-2),
    manifestation: {
      pid: "870970-basis:51098838",
      titles: {
        main: ["Ildkamp"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:51098838",
      },
      creators: [
        {
          display: "Brandon Sanderson",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=135272809&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=355a65c276690f5dd12f",
      },
      recordCreationDate: "20220508",
    },
  },
];

const USER_ORDERS = [
  {
    orderId: "2982910",
    status: "",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: null,
    holdQueuePosition: "5",
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Efter uvejret"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:23424916",
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
    orderId: "2982912",
    status: "",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: null,
    holdQueuePosition: "3",
    manifestation: {
      pid: "870970-basis:23424916",
      titles: {
        main: ["Efter uvejret"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:23424916",
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
    orderId: "2982913",
    status: "",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: createDateXDaysFromNow(10),
    manifestation: {
      pid: "870970-basis:23518260",
      titles: {
        main: ["Inferno"],
      },
      ownerWork: {
        workId: "work-of:870970-basis:23518260",
      },
      creators: [
        {
          display: "Dan Brown",
        },
      ],
      materialTypes: [
        {
          specific: "bog",
        },
      ],
      cover: {
        thumbnail:
          "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53552315&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=56c69012754540b94e24",
      },
      recordCreationDate: "20170529",
    },
  },
  {
    orderId: "2982913",
    status: "",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: null,
    title: "Ko og Kylling",
    holdQueuePosition: "8",
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

const USER_AGENCY = {
  borrowerStatus: BORROWER_STATUS_TRUE,
  result: [
    {
      agencyId: "726500",
      agencyName: "Roskilde Bibliotekerne",
      branchId: "726500",
      name: "Roskilde Bibliotek",
    },
  ],
};

function useMockLoanerInfo({
  pickUpBranch = "790900",
  loans = USER_LOANS,
  orders = USER_ORDERS,
  debt = USER_DEBT,
  agencies = [USER_AGENCY],
}) {
  const { updateLoanerInfo } = useUser();
  const id = useId();
  useMemo(() => {
    updateLoanerInfo({
      pickupBranch: pickUpBranch,
      loans,
      orders,
      debt,
      agencies,
    });
  }, [id]);
}

const USER_LIBRARIES = [
  {
    agencyName: "Silkeborg Biblioteker",
    agencyId: "774000",
  },
  {
    agencyId: "710100",
    agencyName: "Københavns Biblioteker",
  },
  {
    agencyName: "Syddansk Universitetsbibliotek",
    agencyId: "820030",
  },
];

export default function automock_utils() {
  return {
    MANIFESTATION_1,
    MANIFESTATION_2,
    MANIFESTATION_3,
    MANIFESTATION_4,
    MANIFESTATION_5,
    MANIFESTATION_6,
    MANIFESTATION_7,
    MANIFESTATION_8,
    MANIFESTATION_9,
    MANIFESTATION_10,
    ALL_MANIFESTATIONS,
    WORK_1,
    WORK_2,
    WORK_3,
    WORK_4,
    WORK_5,
    WORK_6,
    WORK_7,
    WORK_8,
    ALL_WORKS,
    BORROWER_STATUS_TRUE,
    BORROWER_STATUS_FALSE,
    BRANCH_1,
    BRANCH_2,
    BRANCH_3,
    BRANCH_4,
    BRANCH_5,
    BRANCH_5_1,
    BRANCH_5_2,
    BRANCH_6,
    BRANCH_7,
    BRANCH_7_1,
    BRANCH_7_2,
    BRANCH_7_3,
    BRANCH_8,
    USER_1,
    USER_2,
    USER_3,
    USER_4,
    USER_5,
    USER_6,
    REVIEW_1,
    DEFAULT_STORY_PARAMETERS,
    useMockLoanerInfo,
    USER_LOANS,
    USER_ORDERS,
    USER_LIBRARIES,
    USER_AGENCY,
    TODAY,
    TOMORROW,
    NEVER,
  };
}
