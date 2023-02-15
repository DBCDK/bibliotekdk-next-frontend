import { encodeTitleCreator, getCanonicalWorkUrl, pipe } from "../utils";

test("encodeTitleCreator", () => {
  const actual = encodeTitleCreator("en Bogtitel", "En Forfatter");
  const expected = "en-bogtitel_en-forfatter";
  expect(actual).toEqual(expected);
});

test("getCanonicalWorkUrl", () => {
  const work = {
    id: "some-work-id",
    title: "en Bogtitel",
    creators: [{ name: "En Forfatter" }],
  };
  const actual = getCanonicalWorkUrl(work);
  const expected =
    "http://localhost:3000/materiale/en-bogtitel_en-forfatter/some-work-id";
  expect(actual).toEqual(expected);
});

describe("pipe", () => {
  it("empty functions give initial value", () => {
    const actual = pipe([], []);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("empty functions give initial value 2", () => {
    const actual = pipe([{ hej: "123" }, { hej: "321" }], []);
    const expected = [{ hej: "123" }, { hej: "321" }];
    expect(actual).toEqual(expected);
  });
  it("one function give initial value 2", () => {
    const actual = pipe(
      [{ hej: "123" }, { hej: "321" }],
      [(curr) => curr.slice(0, 1)]
    );
    const expected = [{ hej: "123" }];
    expect(actual).toEqual(expected);
  });
  it("2 functions give initial value 2", () => {
    const addOne = (accum) => accum + 1;

    const actual = pipe(1, [addOne, addOne]);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
});
