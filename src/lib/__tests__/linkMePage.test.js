import { checkQuery } from "@/pages/linkme.php";
import { oclcFromQuery, parseLinkme, parseLinkmeQuery } from "@/lib/utils";

test("checkQuery", () => {
  let query = { "rec.id": "123" };
  let expected = true;
  let actual = checkQuery(query);
  expect(actual).toEqual(expected);

  query = { fisk: "hest" };
  expected = false;
  actual = checkQuery(query);
  expect(actual).toEqual(expected);
});

test("test oclc parse", () => {
  // happy path
  let query = "wcx=12345678";
  let expected = "12345678";

  let actual = oclcFromQuery(query);
  expect(actual).toEqual(expected);

  // not set
  query = null;
  expected = null;
  actual = oclcFromQuery(query);
  expect(actual).toEqual(expected);

  // no ccl
  query = "1234";
  expected = null;
  actual = oclcFromQuery(query);
  expect(actual).toEqual(expected);
});

test("parseLinkme", () => {
  let actual = parseLinkme("rec.id=810015-katalog:00194810");
  let expected = "/linkme?rec.id=810015-katalog:00194810";
  expect(actual).toEqual(expected);
});

test("parseLinkmeQuery", () => {
  let query = { fo: "holm", ti: "kina fra kejserdømme" };
  let expected = [
    {
      value: "holm",
      prefixLogicalOperator: null,
      searchIndex: "term.creatorcontributor",
    },
    {
      value: "kina fra kejserdømme",
      prefixLogicalOperator: "AND",
      searchIndex: "term.title",
    },
  ];

  let actual = parseLinkmeQuery(query);
  expect(actual).toEqual(expected);

  // test an array of query values
  query = { tekst: ["hest", "fisk"] };
  expected = [
    {
      value: "hest",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
    {
      value: "fisk",
      prefixLogicalOperator: "AND",
      searchIndex: "term.default",
    },
  ];
  actual = parseLinkmeQuery(query);
  expect(actual).toEqual(expected);

  // test that '?' is removed from end of search string
  // test an array of query values
  query = { tekst: "hest?" };
  expected = [
    {
      value: "hest",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
  ];
  actual = parseLinkmeQuery(query);
  expect(actual).toEqual(expected);
});
