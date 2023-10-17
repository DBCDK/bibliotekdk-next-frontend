import translate from "@/components/base/translate";
import { buttonTextLabelMaker, constructButtonText } from "../utils";

describe("Button text generation", () => {
  it("Ebook", () => {
    const materialType = "literature";
    const selectedMaterialType = "e-bog";
    const expectedAction = "read";

    const actual = buttonTextLabelMaker(materialType, selectedMaterialType);
    const expected = [
      `material-action-${expectedAction}`,
      "material-typename-ebook",
    ];
    expect(actual).toEqual(expected);

    const actualShort = buttonTextLabelMaker(
      materialType,
      selectedMaterialType,
      true
    );
    const expectedShort = [
      `material-action-${expectedAction}`,
      "material-direction-here",
    ];
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
      materialTypeShort,
      selectedMaterialTypeShort,
      true
    );
    const expectedShort =
      translate({
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
});
