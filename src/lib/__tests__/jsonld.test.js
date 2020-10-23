import { getJSONLD } from "../jsonld";
import dummy_workDataApi from "../../components/work/dummy.workDataApi";

test("generateJSONLD", () => {
  const data = dummy_workDataApi({ workId: "some-id" });
  const actual = getJSONLD({ ...data.work, id: "some-id" });
  expect(actual).toMatchSnapshot();
});
