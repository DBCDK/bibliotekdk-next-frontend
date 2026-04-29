import { sortData } from "../utils";
import data from "./__fixtures__/sort.mock";

test("Sort data", () => {
  const actual = sortData(data.bibliotekdkCms.faqs);
  expect(actual).toMatchSnapshot();
});
