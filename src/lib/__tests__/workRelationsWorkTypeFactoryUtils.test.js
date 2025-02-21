import {
  extractGoodCover,
  filterFieldsInElement,
  parseRelations,
  parseSingleRelationObject,
  parseSingleRelation,
  getParentRelationInput,
  sortByDate,
  getRelationsAsArray,
  getUniqWorkWithWorkId,
} from "@/lib/workRelationsWorkTypeFactoryUtils";
import { RelationTypeEnum, WorkTypeEnum } from "@/lib/enums";

function getManifestations(pids) {
  const manifestations = [
    { pid: "default_cover__0", cover: { origin: "default" } },
    {
      pid: "moreinfo_cover__0",
      cover: { origin: "fbiinfo" },
      relations: [{ hej: 123 }],
      ownerWork: { hej: 123 },
    },
    {
      pid: "no_ownerWork__0",
      relations: [{ hej: 123 }],
    },
    {
      pid: "with_ownerWork__0",
      relations: [{ hej: 123 }],
      ownerWork: { workId: "321" },
    },
  ];

  return manifestations.filter((manifestation) =>
    pids.includes(manifestation.pid)
  );
}

function getRelationTypeArray(relationType) {
  const relationTypeArrays = [
    [
      RelationTypeEnum.CONTINUES.key,
      [
        {
          pid: "continues__0",
          ownerWork: { workId: "continues__0__321" },
          generation: 1,
        },
        {
          pid: "continues__1",
          ownerWork: { workId: "continues__1__321" },
          generation: 1,
        },
      ],
    ],
    [
      RelationTypeEnum.CONTINUEDIN.key,
      [
        {
          pid: "continued_in__0",
          ownerWork: { workId: "continued_in__0__321" },
          generation: 1,
        },
        {
          pid: "continued_in__1",
          ownerWork: { workId: "continued_in__1__321" },
          generation: 1,
        },
      ],
    ],
    [
      RelationTypeEnum.HASADAPTATION.key,
      [
        {
          pid: "has_adaptation__0",
          ownerWork: { workId: "has_adaptation__0__321" },
          generation: 1,
        },
        {
          pid: "has_adaptation__1",
          ownerWork: { workId: "has_adaptation__1__321" },
          generation: 1,
        },
      ],
    ],
    [
      RelationTypeEnum.ISADAPTATIONOF.key,
      [
        {
          pid: "is_adaptation_of__0",
          ownerWork: { workId: "is_adaptation_of__0__321" },
          generation: 1,
        },
        {
          pid: "is_adaptation_of__1",
          ownerWork: { workId: "is_adaptation_of__0__321" },
          generation: 1,
        },
      ],
    ],
  ];

  return relationTypeArrays.filter((manifestations) =>
    relationType.includes(manifestations[0])
  );
}

function getWork(workIds) {
  const works = [
    {
      workId: "work_with_stuff__0",
      workTypes: [WorkTypeEnum.ARTICLE],
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      titles: {
        main: ["hejmain"],
        full: ["hejfull"],
      },
      creators: {
        display: "hejCreator",
      },
      manifestations: {
        mostRelevant: [
          {
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            hostPublication: { issue: "2000-01-20" },
          },
        ],
      },
      relations: {
        [RelationTypeEnum.CONTINUES.key]: [
          {
            pid: "continues__0",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "continues__0__321",
            },
            hostPublication: { issue: "2000-01-10" },
          },
          {
            pid: "continues__1",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "continues__1__321",
            },
            hostPublication: { issue: "2000-01-11" },
          },
        ],
        [RelationTypeEnum.CONTINUEDIN.key]: [
          {
            pid: "continued_in__0",
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "continued_in__0__321",
            },
            hostPublication: { issue: "2000-01-30" },
          },
          {
            pid: "continued_in__1",
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "continued_in__1__321",
            },
            hostPublication: { issue: "2000-01-31" },
          },
        ],
        [RelationTypeEnum.HASADAPTATION.key]: [
          {
            pid: "has_adaptation__0",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "has_adaptation__0__321",
            },
          },
          {
            pid: "has_adaptation__1",
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "has_adaptation__1__321",
            },
          },
        ],
        [RelationTypeEnum.ISADAPTATIONOF.key]: [
          {
            pid: "is_adaptation_of__0",
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "is_adaptation_of__0__321",
            },
          },
          {
            pid: "is_adaptation_of__1",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [
              {
                materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
                materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
              },
            ],
            ownerWork: {
              workId: "is_adaptation_of__1__321",
            },
          },
        ],
      },
    },
  ];

  return works.filter((work) => workIds.includes(work.workId));
}

