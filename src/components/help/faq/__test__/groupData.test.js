import { groupData } from "../utils";
import data from "./mock/group.mock";

test("Group data", () => {
  const actual = groupData(data.faq.entities);
  expect(actual).toMatchSnapshot();
});
