import { checkQuery } from "@/pages/linkme.php";

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
