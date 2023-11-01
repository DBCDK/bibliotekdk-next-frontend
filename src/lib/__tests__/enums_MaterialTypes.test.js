/**
 * @file
 * The file for testing {@link MaterialTypeOrderEnum}
 *   and {@link getOrderedFlatMaterialTypes}
 *   and {@link prioritiseByWorkType}.
 */

import {
  getOrderedFlatMaterialTypes,
  MaterialTypeOrderEnum,
  prioritiseByWorkType,
} from "@/lib/enums_MaterialTypes";

describe("prioritiseByWorkType", () => {
  it("should prioritise custom order if not workTypes given (tegneserie vs computerspil; expect negative number)", () => {
    const workTypes = [];
    const actual = prioritiseByWorkType(
      ["LITERATURE", { TEGNESERIE: { display: "tegneserie", code: "123" } }],
      ["GAME", { COMPUTERSPIL: { display: "computerspil", code: "123" } }],
      workTypes
    );
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should prioritise custom order if not workTypes given (computerspil vs tegneserie; expect positive number)", () => {
    const workTypes = [];
    const actual = prioritiseByWorkType(
      ["GAME", { COMPUTERSPIL: { display: "computerspil", code: "123" } }],
      ["LITERATURE", { TEGNESERIE: { display: "tegneserie", code: "123" } }],
      workTypes
    );
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("should promote order by workType if workType is given (GAME: computerspil vs tegneserie; expect negative number)", () => {
    const workTypes = ["GAME"];
    const actual = prioritiseByWorkType(
      ["GAME", { COMPUTERSPIL: { display: "computerspil", code: "123" } }],
      ["LITERATURE", { TEGNESERIE: { display: "tegneserie", code: "123" } }],
      workTypes
    );
    const expected = 0;
    expect(actual).toBeLessThan(expected);
  });
  it("should promote order by workType if workType is given (GAME: tegneserie vs computerspil; expect positive number)", () => {
    const workTypes = ["GAME"];
    const actual = prioritiseByWorkType(
      ["LITERATURE", { TEGNESERIE: { display: "tegneserie", code: "123" } }],
      ["GAME", { COMPUTERSPIL: { display: "computerspil", code: "123" } }],
      workTypes
    );
    const expected = 0;
    expect(actual).toBeGreaterThan(expected);
  });
});

describe("getOrderedFlatMaterialTypes", () => {
  it("should return ordered properly if no workType is given (expect LITERATURE materialTypes first)", () => {
    const workTypes = [];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = Object.values(MaterialTypeOrderEnum)
      .flatMap((mat) => Object.values(mat))
      .map((mat) => mat.code);
    expect(actual).toEqual(expected);
  });
  it("should return ordered properly if workType is given (GAME; expect 'playstation 5' first)", () => {
    const workTypes = ["GAME"];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = "PLAYSTATION_5";
    expect(actual[0]).toEqual(expected);
  });
  it("should return ordered properly if workType is given (LITERATURE; expect 'bog' first)", () => {
    const workTypes = ["LITERATURE"];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = "BOOK";
    expect(actual[0]).toEqual(expected);
  });
  it("should return ordered properly if workType is given (MOVIE; expect 'film (net)' first)", () => {
    const workTypes = ["MOVIE"];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = "FILM_ONLINE";
    expect(actual[0]).toEqual(expected);
  });
  it("should return ordered properly if workType is given (SHEETMUSIC; expect 'e-node' first)", () => {
    const workTypes = ["SHEETMUSIC"];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = "SHEET_MUSIC_ONLINE";
    expect(actual[0]).toEqual(expected);
  });
  it("should return ordered properly if workType is given (MUSIC; expect 'cd (musik)' first)", () => {
    const workTypes = ["MUSIC"];
    const actual = getOrderedFlatMaterialTypes(workTypes);
    const expected = "MUSIC_CD";
    expect(actual[0]).toEqual(expected);
  });
});
