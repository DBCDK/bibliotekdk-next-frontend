import {
  encodeTitleCreator,
  getCanonicalWorkUrl,
  chainFunctions,
  getCreatorDisplay,
} from "../utils";

describe("getCreatorDisplay", () => {
  it("returns display when andOthers is not set", () => {
    expect(getCreatorDisplay({ display: "En Forfatter" })).toEqual(
      "En Forfatter"
    );
    expect(
      getCreatorDisplay({ display: "En Forfatter", andOthers: false })
    ).toEqual("En Forfatter");
  });

  it("appends m.fl. when andOthers is true", () => {
    expect(
      getCreatorDisplay({ display: "En Forfatter", andOthers: true })
    ).toEqual("En Forfatter m.fl.");
  });

  it("returns undefined when creator or display is missing", () => {
    expect(getCreatorDisplay(undefined)).toBeUndefined();
    expect(getCreatorDisplay(null)).toBeUndefined();
    expect(getCreatorDisplay({ andOthers: true })).toBeUndefined();
    expect(getCreatorDisplay({ display: "", andOthers: true })).toBeUndefined();
  });
});

describe("encodeTitleCreator", () => {
  it("regular", () => {
    const actual = encodeTitleCreator("en Bogtitel", [
      { display: "En Forfatter" },
    ]);
    const expected = "en-bogtitel_en-forfatter";
    expect(actual).toEqual(expected);
  });

  it("should prioritise corporations", () => {
    const actual = encodeTitleCreator("en bogtitel", [
      { display: "ikke den her", __typename: "Person" },
      { display: "den her forfatter", __typename: "Corporation" },
    ]);
    const expected = "en-bogtitel_den-her-forfatter";
    expect(actual).toEqual(expected);
  });
});

test("getCanonicalWorkUrl", () => {
  const work = {
    id: "some-work-id",
    title: "en Bogtitel",
    creators: [{ display: "En Forfatter" }],
  };
  const actual = getCanonicalWorkUrl(work);
  const expected =
    "http://localhost:3000/materiale/en-bogtitel_en-forfatter/some-work-id";
  expect(actual).toEqual(expected);
});

describe("pipe", () => {
  it("empty functions give initial value", () => {
    const actual = chainFunctions([])([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("empty functions give initial value 2", () => {
    const actual = chainFunctions([])([{ hej: "123" }, { hej: "321" }]);
    const expected = [{ hej: "123" }, { hej: "321" }];
    expect(actual).toEqual(expected);
  });
  it("one function give initial value 2", () => {
    const actual = chainFunctions([(curr) => curr.slice(0, 1)])([
      { hej: "123" },
      { hej: "321" },
    ]);
    const expected = [{ hej: "123" }];
    expect(actual).toEqual(expected);
  });
  it("2 functions give initial value 2", () => {
    const addOne = (accum) => accum + 1;

    const actual = chainFunctions([addOne, addOne])(1);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
});
