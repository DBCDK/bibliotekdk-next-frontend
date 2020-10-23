import { encodeTitleCreator } from "../utils";

test("encodeTitleCreator", () => {
  const actual = encodeTitleCreator("en Bogtitel", "En Forfatter");
  const expected = "en-bogtitel_en-forfatter";
  expect(actual).toEqual(expected);
});
