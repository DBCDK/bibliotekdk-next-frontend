import { groupData } from "../utils";
import data from "./__fixtures__/group.mock";

test("Group data", () => {
  const actual = groupData(data.bibliotekdkCms.faqs);
  expect(actual).toMatchSnapshot();
});
