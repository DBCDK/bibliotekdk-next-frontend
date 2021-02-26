import { sortArticles } from "../utils";
import data from "./mock/articles.mock";

test("sortArticles desc", () => {
  const actual = sortArticles(data);
  expect(actual).toMatchSnapshot();
});
