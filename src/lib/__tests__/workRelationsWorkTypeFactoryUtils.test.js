import {
  extractGoodCover,
  filterFieldsInElement,
  parseRelations,
  parseSingleRelationObject,
  parseSingleRelation,
} from "@/lib/workRelationsWorkTypeFactoryUtils";
import { RelationTypeEnum, WorkTypeEnum } from "@/lib/enums";

function getManifestations(pids) {
  const manifestations = [
    { pid: "default_cover__0", cover: { origin: "default" } },
    {
      pid: "moreinfo_cover__0",
      cover: { origin: "moreinfo" },
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
        { pid: "continues__0", ownerWork: { workId: "continues__0__321" } },
        { pid: "continues__1", ownerWork: { workId: "continues__1__321" } },
      ],
    ],
    [
      RelationTypeEnum.CONTINUEDIN.key,
      [
        {
          pid: "continued_in__0",
          ownerWork: { workId: "continued_in__0__321" },
        },
        {
          pid: "continued_in__1",
          ownerWork: { workId: "continued_in__1__321" },
        },
      ],
    ],
    [
      RelationTypeEnum.HASADAPTATION.key,
      [
        {
          pid: "has_adaptation__0",
          ownerWork: { workId: "has_adaptation__0__321" },
        },
        {
          pid: "has_adaptation__1",
          ownerWork: { workId: "has_adaptation__1__321" },
        },
      ],
    ],
    [
      RelationTypeEnum.ISADAPTATIONOF.key,
      [
        {
          pid: "is_adaptation_of__0",
          ownerWork: { workId: "is_adaptation_of__0__321" },
        },
        {
          pid: "is_adaptation_of__1",
          ownerWork: { workId: "is_adaptation_of__0__321" },
        },
      ],
    ],
  ];

  return relationTypeArrays.filter((manifestations) =>
    relationType.includes(manifestations[0])
  );
}

describe("extractGoodCover", () => {
  it("empty manifestations (expect empty result)", () => {
    const actual = extractGoodCover([]);
    const expected = [];
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

function getWork(workIds) {
  const works = [
    {
      workId: "work_with_stuff__0",
      workTypes: [WorkTypeEnum.ARTICLE],
      materialTypes: [{ specific: "avisartikel" }],
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
            cover: { detail: "moreinfo.dk", origin: "moreinfo" },
          },
        ],
      },
      relations: {
        [RelationTypeEnum.CONTINUES.key]: [
          {
            pid: "continues__0",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "continues__0__321",
            },
          },
          {
            pid: "continues__1",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "continues__1__321",
            },
          },
        ],
        [RelationTypeEnum.CONTINUEDIN.key]: [
          {
            pid: "continued_in__0",
            cover: { detail: "moreinfo.dk", origin: "moreinfo" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "continued_in__0__321",
            },
          },
          {
            pid: "continued_in__1",
            cover: { detail: "moreinfo.dk", origin: "moreinfo" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "continued_in__1__321",
            },
          },
        ],
        [RelationTypeEnum.HASADAPTATION.key]: [
          {
            pid: "has_adaptation__0",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "has_adaptation__0__321",
            },
          },
          {
            pid: "has_adaptation__1",
            cover: { detail: "moreinfo.dk", origin: "moreinfo" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "has_adaptation__1__321",
            },
          },
        ],
        [RelationTypeEnum.ISADAPTATIONOF.key]: [
          {
            pid: "is_adaptation_of__0",
            cover: { detail: "moreinfo.dk", origin: "moreinfo" },
            materialTypes: [{ specific: "avisartikel" }],
            ownerWork: {
              workId: "is_adaptation_of__0__321",
            },
          },
          {
            pid: "is_adaptation_of__1",
            cover: { detail: "default.dk", origin: "default" },
            materialTypes: [{ specific: "avisartikel" }],
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

describe("parseRelations", () => {
  it("empty work (expect empty result)", () => {
    const actual = parseRelations({});
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("with work (expect parsedRelations)", () => {
    const work = getWork(["work_with_stuff__0"])[0];

    const actual = parseRelations(work);
    const expected = [
      {
        pid: "continues__0",
        relationType: RelationTypeEnum.CONTINUES.key,
        cover: { detail: "default.dk", origin: "default" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "ARTICLE",
        workId: "continues__0__321",
      },
      {
        pid: "continues__1",
        relationType: RelationTypeEnum.CONTINUES.key,
        cover: { detail: "default.dk", origin: "default" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "ARTICLE",
        workId: "continues__1__321",
      },
      {
        cover: { detail: "moreinfo.dk", origin: "moreinfo" },
        materialTypesArray: ["avisartikel"],
        relationType: "current",
        workId: "work_with_stuff__0",
        workTypes: [WorkTypeEnum.ARTICLE],
        materialTypes: [{ specific: "avisartikel" }],
        relationWorkType: "ARTICLE",
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
              cover: { detail: "moreinfo.dk", origin: "moreinfo" },
            },
          ],
        },
      },
      {
        pid: "continued_in__0",
        relationType: RelationTypeEnum.CONTINUEDIN.key,
        cover: { detail: "moreinfo.dk", origin: "moreinfo" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "ARTICLE",
        workId: "continued_in__0__321",
      },
      {
        pid: "continued_in__1",
        relationType: RelationTypeEnum.CONTINUEDIN.key,
        cover: { detail: "moreinfo.dk", origin: "moreinfo" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "ARTICLE",
        workId: "continued_in__1__321",
      },
      {
        pid: "has_adaptation__0",
        relationType: RelationTypeEnum.HASADAPTATION.key,
        cover: { detail: "default.dk", origin: "default" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "LITERATURE",
        workId: "has_adaptation__0__321",
      },
      {
        pid: "has_adaptation__1",
        relationType: RelationTypeEnum.HASADAPTATION.key,
        cover: { detail: "moreinfo.dk", origin: "moreinfo" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "LITERATURE",
        workId: "has_adaptation__1__321",
      },
      {
        pid: "is_adaptation_of__0",
        relationType: RelationTypeEnum.ISADAPTATIONOF.key,
        cover: { detail: "moreinfo.dk", origin: "moreinfo" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "MOVIE",
        workId: "is_adaptation_of__0__321",
      },
      {
        pid: "is_adaptation_of__1",
        relationType: RelationTypeEnum.ISADAPTATIONOF.key,
        cover: { detail: "default.dk", origin: "default" },
        materialTypes: [{ specific: "avisartikel" }],
        materialTypesArray: ["avisartikel"],
        relationWorkType: "MOVIE",
        workId: "is_adaptation_of__1__321",
      },
    ];
    expect(actual).toEqual(expected);
  });
});
