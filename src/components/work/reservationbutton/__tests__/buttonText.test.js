import Translate from "@/components/base/translate";
import { constructButtonText } from "../utils";

describe("Button text generation for buttons linking directly to material", () => {
  it("Ebook", () => {
    const workTypes = ["LITERATURE"];
    const selectedMaterialType = [
      {
        specificDisplay: "e-bog",
        specificCode: "EBOOK",
        generalDisplay: "e-bøger",
        generalCode: "EBOOKS",
      },
    ];
    const expectedAction = "read";

    const actual = constructButtonText(workTypes, selectedMaterialType);
    const expected =
      Translate({
        context: "overview",
        label: `material-action-${expectedAction}`,
      }) +
      " " +
      Translate({
        context: "overview",
        label: "material-typename-ebook",
      }).toLowerCase();
    expect(actual).toEqual(expected);

    const actualShort = constructButtonText(
      workTypes,
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
    const workTypes = ["LITERATURE"];
    const selectedMaterialType = [
      {
        specificDisplay: "podcast",
        specificCode: "PODCAST",
        generalDisplay: "podcasts",
        generalCode: "PODCASTS",
      },
    ];
    const expectedAction = "listen";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["ARTICLE"];
    const selectedMaterialType = [
      {
        specificDisplay: "artikel",
        specificCode: "ARTICLE",
        generalDisplay: "artikler",
        generalCode: "ARTICLES",
      },
    ];
    const expectedAction = "read";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["LITERATURE"];
    const selectedMaterialType = [
      {
        specificDisplay: "lydbog (online)",
        specificCode: "AUDIO_BOOK_ONLINE",
        generalDisplay: "lydbøger",
        generalCode: "AUDIO_BOOKS",
      },
    ];
    const expectedAction = "listen";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["MUSIC"];
    const selectedMaterialType = [
      {
        specificDisplay: "musik",
        specificCode: "MUSIC",
        generalDisplay: "musik",
        generalCode: "MUSIC",
      },
    ];
    const expectedAction = "listen";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["MOVIE"];
    const selectedMaterialType = [
      {
        specificDisplay: "film",
        specificCode: "FILM",
        generalDisplay: "film",
        generalCode: "FILMS",
      },
    ];
    const expectedAction = "see";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["SHEETMUSIC"];
    const selectedMaterialType = [
      {
        specificDisplay: "node",
        specificCode: "SHEET_MUSIC",
        generalDisplay: "noder",
        generalCode: "SHEET_MUSIC",
      },
    ];
    const expectedAction = "see";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
    const workTypes = ["GAME"];
    const selectedMaterialType = [
      {
        specificDisplay: "computerspil",
        specificCode: "COMPUTER_GAME",
        generalDisplay: "computerspil",
        generalCode: "COMPUTER_GAMES",
      },
    ];
    const expectedAction = "play";

    const actual = constructButtonText(workTypes, selectedMaterialType);
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
      workTypes,
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