function getFlatRelations() {
  return [
    {
      pid: "continues__0",
      cover: { detail: "default.dk", origin: "default" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "ARTICLE",
      workId: "continues__0__321",
      hostPublication: { issue: "2000-01-10" },
    },
    {
      pid: "continues__1",
      cover: { detail: "default.dk", origin: "default" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "ARTICLE",
      workId: "continues__1__321",
      hostPublication: { issue: "2000-01-11" },
    },
    {
      cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      workId: "work_with_stuff__0",
      generation: 0,
      workTypes: [WorkTypeEnum.ARTICLE],
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      relationWorkType: "ARTICLE",
      titles: {
        main: ["hejmain"],
        full: ["hejfull"],
      },
      creators: {
        display: "hejCreator",
      },
      hostPublication: { issue: "2000-01-20" },
      manifestations: {
        mostRelevant: [
          {
            cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
            hostPublication: { issue: "2000-01-20" },
          },
        ],
      },
    },
    {
      pid: "continued_in__0",
      cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "ARTICLE",
      workId: "continued_in__0__321",
      hostPublication: { issue: "2000-01-30" },
    },
    {
      pid: "continued_in__1",
      cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "ARTICLE",
      workId: "continued_in__1__321",
      hostPublication: { issue: "2000-01-31" },
    },
    {
      pid: "has_adaptation__0",
      cover: { detail: "default.dk", origin: "default" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "LITERATURE",
      workId: "has_adaptation__0__321",
    },
    {
      pid: "has_adaptation__1",
      cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "LITERATURE",
      workId: "has_adaptation__1__321",
    },
    {
      pid: "is_adaptation_of__0",
      cover: { detail: "moreinfo.dk", origin: "fbiinfo" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "MOVIE",
      workId: "is_adaptation_of__0__321",
    },
    {
      pid: "is_adaptation_of__1",
      cover: { detail: "default.dk", origin: "default" },
      generation: 1,
      materialTypes: [
        {
          materialTypeSpecific: { display: "artikel", code: "ARTICLE" },
          materialTypeGeneral: { display: "artikler", code: "ARTICLES" },
        },
      ],
      materialTypesArray: [
        {
          specificDisplay: "artikel",
          specificCode: "ARTICLE",
          generalDisplay: "artikler",
          generalCode: "ARTICLES",
        },
      ],
      relationWorkType: "MOVIE",
      workId: "is_adaptation_of__1__321",
    },
  ];
}

describe("extractGoodCover", () => {
  it("empty manifestations (expect empty result)", () => {
    const actual = extractGoodCover([]);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  it("one manifestation default cover (expect the one)", () => {
    const manifestations = getManifestations(["default_cover__0"]);
    const actual = extractGoodCover(manifestations);
    const expected = manifestations[0].cover;
    expect(actual).toEqual(expected);
  });
  it("2 manifestations; default cover and moreinfo cover (expect moreinfo)", () => {
    const manifestations = getManifestations([
      "default_cover__0",
      "moreinfo_cover__0",
    ]);
    const actual = extractGoodCover(manifestations);
    const expected = getManifestations(["moreinfo_cover__0"])[0].cover;
    expect(actual).toEqual(expected);
  });
});

describe("getParentRelationInput", () => {
  it("should be return empty object if no parentWork", () => {
    const actual = getParentRelationInput({});
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it("should be enriched properly with poor parent", () => {
    const actual = getParentRelationInput({ workId: "parent" });
    const expected = {
      workId: "parent",
      relationType: "current",
      hostPublication: {},
      cover: {},
      generation: 0,
    };
    expect(actual).toMatchObject(expected);
  });

  it("should be enriched properly with hostPublication", () => {
    const actual = getParentRelationInput({
      workId: "parent",
      manifestations: {
        mostRelevant: [{ hostPublication: { issue: "2000-01-10" } }],
      },
    });
    const expected = {
      workId: "parent",
      relationType: "current",
      hostPublication: { issue: "2000-01-10" },
      cover: {},
      generation: 0,
    };
    expect(actual).toMatchObject(expected);
  });

  it("should be enriched properly with cover", () => {
    const actual = getParentRelationInput({
      workId: "parent",
      manifestations: {
        mostRelevant: [
          {
            hostPublication: { issue: "2000-01-10" },
            cover: { origin: "fbiinfo", detail: "moreinfo.dk" },
          },
        ],
      },
    });
    const expected = {
      workId: "parent",
      relationType: "current",
      hostPublication: { issue: "2000-01-10" },
      cover: {},
      generation: 0,
    };
    expect(actual).toMatchObject(expected);
  });
});

describe("sortByDate", () => {
  it("sort properly (expect a before b, alas negative", () => {
    const actual = sortByDate(
      { hostPublication: { issue: "2000-01-01" } },
      { hostPublication: { issue: "2000-01-02" } }
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("sort properly (expect b before a, alas positive", () => {
    const actual = sortByDate(
      { hostPublication: { issue: "2000-01-02" } },
      { hostPublication: { issue: "2000-01-01" } }
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("sort properly (expect a equal b, alas 0", () => {
    const actual = sortByDate(
      { hostPublication: { issue: "2000-01-31" } },
      { hostPublication: { issue: "2000-01-31" } }
    );
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("sort properly (missing a, b before a, alas 1", () => {
    const actual = sortByDate(
      { hostPublication: { hej: "nej" } },
      { hostPublication: { issue: "2000-01-31" } }
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("sort properly (missing b, a before b, alas -1", () => {
    const actual = sortByDate(
      { hostPublication: { issue: "2000-01-31" } },
      { hostPublication: { hej: "nej" } }
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("sort properly (missing a and b, alas 0", () => {
    const actual = sortByDate(
      { hostPublication: { hej: "nej" } },
      { hostPublication: { hej: "nej" } }
    );
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});

describe("filterFieldsInElement", () => {
  it("empty manifestations (expect empty access)", () => {
    const actual = filterFieldsInElement([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("one manifestion; no ownerWork nor relations (expect the one)", () => {
    const manifestations = getManifestations(["default_cover__0"]);
    const actual = filterFieldsInElement(manifestations[0]);
    const expected = manifestations[0];
    expect(actual).toEqual(expected);
  });
  it("one manifestation; 1 ownerWork; 1 relation (expect moreinfo)", () => {
    const manifestations = getManifestations(["moreinfo_cover__0"]);
    const actual = filterFieldsInElement(manifestations[0]);
    const expected = getManifestations(["moreinfo_cover__0"])[0];
    delete expected.relations;
    delete expected.ownerWork;
    expect(actual).toEqual(expected);
  });
});

describe("parseSingleRelation", () => {
  it("empty everything (expect empty object)", () => {
    const actual = parseSingleRelation({}, "");
    const expected = {};
    expect(actual).toEqual(expected);
  });
  it("empty manifestations and manifestationArray; 1 relationType (expect relationsType)", () => {
    const actual = parseSingleRelation({}, "123");
    const expected = { relationType: "123" };
    expect(actual).toEqual(expected);
  });
  it("one manifestation default cover (expect the one)", () => {
    const manifestations = getManifestations(["no_ownerWork__0"]);
    const actual = parseSingleRelation(manifestations[0], "123");
    const expected = { ...manifestations[0], relationType: "123" };
    expect(actual).toEqual(expected);
  });
  it("one manifestations; ownerWork.workId, relationType, manifestation", () => {
    const manifestations = getManifestations(["with_ownerWork__0"]);
    const actual = parseSingleRelation(manifestations[0], "123");
    const expected = {
      ...getManifestations(["with_ownerWork__0"])[0],
      relationType: "123",
      workId: "321",
    };
    expect(actual).toEqual(expected);
  });
});

describe("parseSingleRelationObject", () => {
  it("empty relationTypeArray (expect empty result)", () => {
    const actual = parseSingleRelationObject([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("relationTypeArray with 2 manifestations (expect the 2 with workId and relationType)", () => {
    const relationTypeArray = getRelationTypeArray(
      RelationTypeEnum.CONTINUES.key
    )[0];

    const actual = parseSingleRelationObject(relationTypeArray);
    const expected = [
      {
        ...relationTypeArray[1][0],
        relationType: RelationTypeEnum.CONTINUES.key,
        workId: "continues__0__321",
      },
      {
        ...relationTypeArray[1][1],
        relationType: RelationTypeEnum.CONTINUES.key,
        workId: "continues__1__321",
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe("getRelationsAsArray", () => {
  it("empty work (expect empty result)", () => {
    const actual = getRelationsAsArray({});
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("with work (expect the standard relations with specific workIds)", () => {
    const work = getWork(["work_with_stuff__0"])[0];
    const actual = getRelationsAsArray(work.relations);
    const expected = [
      { workId: "continues__0__321" },
      { workId: "continues__1__321" },
      { workId: "continued_in__0__321" },
      { workId: "continued_in__1__321" },
      { workId: "has_adaptation__0__321" },
      { workId: "has_adaptation__1__321" },
      { workId: "is_adaptation_of__0__321" },
      { workId: "is_adaptation_of__1__321" },
    ];
    expect(actual).toMatchObject(expected);
  });
});

describe("getUniqWorkWithWorkId", () => {
  it("empty work (expect empty result)", () => {
    const actual = getUniqWorkWithWorkId([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("with work (expect parsedRelations)", () => {
    const manifestations = getFlatRelations();
    const actual = getUniqWorkWithWorkId(manifestations);
    const expected = [
      { workId: "work_with_stuff__0" },
      { workId: "continues__0__321" },
      { workId: "continues__1__321" },
      { workId: "continued_in__0__321" },
      { workId: "continued_in__1__321" },
      { workId: "has_adaptation__0__321" },
      { workId: "has_adaptation__1__321" },
      { workId: "is_adaptation_of__0__321" },
      { workId: "is_adaptation_of__1__321" },
    ];
    expect(actual).toMatchObject(expected);
  });
});

describe("parseRelations", () => {
  it("empty work (expect empty result)", () => {
    const actual = parseRelations({});
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("with work (expect parsedRelations)", () => {
    const work = getWork(["work_with_stuff__0"])[0];
    const actual = parseRelations(work);
    const expected = getFlatRelations();
    expect(actual).toMatchObject(expected);
  });
});
