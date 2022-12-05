import parseArticleBody from "../utils";
import data from "./__fixtures__/article.mock";
import config from "@/config";

test("parseArticleBodyImages", () => {
  const actual = parseArticleBody(data.article.body.value);
  expect(actual).toMatchSnapshot();
});

test("replaceString", () => {
  const replaceme =
    "fisk http://bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk/ hest og køer";
  const expected = "fisk " + config.backend.url + "/ hest og køer";
  const actual = parseArticleBody(replaceme);

  expect(actual).toEqual(expected);
});
