import { groupSortData } from "../utils";
import data from "./__fixtures__/group.mock";

test("Group and sort Data", () => {
  const actual = groupSortData(data.faq.entities);
  expect(actual).toMatchSnapshot();
});
