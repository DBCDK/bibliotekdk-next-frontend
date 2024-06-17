import { checkQuery } from "@/pages/linkme.php";
import { parseLinkme } from "@/lib/utils";

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

test("parseLinkme", () => {
  let query =
    "ccl=%28fo%3DMartin+og+fo%3DWidmark+og+ti%3DRidder+Sille+%27og%27+Baron+von+Rumpe%29+eller+is%3D9788711225967&target=DfaFolk";
  let expected = "fisk";
  let actual = parseLinkme(query);

  expect(actual).toEqual(expected);
});
