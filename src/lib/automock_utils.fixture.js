// A manifestation that may be ordered via ILL
import { useId, useMemo } from "react";
import { AccessEnum } from "@/lib/enums";
import { dateObjectToDateOnlyString } from "@/utils/datetimeConverter";
import {
  BranchTypeEnum,
  HoldingStatusEnum,
} from "@/components/hooks/useHandleAgencyAccessData";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

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
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
      __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53588697&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=06bb715d932ba34098b2",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53588697&attachment_type=forside_lille&bibliotek=870970&source_id=150020&key=06bb715d932ba34098b2",
    origin: "moreinfo",
  },
  creators: [{ display: "Linoleum Gummigulv" }],
};

const MANIFESTATION_1 = {
  ...MANIFESTATION_BASE,
  titles: {
    full: ["Hugo i Sølvskoven", "Begyndelsen"],
  },
  ownerWork: {
    titles: {
      full: ["Hugo i Sølvskoven Værk", "Begyndelsen Værk"],
    },
    creators: [{ display: "Linoleum Gummigulv" }],
  },
};
// Another manifestation that may be ordered via ILL
const MANIFESTATION_2 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-2",
  titles: {
    full: ["Hugo i Sølvskoven 2", "Rise of Rita"],
  },
  ownerWork: {
    titles: {
      full: ["Hugo i Sølvskoven 2 Værk", "Rise of Rita Værk"],
    },
    creators: [{ display: "Linoleum Gummigulv" }],
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
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=21678783&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=54646db03d538703e6c1",
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
  ownerWork: {
    titles: {
      full: ["Hugo i Sølvskoven 3 Værk", "Gulvguldets hemmelighed Værk"],
    },
    creators: [{ display: "Linoleum Gummigulv" }],
  },
  access: [
    {
      __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
      __typename: "InterLibraryLoan",
      loanIsPossible: false,
    },
  ],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777057&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4d9e99b14209aef2a5d6",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777057&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=4d9e99b14209aef2a5d6",
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
  ownerWork: {
    creators: [{ display: "Linoleum Gummigulv" }],
    titles: {
      full: [
        "Hugo i Sølvskoven 4 Værk",
        "Guldet glimter, sølvet smelter, gulvet vælter Værk",
      ],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
  ],
  access: [
    {
      __resolveType: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      __typename: "DigitalArticleService",
      issn: "some-issn",
    },
    {
      __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  workTypes: ["ARTICLE"],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23637189&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=72eb2ae9d91fb0ffbb7f",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23637189&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72eb2ae9d91fb0ffbb7f",
    origin: "moreinfo",
  },
};
// Indexed article, that may be ordered via digital article copy
const MANIFESTATION_4_1 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-4-1",
  titles: {
    full: [
      "Hugo i Sølvskoven 4½",
      "Kobberet lugter, messingen smitter, lofter suger",
    ],
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
    {
      materialTypeSpecific: {
        display: "artikel (online)",
        code: "ARTICLE_ONLINE",
      },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
  ],
  access: [
    {
      __resolveType: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      __typename: "DigitalArticleService",
      issn: "some-issn",
    },
    {
      __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
      __typename: "InterLibraryLoan",
      loanIsPossible: true,
    },
  ],
  workTypes: ["ARTICLE"],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23637189&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=72eb2ae9d91fb0ffbb7f",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23637189&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72eb2ae9d91fb0ffbb7f",
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
  ownerWork: {
    creators: [{ display: "Linoleum Gummigulv" }],
    titles: {
      full: [
        "Hugo i Sølvskoven 5 Værk",
        "Gulvguldmonstrene mod Grullerne Værk",
      ],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "tidsskrift", code: "JOURNAL" },
      materialTypeGeneral: {
        display: "aviser og tidsskrifter",
        code: "NEWSPAPER_JOURNALS",
      },
    },
  ],
  access: [
    {
      __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      issn: "some-issn",
    },
    {
      __typename: AccessEnum.INTER_LIBRARY_LOAN,
      loanIsPossible: true,
    },
  ],
  workTypes: ["PERIODICA"],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25504097&attachment_type=forside_stor&bibliotek=870970&source_id=150015&key=f9383e2279f840a4f31e",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25504097&attachment_type=forside_lille&bibliotek=870970&source_id=150015&key=f9383e2279f840a4f31e",
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
  ownerWork: {
    creators: [{ display: "Linoleum Gummigulv" }],
    titles: {
      full: [
        "Hugo i Sølvskoven 6 Værk",
        "Gulvguldmonstrene vender tilbage Værk",
      ],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
  ],
  publisher: ["Sølvbakke"],
  edition: { publicationYear: { display: 3001 }, edition: "109. udgave" },
  creators: [{ display: "Linoleum Gummigulv" }],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777014&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=1965ebb8c60f848c3b2c",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=24777014&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=1965ebb8c60f848c3b2c",
    origin: "moreinfo",
  },
};

const MANIFESTATION_7 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-7",
  titles: { full: ["Lær at læse med Hugo og Rita 1"] },
  ownerWork: {
    titles: {
      full: ["Lær at læse med Hugo og Rita 1 Værk"],
      creators: [{ display: "Linoleum Gummigulv" }],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
      materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
    },
  ],
  access: [
    {
      __typename: AccessEnum.ACCESS_URL,
      url: "https://ereol.combo/langurl",
      origin: "https://ereol.combo",
    },
    {
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: "123123",
      pid: "321321",
    },
  ],
  workTypes: ["LITERATURE"],
  cover: {
    detail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29053782&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=115cd0be4dc0b0e7d74e",
    thumbnail:
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=29053782&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=115cd0be4dc0b0e7d74e",
    origin: "moreinfo",
  },
};

