import { sortArticles } from "../utils";
import data from "./mock/articles.mock";

test("sortArticles desc", () => {
  expect(data.length).toBe(5);

  // Sort and filter data
  const actual = sortArticles(data);

  // One article will get removed
  expect(actual.length).toBe(4);
  expect(actual).toMatchSnapshot();
});
