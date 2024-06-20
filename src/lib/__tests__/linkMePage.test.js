import { checkQuery } from "@/pages/linkme.php";
import { oclcFromQuery, parseLinkmeQuery } from "@/lib/utils";

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
});
