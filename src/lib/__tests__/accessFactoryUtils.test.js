import {
  checkDigitalCopy,
  checkPhysicalCopy,
  enrichInfomediaAccess,
  getAllAccess,
  getAllAllowedEnrichedAccessSorted,
  getAllEnrichedAccessSorted,
  getAreAccessesPeriodicaLike,
  getCountOfAllAllowedEnrichedAccessSorted,
  prioritiseAccessUrl,
  prioritiseDigitalArticleService,
  prioritiseEreol,
  prioritiseInfomediaService,
  prioritiseInterLibraryLoan,
  sortPrioritisedAccess,
} from "@/lib/accessFactoryUtils";
import { AccessEnum } from "@/lib/enums";

describe("getAllAccess", () => {
  it("empty manifestations (expect empty access)", () => {
    const actual = getAllAccess([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("single manifestations no acces (expect empty access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [],
      },
    ]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("single manifestation 1 access (expect 1 access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [{ url: "urla_1.dekaa" }],
      },
    ]);
    const expected = [{ pid: "1loan", url: "urla_1.dekaa" }];
    expect(actual).toEqual(expected);
  });
  it("single manifestation 2 access (expect 2 access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [{ url: "urla_1.dekaa" }, { url: "urla_2.dekaa" }],
      },
    ]);
    const expected = [
      { pid: "1loan", url: "urla_1.dekaa" },
      { pid: "1loan", url: "urla_2.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("multiple manifestation 1 access each (expect 2 access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [{ url: "urla_1_0.dekaa" }],
      },
      {
        pid: "2loan",
        access: [{ url: "urla_2_0.dekaa" }],
      },
    ]);
    const expected = [
      { pid: "1loan", url: "urla_1_0.dekaa" },
      { pid: "2loan", url: "urla_2_0.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("multiple manifestation 2 access each (expect 4 access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [{ url: "urla_1_0.dekaa" }, { url: "urla_1_1.dekaa" }],
      },
      {
        pid: "2loan",
        access: [{ url: "urla_2_0.dekaa" }, { url: "urla_2_1.dekaa" }],
      },
    ]);
    const expected = [
      { pid: "1loan", url: "urla_1_0.dekaa" },
      { pid: "1loan", url: "urla_1_1.dekaa" },
      { pid: "2loan", url: "urla_2_0.dekaa" },
      { pid: "2loan", url: "urla_2_1.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("multiple manifestation mixed access each (expect 3 access)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        access: [{ url: "urla_1_0.dekaa" }],
      },
      {
        pid: "2loan",
        access: [{ url: "urla_2_0.dekaa" }, { url: "urla_2_1.dekaa" }],
      },
    ]);
    const expected = [
      { pid: "1loan", url: "urla_1_0.dekaa" },
      { pid: "2loan", url: "urla_2_0.dekaa" },
      { pid: "2loan", url: "urla_2_1.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("single manifestations with access and title (expect access and title)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        titles: { main: ["Hejsa"] },
        access: [{ url: "urla_1_0.dekaa" }],
      },
    ]);
    const expected = [
      { titles: ["Hejsa"], pid: "1loan", url: "urla_1_0.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("single manifestations with access and creators (expect access and creators)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        creators: [{ display: "Hejsa" }],
        access: [{ url: "urla_1_0.dekaa" }],
      },
    ]);
    const expected = [
      { creators: [{ display: "Hejsa" }], pid: "1loan", url: "urla_1_0.dekaa" },
    ];
    expect(actual).toEqual(expected);
  });
  it("single manifestations with access and single materialTypes (expect access and materialTypes)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog", code: "BOOK" },
            materialTypeGeneral: { display: "bøger", code: "BOOKS" },
          },
        ],
        access: [{ url: "urla_1_0.dekaa" }],
      },
    ]);
    const expected = [
      {
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        pid: "1loan",
        url: "urla_1_0.dekaa",
      },
    ];
    expect(actual).toEqual(expected);
  });
  it("single manifestations with access and multiple materialTypes (expect access and materialTypes)", () => {
    const actual = getAllAccess([
      {
        pid: "1loan",
        materialTypes: [
          {
            materialTypeSpecific: { display: "bog", code: "BOOK" },
            materialTypeGeneral: { display: "bøger", code: "BOOKS" },
          },
          {
            materialTypeSpecific: {
              display: "lydbog (cd-mp3)",
              code: "AUDIO_BOOK_CD_MP3",
            },
            materialTypeGeneral: { display: "lydbøger", code: "AUDIO_BOOKS" },
          },
        ],
        access: [{ url: "urla_1_0.dekaa" }],
      },
    ]);
    const expected = [
      {
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "lydbog (cd-mp3)",
            specificCode: "AUDIO_BOOK_CD_MP3",
            generalDisplay: "lydbøger",
            generalCode: "AUDIO_BOOKS",
          },
        ],
        pid: "1loan",
        url: "urla_1_0.dekaa",
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe("enrichInfomediaAccess", () => {
  it("singleAccess", () => {
    const actual = enrichInfomediaAccess({
      titles: ["HeJsÅ"],
      pid: "1loan",
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: "id_hej",
    });
    const expected = {
      titles: ["HeJsÅ"],
      pid: "1loan",
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: "id_hej",
      url: "/infomedia/hejsaa/work-of:1loan/id_hej",
      origin: "infomedia",
      accessType: "infomedia",
    };
    expect(actual).toEqual(expected);
  });
});

describe("prioritiseAccessUrl", () => {
  it("No login required, origin not DBC Webarkiv, url present (expect 0)", () => {
    const actual = prioritiseAccessUrl({
      __typename: AccessEnum.ACCESS_URL,
      loginRequired: false,
      origin: "infolinka.orga",
      url: "infolinka.orga/nisse",
    });
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("no url (expect 4)", () => {
    const actual = prioritiseAccessUrl({
      __typename: AccessEnum.ACCESS_URL,
      url: "",
      loginRequired: false,
      origin: "infolinka.orga",
    });
    const expected = 4;
    expect(actual).toEqual(expected);
  });
  it("url there, loginRequired is true (expect 3)", () => {
    const actual = prioritiseAccessUrl({
      __typename: AccessEnum.ACCESS_URL,
      url: "infolinka.orga/nisse",
      loginRequired: true,
      origin: "infolinka.orga",
    });
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("url there, loginRequired is false; origin is DBC Webarkiv (expect 1)", () => {
    const actual = prioritiseAccessUrl({
      __typename: AccessEnum.ACCESS_URL,
      url: "infolinka.orga/nisse",
      loginRequired: false,
      origin: "DBC Webarkiv",
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("prioritiseInfomediaService", () => {
  it("id empty string (expect 1)", () => {
    const actual = prioritiseInfomediaService({
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: "",
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("id null (expect 1)", () => {
    const actual = prioritiseInfomediaService({
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: null,
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("no id (expect 1)", () => {
    const actual = prioritiseInfomediaService({
      __typename: AccessEnum.INFOMEDIA_SERVICE,
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("with id (expect 0)", () => {
    const actual = prioritiseInfomediaService({
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: "nisse",
    });
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("wrong type id (expect 1)", () => {
    const actual = prioritiseInfomediaService({
      __typename: AccessEnum.INFOMEDIA_SERVICE,
      id: 1,
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("prioritiseDigitalArticleService", () => {
  it("no issn (expect 1)", () => {
    const actual = prioritiseDigitalArticleService({
      aiuhdoiasdio: "iasodajsoid",
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("issn as number (expect 1)", () => {
    const actual = prioritiseDigitalArticleService({
      __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      issn: 12312,
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("some issn (expect 0)", () => {
    const actual = prioritiseDigitalArticleService({
      __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      issn: "1232141",
    });
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe("prioritiseEreol", () => {
  it("url not there", () => {
    const actual = prioritiseEreol({
      __typename: AccessEnum.EREOL,
      origin: "DBC go",
      url: "",
    });
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("url there; origin neither Ereolen or Ereolen Go (expect 2)", () => {
    const actual = prioritiseEreol({
      __typename: AccessEnum.EREOL,
      origin: "DBC go",
      url: "dbc.engo/nisse",
    });
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Ereolen Go (expect 1)", () => {
    const actual = prioritiseEreol({
      __typename: AccessEnum.EREOL,
      origin: "Ereolen Go",
      url: "ereol.engo/nisse",
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Ereolen (expect 0)", () => {
    const actual = prioritiseEreol({
      __typename: AccessEnum.EREOL,
      origin: "Ereolen",
      url: "ere.ol/nisse",
    });
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe("prioritiseInterLibraryLoan", () => {
  it("loanIsPossible (expect 0)", () => {
    const actual = prioritiseInterLibraryLoan({
      __typename: AccessEnum.INTER_LIBRARY_LOAN,
      loanIsPossible: true,
    });
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("loanIsPossible is false (expect 1)", () => {
    const actual = prioritiseInterLibraryLoan({
      __typename: AccessEnum.INTER_LIBRARY_LOAN,
      loanIsPossible: false,
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("loanIsPossible is an array ...? (expect 1)", () => {
    const actual = prioritiseInterLibraryLoan({
      __typename: AccessEnum.INTER_LIBRARY_LOAN,
      loanIsPossible: [],
    });
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("sortPrioritisedAccess", () => {
  it("AccessUrl, InfomediaService (expect -1)", () => {
    const actual = sortPrioritisedAccess(
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "2loan" }
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("InfomediaService, AccessUrl (expect +1)", () => {
    const actual = sortPrioritisedAccess(
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" }
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("AccessUrl, DigitalArticleService (expect -3)", () => {
    const actual = sortPrioritisedAccess(
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "3loan" }
    );
    const expected = -3;
    expect(actual).toEqual(expected);
  });
  it("DigitalArticleService, AccessUrl (expect +3)", () => {
    const actual = sortPrioritisedAccess(
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" }
    );
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("AccessUrl (DBC Webarkiv), AccessUrl (info.fifo) (expect 1)", () => {
    const actual = sortPrioritisedAccess(
      {
        __typename: AccessEnum.ACCESS_URL,
        url: "dbc.dekaa/nisse",
        loginRequired: false,
        origin: "DBC Webarkiv",
        pid: "3loan",
      },
      {
        __typename: AccessEnum.ACCESS_URL,
        url: "dbc.dekaa/nisse",
        loginRequired: false,
        origin: "info.fifo",
        pid: "2loan",
      }
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("AccessUrl (info.fifo), AccessUrl (DBC Webarkiv) (expect -1)", () => {
    const actual = sortPrioritisedAccess(
      {
        __typename: AccessEnum.ACCESS_URL,
        url: "dbc.dekaa/nisse",
        loginRequired: false,
        origin: "info.fifo",
        pid: "2loan",
      },
      {
        __typename: AccessEnum.ACCESS_URL,
        url: "dbc.dekaa/nisse",
        loginRequired: false,
        origin: "DBC Webarkiv",
        pid: "3loan",
      }
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});

const manifestationsWithAccess = [
  {
    pid: "1loan",
    access: [
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
      {
        __typename: AccessEnum.ACCESS_URL,
        origin: "www.dfi.dk",
        url: "dfi_1_1.dekaa",
        type: "RESOURCE",
      },
    ],
  },
  {
    pid: "2loan",
    access: [
      {
        __typename: AccessEnum.INFOMEDIA_SERVICE,
        id: "urla_2_0.dekaa",
        type: "RESOURCE",
      },
      {
        __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: "urla_4_1.dekaa",
      },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: true },
      {
        __typename: AccessEnum.ACCESS_URL,
        origin: "DBC Webarkiv",
        url: "urla_2_1.dekaa",
        type: "RESOURCE",
      },
    ],
  },
  {
    pid: "3loan",
    access: [
      {
        __typename: AccessEnum.INFOMEDIA_SERVICE,
        id: "urla_3_0.dekaa",
        type: "RESOURCE",
      },
      {
        __typename: AccessEnum.ACCESS_URL,
        origin: "filmstriben.dk",
        url: "www.filmstriben.dk/bibliotek/urlan",
        type: "RESOURCE",
      },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: true },
      {
        __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: 1231,
      },
    ],
  },
  {
    pid: "4loan",
    access: [
      {
        __typename: AccessEnum.EREOL,
        origin: "Ereolen Go",
        url: "urla_4_0.dekaa",
        type: "RESOURCE",
      },
      {
        __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: "urla_4_1.dekaa",
      },
      {
        __typename: AccessEnum.ACCESS_URL,
        origin: "urla.engo",
        url: "urla_4_2.dekaa",
        type: "RESOURCE",
      },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, id: 1231, type: "RESOURCE" },
    ],
  },
];

describe("getAllEnrichedAccessSorted", () => {
  it("should prioritise correctly", () => {
    const actual = getAllEnrichedAccessSorted(manifestationsWithAccess);
    const expected = [
      { __typename: AccessEnum.ACCESS_URL, pid: "4loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "1loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "3loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "4loan" },
      { __typename: AccessEnum.EREOL, pid: "4loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "4loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "2loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "3loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "1loan" },
    ];

    expect(actual).toMatchObject(expected);
  });
});

describe("getAllAllowedEnrichedAccessSorted", () => {
  const actualFunction = (hasDigitalAccess) =>
    getAllAllowedEnrichedAccessSorted(
      manifestationsWithAccess,
      hasDigitalAccess
    );

  it("should prioritise correctly (hasDigitalAccess === true)", () => {
    const hasDigitalAccess = true;
    const actual = actualFunction(hasDigitalAccess);
    const expected = [
      { __typename: AccessEnum.ACCESS_URL, pid: "4loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "4loan" },
      { __typename: AccessEnum.EREOL, pid: "4loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "4loan" },
      { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "2loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "3loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "1loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "3loan" },
    ];

    expect(actual).toMatchObject(expected);
  });
  it("should prioritise correctly (hasDigitalAccess === false)", () => {
    const hasDigitalAccess = false;
    const actual = actualFunction(hasDigitalAccess);
    const expected = [
      { __typename: AccessEnum.ACCESS_URL, pid: "4loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "2loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "3loan" },
      { __typename: AccessEnum.INFOMEDIA_SERVICE, pid: "4loan" },
      { __typename: AccessEnum.EREOL, pid: "4loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "2loan" },
      { __typename: AccessEnum.INTER_LIBRARY_LOAN, pid: "3loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "1loan" },
      { __typename: AccessEnum.ACCESS_URL, pid: "3loan" },
    ];

    expect(actual).toMatchObject(expected);
  });
});

describe("getCountOfAllAllowedEnrichedAccessSorted", () => {
  const actualFunction = (hasDigitalAccess) =>
    getCountOfAllAllowedEnrichedAccessSorted(
      manifestationsWithAccess,
      hasDigitalAccess
    );

  it("should count correct number of alternatives (hasDigitalAccess === true; expect 7)", () => {
    const hasDigitalAccess = true;
    const actual = actualFunction(hasDigitalAccess);
    const expected = 9;

    expect(actual).toEqual(expected);
  });
  it("should count correct number of alternatives (hasDigitalAccess === false; expect 7)", () => {
    const hasDigitalAccess = false;
    const actual = actualFunction(hasDigitalAccess);
    const expected = 9;

    expect(actual).toEqual(expected);
  });
  it("should count correct number of alternatives (No DigitalArticleService; expect 1)", () => {
    const hasDigitalAccess = true;
    const manifestation = [
      {
        pid: "1loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
        ],
      },
      {
        pid: "2loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: true },
        ],
      },
      {
        pid: "3loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: true },
        ],
      },
    ];
    const actual = getCountOfAllAllowedEnrichedAccessSorted(
      manifestation,
      hasDigitalAccess
    );
    const expected = 1;

    expect(actual).toEqual(expected);
  });
  it("should count correct number of alternatives (hasDigitalAccess=false; expect 0)", () => {
    const hasDigitalAccess = false;
    const manifestation = [
      {
        pid: "1loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
          { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, issn: "oaidjad" },
        ],
      },
      {
        pid: "2loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
        ],
      },
      {
        pid: "3loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
        ],
      },
    ];
    const actual = getCountOfAllAllowedEnrichedAccessSorted(
      manifestation,
      hasDigitalAccess
    );
    const expected = 0;

    expect(actual).toEqual(expected);
  });
  it("should count correct number of alternatives (expect 1)", () => {
    const hasDigitalAccess = true;
    const manifestation = [
      {
        pid: "1loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
          { __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE, issn: "12312" },
        ],
      },
      {
        pid: "2loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
        ],
      },
      {
        pid: "3loan",
        access: [
          { __typename: AccessEnum.INTER_LIBRARY_LOAN, loanIsPossible: false },
        ],
      },
    ];
    const actual = getCountOfAllAllowedEnrichedAccessSorted(
      manifestation,
      hasDigitalAccess
    );
    const expected = 1;

    expect(actual).toEqual(expected);
  });
});

describe("checkDigitalCopy", () => {
  it("check possibilities (false, false, true)", () => {
    const actual = checkDigitalCopy([
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
      },
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.INFOMEDIA_SERVICE,
        id: "id_hej",
      },
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.DIGITAL_ARTICLE_SERVICE,
        issn: "213123412",
      },
    ]);
    const expected = [false, false, true];
    expect(actual).toEqual(expected);
  });
});
describe("checkPhysicalCopy", () => {
  it("check possibilities (false, false, false, true)", () => {
    const actual = checkPhysicalCopy([
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.INTER_LIBRARY_LOAN,
      },
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.INFOMEDIA_SERVICE,
        id: "id_hej",
      },
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.INTER_LIBRARY_LOAN,
        loanIsPossible: false,
      },
      {
        titles: ["HeJsÅ"],
        pid: "1loan",
        __typename: AccessEnum.INTER_LIBRARY_LOAN,
        loanIsPossible: true,
      },
    ]);
    const expected = [false, false, false, true];
    expect(actual).toEqual(expected);
  });
});
describe("getAreAccessesPeriodicaLike", () => {
  it("check possibilities (false, false, false, false, false, false, true, true, true, true, true)", () => {
    const actual = getAreAccessesPeriodicaLike([
      {
        titles: ["HeJsÅ"],
      },
      {
        titles: ["HeJsÅ"],
        workTypes: ["notPeriodica"],
      },
      {
        titles: ["HeJsÅ"],
        workTypes: [],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [
          {
            specificDisplay: "notÅrbog",
            specificCode: "not_YEAR_NOT!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
          {
            specificDisplay: "neitherÅrbog",
            specificCode: "neither_YEAR_NEITHER!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [
          {
            specificDisplay: "notÅrbog",
            specificCode: "not_YEAR_NOT!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [],
      },
      {
        titles: ["HeJsÅ"],
        workTypes: ["periodica"],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [
          {
            specificDisplay: "årbog",
            specificCode: "YEARBOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [
          {
            specificDisplay: "årbog",
            specificCode: "YEARBOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
          {
            specificDisplay: "neitherÅrbog",
            specificCode: "neither_YEAR_NEITHER!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
      {
        titles: ["HeJsÅ"],
        materialTypesArray: [
          {
            specificDisplay: "notÅrbog",
            specificCode: "not_YEAR_NOT!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
          {
            specificDisplay: "årbog",
            specificCode: "YEARBOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
      {
        titles: ["HeJsÅ"],
        workTypes: ["periodica"],
        materialTypesArray: [
          {
            specificDisplay: "notÅrbog",
            specificCode: "not_YEAR_NOT!!_BOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
          {
            specificDisplay: "årbog",
            specificCode: "YEARBOOK",
            generalDisplay: "aviser og tidsskrifter",
            generalCode: "NEWSPAPER_JOURNALS",
          },
        ],
      },
    ]);
    const expected = [
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
    ];
    expect(actual).toEqual(expected);
  });
});
