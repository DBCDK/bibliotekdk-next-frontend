import { encodeTitleCreator, getCanonicalWorkUrl } from "@/utils";

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
  const expected = "https://bibliotek.dk/en-bogtitel_en-forfatter/some-work-id";
  expect(actual).toEqual(expected);
});
