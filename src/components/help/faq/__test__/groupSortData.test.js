import { groupSortData } from "../utils";
import data from "./__fixtures__/group.mock";

test("Group and sort Data", () => {
  const actual = groupSortData(data.bibliotekdkCms.faqs);
  expect(actual).toMatchSnapshot();
});
