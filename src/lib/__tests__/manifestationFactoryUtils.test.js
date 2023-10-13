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
  compareArraysOfStrings,
  flatMapMaterialTypes,
  flattenMaterialType,
  formatMaterialTypesFromUrl,
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
  getElementByCustomSorting,
  getFlatPidsByType,
  getInUniqueMaterialTypes,
  getUniqueMaterialTypes,
  groupManifestations,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import { getOrderedFlatMaterialTypes } from "@/lib/enums_MaterialTypes";

test("manifestationFactoryFunctions", () => {
  const actual = "";
  const expected = "";
  expect(actual).toEqual(expected);
});

describe("formatMaterialTypesFromUrl", () => {
  it("should split materialTypeUrl with 2 types properly", () => {
    const actual = formatMaterialTypesFromUrl("bog / ebog");
    const expected = ["bog", "ebog"];
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
  it("should join 2 materialTypes properly", () => {
    const actual = formatMaterialTypesToUrl(["bog", "ebog"]);
    const expected = "bog / ebog";
    expect(actual).toEqual(expected);
  });
  it("should 1 materialTypes properly", () => {
    const actual = formatMaterialTypesToUrl(["bog"]);
    const expected = "bog";
    expect(actual).toEqual(expected);
  });
  it("should no materialTypes properly", () => {
    const actual = formatMaterialTypesToUrl([]);
    const expected = "";
    expect(actual).toEqual(expected);
  });
});

describe("flattenMaterialType", () => {
  it("should flatten 2 materialTypes in manifestation properly", () => {
    const actual = flattenMaterialType(twoSpecificMaterialType_Bog_Ebog);
    const expected = ["bog", "ebog"];
    expect(actual).toEqual(expected);
  });
  it("should flatten 1 materialTypes in manifestation properly", () => {
    const actual = flattenMaterialType(oneSpecificMaterialType_Bog);
    const expected = ["bog"];
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
    const expected = ["graphic novel", "tegneserie"];
    expect(actual).toEqual(expected);
  });
});

describe("flatMapMaterialTypes", () => {
  it("should flatten materialTypes of 2 manifestations with mixed number of materialTypes properly", () => {
    const actual = flatMapMaterialTypes(twoManifestations_bog_ebog__bog);
    const expected = [["bog", "ebog"], ["bog"]];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of 1 manifestation with multiple materialTypes properly", () => {
    const actual = flatMapMaterialTypes(oneManifestation_bog_ebog);
    const expected = [["bog", "ebog"]];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of 1 manifestation with a single materialType properly", () => {
    const actual = flatMapMaterialTypes(oneManifestation_bog);
    const expected = [["bog"]];
    expect(actual).toEqual(expected);
  });
  it("should flatten materialTypes of no manifestation properly which is nothing", () => {
    const actual = flatMapMaterialTypes([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("groupManifestations", () => {
  it("should group 2 manifestations with mixed number of materialTypes properly", () => {
    const actual = groupManifestations(twoManifestations_bog_ebog__bog);
    const expected = {
      "bog,ebog": [
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog",
          materialTypesArray: ["bog", "ebog"],
        },
      ],
      bog: [
        {
          ...oneSpecificMaterialType_Bog,
          pid: "1bog",
          materialTypesArray: ["bog"],
        },
      ],
    };
    expect(actual).toStrictEqual(expected);
  });
  it("should group 1 manifestation with multiple materialTypes properly", () => {
    const actual = groupManifestations(oneManifestation_bog_ebog);
    const expected = {
      "bog,ebog": [
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog",
          materialTypesArray: ["bog", "ebog"],
        },
      ],
    };
    expect(actual).toEqual(expected);
  });
  it("should group 5 manifestations with a mixed materialTypes properly", () => {
    const actual = groupManifestations(
      fiveManifestations_bog_ebog_x2__bog_x2__ebog_x1
    );
    const expected = {
      "bog,ebog": [
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog",
          materialTypesArray: ["bog", "ebog"],
        },
        {
          ...twoSpecificMaterialType_Bog_Ebog,
          pid: "1bog2ebog_v2",
          materialTypesArray: ["bog", "ebog"],
        },
      ],
      bog: [
        {
          ...oneSpecificMaterialType_Bog,
          pid: "1bog",
          materialTypesArray: ["bog"],
        },
        {
          ...oneSpecificMaterialType_Bog,
          pid: "1bog_v2",
          materialTypesArray: ["bog"],
        },
      ],
      ebog: [
        {
          ...oneSpecificMaterialType_Ebog,
          pid: "1ebog",
          materialTypesArray: ["ebog"],
        },
      ],
    };
    expect(actual).toEqual(expected);
  });
  it("should no manifestation properly which is nothing", () => {
    const actual = groupManifestations([]);
    const expected = {};
    expect(actual).toEqual(expected);
  });
});

describe("compareArraysOfStrings", () => {
  it("should compare array strings properly (ebog vs bog; expect 1)", () => {
    const actual = compareArraysOfStrings(["ebog"], ["bog"]);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (bog vs ebog; expect -1)", () => {
    const actual = compareArraysOfStrings(["bog"], ["ebog"]);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly with custom order (ebog vs billedbog; expect positive number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareArraysOfStrings(
      ["ebog"],
      ["billedbog"],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeLessThan(expected);
  });
  it("should compare array strings properly with custom order (billedbog vs ebog; expect negative number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareArraysOfStrings(
      ["billedbog"],
      ["ebog"],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeGreaterThan(expected);
  });
  it("should compare array strings properly with custom order (tegneserie vs computerspil; expect negative number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareArraysOfStrings(
      ["tegneserie"],
      ["computerspil"],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeLessThan(expected);
  });
  it("should compare array strings properly with custom order (computerspil vs tegneserie; expect positive number)", () => {
    const materialTypeOrder = getOrderedFlatMaterialTypes();
    const actual = compareArraysOfStrings(
      ["computerspil"],
      ["tegneserie"],
      materialTypeOrder
    );
    const expected = 0;
    expect(actual).toBeGreaterThan(expected);
  });
  it("should compare array strings properly (bog/ebog vs bog/ebog; expect 0)", () => {
    const actual = compareArraysOfStrings(["bog", "ebog"], ["bog", "ebog"]);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (bog/ebog vs bog; expect 0)", () => {
    const actual = compareArraysOfStrings(["bog", "ebog"], ["bog"]);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("should compare array strings properly (expect 0)", () => {
    const actual = compareArraysOfStrings(["bog"], ["bog", "ebog"]);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare (empty vs empty; expect 0)", () => {
    const actual = compareArraysOfStrings([], []);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should compare (bog vs empty; expect -1)", () => {
    const actual = compareArraysOfStrings(["bog"], []);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("should compare (empty vs bog; expect -1)", () => {
    const actual = compareArraysOfStrings([], ["bog"]);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("getElementByCustomSorting", () => {
  it("should be 0 if materialTypesOrder is empty", () => {
    const materialTypesOrder = [];
    const actual = getElementByCustomSorting(materialTypesOrder, "bog");
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should be length of materialTypesOrder if no match", () => {
    const materialTypesOrder = getOrderedFlatMaterialTypes();
    const actual = getElementByCustomSorting(
      materialTypesOrder,
      "toilet-humor"
    );
    const expected = materialTypesOrder.length;
    expect(actual).toEqual(expected);
  });
  it("should be less than length of materialTypesOrder if match", () => {
    const materialTypesOrder = getOrderedFlatMaterialTypes();
    const actual = getElementByCustomSorting(materialTypesOrder, "bog");
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
      ["ebog"],
      ["bog"],
      ["bog", "ebog"],
      ["bog", "ebog"],
      ["ebog"],
      ["bog"],
      ["bog", "ebog"],
    ]);
    const expected = [["bog"], ["bog", "ebog"], ["ebog"]];
    expect(actual).toEqual(expected);
  });
  it("should sort and output the correct materialTypeArray when having 1 type", () => {
    const actual = getUniqueMaterialTypes([["bog"], ["bog"], ["bog"]]);
    const expected = [["bog"]];
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
      [["bog"], ["bog", "ebog"], ["ebog"]]
    );
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (lydbog not in arr; expect false)", () => {
    const actual = getInUniqueMaterialTypes(
      ["lydbog"],
      [["bog"], ["bog", "ebog"], ["ebog"]]
    );
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (empty not in arr; expect false)", () => {
    const actual = getInUniqueMaterialTypes(
      [],
      [["bog"], ["bog", "ebog"], ["ebog"]]
    );
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (empty not in empty; expect false)", () => {
    const actual = getInUniqueMaterialTypes([], []);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("check typeCombination in materialTypeArray (bog not in empty; expect false)", () => {
    const actual = getInUniqueMaterialTypes(["bog"], []);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("getFlatPidsByType", () => {
  it("flatten pids from grouped (bog,ebog)", () => {
    const actual = getFlatPidsByType(
      ["bog", "ebog"],
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

describe("formatMaterialTypesToPresentation", () => {
  it("Returns as espected", () => {
    const testSample = ["article", "article (online)"];

    expect(formatMaterialTypesToPresentation(testSample)).toEqual(
      "Article / Article (online)"
    );
  });

  it("Returns string directly, if not array", () => {
    const testSample = "article (online)";

    expect(formatMaterialTypesToPresentation(testSample)).toEqual(testSample);
  });
});
