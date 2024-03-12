import { getFacetsFromQuery } from "@/components/search/advancedSearch/utils";

test("parse query to facets", () => {
  const query = "fisk";
  const expected = "phrase.language=finsk";
  const actual = getFacetsFromQuery(query);

  expect(actual).toEqual(expected);
});
