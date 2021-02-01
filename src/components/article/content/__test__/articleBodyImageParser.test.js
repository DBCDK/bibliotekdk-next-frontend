import parseArticleBody from "../utils";
import data from "./mock/article.mock";

test("parseArticleBodyImages", () => {
  const actual = parseArticleBody(data.article.body.value);
  expect(actual).toMatchSnapshot();
});
