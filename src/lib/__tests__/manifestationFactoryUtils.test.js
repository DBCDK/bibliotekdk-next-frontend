import {
  oneManifestation_bog_ebog,
  oneManifestation_bog,
  oneSpecificMaterialType_Bog,
  twoManifestations_bog_ebog__bog,
  twoSpecificMaterialType_Bog_Ebog,
  oneSpecificMaterialType_Ebog,
  fiveManifestations_bog_ebog_x2__bog_x2__ebog_x1,
  grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1,
  manifestationFactoryFunctionFixture,
  combinedMaterialType_GraphicNovel_Tegneserie,
} from "@/lib/__tests__/__fixtures__/manifestationFactoryFunction.fixture";
import {
  compareMaterialTypeArrays,
  flatMapMaterialTypes,
  flattenGroupedSortedManifestations,
  flattenMaterialType,
  formatMaterialTypesFromUrl,
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
  toFlatMaterialTypes,
  getElementByCustomSorting,
  getFlatPidsByType,
  getInUniqueMaterialTypes,
  getUniqueMaterialTypes,
  groupManifestations,
  manifestationMaterialTypeFactory,
  inFlatMaterialTypes,
} from "@/lib/manifestationFactoryUtils";
import { getOrderedFlatMaterialTypes } from "@/lib/enums_MaterialTypes";

test("manifestationFactoryFunctions", () => {
  const actual = "";
  const expected = "";
  expect(actual).toEqual(expected);
});

