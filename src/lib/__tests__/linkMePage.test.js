import { checkQuery } from "@/pages/linkme.php";
import {
  oclcFromQuery,
  parseLinkme,
  parseLinkmeQuery,
  preParsLinkme,
} from "@/lib/utils";

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

test("preparse function", () => {
  // url encoded string
  let query = "ccl=is%3D9780399148446";
  let expected = "is=9780399148446";

  let actual = preParsLinkme(query).linkme;
  expect(actual).toEqual(expected);

  // NOT url encoded
  query = "cql=is=9780399148446";
  expected = "is=9780399148446";

  actual = preParsLinkme(query).linkme;
  expect(actual).toEqual(expected);

  // rec.id
  query = "rec.id=9780399148446";
  expected = "9780399148446";

  actual = preParsLinkme(query).linkme;
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
  let query = "12345678";
  let expected = "faust=12345678";

  let actual = parseLinkme(query);
  expect(actual).toEqual(expected);

  query = "1234567890";
  expected = "isbn=1234567890";

  actual = parseLinkme(query);
  expect(actual).toEqual(expected);
});

test("parseLinkmeQuery", () => {
  let query = "fo=holm&ti=kina fra kejserdømme";
  let expected = "fisk";

  let actual = parseLinkmeQuery(query);
  expect(actual).toEqual(expected);

  // query = "ccl=fo%3Db%C3%B8gh%20andersen%20og%20ti%3Dslaget%20i%202";
  // expected = "fo=bøgh andersen og ti=slaget i 2";
  //
  // actual = parseLinkmeQuery(query);
  // expect(actual).toEqual(expected);
});