const MANIFESTATION_8 = {
  ...MANIFESTATION_BASE,
  pid: "some-pid-8",
  titles: { full: ["Lær at læse med Hugo og Rita 2"] },
  ownerWork: {
    creators: [{ display: "Linoleum Gummigulv" }],
    titles: {
      full: ["Lær at læse med Hugo og Rita 2 Værk"],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
  ownerWork: {
    creators: [{ display: "Linoleum Gummigulv" }],
    titles: {
      full: ["Lær at læse med Hugo og Rita 3 Værk"],
    },
  },
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
  ],
  ownerWork: {
    workId: "some-work-id-8",
  },
  titles: {
    full: ["Lær at læse med Hugo og Rita"],
    main: ["Lær at læse med Hugo og Rita"],
  },
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
  MANIFESTATION_4_1,
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
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
  ],
  fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
  genreAndForm: ["roman"],
};

const WORK_2 = {
  workId: "some-work-id-2",
  manifestations: { all: [MANIFESTATION_4], mostRelevant: [MANIFESTATION_4] },
  workTypes: ["ARTICLE"],
  materialTypes: [
    {
      materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
  ],
  fictionNonfiction: { display: "skønlitteratur", code: "FICTION" },
  genreAndForm: [],
};

const WORK_2_1 = {
  workId: "some-work-id-2-1",
  manifestations: {
    all: [MANIFESTATION_4_1],
    mostRelevant: [MANIFESTATION_4_1],
  },
  workTypes: ["ARTICLE"],
  materialTypes: [
    {
      materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
    {
      materialTypeSpecific: {
        display: "artikel (online)",
        code: "ARTICLE_ONLINE",
      },
      materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
    },
  ],
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
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
  ],
};

const WORK_8 = {
  workId: "some-work-id-8",
  titles: {
    full: ["Lær at læse med Hugo og Rita 3"],
    main: ["Lær at læse med Hugo og Rita 3"],
  },
  creators: [{ display: "Linoleum Gummigulv" }],
  manifestations: {
    mostRelevant: [MANIFESTATION_10],
    all: [MANIFESTATION_10],
  },
};

// we need some works with correct constructed workIds - that is 'work-of:some-pid'
// .. sometimes the some-pid parts changes
const WORK_11 = {
  workId: "work-of:some-pid-8",
  titles: {
    full: ["Lær at læse med Hugo og Rita 3"],
    main: ["Lær at læse med Hugo og Rita 3"],
  },
  creators: [{ display: "Linoleum Gummigulv" }],
  manifestations: {
    mostRelevant: [MANIFESTATION_8],
    all: [MANIFESTATION_8],
  },
};

const WORK_12 = {
  workId: "work-of:some-pid-7",
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
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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

const ALL_WORKS = [
  // A work that has physical manifestations, two of them can be loaned via ILL
  WORK_1,
  // A work that is an indexed periodica article
  WORK_2,
  WORK_2_1,
  // A work that is a periodica
  WORK_3,
  // A work that is an e-bog
  WORK_4,
  WORK_4,
  WORK_5,
  WORK_6,
  WORK_7,
  WORK_8,
  WORK_11,
  WORK_12,
];

const BORROWER_STATUS_TRUE = {
  allowed: true,
  statusCode: "OK",
};

const UNKNOWN_USER = {
  allowed: false,
  statusCode: "UNKNOWN_USER",
};

const BORROWER_STATUS_FALSE = {
  allowed: false,
  statusCode: "BORCHK_USER_BLOCKED_BY_AGENCY",
};

const BRANCH_1 = {
  agencyName: "Agency 1",
  agencyType: "FOLKEBIBLIOTEK",
  agencyId: "1",
  branchId: "1237",
  branchType: BranchTypeEnum.MAIN_LIBRARY,
  name: "Test Bib - only physical via ILL",
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  borrowerCheck: true,
  digitalCopyAccess: false,
  temporarilyClosed: false,
};
const BRANCH_2 = {
  agencyName: "Agency 1",
  agencyType: "FORSKNINGSBIBLIOTEK",
  branchId: "123",
  branchType: BranchTypeEnum.MAIN_LIBRARY,
  name: "Test Bib - no orders here",
  orderPolicy: {
    orderPossible: false,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  temporarilyClosed: false,
};
const BRANCH_3 = {
  agencyName: "Agency 2",
  name: "Test Bib - ILL and digital copy service",
  branchId: "1235",
  branchType: BranchTypeEnum.MAIN_LIBRARY,
  orderPolicy: {
    orderPossible: true,
  },
  borrowerCheck: true,
  pickupAllowed: true,
  digitalCopyAccess: true,
  temporarilyClosed: false,
};

const BRANCH_4 = {
  name: "Test Bib - User is blocked",
  agencyId: "2",
  branchId: "1234",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  borrowerCheck: true,
  branchWebsiteUrl: "balleripraprup.dekaa",
  agencyName: "BalleRipRapRup",
  temporarilyClosed: false,
};
const BRANCH_5 = {
  name: "Ripper Bib - Branch with 2 holdings on shelf",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  branchId: "789123",
  branchType: BranchTypeEnum.BRANCH,
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
  temporarilyClosed: false,
};

const BRANCH_5_1 = {
  name: "Rapper Bib - Branch with holdings on loan",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  branchId: "789124",
  branchType: BranchTypeEnum.BRANCH,
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
  temporarilyClosed: false,
};
const BRANCH_5_2 = {
  name: "Rupper Bib - Branch with no holdings but is public library",
  agencyName: "BalleRipRapRup",
  agencyId: "789120",
  branchId: "789125",
  branchType: BranchTypeEnum.BRANCH,
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
  temporarilyClosed: false,
};

const BRANCH_6 = {
  name: "Grull Ly - Branch with no holdings, is public library but agency says holdings",
  agencyName: "Grullinger",
  agencyId: "765430",
  branchId: "765432",
  branchType: BranchTypeEnum.BRANCH,
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
  temporarilyClosed: false,
};

const BRANCH_6_1 = {
  name: "Grull Ly ServicePoint - ServicePoint (branchType) with no holdings. Should not be shown",
  agencyName: "Grullinger",
  agencyId: "765430",
  branchId: "765433",
  branchType:
    "Servicepunkt - We can write whatever here, since it is an allowList",
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
  temporarilyClosed: false,
};

const BRANCH_6_2 = {
  name: "Grull Ly TemporarilyClosed with Reason. Should show reason",
  agencyName: "Grullinger",
  agencyId: "765430",
  branchId: "765434",
  branchType: "filial",
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
  temporarilyClosed: true,
  temporarilyClosedReason: "Grull Ly TemporarilyClosed er lukket",
};

const BRANCH_7 = {
  name: "Herlige Lev FFU - Branch with FFU holdings",
  agencyType: "FORSKNINGSBIBLIOTEK",
  agencyId: "800010",
  branchId: "800014",
  branchType: BranchTypeEnum.BRANCH,
  agencyName: "Special FFUs",
  culrDataSync: false,
  orderPolicy: {
    orderPossible: true,
  },
  borrowerCheck: true,
  holdingStatus: {
    branchId: "800014",
    expectedDelivery: TODAY,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "herligelev.dekaa",
  temporarilyClosed: false,
};

const BRANCH_7_1 = {
  name: "Senge Loese FFU - Branch with FFU holdings",
  agencyName: "Special FFUs",
  agencyId: "800010",
  branchId: "800015",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "800015",
    expectedDelivery: TOMORROW,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "Sengeloese.dekaa",
  temporarilyClosed: false,
};

const BRANCH_7_2 = {
  name: "Hede Huse FFU - Branch with FFU holdings",
  agencyName: "Special FFUs",
  agencyId: "800010",
  branchId: "800016",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: false,
  },
  holdingStatus: {
    branchId: "800016",
    expectedDelivery: NEVER,
    holdingItems: [],
  },
  pickupAllowed: false,
  digitalCopyAccess: true,
  branchWebsiteUrl: "hedehuse.dekaa",
  temporarilyClosed: false,
};
const BRANCH_7_3 = {
  name: "Ulvs Hale FFU - Branch with FFU holdings",
  agencyName: "Special FFUs",
  agencyId: "800010",
  branchId: "800017",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "800017",
    expectedDelivery: null,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "hedehuse.dekaa",
  temporarilyClosed: false,
};

const BRANCH_8 = {
  name: "No borrowerCheck",
  branchId: "1236",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  pickupAllowed: true,
  digitalCopyAccess: false,
  borrowerCheck: false,
  branchWebsiteUrl: "nocheck.dekaa",
  agencyName: "NoCheckBib",
  agencyId: "3",
  temporarilyClosed: false,
};

const BRANCH_9 = {
  name: "Ant Colony FFU - Branch with FFU holdings",
  agencyName: "Animal Group HoldingItems Holder FFUs",
  agencyId: "891230",
  branchId: "891234",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891234",
    expectedDelivery: TODAY,
    holdingItems: [
      {
        expectedDelivery: TODAY,
        status: HoldingStatusEnum.ON_SHELF,
      },
    ],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "ant.colony.dekaa",
  temporarilyClosed: false,
};

const BRANCH_9_1 = {
  name: "Manatee Aggregation FFU - Branch with FFU holdings",
  agencyName: "Animal Group HoldingItems Holder FFUs",
  agencyId: "891230",
  branchId: "891235",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891235",
    expectedDelivery: TODAY,
    holdingItems: [
      {
        expectedDelivery: TODAY,
        status: HoldingStatusEnum.ON_SHELF,
      },
    ],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "gang.dekaa",
  temporarilyClosed: false,
};

const BRANCH_9_2 = {
  name: "Parrot Pandemonium FFU - Branch with FFU holdings",
  agencyName: "Animal Group HoldingItems Holder FFUs",
  agencyId: "891230",
  branchId: "891236",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891236",
    expectedDelivery: null,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "parrot.pandemonium.dekaa",
  temporarilyClosed: false,
};
const BRANCH_9_3 = {
  name: "Rhinoceroses Crash FFU - Branch with FFU holdings",
  agencyName: "Animal Group HoldingItems Holder FFUs",
  agencyId: "891230",
  branchId: "891237",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "891237",
    expectedDelivery: TOMORROW,
    holdingItems: [
      {
        expectedDelivery: TOMORROW,
        status: HoldingStatusEnum.ON_SHELF,
      },
    ],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "rhinoceroses.crash.dekaa",
  temporarilyClosed: false,
};
const BRANCH_10 = {
  name: "Ying FFU - Branch without FFU holdings",
  agencyName: "Duo without holdings FFUs",
  agencyId: "898760",
  branchId: "898761",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "898767",
    expectedDelivery: TODAY,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "ying.dekaa",
  temporarilyClosed: false,
};
const BRANCH_10_1 = {
  name: "Yang FFU - Branch without FFU holdings",
  agencyName: "Duo without holdings FFUs",
  agencyId: "898760",
  branchId: "898762",
  branchType: BranchTypeEnum.BRANCH,
  orderPolicy: {
    orderPossible: true,
  },
  holdingStatus: {
    branchId: "898762",
    expectedDelivery: TOMORROW,
    holdingItems: [],
  },
  pickupAllowed: true,
  digitalCopyAccess: true,
  branchWebsiteUrl: "yang.dekaa",
  temporarilyClosed: false,
};

// A user with some agencies
const USER_1 = {
  name: "Some Name",
  mail: "some@mail.dk",
  rights: { digitalArticleService: false },
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
  name: "Some Name",
  mail: "some@mail.dk",
  agencies: [{ borrowerStatus: BORROWER_STATUS_TRUE, result: [BRANCH_3] }],
  rights: { digitalArticleService: true },
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

const USER_8 = {
  name: "Some Name",
  mail: "some@mail.dk",
  agencies: [],
};

const USER_10 = {
  name: null,
  mail: null,
  rights: { digitalArticleService: false },
  agencies: [
    {
      borrowerStatus: BORROWER_STATUS_TRUE,
      result: [BRANCH_7],
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

// Holding the current mocked session
let currentSession = { pickupBranch: "190101" };

const DEFAULT_STORY_PARAMETERS = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
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
        Session: {
          pickupBranch: () => currentSession?.pickupBranch || null,
          userParameters: () => currentSession?.userParameters || null,
        },
        ElbaServices: {
          placeCopyRequest: (args) => {
            // Used for cypress testing
            console.debug("elbaPlaceCopy", args?.variables?.input);
            return { status: "OK" };
          },
        },
        Mutation: {
          submitSession: (args) => {
            // Used for cypress testing
            console.debug("submitSession", args?.variables?.input);
            currentSession = args?.variables?.input;
            return "OK";
          },
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

const LOAN_1 = {
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
        materialTypeSpecific: { display: "billedbog", code: "PICTURE_BOOK" },
        materialTypeGeneral: { display: "bøger", code: "BOOKS" },
      },
    ],
    cover: {
      thumbnail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=47468736&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f516a8895f6a4af424c3",
    },
    recordCreationDate: "20200529",
  },
};

const USER_LOANS = [
  LOAN_1,
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
          materialTypeSpecific: { display: "bog", code: "BOOK" },
          materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
          materialTypeSpecific: { display: "bog", code: "BOOK" },
          materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
          materialTypeSpecific: { display: "bog", code: "BOOK" },
          materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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

const USER_LOANS_2 = [
  LOAN_1,
  {
    loanId: "120204379",
    dueDate: createDateXDaysFromNow(2),
    title: "Jeg er et fjernlaan 1",
    creator: "Munk Jensen, Sanne",
    manifestation: null,
  },
];

const ORDER_1 = {
  orderId: "2982910",
  status: "UNKNOWN",
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
        materialTypeSpecific: { display: "bog", code: "BOOK" },
        materialTypeGeneral: { display: "bøger", code: "BOOKS" },
      },
    ],
    cover: {
      thumbnail:
        "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=23424916&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=72fda7f507bed4f70854",
    },
    recordCreationDate: "20010323",
  },
};

const USER_ORDERS = [
  ORDER_1,
  {
    orderId: "2982912",
    status: "UNKNOWN",
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
          materialTypeSpecific: { display: "bog", code: "BOOK" },
          materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
    status: "UNKNOWN",
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
          materialTypeSpecific: { display: "bog", code: "BOOK" },
          materialTypeGeneral: { display: "bøger", code: "BOOKS" },
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
    status: "UNKNOWN",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: null,
    title: "Ko og Kylling",
    holdQueuePosition: "8",
  },
];

const USER_ORDERS_2 = [
  ORDER_1,
  {
    orderId: "2982912",
    status: "UNKNOWN",
    title: "Jeg er et fjernlaan 2",
    creator: "Carlander, Troels B.",
    pickUpBranch: {
      agencyName: "Husum Bibliotek",
    },
    pickUpExpiryDate: null,
    holdQueuePosition: "3",
    manifestation: null,
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
  hitcount: 1,
  result: [
    {
      agencyId: "726500",
      agencyName: "Roskilde Bibliotekerne",
      agencyType: "FOLKEBIBLIOTEK",
      branchId: "726500",
      name: "Roskilde Bibliotek",
    },
  ],
};

function useMockLoanerInfo({ pickUpBranch = "790900" }) {
  const { updateLoanerInfo } = useLoanerInfo();
  const id = useId();
  useMemo(() => {
    updateLoanerInfo({
      pickupBranch: pickUpBranch,
    });
  }, [id]);
}

const USER_LIBRARIES = [
  {
    agencyName: "Silkeborg Biblioteker",
    agencyId: "774000",
    agencyType: "FOLKEBIBLIOTEK",
  },
  {
    agencyId: "710100",
    agencyName: "Københavns Biblioteker",
    agencyType: "FOLKEBIBLIOTEK",
  },
  {
    agencyName: "Syddansk Universitetsbibliotek",
    agencyId: "820030",
    // this is a university - @TODO correct agenctyType
    agencyType: "FOLKEBIBLIOTEK",
  },
];

const USER_7 = {
  loans: USER_LOANS,
  orders: USER_ORDERS,
  debt: USER_DEBT,
  agencies: [USER_AGENCY],
  rights: { digitalArticleService: true },
};

//has fjernlån
const USER_9 = {
  loans: USER_LOANS_2,
  orders: USER_ORDERS_2,
  debt: [],
  agencies: [USER_AGENCY],
  rights: { digitalArticleService: true },
};

export default function automock_utils() {
  return {
    MANIFESTATION_1,
    MANIFESTATION_2,
    MANIFESTATION_3,
    MANIFESTATION_4,
    MANIFESTATION_4_1,
    MANIFESTATION_5,
    MANIFESTATION_6,
    MANIFESTATION_7,
    MANIFESTATION_8,
    MANIFESTATION_9,
    MANIFESTATION_10,
    ALL_MANIFESTATIONS,
    WORK_1,
    WORK_2,
    WORK_2_1,
    WORK_3,
    WORK_4,
    WORK_5,
    WORK_6,
    WORK_7,
    WORK_8,
    WORK_11,
    WORK_12,
    ALL_WORKS,
    UNKNOWN_USER,
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
    BRANCH_6_1,
    BRANCH_6_2,
    BRANCH_7,
    BRANCH_7_1,
    BRANCH_7_2,
    BRANCH_7_3,
    BRANCH_8,
    BRANCH_9,
    BRANCH_9_1,
    BRANCH_9_2,
    BRANCH_9_3,
    BRANCH_10,
    BRANCH_10_1,
    USER_1,
    USER_2,
    USER_3,
    USER_4,
    USER_5,
    USER_6,
    USER_7,
    USER_8,
    USER_9,
    USER_10,
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
