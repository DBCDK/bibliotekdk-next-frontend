import {
  encodeTitleCreator,
  getCanonicalWorkUrl,
  getPageDescription,
} from "../utils";

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

test("getPageDescription", () => {
  const work = {
    id: "some-work-id",
    title: "en Bogtitel",
    creators: [{ name: "En Forfatter" }],
    materialTypes: [
      { materialType: "Bog" },
      { materialType: "eBog" },
      { materialType: "lydBog" },
    ],
  };
  const actual = getPageDescription(work);
  const expected =
    "Lån en Bogtitel af En Forfatter som bog, ebog eller lydbog. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.";
  expect(actual).toEqual(expected);
});

test("getPageDescription - one valid type", () => {
  const work = {
    id: "some-work-id",
    title: "en Bogtitel",
    creators: [{ name: "En Forfatter" }],
    materialTypes: [{ materialType: "lydbog" }],
  };
  const actual = getPageDescription(work);
  const expected =
    "Lån en Bogtitel af En Forfatter som lydbog. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.";
  expect(actual).toEqual(expected);
});

test("getPageDescription - no valid types", () => {
  const work = {
    id: "some-work-id",
    title: "en Bogtitel",
    creators: [{ name: "En Forfatter" }],
    materialTypes: [{ materialType: "diskette" }],
  };
  const actual = getPageDescription(work);
  const expected =
    "Lån en Bogtitel af En Forfatter. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.";
  expect(actual).toEqual(expected);
});
