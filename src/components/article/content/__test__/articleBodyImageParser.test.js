import parseArticleBody from "../utils";
import data from "./mock/article.mock";
import config from "@/config";

test("parseArticleBodyImages", () => {
  const actual = parseArticleBody(data.article.body.value);
  expect(actual).toMatchSnapshot();
});

test("replaceString", () => {
  const replaceme =
    "fisk http://bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk/ hest og køer";
  const expected = "fisk " + config.api.url + "/ hest og køer";
  const actual = parseArticleBody(replaceme);

  console.log(actual);
  expect(actual).toEqual(expected);
});
