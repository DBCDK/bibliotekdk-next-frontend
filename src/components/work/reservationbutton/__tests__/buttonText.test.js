import Translate from "@/components/base/translate";
import { constructButtonText } from "../utils";

describe("Button text generation for buttons linking directly to material", () => {
  it("Ebook", () => {
    const materialType = "literature";
    const selectedMaterialType = "e-bog";
    const expectedAction = "read";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-e-bog",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Podcast", () => {
    const materialType = "literature";
    const selectedMaterialType = "podcast";
    const expectedAction = "listen";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-podcast",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Article", () => {
    const materialType = "article";
    const selectedMaterialType = "article";
    const expectedAction = "read";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-article",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Lydbog (online)", () => {
    const materialType = "literature";
    const selectedMaterialType = "lydbog (online)";
    const expectedAction = "listen";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-audiobook",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Music", () => {
    const materialType = "music";
    const selectedMaterialType = "music";
    const expectedAction = "listen";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-music",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Movie", () => {
    const materialType = "movie";
    const selectedMaterialType = "movie";
    const expectedAction = "see";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-movie",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Sheetmusic", () => {
    const materialType = "sheetmusic";
    const selectedMaterialType = "sheetmusic";
    const expectedAction = "see";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-sheetmusic",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });

  it("Game", () => {
    const materialType = "game";
    const selectedMaterialType = "game";
    const expectedAction = "play";

    const actual = constructButtonText(materialType, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-game",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-direction-here",
      }).toLowerCase();
    expect(actualShort).toEqual(expectedShort);
  });
});
