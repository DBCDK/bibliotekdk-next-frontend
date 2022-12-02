import { sortData } from "../utils";
import data from "./__fixtures__/sort.mock";

test("Sort data", () => {
  const actual = sortData(data.faq.entities);
  expect(actual).toMatchSnapshot();
});
