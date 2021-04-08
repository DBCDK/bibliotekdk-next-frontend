import { sortData } from "../utils";
import data from "./mock/sort.mock";

test("Sort data", () => {
  const actual = sortData(data.faq.entities);
  expect(actual).toMatchSnapshot();
});