describe("formatMaterialTypesFromUrl", () => {
  it("should split materialTypeUrl with 2 types properly", () => {
    const actual = formatMaterialTypesFromUrl("bog / e-bog");
    const expected = ["bog", "e-bog"];
    expect(actual).toEqual(expected);
  });
  it("should make single element array with materialTypeUrl having 1 type", () => {
    const actual = formatMaterialTypesFromUrl("bog");
    const expected = ["bog"];
    expect(actual).toEqual(expected);
  });
  it("should give empty materialTypeArray with no type", () => {
    const actual = formatMaterialTypesFromUrl("");
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("formatMaterialTypesToUrl", () => {
  it("should join 2 materialTypes properly (specificDisplayArray)", () => {
    const actual = formatMaterialTypesToUrl(["bog", "e-bog"]);
    const expected = "bog / e-bog";
    expect(actual).toEqual(expected);
  });
  it("should 1 materialTypes properly (specificDisplayArray)", () => {
    const actual = formatMaterialTypesToUrl(["bog"]);
    const expected = "bog";
    expect(actual).toEqual(expected);
  });
  it("should join 2 materialTypes properly (materialTypesArray)", () => {
    const actual = formatMaterialTypesToUrl([
      {
        specificDisplay: "bog",
        specificCode: "BOOK",
        generalDisplay: "bøger",
        generalCode: "BOOKS",
      },
      {
        specificDisplay: "e-bog",
        specificCode: "EBOOK",
        generalDisplay: "e-bøger",
        generalCode: "EBOOKS",
      },
    ]);
    const expected = "bog / e-bog";
    expect(actual).toEqual(expected);
  });
  it("should 1 materialTypes properly (materialTypesArray)", () => {
    const actual = formatMaterialTypesToUrl([
      {
        specificDisplay: "bog",
        specificCode: "BOOK",
        generalDisplay: "bøger",
        generalCode: "BOOKS",
      },
    ]);
    const expected = "bog";
    expect(actual).toEqual(expected);
  });
  it("should no materialTypes properly (specificDisplayArray)", () => {
    const actual = formatMaterialTypesToUrl([]);
    const expected = "";
    expect(actual).toEqual(expected);
  });
});

describe("formatMaterialTypesToPresentation", () => {
  it("Returns as expected (specificDisplayArray)", () => {
    const testSample = ["article", "article (online)"];

    expect(formatMaterialTypesToPresentation(testSample)).toEqual(
      "Article / Article (online)"
    );
  });
  it("should work with (materialTypesArray)", () => {
    const materialTypesArray = [
      {
        specificDisplay: "artikel",
        specificCode: "ARTICLE",
        generalDisplay: "artikler",
        generalCode: "ARTICLES",
      },
      {
        specificDisplay: "artikel (online)",
        specificCode: "ARTICLE_ONLINE",
        generalDisplay: "artikler",
        generalCode: "ARTICLES",
      },
    ];
    const actual = formatMaterialTypesToPresentation(materialTypesArray);
    const expected = "Artikel / Artikel (online)";

    expect(actual).toEqual(expected);
  });
  it("Returns string directly, if not array", () => {
    const testSample = "article (online)";

    expect(formatMaterialTypesToPresentation(testSample)).toEqual(testSample);
  });
  it("should return null with empty", () => {
    const actual = formatMaterialTypesToPresentation([]);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});

describe("flattenMaterialType", () => {
  it("should flatten 2 materialTypes in manifestation properly", () => {
    const actual = flattenMaterialType(twoSpecificMaterialType_Bog_Ebog);
    const expected = [
      {
        specificDisplay: "bog",
        specificCode: "BOOK",
        generalDisplay: "bøger",
        generalCode: "BOOKS",
      },
      {
        specificDisplay: "e-bog",
        specificCode: "EBOOK",
        generalDisplay: "e-bøger",
        generalCode: "EBOOKS",
      },
    ];
    expect(actual).toEqual(expected);
  });
  it("should flatten 1 materialTypes in manifestation properly", () => {
    const actual = flattenMaterialType(oneSpecificMaterialType_Bog);
    const expected = [
      {
        specificDisplay: "bog",
        specificCode: "BOOK",
        generalDisplay: "bøger",
        generalCode: "BOOKS",
      },
    ];
    expect(actual).toEqual(expected);
  });
  it("should flatten no materialTypes in manifestation properly", () => {
    const actual = flattenMaterialType({});
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("should give correct order for combined materialtypes", () => {
    // @TODO write a test here
    const actual = flattenMaterialType(
      combinedMaterialType_GraphicNovel_Tegneserie
    );
    const expected = [
      {
        specificDisplay: "graphic novel",
        specificCode: "GRAPHIC_NOVEL",
        generalDisplay: "tegneserier",
        generalCode: "COMICS",
      },
      {
        specificDisplay: "tegneserie",
        specificCode: "COMIC",
        generalDisplay: "tegneserier",
        generalCode: "COMICS",
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe("flatMapMaterialTypes", () => {
  it("should flatten materialTypes of 2 manifestations with mixed number of materialTypes properly", () => {
    const actual = flatMapMaterialTypes(twoManifestations_bog_ebog__bog);
    const expected = [
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of 1 manifestation with multiple materialTypes properly", () => {
    const actual = flatMapMaterialTypes(oneManifestation_bog_ebog);
    const expected = [
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of 1 manifestation with a single materialType properly", () => {
    const actual = flatMapMaterialTypes(oneManifestation_bog);
    const expected = [
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of no manifestation properly which is nothing", () => {
    const actual = flatMapMaterialTypes([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("toFlatMaterialTypes", () => {
  const example = [
    {
      specificDisplay: "bog",
      specificCode: "BOOK",
      generalDisplay: "bøger",
      generalCode: "BOOKS",
    },
  ];

  it("formats to specificDisplay (default)", () => {
    const actual = toFlatMaterialTypes(example);
    const expected = ["bog"];
    expect(actual).toEqual(expected);
  });
  it("formats to specificDisplay (by arguments)", () => {
    const actual = toFlatMaterialTypes(example, "specificDisplay");
    const expected = ["bog"];
    expect(actual).toEqual(expected);
  });
  it("formats to specificCode (by arguments)", () => {
    const actual = toFlatMaterialTypes(example, "specificCode");
    const expected = ["BOOK"];
    expect(actual).toEqual(expected);
  });
  it("formats to generalDisplay (by arguments)", () => {
    const actual = toFlatMaterialTypes(example, "generalDisplay");
    const expected = ["bøger"];
    expect(actual).toEqual(expected);
  });
  it("formats to generalCode (by arguments)", () => {
    const actual = toFlatMaterialTypes(example, "generalCode");
    const expected = ["BOOKS"];
    expect(actual).toEqual(expected);
  });
});

describe("inFlatMaterialTypes", () => {
  const example = [
    {
      specificDisplay: "bog",
      specificCode: "BOOK",
      generalDisplay: "bøger",
      generalCode: "BOOKS",
    },
  ];

  it("example contains input of specificDisplayArray, default works (['bog'])", () => {
    const actual = inFlatMaterialTypes(["bog"], example);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("example contains input of specificDisplayArray, by argument (['bog'])", () => {
    const actual = inFlatMaterialTypes(["bog"], example, "specificDisplay");
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("example contains input of specificCodeArray (['BOOK'])", () => {
    const actual = inFlatMaterialTypes(["BOOK"], example, "specificCode");
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("example contains input of generalDisplayArray (['bog'])", () => {
    const actual = inFlatMaterialTypes(["bøger"], example, "generalDisplay");
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("example contains input of generalCodeArray (['BOOKS'])", () => {
    const actual = inFlatMaterialTypes(["BOOKS"], example, "generalCode");
    const expected = true;
    expect(actual).toEqual(expected);
  });
});

describe("groupManifestations", () => {
  it("should group 2 manifestations with mixed number of materialTypes properly", () => {
    const actual = groupManifestations(twoManifestations_bog_ebog__bog);
    const expected = {
      "bog,e-bog": [
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog",
          materialTypesArray: [
            {
              specificDisplay: "bog",
              specificCode: "BOOK",
              generalDisplay: "bøger",
              generalCode: "BOOKS",
            },
            {
              specificDisplay: "e-bog",
              specificCode: "EBOOK",
              generalDisplay: "e-bøger",
              generalCode: "EBOOKS",
            },
          ],
          specificDisplayArray: ["bog", "e-bog"],
        },
      ],
      bog: [
        {
          ...oneSpecificMaterialType_Bog,
          pid: "1bog",
          materialTypesArray: [
            {
              specificDisplay: "bog",
              specificCode: "BOOK",
              generalDisplay: "bøger",
              generalCode: "BOOKS",
            },
          ],
          specificDisplayArray: ["bog"],
        },
      ],
    };
    expect(actual).toStrictEqual(expected);
  });
  it("should group 1 manifestation with multiple materialTypes properly", () => {
    const actual = groupManifestations(oneManifestation_bog_ebog);
    const expected = {
      "bog,e-bog": [
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog",
          materialTypesArray: [
            {
              specificDisplay: "bog",
              specificCode: "BOOK",
              generalDisplay: "bøger",
              generalCode: "BOOKS",
            },
            {
              specificDisplay: "e-bog",
              specificCode: "EBOOK",
              generalDisplay: "e-bøger",
              generalCode: "EBOOKS",
            },
          ],
          specificDisplayArray: ["bog", "e-bog"],
        },
      ],
    };
    expect(actual).toEqual(expected);
  });
  it("should group 5 manifestations with a mixed materialTypes properly", () => {
    const actual = groupManifestations(
      fiveManifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    expect(actual).toEqual(grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1);
  });
  it("should no manifestation properly which is nothing", () => {
    const actual = groupManifestations([]);
    const expected = {};
    expect(actual).toEqual(expected);
  });
});

describe("compareMaterialTypeArrays", () => {
  it("should compare array strings properly (e-bog vs bog; expect 1)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ]
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (bog vs e-bog; expect -1)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ]
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly with custom order (e-bog vs billedbog; expect positive number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "billedbog",
          specificCode: "PICTURE_BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeLessThan(expected);
  });
  it("should compare array strings properly with custom order (billedbog vs e-bog; expect negative number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "billedbog",
          specificCode: "PICTURE_BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeGreaterThan(expected);
  });
  it("should compare array strings properly with custom order (tegneserie vs computerspil; expect negative number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "tegneserie",
          specificCode: "COMIC",
          generalDisplay: "tegneserier",
          generalCode: "COMICS",
        },
      ],
      [
        {
          specificDisplay: "computerspil",
          specificCode: "COMPUTER_GAME",
          generalDisplay: "computerspil",
          generalCode: "COMPUTER_GAMES",
        },
      ],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeLessThan(expected);
  });
  it("should compare array strings properly with custom order (computerspil vs tegneserie; expect positive number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "computerspil",
          specificCode: "COMPUTER_GAME",
          generalDisplay: "computerspil",
          generalCode: "COMPUTER_GAMES",
        },
      ],
      [
        {
          specificDisplay: "tegneserie",
          specificCode: "COMIC",
          generalDisplay: "tegneserier",
          generalCode: "COMICS",
        },
      ],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeGreaterThan(expected);
  });
  it("should compare array strings properly (bog/e-bog vs bog/e-bog; expect 0)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ]
    );
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (bog/e-bog vs bog; expect 0)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ]
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (expect 0)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ]
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare (empty vs empty; expect 0)", () => {
    const actual = compareMaterialTypeArrays([], []);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should compare (bog vs empty; expect -1)", () => {
    const actual = compareMaterialTypeArrays(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      []
    );
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare (empty vs bog; expect -1)", () => {
    const actual = compareMaterialTypeArrays(
      [],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ]
    );
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("getElementByCustomSorting", () => {
  it("should be 0 if materialTypesOrder is empty", () => {
    const materialTypesOrder = [];
    const actual = getElementByCustomSorting(materialTypesOrder, "BOOK");
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should be length of materialTypesOrder if no match", () => {
    const materialTypesOrder = getOrderedFlatMaterialTypes();
    const actual = getElementByCustomSorting(
      materialTypesOrder,
      "TOILET_HUMOR"
    );
    const expected = materialTypesOrder.length;
    expect(actual).toEqual(expected);
  });
  it("should be less than length of materialTypesOrder if match", () => {
    const materialTypesOrder = getOrderedFlatMaterialTypes();
    const actual = getElementByCustomSorting(materialTypesOrder, "BOOK");
    const expected = materialTypesOrder.length;
    expect(actual).toBeLessThan(expected);
  });
  it("should be length of materialTypes order if empty materialType", () => {
    const materialTypesOrder = getOrderedFlatMaterialTypes();
    const actual = getElementByCustomSorting(materialTypesOrder, "");
    const expected = materialTypesOrder.length;
    expect(actual).toEqual(expected);
  });
});

describe("getUniqueMaterialTypes", () => {
  it("should sort and output the correct materialTypeArrays between 3 unique", () => {
    const actual = getUniqueMaterialTypes([
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
    ]);
    const expected = [
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  it("should sort and output the correct materialTypeArray when having 1 type", () => {
    const actual = getUniqueMaterialTypes([
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
    ]);
    const expected = [
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
    ];
    expect(actual).toEqual(expected);
  });
  it("should give empty materialTypeArray with no type", () => {
    const actual = getUniqueMaterialTypes("");
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("getInUniqueMaterialTypes", () => {
  it("check typeCombination in materialTypeArray (bog in arr; expect true)", () => {
    const actual = getInUniqueMaterialTypes(
      ["bog"],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        [
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
      ]
    );
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (lydbog not in arr; expect false)", () => {
    const actual = getInUniqueMaterialTypes(
      ["lydbog"],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        [
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
      ]
    );
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (empty not in arr; expect false)", () => {
    const actual = getInUniqueMaterialTypes(
      [],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        [
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
      ]
    );
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check if specific code works (bog/BOOK in bog-materialTypeArray", () => {
    const actual = getInUniqueMaterialTypes(
      ["BOOK"],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
      ]
    );
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("check if general display works (bøger in bog-materialTypeArray", () => {
    const actual = getInUniqueMaterialTypes(
      ["bøger"],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
      ]
    );
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("check if general Code works ('BOOKS' in bog-materialTypeArray", () => {
    const actual = getInUniqueMaterialTypes(
      ["BOOKS"],
      [
        [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
      ]
    );
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (empty not in empty; expect false)", () => {
    const actual = getInUniqueMaterialTypes([], []);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (bog not in empty; expect false)", () => {
    const actual = getInUniqueMaterialTypes(
      [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      []
    );
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("getFlatPidsByType", () => {
  it("flatten pids from grouped (bog,e-bog)", () => {
    const actual = getFlatPidsByType(
      ["bog", "e-bog"],
      grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    const expected = ["1bog2ebog", "1bog2ebog_v2"];
    expect(actual).toEqual(expected);
  });
  it("flatten pids from grouped (bog)", () => {
    const actual = getFlatPidsByType(
      ["bog"],
      grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    const expected = ["1bog", "1bog_v2"];
    expect(actual).toEqual(expected);
  });
  it("flatten pids from grouped (empty group)", () => {
    const actual = getFlatPidsByType(["bog"], {});
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("flatten pids from grouped (empty)", () => {
    const actual = getFlatPidsByType(
      [],
      grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("flatten pids from grouped (empty typeArr, empty groups)", () => {
    const actual = getFlatPidsByType([], {});
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("flattenGroupedSortedManifestations", () => {
  it("should sort properly", () => {
    const actual = flattenGroupedSortedManifestations(
      grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    const expected = [
      {
        ...oneSpecificMaterialType_Bog,
        pid: "1bog",
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        specificDisplayArray: ["bog"],
      },
      {
        ...oneSpecificMaterialType_Bog,
        pid: "1bog_v2",
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
        ],
        specificDisplayArray: ["bog"],
      },
      {
        ...twoSpecificMaterialType_Bog_Ebog,
        pid: "1bog2ebog",
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        specificDisplayArray: ["bog", "e-bog"],
      },
      {
        ...twoSpecificMaterialType_Bog_Ebog,
        pid: "1bog2ebog_v2",
        materialTypesArray: [
          {
            specificDisplay: "bog",
            specificCode: "BOOK",
            generalDisplay: "bøger",
            generalCode: "BOOKS",
          },
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        specificDisplayArray: ["bog", "e-bog"],
      },
      {
        ...oneSpecificMaterialType_Ebog,
        pid: "1ebog",
        materialTypesArray: [
          {
            specificDisplay: "e-bog",
            specificCode: "EBOOK",
            generalDisplay: "e-bøger",
            generalCode: "EBOOKS",
          },
        ],
        specificDisplayArray: ["e-bog"],
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe("manifestationMaterialTypeUtils", () => {
  it("expect exact keys from factory function (remember to update test)", () => {
    const actual = manifestationMaterialTypeFactory(
      manifestationFactoryFunctionFixture
    );
    const expectedKeys = [
      "flatMaterialTypes",
      "uniqueMaterialTypes",
      "inUniqueMaterialTypes",
      "manifestationsByType",
      "flatPidsByType",
      "flattenedGroupedSortedManifestations",
      "flattenGroupedSortedManifestationsByType",
      "manifestationsEnrichedWithDefaultFrontpage",
    ];
    expect(Object.keys(actual)).toEqual(expectedKeys);
  });
});
